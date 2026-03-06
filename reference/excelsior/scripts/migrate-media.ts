#!/usr/bin/env npx tsx
/**
 * Media Migration Script
 *
 * Migrates existing static images to Vercel Blob storage via Payload CMS.
 * Handles both project images (from /public/work/) and checks article media.
 *
 * Usage:
 *   npx tsx scripts/migrate-media.ts              # Run migration
 *   npx tsx scripts/migrate-media.ts --dry-run    # Preview without changes
 *
 * Environment variables required:
 *   - BLOB_READ_WRITE_TOKEN: Vercel Blob token
 *   - DATABASE_URL: Database connection string
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "../src/payload.config";
import { put } from "@vercel/blob";

// Parse command line arguments
function parseArgs(): { dryRun: boolean } {
  const args = process.argv.slice(2);
  let dryRun = false;

  for (const arg of args) {
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
Media Migration Script

Migrates static images from /public/work/ to Vercel Blob storage
and updates project references.

Usage:
  npx tsx scripts/migrate-media.ts [options]

Options:
  --dry-run      Preview changes without modifying database
  --help, -h     Show this help message

Examples:
  npx tsx scripts/migrate-media.ts              # Run full migration
  npx tsx scripts/migrate-media.ts --dry-run    # Preview only
      `);
      process.exit(0);
    }
  }

  return { dryRun };
}

// Check environment
function checkEnvironment(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("\n❌ Missing BLOB_READ_WRITE_TOKEN environment variable");
    console.error("   Please set this in your .env file\n");
    process.exit(1);
  }
}

// Get MIME type from file extension
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] || "image/jpeg";
}

// Migrate project images
async function migrateProjectImages(
  payload: Awaited<ReturnType<typeof getPayload>>,
  dryRun: boolean
): Promise<{ migrated: number; skipped: number; failed: number }> {
  console.log("\n📦 Migrating Project Images...\n");

  const { docs: projects } = await payload.find({
    collection: "projects",
    limit: 500,
    depth: 0,
  });

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const project of projects) {
    const prefix = `[${migrated + skipped + failed + 1}/${projects.length}]`;

    // Check if it has an uploaded image and if it's cloud-hosted
    if (project.image) {
      const mediaId = typeof project.image === "object" ? project.image.id : project.image;
      try {
        const media = await payload.findByID({
          collection: "media",
          id: mediaId,
        });

        // If URL contains 'blob.vercel-storage.com', it's definitely cloud hosted
        if (media.url && media.url.includes("blob.vercel-storage.com")) {
          console.log(`${prefix} ✓ ${project.title} - already has direct cloud URL (${media.url})`);
          skipped++;
          continue;
        }
        
        console.log(`${prefix} ℹ ${project.title} - has local or proxied URL (${media.url}), re-migrating...`);
      } catch (e) {
        console.log(`${prefix} ⚠ ${project.title} - image reference broken, re-migrating...`);
      }
    }

    // Resolve the file path
    let relativePath = project.imagePath;
    
    if (!relativePath && project.slug) {
      // Fallback: try to find image by slug in public/work
      const slugPath = `work/${project.slug}.jpg`;
      if (fs.existsSync(path.join(process.cwd(), "public", slugPath))) {
        relativePath = `/${slugPath}`;
      }
    }

    if (!relativePath) {
      console.log(`${prefix} ⚠ ${project.title} - no image path found`);
      skipped++;
      continue;
    }

    const absolutePath = path.join(
      process.cwd(),
      "public",
      relativePath.startsWith("/") ? relativePath.slice(1) : relativePath
    );

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      console.log(`${prefix} ❌ ${project.title} - file not found: ${absolutePath}`);
      failed++;
      continue;
    }

    if (dryRun) {
      console.log(`${prefix} [DRY RUN] Would migrate: ${project.title}`);
      console.log(`         From: ${absolutePath}`);
      migrated++;
      continue;
    }

    try {
      // Read the file
      const fileBuffer = fs.readFileSync(absolutePath);
      const fileName = path.basename(absolutePath);
      const mimeType = getMimeType(absolutePath);

      console.log(`${prefix} ⬆ Uploading ${fileName} to Vercel Blob...`);
      const blob = await put(fileName, fileBuffer, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      });

      // Upload to Payload media (this will also create sizes)
      const mediaDoc = await payload.create({
        collection: "media",
        data: {
          alt: `${project.title} - Project Screenshot`,
          caption: project.summary || `Website screenshot for ${project.title}`,
        },
        file: {
          data: fileBuffer,
          name: fileName,
          mimetype: mimeType,
          size: fileBuffer.length,
        },
      });

      // Update the URL to the direct Vercel Blob URL
      await payload.update({
        collection: "media",
        id: mediaDoc.id,
        data: {
          url: blob.url,
        },
      });

      // Update project to use the new media reference
      await payload.update({
        collection: "projects",
        id: project.id,
        data: {
          image: mediaDoc.id,
          imagePath: null, // Clear fallback path
        },
      });

      console.log(`${prefix} ✅ ${project.title} - migrated to ${blob.url}`);
      migrated++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.log(`${prefix} ❌ ${project.title} - failed: ${errorMsg}`);
      failed++;
    }

    // Small delay to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { migrated, skipped, failed };
}

// Check article media status
async function checkArticleMedia(
  payload: Awaited<ReturnType<typeof getPayload>>
): Promise<{ total: number; withImages: number; missingImages: number }> {
  console.log("\n📰 Checking Article Media...\n");

  const { docs: articles } = await payload.find({
    collection: "articles",
    limit: 500,
    depth: 1,
  });

  let withImages = 0;
  let missingImages = 0;

  for (const article of articles) {
    const hasFeaturedImage = article.featuredImage && 
      (typeof article.featuredImage === "object" ? article.featuredImage.url : true);
    const hasInfographic = article.infographic &&
      (typeof article.infographic === "object" ? article.infographic.url : true);

    if (hasFeaturedImage && hasInfographic) {
      console.log(`  ✅ ${article.title}`);
      withImages++;
    } else {
      const missing = [];
      if (!hasFeaturedImage) missing.push("featuredImage");
      if (!hasInfographic) missing.push("infographic");
      console.log(`  ❌ ${article.title} - missing: ${missing.join(", ")}`);
      missingImages++;
    }
  }

  return { total: articles.length, withImages, missingImages };
}

// Main function
async function main(): Promise<void> {
  const startTime = Date.now();
  const { dryRun } = parseArgs();

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              MEDIA MIGRATION TO VERCEL BLOB                   ║
╠═══════════════════════════════════════════════════════════════╣
║  Migrating static images to cloud storage                     ║
${dryRun ? "║  MODE: DRY RUN (preview only, no changes)                    ║\n" : ""}╚═══════════════════════════════════════════════════════════════╝
`);

  // Check environment
  if (!dryRun) {
    checkEnvironment();
  }

  // Initialize Payload
  console.log("Initializing Payload CMS...");
  const payload = await getPayload({ config });

  // Migrate project images
  const projectResults = await migrateProjectImages(payload, dryRun);

  // Check article media
  const articleResults = await checkArticleMedia(payload);

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`
${"─".repeat(60)}

╔═══════════════════════════════════════════════════════════════╗
║                     MIGRATION COMPLETE                         ║
╠═══════════════════════════════════════════════════════════════╣
║  PROJECT IMAGES                                                ║
║    Migrated:  ${projectResults.migrated.toString().padEnd(4)}                                            ║
║    Skipped:   ${projectResults.skipped.toString().padEnd(4)}                                            ║
║    Failed:    ${projectResults.failed.toString().padEnd(4)}                                            ║
╠═══════════════════════════════════════════════════════════════╣
║  ARTICLES                                                      ║
║    Total:         ${articleResults.total.toString().padEnd(4)}                                        ║
║    With images:   ${articleResults.withImages.toString().padEnd(4)}                                        ║
║    Missing images:${articleResults.missingImages.toString().padEnd(4)}                                        ║
╠═══════════════════════════════════════════════════════════════╣
║  Duration:  ${duration.padEnd(6)}s                                           ║
╚═══════════════════════════════════════════════════════════════╝
`);

  if (articleResults.missingImages > 0) {
    console.log(`
💡 TIP: To regenerate missing article images, run:
   pnpm run generate:articles -- --count ${articleResults.missingImages}
`);
  }

  if (dryRun) {
    console.log(`
⚠️  This was a DRY RUN. No changes were made.
   Run without --dry-run to perform the actual migration.
`);
  }

  process.exit(projectResults.failed > 0 ? 1 : 0);
}

// Run
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
