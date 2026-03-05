/**
 * seed-blog-posts.ts
 * Seeds the Payload CMS Posts collection with SEO-targeted blog articles
 * for Momentum Realty Group's key Orange County zip codes.
 *
 * Usage:
 *   cd apps/app && npx tsx scripts/seed-blog-posts.ts
 */

import { getPayload } from "payload";
import config from "../src/payload.config";

// ─── Simple markdown → Lexical converter ─────────────────────────────────────
// Handles: ## Headings, - bullet lists, blank-line paragraphs

function makeTextNode(text: string, format = 0) {
  return { detail: 0, format, mode: "normal", style: "", text, type: "text", version: 1 };
}

function makeParagraph(text: string) {
  return {
    children: text.trim() ? [makeTextNode(text.trim())] : [],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  };
}

function makeHeading(text: string, tag: "h2" | "h3" = "h2") {
  return {
    children: [makeTextNode(text.trim())],
    direction: "ltr",
    format: "",
    indent: 0,
    tag,
    type: "heading",
    version: 1,
  };
}

function makeListItem(text: string) {
  return {
    children: [{ children: [makeTextNode(text.trim())], direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1 }],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "listitem",
    value: 1,
    version: 1,
  };
}

function makeList(items: string[]) {
  return {
    children: items.map(makeListItem),
    direction: "ltr",
    format: "",
    indent: 0,
    listType: "bullet",
    start: 1,
    tag: "ul",
    type: "list",
    version: 1,
  };
}

