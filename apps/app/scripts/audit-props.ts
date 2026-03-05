import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "properties",
    limit: 50,
    depth: 0,
  });

  console.log(`Total: ${result.totalDocs}\n`);

  let withPrice = 0, withBeds = 0, withBaths = 0, withSqft = 0;
  let withCity = 0, withAddress = 0, withImages = 0, withSlug = 0;

  for (const p of result.docs as any[]) {
    if (p.price) withPrice++;
    if (p.bedrooms != null) withBeds++;
    if (p.bathrooms != null) withBaths++;
    if (p.sqft) withSqft++;
    if (p.city) withCity++;
    if (p.address) withAddress++;
    if ((p.wpImageUrls || []).length > 0) withImages++;
    if (p.slug) withSlug++;
  }

  const n = result.docs.length;
  console.log(`Field coverage (out of ${n} sampled):`);
  console.log(`  price:     ${withPrice}/${n}`);
  console.log(`  bedrooms:  ${withBeds}/${n}`);
  console.log(`  bathrooms: ${withBaths}/${n}`);
  console.log(`  sqft:      ${withSqft}/${n}`);
  console.log(`  city:      ${withCity}/${n}`);
  console.log(`  address:   ${withAddress}/${n}`);
  console.log(`  images:    ${withImages}/${n}`);
  console.log(`  slug:      ${withSlug}/${n}`);

  // Show a "good" property with lots of data
  const good = (result.docs as any[]).find(p => p.price && p.bedrooms && p.city);
  if (good) {
    console.log("\nBest populated property:");
    console.log(JSON.stringify({
      id: good.id, title: good.title, slug: good.slug,
      status: good.status, price: good.price, bedrooms: good.bedrooms,
      bathrooms: good.bathrooms, sqft: good.sqft, city: good.city,
      county: good.county, address: good.address, zipCode: good.zipCode,
      wpImageUrls: (good.wpImageUrls || []).slice(0, 2),
    }, null, 2));
  } else {
    console.log("\nNo fully-populated property found in first 50. Checking with different query...");
    const r2 = await payload.find({
      collection: "properties",
      where: { price: { greater_than: 0 } },
      limit: 3,
      depth: 0,
    });
    for (const p of r2.docs as any[]) {
      console.log(JSON.stringify({
        id: (p as any).id, title: (p as any).title, slug: (p as any).slug,
        price: (p as any).price, bedrooms: (p as any).bedrooms, city: (p as any).city,
        wpImageUrls: ((p as any).wpImageUrls || []).slice(0, 1),
      }, null, 2));
    }
  }

  process.exit(0);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
