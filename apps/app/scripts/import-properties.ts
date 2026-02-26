/**
 * import-properties.ts
 *
 * Migrates all properties from momentumrg.com WordPress REST API
 * into the Payload CMS database.
 *
 * Usage:
 *   DATABASE_URL=... PAYLOAD_SECRET=... pnpm tsx scripts/import-properties.ts
 */

import "dotenv/config";
import payload from "payload";
import config from "../src/payload.config";

// ─── Type Maps ────────────────────────────────────────────────────────────────

const TYPE_MAP: Record<string, string> = {
  "Single Family Home": "single-family-home",
  Condo: "condo",
  Townhouse: "townhouse",
  Duplex: "duplex",
  Fourplex: "fourplex",
  "Multi Unit": "multi-unit",
  Apartment: "apartment",
  Land: "land",
  "Co-Op": "co-op",
};

const STATUS_MAP: Record<string, string> = {
  "For Sale": "for-sale",
  Sold: "sold",
  "In Escrow": "in-escrow",
  "For Lease": "for-lease",
  Leased: "leased",
  Pending: "pending",
  "On Hold": "on-hold",
  Cancelled: "cancelled",
  "Coming Soon": "coming-soon",
  "Under Contract": "in-escrow",
  "On Sale": "for-sale",
  "For Rent": "for-lease",
};

// ─── WP API Helpers ───────────────────────────────────────────────────────────

const WP_BASE = "https://momentumrg.com/wp-json/wp/v2";

async function fetchTaxonomyTerms(taxonomy: string): Promise<Map<number, string>> {
  const res = await fetch(`${WP_BASE}/${taxonomy}?per_page=100`);
  const terms: any[] = await res.json();
  const map = new Map<number, string>();
  for (const t of terms) map.set(t.id, t.name);
  return map;
}

