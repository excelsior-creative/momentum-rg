/**
 * migrate-blog-posts.ts
 *
 * Migrates all blog posts from the old momentumrg.com WordPress site
 * into Payload CMS, including featured images and categories.
 *
 * - Pulls 88 published posts via WP REST API
 * - Downloads and uploads featured images to Payload media
 * - Converts HTML content → Lexical JSON (Payload richText format)
 * - Syncs WP categories to Payload categories collection
 * - Skips posts that already exist (idempotent / safe to re-run)
 *
 * Usage:
 *   cd apps/app
 *   pnpm tsx --env-file=.env.local.vercel scripts/migrate-blog-posts.ts
 *   pnpm tsx --env-file=.env.local.vercel scripts/migrate-blog-posts.ts --dry-run
 *   pnpm tsx --env-file=.env.local.vercel scripts/migrate-blog-posts.ts --limit=10
 */

import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";
import fs from "fs";
import path from "path";
import os from "os";

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] || "100");
const DELAY_MS = 500;

// ─── WP credentials ───────────────────────────────────────────────────────────

const WP_BASE = "https://momentumrg.com/wp-json/wp/v2";
const WP_USER = "bjohnson@swizzmagik.com";
const WP_PASS = "k4G4 3C3V 7uKb lpEF aJdh Pjz7";
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

// ─── HTML → Lexical converter ─────────────────────────────────────────────────
// Handles the most common WordPress block tags:
// p, h2, h3, h4, strong, em, a, ul, ol, li, br, img (inline)

function makeTextNode(text: string, format = 0) {
  return { detail: 0, format, mode: "normal", style: "", text, type: "text", version: 1 };
}

function makeParagraph(children: any[]) {
  return {
    children: children.length ? children : [makeTextNode("")],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  };
}

function makeHeading(children: any[], tag: "h2" | "h3" | "h4" = "h2") {
  return {
    children,
    direction: "ltr",
    format: "",
    indent: 0,
    tag,
    type: "heading",
    version: 1,
  };
}

function makeListItem(children: any[], value = 1) {
  return {
    children: [makeParagraph(children)],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "listitem",
    value,
    version: 1,
  };
}

function makeList(items: any[][], listType: "bullet" | "number" = "bullet") {
  return {
    children: items.map((children, i) => makeListItem(children, i + 1)),
    direction: "ltr",
    format: "",
    indent: 0,
    listType,
    start: 1,
    tag: listType === "bullet" ? "ul" : "ol",
    type: "list",
    version: 1,
  };
}

/**
 * Minimal HTML parser that converts common WP content to Lexical nodes.
 * Uses basic regex/string manipulation — no external deps needed.
 */
