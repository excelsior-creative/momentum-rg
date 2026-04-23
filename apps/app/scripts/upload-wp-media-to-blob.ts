#!/usr/bin/env npx tsx
/**
 * Uploads reference/uploads (WordPress mirror) to Vercel Blob with stable pathnames:
 *   wp-uploads/YYYY/MM/filename.ext
 *
 * Manifest (relativePath -> url) enables resume after interruption.
 *
 * Usage (from apps/app):
 *   pnpm tsx --env-file=.env.local scripts/upload-wp-media-to-blob.ts
 *   pnpm tsx --env-file=.env.local scripts/upload-wp-media-to-blob.ts --dry-run
 *   pnpm tsx --env-file=.env.local scripts/upload-wp-media-to-blob.ts --concurrency=8
 *
 * Env:
 *   BLOB_READ_WRITE_TOKEN — required (same as Payload vercel blob plugin)
 *   WP_UPLOADS_ROOT — optional; default: repo root reference/uploads
 *   NEXT_PUBLIC_WP_MEDIA_BASE — set in Vercel to blob store origin (e.g. https://xxx.public.blob.vercel-storage.com)
 *
 * After upload, set NEXT_PUBLIC_WP_MEDIA_BASE in Vercel project env to match your store’s public URL origin.
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { put } from "@vercel/blob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
]);

const DEFAULT_EXCLUDE_DIR_NAMES = new Set([
  "wpallimport",
  "siteground-optimizer-assets",
  "wp-file-manager-pro",
  "theplus-addons",
  "logs",
]);

const BLOB_PREFIX = "wp-uploads";

type Manifest = Record<string, string>;

function parseArgs() {
  const argv = process.argv.slice(2);
  let dryRun = false;
  let concurrency = 6;
  let manifestPath = path.join(__dirname, "wp-blob-upload-manifest.json");

  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
    else if (a.startsWith("--concurrency=")) {
      concurrency = Math.max(1, parseInt(a.split("=")[1] || "6", 10) || 6);
    } else if (a.startsWith("--manifest=")) {
      manifestPath = path.resolve(a.split("=")[1] || manifestPath);
    } else if (a === "--help" || a === "-h") {
      console.log(`See script header in upload-wp-media-to-blob.ts`);
      process.exit(0);
    }
  }

  return { dryRun, concurrency, manifestPath };
}

function getDefaultUploadsRoot(): string {
  const appRoot = path.resolve(__dirname, "..");
  const repoRoot = path.resolve(appRoot, "..", "..");
  return path.join(repoRoot, "reference", "uploads");
}

function loadManifest(p: string): Manifest {
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return {};
  }
}

function saveManifest(p: string, m: Manifest) {
  fs.writeFileSync(p, JSON.stringify(m, null, 0), "utf8");
}

function shouldSkipDir(name: string, exclude: Set<string>): boolean {
  return exclude.has(name.toLowerCase());
}

function collectImageFiles(root: string, exclude: Set<string>): string[] {
  const out: string[] = [];

  function walk(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (shouldSkipDir(ent.name, exclude)) continue;
        walk(full);
        continue;
      }
      if (!ent.isFile()) continue;
      const ext = path.extname(ent.name).toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      out.push(full);
    }
  }

  walk(root);
  return out;
}

function relativeUploadKey(absoluteFile: string, uploadsRoot: string): string {
  const rel = path.relative(uploadsRoot, absoluteFile);
  return rel.split(path.sep).join("/");
}

async function runPool<T>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<void>
) {
  let cursor = 0;
  const n = items.length;
  const worker = async () => {
    while (true) {
      const i = cursor++;
      if (i >= n) break;
      await fn(items[i], i);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(concurrency, Math.max(1, n)) }, () => worker())
  );
}

async function main() {
  const { dryRun, concurrency, manifestPath } = parseArgs();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Missing BLOB_READ_WRITE_TOKEN");
    process.exit(1);
  }

  const uploadsRoot =
    process.env.WP_UPLOADS_ROOT?.trim() || getDefaultUploadsRoot();

  if (!fs.existsSync(uploadsRoot)) {
    console.error(`WP uploads root not found: ${uploadsRoot}`);
    process.exit(1);
  }

  const exclude = DEFAULT_EXCLUDE_DIR_NAMES;
  const files = collectImageFiles(uploadsRoot, exclude);
  const manifest = loadManifest(manifestPath);

  console.log(`Root: ${uploadsRoot}`);
  console.log(`Files (images): ${files.length}`);
  console.log(`Manifest: ${manifestPath} (${Object.keys(manifest).length} entries)`);
  console.log(`Concurrency: ${concurrency} | dryRun: ${dryRun}\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let wouldUpload = 0;
  let sinceFlush = 0;

  const flush = () => {
    saveManifest(manifestPath, manifest);
    sinceFlush = 0;
  };

  await runPool(files, concurrency, async (absPath) => {
    const key = relativeUploadKey(absPath, uploadsRoot);
    const pathname = `${BLOB_PREFIX}/${key}`;

    if (manifest[key]) {
      skipped++;
      return;
    }

    if (dryRun) {
      wouldUpload++;
      return;
    }

    try {
      const buf = fs.readFileSync(absPath);
      const result = await put(pathname, buf, {
        access: "public",
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      manifest[key] = result.url;
      uploaded++;
      sinceFlush++;
      if (sinceFlush >= 25) flush();
    } catch (e: any) {
      failed++;
      console.error(`FAIL ${pathname}: ${e?.message || e}`);
    }
  });

  if (!dryRun) flush();

  if (dryRun) {
    console.log(
      `\nDone (dry run). would upload: ${wouldUpload} already in manifest: ${skipped} files total: ${files.length}`
    );
    console.log("Re-run without --dry-run to upload and write the manifest.");
  } else {
    console.log(`\nDone. uploaded: ${uploaded} skipped(already in manifest): ${skipped} failed: ${failed}`);
  }
  if (!dryRun) {
    console.log(
      `\nSet NEXT_PUBLIC_WP_MEDIA_BASE to your Blob store origin (no trailing slash), e.g. from first URL path:`
    );
    const sample = Object.values(manifest).find((u) => u.startsWith("http"));
    if (sample) {
      try {
        const u = new URL(sample);
        console.log(`  ${u.origin}`);
      } catch {
        /* ignore */
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