async function fetchPropertiesPage(page: number): Promise<any[]> {
  const res = await fetch(
    `${WP_BASE}/properties?per_page=100&page=${page}&_embed=false`
  );
  if (!res.ok) return [];
  return res.json();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Initializing Payload...");
  await payload.init({ config, local: true });

  // Load taxonomy maps
  console.log("📋 Loading taxonomy terms...");
  const [types, statuses, cities] = await Promise.all([
    fetchTaxonomyTerms("property-types"),
    fetchTaxonomyTerms("property-statuses"),
    fetchTaxonomyTerms("property-cities"),
  ]);

  console.log(`  Types: ${types.size} | Statuses: ${statuses.size} | Cities: ${cities.size}`);

  // Get total pages
  const headerRes = await fetch(`${WP_BASE}/properties?per_page=100&page=1`);
  const totalPages = parseInt(headerRes.headers.get("x-wp-totalpages") || "1");
  const totalProps = parseInt(headerRes.headers.get("x-wp-total") || "0");
  console.log(`\n📦 Found ${totalProps} properties across ${totalPages} pages\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let page = 1; page <= totalPages; page++) {
    console.log(`Fetching page ${page}/${totalPages}...`);
    const properties = await fetchPropertiesPage(page);

    for (const wp of properties) {
      try {
        const meta = wp.property_meta || {};

        // Map property type
        const typeTermId = (wp["property-types"] || [])[0];
        const typeName = typeTermId ? types.get(typeTermId) || "" : "";
        const propertyType = TYPE_MAP[typeName] || "single-family-home";

        // Map status
        const statusTermId = (wp["property-statuses"] || [])[0];
        const statusName = statusTermId ? statuses.get(statusTermId) || "" : "";
        const status = STATUS_MAP[statusName] || "sold";

        // Parse address parts from full address string
        const fullAddress: string = meta.REAL_HOMES_property_address || "";
        const addressParts = fullAddress.split(", ");
        // Format: "123 Street, City, County, State, ZIP, Country"
        // We'll extract what we can
        let city = "";
        let county = "";
        let zipCode = "";

        const cityTermId = (wp["property-cities"] || [])[0];
        if (cityTermId) city = cities.get(cityTermId) || "";

        // Try to extract zip from address
        const zipMatch = fullAddress.match(/\b\d{5}\b/);
        if (zipMatch) zipCode = zipMatch[0];

        // Try to extract county
        const countyMatch = fullAddress.match(/(\w+)\s+County/);
        if (countyMatch) county = countyMatch[0];

        // Location coords
        const location = meta.REAL_HOMES_property_location || {};
        const latitude = location.latitude ? parseFloat(location.latitude) : null;
        const longitude = location.longitude ? parseFloat(location.longitude) : null;

        // Images - collect original URLs
        const imageData: any[] = meta.REAL_HOMES_property_images || [];
        const wpImageUrls = imageData
          .slice(0, 20)
          .map((img: any) => {
            const srcFull = img.sizes?.["property_size_rh_map_thumb"]?.source_url ||
              img.sizes?.["full"]?.source_url || "";
            // Reconstruct from file path
            if (!srcFull && img.file) {
              return `https://momentumrg.com/wp-content/uploads/${img.file}`;
            }
            return srcFull;
          })
          .filter(Boolean);

        // Featured media URL (thumbnail)
        const featuredImageUrl =
          wp.featured_media && imageData.length > 0
            ? `https://momentumrg.com/wp-content/uploads/${imageData[0]?.file || ""}`
            : null;

        // Date added
        const dateAdded = wp.date ? new Date(wp.date).toISOString() : undefined;

        // Check if already imported (by wpId)
        const existing = await payload.find({
          collection: "properties",
          where: { wpId: { equals: wp.id } },
          limit: 1,
        });

        if (existing.docs.length > 0) {
          skipped++;
          continue;
        }

        // Generate unique slug
        let slug = wp.slug || `property-${wp.id}`;

        // Create the property
        await payload.create({
          collection: "properties",
          data: {
            title: wp.title?.rendered?.replace(/\u00a0/g, " ") || "Untitled Property",
            slug,
            excerpt: wp.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() || "",
            status,
            propertyType,
            featured: meta.REAL_HOMES_featured === 1,
            price: meta.REAL_HOMES_property_price
              ? parseFloat(meta.REAL_HOMES_property_price)
              : null,
            priceOld: meta.REAL_HOMES_property_old_price
              ? parseFloat(meta.REAL_HOMES_property_old_price)
              : null,
            bedrooms: meta.REAL_HOMES_property_bedrooms
              ? parseInt(meta.REAL_HOMES_property_bedrooms)
              : null,
            bathrooms: meta.REAL_HOMES_property_bathrooms
              ? parseFloat(meta.REAL_HOMES_property_bathrooms)
              : null,
            sqft: meta.REAL_HOMES_property_size
              ? parseFloat(meta.REAL_HOMES_property_size)
              : null,
            garage: meta.REAL_HOMES_property_garage
              ? parseInt(meta.REAL_HOMES_property_garage)
              : null,
            lotSize: meta.REAL_HOMES_property_lot_size || null,
            yearBuilt: meta.REAL_HOMES_property_year_built
              ? parseInt(meta.REAL_HOMES_property_year_built)
              : null,
            propertyId: meta.REAL_HOMES_property_id || null,
            address: fullAddress,
            city: city || null,
            state: "CA",
            zipCode: zipCode || null,
            county: county || null,
            latitude,
            longitude,
            dateAdded,
            wpId: wp.id,
            wpImageUrls: wpImageUrls.map((url: string) => ({ url })),
          },
        });

        imported++;
        if (imported % 10 === 0) {
          console.log(`  ✅ Imported ${imported}...`);
        }
      } catch (err: any) {
        errors++;
        console.error(`  ❌ Error on WP ID ${wp.id}: ${err.message?.slice(0, 100)}`);
      }
    }

    // Small delay between pages to be polite
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n✅ Done!`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped (already exists): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