function htmlToLexical(html: string): any {
  // Strip WordPress-specific data attributes
  html = html.replace(/\s+data-[a-z-]+="[^"]*"/g, "");
  html = html.replace(/\s+data-[a-z-]+='[^']*'/g, "");

  // Normalize whitespace between tags
  html = html.replace(/\s+</g, "<").replace(/>\s+/g, ">");

  // Split into block-level elements
  const nodes: any[] = [];

  // We'll parse by extracting top-level block tags
  const blockTagRe = /<(p|h[2-6]|ul|ol|blockquote|div|pre|figure)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex
  blockTagRe.lastIndex = 0;

  while ((match = blockTagRe.exec(html)) !== null) {
    const [fullMatch, tag, , inner] = match;

    // Handle any loose text before this block (shouldn't normally happen)
    const before = html.slice(lastIndex, match.index).trim();
    if (before) {
      const textNodes = parseInlineHtml(before);
      if (textNodes.length) nodes.push(makeParagraph(textNodes));
    }
    lastIndex = match.index + fullMatch.length;

    const lowerTag = tag.toLowerCase();

    if (lowerTag === "p") {
      const children = parseInlineHtml(inner.trim());
      if (children.length > 0 || true) {
        nodes.push(makeParagraph(children));
      }
    } else if (lowerTag === "h2") {
      nodes.push(makeHeading(parseInlineHtml(stripTags(inner)), "h2"));
    } else if (lowerTag === "h3") {
      nodes.push(makeHeading(parseInlineHtml(stripTags(inner)), "h3"));
    } else if (lowerTag === "h4") {
      nodes.push(makeHeading(parseInlineHtml(stripTags(inner)), "h4"));
    } else if (lowerTag === "ul") {
      const items = extractListItems(inner);
      if (items.length) nodes.push(makeList(items, "bullet"));
    } else if (lowerTag === "ol") {
      const items = extractListItems(inner);
      if (items.length) nodes.push(makeList(items, "number"));
    } else if (lowerTag === "blockquote") {
      // Treat as paragraph
      const children = parseInlineHtml(stripTags(inner).trim());
      nodes.push(makeParagraph(children));
    } else if (lowerTag === "figure") {
      // Skip embedded images in content — featured image is handled separately
    } else {
      // div / pre / other — treat inner text as paragraph
      const text = stripTags(inner).trim();
      if (text) nodes.push(makeParagraph([makeTextNode(text)]));
    }
  }

  // Any trailing loose text
  const after = html.slice(lastIndex).trim();
  if (after) {
    const textNodes = parseInlineHtml(after);
    if (textNodes.length) nodes.push(makeParagraph(textNodes));
  }

  return {
    root: {
      children: nodes.length > 0 ? nodes : [makeParagraph([makeTextNode("")])],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

function extractListItems(html: string): any[][] {
  const items: any[][] = [];
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(html)) !== null) {
    items.push(parseInlineHtml(stripTags(m[1]).trim()));
  }
  return items;
}

/**
 * Parse inline HTML (strong, em, a, br, plain text) into Lexical text nodes.
 * Format bits: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
 */
function parseInlineHtml(html: string): any[] {
  const nodes: any[] = [];
  // Process inline tags: strong/b (bold=1), em/i (italic=2), a (ignored but text kept), br
  const inlineRe = /<(strong|b|em|i|a|span|code|br)\b([^>]*)>([\s\S]*?)<\/\1>|<br\s*\/?>/gi;

  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = inlineRe.exec(html)) !== null) {
    // Text before this inline tag
    const before = html.slice(last, m.index);
    if (before) {
      const text = decodeHtmlEntities(stripTags(before));
      if (text) nodes.push(makeTextNode(text));
    }
    last = m.index + m[0].length;

    if (m[0].startsWith("<br")) {
      nodes.push(makeTextNode("\n"));
      continue;
    }

    const tag = m[1].toLowerCase();
    const inner = m[3] || "";
    const text = decodeHtmlEntities(stripTags(inner));

    if (!text) continue;

    let format = 0;
    if (tag === "strong" || tag === "b") format |= 1; // bold
    if (tag === "em" || tag === "i") format |= 2; // italic
    if (tag === "code") format |= 16; // code

    nodes.push(makeTextNode(text, format));
  }

  // Remaining text
  const after = html.slice(last);
  if (after) {
    const text = decodeHtmlEntities(stripTags(after));
    if (text) nodes.push(makeTextNode(text));
  }

  return nodes.filter((n) => n.text !== "");
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8230;/g, "…")
    .replace(/&[a-z]+;/g, ""); // strip remaining unknown entities
}

// ─── WP API helpers ───────────────────────────────────────────────────────────

async function fetchAllPosts(): Promise<any[]> {
  const res = await fetch(
    `${WP_BASE}/posts?per_page=100&status=publish&_embed=false`,
    { headers: { Authorization: `Basic ${WP_AUTH}` } }
  );
  const posts = await res.json();
  const total = parseInt(res.headers.get("x-wp-total") || String(posts.length));
  console.log(`📦 Found ${total} published posts in WordPress`);
  return posts;
}

async function fetchWPCategories(): Promise<Map<number, { name: string; slug: string }>> {
  const res = await fetch(`${WP_BASE}/categories?per_page=100`);
  const cats: any[] = await res.json();
  const map = new Map<number, { name: string; slug: string }>();
  for (const c of cats) map.set(c.id, { name: c.name, slug: c.slug });
  return map;
}

