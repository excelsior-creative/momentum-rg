import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "properties",
    limit: 1,
    depth: 0,
  });
  console.log(`Total properties in DB: ${result.totalDocs}`);

  // Show one sample property
  if (result.docs.length > 0) {
    const p = result.docs[0] as any;
    console.log("Sample property:");
    console.log(`  id: ${p.id}`);
    console.log(`  title: ${p.title}`);
    console.log(`  slug: ${p.slug}`);
    console.log(`  status: ${p.status}`);
    console.log(`  price: ${p.price}`);
    console.log(`  city: ${p.city}`);
    console.log(`  bedrooms: ${p.bedrooms}`);
    console.log(`  bathrooms: ${p.bathrooms}`);
    console.log(`  sqft: ${p.sqft}`);
    console.log(`  address: ${p.address}`);
    console.log(`  wpImageUrls count: ${(p.wpImageUrls || []).length}`);
    if ((p.wpImageUrls || []).length > 0) {
      console.log(`  first image url: ${p.wpImageUrls[0].url}`);
    }
  }

  // Count by status
  const statuses = ["for-sale", "sold", "in-escrow", "for-lease", "leased", "pending", "coming-soon", "on-hold", "cancelled"];
  console.log("\nBreakdown by status:");
  for (const s of statuses) {
    const r = await payload.find({
      collection: "properties",
      where: { status: { equals: s } },
      limit: 0,
      depth: 0,
    });
    if (r.totalDocs > 0) console.log(`  "${s}": ${r.totalDocs}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
