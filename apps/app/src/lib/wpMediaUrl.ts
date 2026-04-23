/**
 * Legacy WordPress uploads live under paths like `2022/03/file.jpg`.
 * After bulk upload to Vercel Blob (see scripts/upload-wp-media-to-blob.ts),
 * they are served at `{NEXT_PUBLIC_WP_MEDIA_BASE}/wp-uploads/{relativePath}`.
 *
 * If NEXT_PUBLIC_WP_MEDIA_BASE is unset, falls back to momentumrg.com/wp-content/uploads
 * so local dev still resolves until Blob is configured.
 */
export const WP_UPLOADS_BLOB_PREFIX = "wp-uploads";

const LEGACY_UPLOADS_BASE = "https://momentumrg.com/wp-content/uploads";

const LEGACY_PREFIXES = [
  "https://momentumrg.com/wp-content/uploads/",
  "http://momentumrg.com/wp-content/uploads/",
] as const;

export function wpMediaUrl(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "");
  const base = process.env.NEXT_PUBLIC_WP_MEDIA_BASE?.trim().replace(/\/$/, "");
  if (base) {
    return `${base}/${WP_UPLOADS_BLOB_PREFIX}/${normalized}`;
  }
  return `${LEGACY_UPLOADS_BASE}/${normalized}`;
}

/** Map a stored WP URL, Blob URL, or bare relative path to the correct public URL. */
export function wpMediaUrlFromAny(input: string): string {
  if (!input) return input;
  for (const prefix of LEGACY_PREFIXES) {
    if (input.startsWith(prefix)) {
      return wpMediaUrl(input.slice(prefix.length));
    }
  }
  if (/^https?:\/\//.test(input)) {
    return input;
  }
  return wpMediaUrl(input);
}

/** Relative paths under wp-content/uploads (same as reference/uploads mirror). */
export const siteMediaPaths = {
  heroOrangeCounty: "2022/03/orange-county-real-estate-2.jpg",
  karlParize: "2022/03/Karl-Parize-Realtor-1.jpg",
  heroSlideWarm: "2025/06/ec0f2dd1aefdaf6488f3e6b01142695d1df501df-scaled.png",
  heroSlideComplex: "2025/06/6daf30f51f90728aaf76113795821975d6fd2d41-scaled.png",
  aboutCollage: "2025/06/New-Project-1-scaled.png",
  serviceRealEstate: "2025/06/image.png",
  servicePropMgmt: "2025/06/prop_management.png",
  serviceInvestments: "2025/06/investments.png",
  serviceMortgages: "2025/06/mortgages.png",
} as const;
