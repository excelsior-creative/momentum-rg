/**
 * geocode-properties.ts
 * Geocodes properties in the Payload DB that are missing lat/lng coordinates.
 * Uses Nominatim (OpenStreetMap) — free, no API key required.
 *
 * Usage:
 *   cd apps/app && npx tsx scripts/geocode-properties.ts
 *
 * Rate limited to 1 request/second per Nominatim policy.
 */

import { getPayload } from "payload";
import config from "../src/payload.config";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";
const RATE_LIMIT_MS = 1200; // 1.2s between requests (Nominatim allows 1/s)

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocode(address: string, city: string, state = "CA"): Promise<{ lat: number; lng: number } | null> {
  const query = [address, city, state, "USA"].filter(Boolean).join(", ");
  const url = `${NOMINATIM_BASE}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=us`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "MomentumRealtyGroup/1.0 (karl@momentumrg.com)",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`Nominatim HTTP ${res.status} for: ${query}`);
      return null;
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      // Try with just zip + city
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.warn(`Geocode error for "${query}":`, err);
    return null;
  }
}

async function geocodeByZip(zipCode: string): Promise<{ lat: number; lng: number } | null> {
  const url = `${NOMINATIM_BASE}?postalcode=${encodeURIComponent(zipCode)}&country=us&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "MomentumRealtyGroup/1.0 (karl@momentumrg.com)",
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
}

async function main() {
  const payload = await getPayload({ config });
  console.log("🌍 Starting geocoding...\n");

  let page = 1;
  let processed = 0;
  let geocoded = 0;
  let failed = 0;
  let skipped = 0;

  while (true) {
    const result = await payload.find({
      collection: "properties",
      page,
      limit: 50,
      where: {
        and: [
          { latitude: { exists: false } },
        ],
      },
      select: {
        id: true,
        title: true,
        address: true,
        city: true,
        zipCode: true,
        latitude: true,
        longitude: true,
      },
    });

    if (result.docs.length === 0) break;

    for (const property of result.docs) {
      processed++;

      // Skip if already has coords
      if (property.latitude && property.longitude) {
        skipped++;
        continue;
      }

      const address = (property as { address?: string }).address;
      const city = (property as { city?: string }).city;
      const zipCode = (property as { zipCode?: string }).zipCode;

      if (!address && !city && !zipCode) {
        console.log(`  ⚠️  No address data for: "${property.title}" — skipping`);
        failed++;
        continue;
      }

      let coords: { lat: number; lng: number } | null = null;

      // Try full address first
      if (address && city) {
        coords = await geocode(address, city);
        await sleep(RATE_LIMIT_MS);
      }

      // Fallback: zip code only
      if (!coords && zipCode) {
        coords = await geocodeByZip(zipCode);
        await sleep(RATE_LIMIT_MS);
      }

      if (coords) {
        await payload.update({
          collection: "properties",
          id: property.id,
          data: {
            latitude: coords.lat,
            longitude: coords.lng,
          },
        });
        console.log(`  ✅ [${processed}] "${property.title}" → ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
        geocoded++;
      } else {
        console.log(`  ❌ [${processed}] Failed to geocode: "${property.title}" (${address || ""}, ${city || ""}, ${zipCode || ""})`);
        failed++;
      }
    }

    if (!result.hasNextPage) break;
    page++;
  }

  console.log(`
✅ Geocoding complete!
   Processed: ${processed}
   Geocoded:  ${geocoded}
   Skipped:   ${skipped} (already had coords)
   Failed:    ${failed}
  `);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Geocoding failed:", err);
  process.exit(1);
});
