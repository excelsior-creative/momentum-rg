import { getPayloadClient } from "@/lib/payload";
import {
  downloadImage,
  generateArticle,
  generateFeaturedImage,
  generateInfographic,
  generateInfographicData,
  getRandomPublishTime,
  markdownToLexical,
  researchTrendingTopics,
  suggestArticleTags,
} from "@/services/contentGenerationService";
import { humanizeContent } from "@/services/humanizationService";
import { NextRequest, NextResponse } from "next/server";

/**
 * Cron job endpoint for automated article generation
 *
 * This endpoint is called by Vercel Cron on a nightly schedule.
 * It performs the following steps:
 * 1. Research trending topics using Gemini
 * 2. Generate an SEO-optimized article
 * 3. Create a featured image via Replicate
 * 4. Create an infographic via Replicate
 * 5. Upload images to Payload CMS
 * 6. Create the article with a random publish time
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error("Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting automated article generation...");

    // Step 1: Research trending topics
    console.log("Step 1: Researching trending topics...");
    const topic = await researchTrendingTopics();
    console.log(`Selected topic: ${topic.title}`);
    console.log(`Target keyword: ${topic.targetKeyword} (${topic.location})`);

    // Step 2: Generate the article content
    console.log("Step 2: Generating article content...");
    const rawArticle = await generateArticle(topic);

    // Apply humanization to make the content sound more natural
    const article = {
      ...rawArticle,
      content: humanizeContent(rawArticle.content, "moderate"),
      excerpt: humanizeContent(rawArticle.excerpt, "moderate"),
    };

    console.log(`Article generated and humanized: ${article.title}`);

    // Step 3: Extract infographic data for detailed visualization
    console.log("Step 3: Extracting infographic data...");
    const infographicData = await generateInfographicData(article);
    console.log(
      `Infographic: ${infographicData.statistics.length} stats, ${infographicData.steps.length} steps`
    );

    // Step 4 & 5: Generate images in parallel with structured data
    console.log("Step 4 & 5: Generating images...");
    const [featuredImageResult, infographicUrl] = await Promise.all([
      generateFeaturedImage(article),
      generateInfographic(article, infographicData),
    ]);

    // Step 6: Download and upload images to Payload
    console.log("Step 6: Uploading images to Payload...");
    const payload = await getPayloadClient();

    const [featuredImageBuffer, infographicBuffer] = await Promise.all([
      downloadImage(featuredImageResult.url),
      downloadImage(infographicUrl),
    ]);

    // Generate keyword-rich filename from target keyword
    const keywordSlug = article.targetKeyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Upload featured image with keyword-rich filename and alt text
    const featuredImageDoc = await payload.create({
      collection: "media",
      data: {
        alt: `${article.targetKeyword} - ${article.title} | Excelsior Creative Orange County`,
        caption: `${article.excerpt} | Keywords: ${article.keywords}`,
      },
      file: {
        data: featuredImageBuffer,
        name: `${keywordSlug}-${article.slug}-featured-image-${Date.now()}.png`,
        mimetype: "image/png",
        size: featuredImageBuffer.length,
      },
    });

    // Upload infographic with keyword-rich filename and alt text
    const infographicDoc = await payload.create({
      collection: "media",
      data: {
        alt: `${article.targetKeyword} Infographic - ${infographicData.headline} | Excelsior Creative`,
        caption: `${infographicData.problemStatement} | ${infographicData.statistics.length} key statistics, ${infographicData.steps.length} actionable steps | ${article.keywords}`,
      },
      file: {
        data: infographicBuffer,
        name: `${keywordSlug}-infographic-${article.slug}-${Date.now()}.png`,
        mimetype: "image/png",
        size: infographicBuffer.length,
      },
    });

    console.log(`Uploaded featured image: ${featuredImageDoc.id}`);
    console.log(`Uploaded infographic: ${infographicDoc.id}`);

    // Step 7: Get or create a category based on topic
    console.log("Step 7: Selecting article category...");
    let categoryId: number;
    const { docs: categories } = await payload.find({
      collection: "article-categories",
      limit: 100,
    });

    if (categories.length > 0) {
      // Try to match category based on keyword type
      const keyword = topic.targetKeyword.toLowerCase();
      let matchedCategory = categories.find((c) => {
        const name = c.name.toLowerCase();
        if (
          keyword.includes("emergency") ||
          keyword.includes("urgent") ||
          keyword.includes("24/7")
        ) {
          return name.includes("emergency") || c.icon === "zap";
        }
        if (
          keyword.includes("fix") ||
          keyword.includes("repair") ||
          keyword.includes("issue")
        ) {
          return (
            name.includes("fix") ||
            name.includes("repair") ||
            c.icon === "wrench"
          );
        }
        if (keyword.includes("developer") || keyword.includes("development")) {
          return name.includes("development") || c.icon === "code";
        }
        return false;
      });

      // Fall back to first category if no match
      categoryId = matchedCategory?.id || categories[0].id;
    } else {
      // Create a default category if none exists
      const newCategory = await payload.create({
        collection: "article-categories",
        data: {
          name: "Web Development",
          slug: "web-development",
          description: "Articles about web development and digital services",
          icon: "code",
          order: 0,
        },
      });
      categoryId = newCategory.id;
    }

    // Step 8: Suggest tags
    console.log("Step 8: Suggesting article tags...");
    const { docs: allTags } = await payload.find({
      collection: "article-tags",
      limit: 100,
    });
    const suggestedTagIds = await suggestArticleTags(article, allTags);
    console.log(`Suggested tags: ${suggestedTagIds.join(", ")}`);

    // Step 9: Ensure unique slug
    console.log("Step 9: Checking slug uniqueness...");
    let finalSlug = article.slug;
    const { docs: existingArticles } = await payload.find({
      collection: "articles",
      where: {
        slug: { equals: article.slug },
      },
      limit: 1,
    });

    if (existingArticles.length > 0) {
      // Append timestamp to make slug unique
      finalSlug = `${article.slug}-${Date.now()}`;
      console.log(`Slug already exists, using: ${finalSlug}`);
    }

    // Step 10: Create the article with random publish time
    console.log("Step 10: Creating article in Payload...");
    const publishTime = getRandomPublishTime();

    // Convert markdown content to Lexical format
    const lexicalContent = markdownToLexical(article.content);

    const newArticle = await payload.create({
      collection: "articles",
      data: {
        title: article.title,
        slug: finalSlug,
        status: "published",
        publishedAt: publishTime.toISOString(),
        category: categoryId,
        tags: suggestedTagIds,
        featuredImage: featuredImageDoc.id,
        infographic: infographicDoc.id,
        excerpt: article.excerpt,
        content: lexicalContent,
        seo: {
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          keywords: article.keywords,
        },
        structuredData: {
          articleType: "BlogPosting",
          author: "Excelsior Creative Team",
        },
        featured: false,
        order: 0,
      },
    });

    console.log(`Article created successfully!`);
    console.log(`ID: ${newArticle.id}`);
    console.log(`Slug: ${newArticle.slug}`);
    console.log(`Scheduled publish time: ${publishTime.toISOString()}`);

    return NextResponse.json({
      success: true,
      article: {
        id: newArticle.id,
        title: newArticle.title,
        slug: newArticle.slug,
        publishedAt: publishTime.toISOString(),
      },
      topic: {
        title: topic.title,
        targetKeyword: topic.targetKeyword,
        location: topic.location,
      },
      images: {
        featuredImageId: featuredImageDoc.id,
        infographicId: infographicDoc.id,
      },
    });
  } catch (error) {
    console.error("Article generation cron error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to generate article",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering with additional options
export async function POST(request: NextRequest) {
  // For manual triggers, still verify authorization
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delegate to GET handler
  return GET(request);
}