function markdownToLexical(md: string) {
  const lines = md.split("\n");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      nodes.push(makeHeading(line.slice(3)));
      i++;
    } else if (line.startsWith("### ")) {
      nodes.push(makeHeading(line.slice(4), "h3"));
      i++;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      // collect consecutive bullet items
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(makeList(items));
    } else if (line.trim() === "") {
      i++;
    } else {
      // Plain paragraph — join wrapped lines
      const parts: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("- ") && !lines[i].startsWith("* ")) {
        // Strip markdown bold/italic (**text** → text)
        parts.push(lines[i].replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/_(.+?)_/g, "$1").replace(/`(.+?)`/g, "$1"));
        i++;
      }
      if (parts.length > 0) {
        nodes.push(makeParagraph(parts.join(" ")));
      }
    }
  }

  return {
    root: {
      children: nodes.length > 0 ? nodes : [makeParagraph("")],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

// ─── Post data ───────────────────────────────────────────────────────────────

const POSTS = [
  {
    title: "Buying a Home in Long Beach 90804: What You Need to Know in 2025",
    slug: "buying-home-long-beach-90804-2025",
    excerpt:
      "The 90804 zip code spans Central Long Beach and offers some of the most accessible entry points into the Long Beach real estate market. Here's a complete guide for buyers.",
    content: `
The 90804 zip code — covering the neighborhoods of Central Long Beach and sections of the East Side — has emerged as one of the most value-driven areas in Los Angeles County.

## Why 90804 Is Attracting Buyers Right Now

Median home prices in 90804 typically run 10–20% below neighboring Belmont Shore (90803) and Signal Hill, making it an attractive entry point for first-time buyers and investors alike. The zip code benefits from Long Beach's ongoing revitalization efforts, walkable urban blocks, and proximity to the 405/710 freeway interchange.

## What Type of Homes Are Available?

You'll find a diverse mix in 90804:

- Single-family bungalows from the 1920s–1940s with original character
- Duplexes and triplexes — ideal for house-hacking strategies
- Condominiums in newer mid-rise buildings
- Mixed-use parcels for investor-buyers

## Key Things to Know Before You Buy

Schools: 90804 is served by Long Beach Unified School District (LBUSD). Research individual schools using the CA School Dashboard before committing.

Flood zones: Some blocks in 90804 are in FEMA flood zone designations — always verify with a local agent who knows the parcel-level details.

Rent control: Long Beach has rent stabilization ordinances that affect multi-unit properties built before 1995. If you're buying a duplex or triplex, understand how RSO applies.

Commute access: The A Line Metro station at Long Beach Transit Mall is about 2 miles away, and bus routes are frequent throughout the zip.

## How Momentum Realty Group Can Help

Karl Parize and the Momentum team have deep knowledge of Long Beach neighborhood dynamics. We'll walk you through comparable sales, flag any property-specific concerns, and negotiate on your behalf to maximize value.

Ready to explore homes in 90804? Contact us today or browse current listings.
    `,
    publishedDate: "2025-01-15",
  },
  {
    title: "Huntington Beach Real Estate: A Guide to Buying in 92649",
    slug: "huntington-beach-92649-real-estate-guide",
    excerpt:
      "Zip code 92649 — Huntington Harbour and West Huntington Beach — is one of Orange County's most coveted addresses. Here's everything buyers need to know.",
    content: `
Huntington Beach's 92649 zip code sits at the western edge of "Surf City USA," encompassing Huntington Harbour, Warner Pointe, and the Pacific Coast Highway corridor. It's one of the most desirable zip codes in all of Orange County for a reason.

## Why 92649 Commands Premium Prices

- Waterfront living: Huntington Harbour offers channels, docks, and direct bay access — rare in Southern California
- Top-rated schools: Ada Clegg Elementary and Huntington Beach High consistently rank among OC's best
- Lifestyle: Minutes to the surf, the pier, world-class dining, and Pacific City shopping
- Investment stability: Coastal OC properties have historically shown the lowest volatility during market downturns

## What Buyers Typically Find in 92649

Single-family homes range from $1.2M to $3.5M+ depending on proximity to water and lot size. Townhomes run $700K–$1.4M in communities like Coral Cay and Sea Harbour. Waterfront estates range from $2M to $10M+ for homes with private docks and bay views. Condos are typically $550K–$1.1M in gated complexes along Pacific Coast Highway.

## Key Due Diligence Items

Dock permits: If you're buying a home with a bayfront dock, verify the dock permit is current and transferable. This is a nuanced area of local maritime law.

HOA fees: Many Huntington Harbour communities have active HOAs managing seawalls, common areas, and boat launches. Budget $400–$800/month.

Flood and coastal zone: Properties in 92649 may be in AE or VE flood zones. Flood insurance is often required and can add meaningfully to carrying costs.

## The Momentum Advantage in Huntington Beach

We've successfully closed transactions in 92649 ranging from starter condos to multi-million-dollar waterfront estates. Our familiarity with Huntington Harbour's unique permit requirements and coastal regulations saves clients from costly surprises.

Start your search or call Karl directly at (714) 336-3375.
    `,
    publishedDate: "2025-02-01",
  },
  {
    title: "La Habra 90631: Why This Border City Is One of OC's Best Values",
    slug: "la-habra-90631-real-estate-value",
    excerpt:
      "Straddling Orange and Los Angeles Counties, La Habra's 90631 offers surprising value, strong schools, and easy freeway access. Here's why buyers are taking notice.",
    content: `
La Habra's 90631 zip code has one of the most interesting geographic stories in Southern California real estate: it straddles the Orange and Los Angeles County lines, giving buyers access to OC's quality of life at prices that more closely resemble LA County's inland markets.

## The La Habra Value Proposition

Median home prices in La Habra typically run $200,000–$400,000 below Fullerton or Brea despite comparable square footage and lot sizes. For buyers being priced out of central OC, 90631 deserves serious consideration.

Average sale price for single-family homes typically falls between $750K and $1.1M (2024 data). Price per square foot is typically $450–$600, well below coastal OC's $700–$1,200+. Days on market are historically low (7–21 days), signaling strong demand.

## What Makes La Habra Attractive?

Schools: La Habra City School District serves K–8, feeding into Sonora High School. Fullerton Joint Union High School District also serves portions of the city.

Freeway access: 5, 57, and 60 freeways are all within easy reach — making La Habra one of the best-connected cities in the OC/LA border region.

Community: A genuine small-town feel with a vibrant downtown district on Imperial Highway. The annual Corn Festival is a local institution.

New development: Several newer infill projects have added modern townhomes and condos to a previously all-SFR market, broadening options.

## Investment Angle

La Habra's appreciating values and rental demand driven by Cal State Fullerton proximity make it a strong candidate for buy-and-hold investors. Duplexes and small multi-unit properties occasionally appear here — rare finds at accessible price points.

## Working With Momentum in La Habra

We know the La Habra market well, including the quirks of county-border parcels (tax rates, utility districts, and school boundary nuances differ block by block). We'll help you navigate all of it.

Browse La Habra listings or schedule a consultation with Karl today.
    `,
    publishedDate: "2025-02-20",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config });
  console.log("🌱 Seeding blog posts...");

  // Get admin user for author field
  const users = await payload.find({ collection: "users", limit: 1 });
  const authorId = users.docs[0]?.id;

  if (!authorId) {
    console.error("❌ No admin user found. Create a user first via /admin.");
    process.exit(1);
  }

  for (const post of POSTS) {
    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: post.slug } },
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      console.log(`  ⏭  Skipping "${post.title}" — already exists`);
      continue;
    }

    await payload.create({
      collection: "posts",
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: markdownToLexical(post.content),
        publishedDate: post.publishedDate,
        author: authorId,
        _status: "published",
      },
    });

    console.log(`  ✅ Created: "${post.title}"`);
  }

  console.log("✅ Done seeding blog posts.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