async function fetchFeaturedMedia(mediaId: number): Promise<string | null> {
  if (!mediaId) return null;
  try {
    const res = await fetch(`${WP_BASE}/media/${mediaId}`, {
      headers: { Authorization: `Basic ${WP_AUTH}` },
    });
    if (!res.ok) return null;
    const media: any = await res.json();
    return media.source_url || media.guid?.rendered || null;
  } catch {
    return null;
  }
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MomentumRG-migration/1.0)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = path.basename(url.split("?")[0]) || "image.jpg";
  return { buffer, contentType, filename };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Initializing Payload...");
  const payload = await getPayload({ config });

  if (DRY_RUN) console.log("🔵 DRY RUN — no writes will be made\n");

  // Get admin user for author field
  const users = await payload.find({ collection: "users", limit: 1 });
  const authorId = users.docs[0]?.id;
  if (!authorId) {
    console.error("❌ No admin user found. Create a user first via /admin.");
    process.exit(1);
  }

  // Fetch WP categories and sync to Payload
  console.log("\n📋 Syncing WordPress categories...");
  const wpCategoryMap = await fetchWPCategories();
  const payloadCategoryIds = new Map<number, string | number>();

  if (!DRY_RUN) {
    for (const [wpCatId, { name, slug }] of wpCategoryMap) {
      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: slug } },
        limit: 1,
      });

      if (existing.totalDocs > 0) {
        payloadCategoryIds.set(wpCatId, existing.docs[0].id);
      } else {
        const cat = await payload.create({
          collection: "categories",
          data: { name: decodeHtmlEntities(name), slug },
        });
        payloadCategoryIds.set(wpCatId, cat.id);
        console.log(`  ➕ Category: "${name}"`);
      }
    }
  }
  console.log(`  ✅ ${wpCategoryMap.size} categories ready`);

  // Fetch all posts
  console.log("\n📰 Fetching WordPress posts...");
  const wpPosts = await fetchAllPosts();
  const toProcess = wpPosts.slice(0, LIMIT);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const wp = toProcess[i];
    const title = decodeHtmlEntities(wp.title?.rendered || "Untitled");
    const slug = wp.slug || `post-${wp.id}`;

    process.stdout.write(`[${i + 1}/${toProcess.length}] "${title.slice(0, 60)}"... `);

    if (DRY_RUN) {
      console.log("(dry run)");
      created++;
      continue;
    }

    try {
      // Check if already imported
      const existing = await payload.find({
        collection: "posts",
        where: { slug: { equals: slug } },
        limit: 1,
      });

      if (existing.totalDocs > 0) {
        console.log("⏭  exists");
        skipped++;
        continue;
      }

      // Convert HTML content → Lexical
      const rawHtml = wp.content?.rendered || "";
      const lexicalContent = htmlToLexical(rawHtml);

      // Strip HTML from excerpt
      const excerpt = decodeHtmlEntities(
        stripTags(wp.excerpt?.rendered || "").trim()
      ).slice(0, 500);

      // Map categories
      const wpCatIds: number[] = wp.categories || [];
      const categoryPayloadIds = wpCatIds
        .map((id) => payloadCategoryIds.get(id))
        .filter(Boolean) as (string | number)[];

      // Download and upload featured image
      let featuredImageId: string | number | undefined;

      if (wp.featured_media) {
        try {
          const imageUrl = await fetchFeaturedMedia(wp.featured_media);
          if (imageUrl) {
            const { buffer, filename } = await downloadImage(imageUrl);
            const tmpPath = path.join(os.tmpdir(), `mrg_post_${wp.id}_${filename}`);
            fs.writeFileSync(tmpPath, buffer);

            const mediaDoc = await payload.create({
              collection: "media",
              data: { alt: title },
              filePath: tmpPath,
            });
            fs.unlinkSync(tmpPath);
            featuredImageId = mediaDoc.id;
          }
        } catch (imgErr: any) {
          console.warn(`\n    ⚠️  Image failed: ${imgErr.message?.slice(0, 80)}`);
        }
      }

      // Create the post
      await payload.create({
        collection: "posts",
        data: {
          title,
          slug,
          excerpt: excerpt || undefined,
          content: lexicalContent,
          publishedDate: wp.date ? new Date(wp.date).toISOString() : undefined,
          author: authorId,
          categories: categoryPayloadIds.length ? categoryPayloadIds : undefined,
          featuredImage: featuredImageId,
          _status: "published",
        },
      });

      created++;
      console.log(`✅`);
    } catch (err: any) {
      errors++;
      console.log(`❌ ${err.message?.slice(0, 100)}`);
    }

    // Polite delay between posts
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  console.log(`\n📊 Results:`);
  console.log(`  ✅ Created:  ${created}`);
  console.log(`  ⏭️  Skipped:  ${skipped}`);
  console.log(`  ❌ Errors:   ${errors}`);
  console.log(`\n🎉 Done!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
