/**
 * migrate-images.ts
 *
 * Downloads property images from the old WordPress CDN and uploads them
 * to Payload CMS media, then sets the featuredImage on each property.
 *
 * Only processes properties that:
 *   - Have wpImageUrls but no featuredImage
 *   - Or are explicitly included via --ids flag
 *
 * Usage:
 *   pnpm tsx --env-file=.env.local.vercel scripts/migrate-images.ts
 *   pnpm tsx --env-file=.env.local.vercel scripts/migrate-images.ts --limit=10
 *   pnpm tsx --env-file=.env.local.vercel scripts/migrate-images.ts --status=for-sale
 *   pnpm tsx --env-file=.env.local.vercel scripts/migrate-images.ts --dry-run
 *
 * Safe to re-run — skips properties that already have a featuredImage set.
 */

import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";
import fs from "fs";
import path from "path";
import os from "os";
import { wpMediaUrlFromAny } from "../src/lib/wpMediaUrl";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] || "300");
const STATUS_FILTER = args.find((a) => a.startsWith("--status="))?.split("=")[1];
const DELAY_MS = 300; // polite delay between downloads

async function downloadImageToBuffer(url: string): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MomentumRG-migration/1.0)" },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }

  const contentType = res.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = path.basename(url.split("?")[0]) || "image.jpg";

  return { buffer, contentType, filename };
}

async function main() {
  console.log("🚀 Initializing Payload...");
  const payload = await getPayload({ config });

  console.log(`\n📋 Finding properties needing images...`);
  if (DRY_RUN) console.log("🔵 DRY RUN mode — no changes will be made\n");

  // Fetch all properties, then filter in JS (Payload doesn't support exists:false on relations reliably)
  const whereClause: any = STATUS_FILTER
    ? { status: { equals: STATUS_FILTER } }
    : {};

  const result = await payload.find({
    collection: "properties",
    where: Object.keys(whereClause).length ? whereClause : undefined,
    limit: LIMIT,
    depth: 1,
    sort: "status", // process active listings first
  });

  // Filter: need wp image URLs but no featuredImage yet
  const properties = (result.docs as any[]).filter(
    (p) =>
      !p.featuredImage &&
      p.wpImageUrls &&
      p.wpImageUrls.length > 0
  );
  console.log(`Found ${properties.length} properties to process (total matching: ${result.totalDocs})\n`);

  let success = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    const wpUrls: { url?: string | null }[] = prop.wpImageUrls || [];

    // Get first valid URL
    const imageUrl = wpUrls.find((u) => u?.url)?.url;

    if (!imageUrl) {
      console.log(`  [${i + 1}/${properties.length}] SKIP  "${prop.title}" — no wp image URLs`);
      skipped++;
      continue;
    }

    const resolvedUrl = wpMediaUrlFromAny(imageUrl);

    if (DRY_RUN) {
      console.log(`  [${i + 1}/${properties.length}] WOULD process "${prop.title}" → ${resolvedUrl}`);
      success++;
      continue;
    }

    try {
      // Download image
      const { buffer, contentType, filename } = await downloadImageToBuffer(resolvedUrl);

      // Write to temp file (Payload's upload needs a file path or stream)
      const tmpPath = path.join(os.tmpdir(), `mrg_${prop.id}_${filename}`);
      fs.writeFileSync(tmpPath, buffer);

      // Upload to Payload media collection
      const mediaDoc = await payload.create({
        collection: "media",
        data: {
          alt: prop.title,
        },
        filePath: tmpPath,
      });

      // Clean up temp file
      fs.unlinkSync(tmpPath);

      // Set as featured image
      await payload.update({
        collection: "properties",
        id: prop.id,
        data: {
          featuredImage: mediaDoc.id,
        },
      });

      success++;
      console.log(`  [${i + 1}/${properties.length}] ✅  "${prop.title}" — ${filename} (${(buffer.length / 1024).toFixed(0)}kb)`);
    } catch (err: any) {
      errors++;
      console.error(`  [${i + 1}/${properties.length}] ❌  "${prop.title}" — ${err.message?.slice(0, 100)}`);
    }

    // Polite delay
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  console.log(`\n📊 Results:`);
  console.log(`  ✅ Migrated: ${success}`);
  console.log(`  ⏭️  Skipped:  ${skipped}`);
  console.log(`  ❌ Errors:   ${errors}`);

  if (result.totalDocs > LIMIT) {
    console.log(`\n⚠️  ${result.totalDocs - LIMIT} more properties remain. Run again to continue.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
