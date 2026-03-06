import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";

// Article Categories Data
const articleCategoriesData = [
  {
    name: "Emergency Services",
    slug: "emergency-services",
    description:
      "24/7 emergency website repair and urgent support services for Orange County businesses",
    icon: "zap" as const,
    order: 1,
  },
  {
    name: "Web Development",
    slug: "web-development",
    description:
      "Custom web development services, tips, and best practices for modern websites",
    icon: "code" as const,
    order: 2,
  },
  {
    name: "Website Fixes",
    slug: "website-fixes",
    description:
      "Common website problems and solutions for slow, broken, or hacked websites",
    icon: "wrench" as const,
    order: 3,
  },
  {
    name: "Local Services",
    slug: "local-services",
    description:
      "Local web development and digital services for Orange County businesses",
    icon: "building" as const,
    order: 4,
  },
];

// Articles Data
const articlesData = [
  {
    title: "What to Do When Your Website Goes Down: Emergency Response Guide",
    slug: "emergency-website-down-guide",
    categorySlug: "emergency-services",
    status: "published" as const,
    featured: true,
    excerpt:
      "Learn the critical steps to take when your website experiences downtime, and how to minimize damage to your business. This comprehensive guide covers immediate actions, diagnosis, and recovery.",
    content: {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "When your website goes down, every minute counts. For businesses in Orange County, website downtime can mean lost customers, damaged reputation, and significant revenue loss. This guide will walk you through the essential steps to take when facing a website emergency.",
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
          {
            type: "heading",
            tag: "h2",
            children: [{ type: "text", text: "Step 1: Confirm the Outage" }],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "Before panicking, verify that your website is actually down. Use these methods to confirm:",
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
          {
            type: "list",
            listType: "bullet",
            children: [
              {
                type: "listitem",
                children: [
                  {
                    type: "text",
                    text: "Try accessing from multiple devices and networks",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
              {
                type: "listitem",
                children: [
                  {
                    type: "text",
                    text: "Use online tools like Down For Everyone Or Just Me",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
              {
                type: "listitem",
                children: [
                  {
                    type: "text",
                    text: "Check your hosting provider status page",
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
          {
            type: "heading",
            tag: "h2",
            children: [{ type: "text", text: "Step 2: Identify the Cause" }],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "Common causes of website downtime include server issues, DNS problems, expired domains, SSL certificate issues, and security breaches. Check your error logs and hosting dashboard for clues.",
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      },
    },
    seo: {
      metaTitle: "Website Down? Emergency Response Guide | Orange County",
      metaDescription:
        "Learn what to do when your website goes down. Step-by-step emergency response guide for Orange County businesses facing website outages.",
      keywords:
        "website down, emergency website repair, website outage, Orange County web support",
    },
    structuredData: {
      articleType: "HowTo" as const,
      author: "Excelsior Creative Team",
    },
  },
  {
    title: "How to Choose a Web Development Agency in Orange County",
    slug: "choose-web-development-agency-orange-county",
    categorySlug: "local-services",
    status: "published" as const,
    featured: true,
    excerpt:
      "Selecting the right web development partner is crucial for your business success. Learn what to look for when hiring a web agency in Orange County.",
    content: {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "Choosing the right web development agency can make or break your online presence. Orange County has no shortage of web developers, but finding the right fit requires careful evaluation.",
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      },
    },
    seo: {
      metaTitle: "How to Choose a Web Agency in Orange County | Guide",
      metaDescription:
        "Expert tips for selecting the best web development agency in Orange County.",
      keywords: "web development agency Orange County, hire web developer OC",
    },
    structuredData: {
      articleType: "Article" as const,
      author: "Excelsior Creative Team",
    },
  },
];

const projectsData = [
  {
    title: "Zero Abuse Project",
    slug: "zero-abuse-project",
    category: "Social Impact",
    filterCategory: "nonprofit" as const,
    imagePath: "/work/zero-abuse.jpg",
    link: "https://zeroabuseproject.org",
    featured: true,
    order: 1,
  },
  {
    title: "Sierra Lobo",
    slug: "sierra-lobo",
    category: "Aerospace & Engineering",
    filterCategory: "professional" as const,
    imagePath: "/work/sierra-lobo.jpg",
    link: "https://sierralobo.com",
    featured: true,
    order: 2,
  },
  {
    title: "Habitat for Humanity",
    slug: "habitat-for-humanity",
    category: "Community Development",
    filterCategory: "nonprofit" as const,
    imagePath: "/work/habitat-oc.jpg",
    link: "https://habitatoc.org",
    featured: true,
    order: 3,
  },
  {
    title: "Kipton Quarry",
    slug: "kipton-quarry",
    category: "Environmental Services",
    filterCategory: "professional" as const,
    imagePath: "/work/kiptonquarry.jpg",
    link: "https://kiptonquarry.com",
    featured: true,
    order: 4,
  },
];

async function seed() {
  console.log("🌱 Starting seed...");

  const payload = await getPayload({ config });

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  try {
    await payload.delete({ collection: "articles", where: {} });
  } catch (e) {
    console.log("  - No articles to clear");
  }
  try {
    await payload.delete({ collection: "article-categories", where: {} });
  } catch (e) {
    console.log("  - No article categories to clear");
  }
  try {
    await payload.delete({ collection: "projects", where: {} });
  } catch (e) {
    console.log("  - No projects to clear");
  }

  // Seed projects
  console.log("📦 Seeding projects...");
  for (const project of projectsData) {
    await payload.create({
      collection: "projects",
      data: project as any,
    });
    console.log(`  ✓ Created project: ${project.title}`);
  }

  // Seed article categories
  console.log("📦 Seeding article categories...");
  const categoryMap: Record<string, number> = {};
  for (const category of articleCategoriesData) {
    const created = await payload.create({
      collection: "article-categories",
      data: category,
    });
    categoryMap[category.slug] = created.id;
    console.log(`  ✓ Created category: ${category.name}`);
  }

  // Seed articles
  console.log("📦 Seeding articles...");
  for (const article of articlesData) {
    const { categorySlug, ...articleData } = article;
    const categoryId = categoryMap[categorySlug];

    if (categoryId) {
      await payload.create({
        collection: "articles",
        data: {
          ...articleData,
          category: categoryId,
          publishedAt: new Date().toISOString(),
        } as any,
      });
      console.log(`  ✓ Created article: ${article.title}`);
    }
  }


  console.log("✅ Seed completed!");
  console.log("");
  console.log("📊 Summary:");
  console.log(`  • ${projectsData.length} projects`);
  console.log(`  • ${articleCategoriesData.length} article categories`);
  console.log(`  • ${articlesData.length} articles`);
  console.log("");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
