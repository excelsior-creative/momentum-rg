import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";

type TagColor = "orange" | "blue" | "green" | "purple" | "pink" | "gray";

const tags: Array<{ name: string; slug: string; color: TagColor }> = [
  { name: "AI SEO", slug: "ai-seo", color: "orange" },
  { name: "Content Marketing", slug: "content-marketing", color: "blue" },
  { name: "Digital Strategy", slug: "digital-strategy", color: "purple" },
  { name: "Frontend", slug: "frontend", color: "blue" },
  { name: "Backend", slug: "backend", color: "purple" },
  { name: "Performance", slug: "performance", color: "green" },
  { name: "Security", slug: "security", color: "purple" },
  { name: "Small Business", slug: "small-business", color: "green" },
  { name: "Nonprofit", slug: "nonprofit", color: "orange" },
  { name: "E-commerce", slug: "e-commerce", color: "pink" },
  { name: "SaaS", slug: "saas", color: "blue" },
  { name: "Orange County", slug: "orange-county", color: "orange" },
  { name: "California", slug: "california", color: "orange" },
  { name: "Local Business", slug: "local-business", color: "green" },
  { name: "Healthcare", slug: "healthcare", color: "blue" },
  { name: "Education", slug: "education", color: "green" },
  { name: "Philanthropy", slug: "philanthropy", color: "purple" },
  { name: "Technology", slug: "technology", color: "blue" },
  { name: "Emergency", slug: "emergency", color: "orange" },
  { name: "How-To", slug: "how-to", color: "green" },
  { name: "Guide", slug: "guide", color: "blue" },
  { name: "Tutorial", slug: "tutorial", color: "purple" },
];

async function seedTags() {
  console.log("Using DATABASE_URL:", process.env.DATABASE_URL);
  const payload = await getPayload({ config });

  console.log("Seeding tags...");

  for (const tag of tags) {
    try {
      const existing = await payload.find({
        collection: "article-tags",
        where: {
          slug: { equals: tag.slug },
        },
      });

      if (existing.docs.length === 0) {
        await payload.create({
          collection: "article-tags",
          data: tag,
        });
        console.log(`Created tag: ${tag.name}`);
      } else {
        console.log(`Tag already exists: ${tag.name}`);
      }
    } catch (error) {
      console.error(`Error creating tag ${tag.name}:`, error);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seedTags();
