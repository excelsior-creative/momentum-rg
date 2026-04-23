/**
 * patch-images.ts
 *
 * Fetches image URLs from the WordPress API and patches them into
 * Payload properties that are missing wpImageUrls.
 *
 * Usage:
 *   pnpm tsx --env-file=.env.vercel scripts/patch-images.ts
 *
 * Safe to run multiple times (skips properties that already have images).
 */

import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";
import { wpMediaUrl, wpMediaUrlFromAny } from "../src/lib/wpMediaUrl";

const WP_BASE = "https://momentumrg.com/wp-json/wp/v2";

async function fetchWpProperty(wpId: number): Promise<any> {
  try {
    const res = await fetch(`${WP_BASE}/properties/${wpId}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function main() {
  console.log("🚀 Initializing Payload...");
  const payload = await getPayload({ config });

  // Fetch all properties missing image data
  console.log("\n📋 Finding properties without image data...");
  const allResult = await payload.find({
    collection: "properties",
    limit: 300,
    depth: 0,
  });

  const needsImages = (allResult.docs as any[]).filter(
    (p) => !p.wpImageUrls || p.wpImageUrls.length === 0
  );

  console.log(
    `Total: ${allResult.totalDocs} | Need images: ${needsImages.length}\n`
  );

  let patched = 0;
  let noImages = 0;
  let errors = 0;

  for (let i = 0; i < needsImages.length; i++) {
    const property = needsImages[i] as any;
    const { id, title, wpId } = property;

    if (!wpId) {
      console.log(`  [${i + 1}/${needsImages.length}] SKIP  "${title}" — no wpId`);
      noImages++;
      continue;
    }

    // Fetch from WP
    const wpProp = await fetchWpProperty(wpId);
    if (!wpProp) {
      console.log(`  [${i + 1}/${needsImages.length}] FAIL  WP ID ${wpId} not found`);
      errors++;
      continue;
    }

    const meta = wpProp.property_meta || {};
    const imageData: any[] = meta.REAL_HOMES_property_images || [];

    const wpImageUrls = imageData
      .slice(0, 20)
      .map((img: any) => {
        const raw =
          img.full_url ||
          img.url ||
          (img.file ? wpMediaUrl(String(img.file).replace(/^\/+/, "")) : null);
        return raw ? wpMediaUrlFromAny(raw) : null;
      })
      .filter(Boolean) as string[];

    if (wpImageUrls.length === 0) {
      console.log(
        `  [${i + 1}/${needsImages.length}] NONE  "${title}" — WP has no images`
      );
      noImages++;
      continue;
    }

    try {
      await payload.update({
        collection: "properties",
        id,
        data: {
          wpImageUrls: wpImageUrls.map((url) => ({ url })),
        },
      });
      patched++;
      console.log(
        `  [${i + 1}/${needsImages.length}] ✅ "${title}" — ${wpImageUrls.length} images`
      );
    } catch (err: any) {
      errors++;
      console.error(
        `  [${i + 1}/${needsImages.length}] ❌ Error patching ${id}: ${err.message?.slice(0, 80)}`
      );
    }

    // Small delay to be polite to WP API
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n✅ Done!`);
  console.log(`  Patched with images: ${patched}`);
  console.log(`  No images available: ${noImages}`);
  console.log(`  Errors: ${errors}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
