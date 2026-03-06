#!/usr/bin/env npx tsx
/**
 * Article Generation CLI Script
 *
 * Generates SEO-optimized articles with AI-powered featured images and infographics.
 * Uses Gemini for content generation and nano-banana-pro for image generation.
 *
 * Standard Usage:
 *   npx tsx scripts/generate-articles.ts                    # Generate 1 article
 *   npx tsx scripts/generate-articles.ts --count 5          # Generate 5 articles
 *   npx tsx scripts/generate-articles.ts --count 3 --dry-run # Preview without creating
 *
 * Backdate Usage:
 *   npx tsx scripts/generate-articles.ts --backdate --start 2024-01-01 --end 2024-12-31
 *   npx tsx scripts/generate-articles.ts --backdate --start 2024-01-01 --avg-per-week 4 --dry-run
 *
 * Environment variables required:
 *   - GOOGLE_GENAI_API_KEY: Gemini API key
 *   - REPLICATE_API_KEY: Replicate API key
 */

import "dotenv/config";
import fs from "fs";
import { getPayload } from "payload";
import config from "../src/payload.config";
import {
  composeArticleWithUsage,
  downloadImage,
  generateArticleOutlineWithUsage,
  generateArticleSectionWithUsage,
  generateArticleWithUsage,
  generateFeaturedImageWithUsage,
  generateInfographicDataWithUsage,
  generateInfographicWithUsage,
  generateInlineImageWithUsage,
  getGenerationSettings,
  getRandomPublishTime,
  identifyImagePlacementsWithUsage,
  insertImagePlaceholders,
  markdownToLexical,
  parseCustomTopicWithUsage,
  researchTrendingTopicsWithUsage,
  type GeminiUsageResult,
  type GeneratedArticle,
  type InfographicData,
  type TopicIdea,
} from "../src/services/contentGenerationService";
import {
  generateOrganicDates,
  getDateDistributionSummary,
} from "../src/services/datePatternService";
import { humanizeContent } from "../src/services/humanizationService";

// CLI arguments type
type CliArgs = {
  // Standard mode
  count: number;
  dryRun: boolean;
  // Backdate mode
  backdate: boolean;
  startDate: Date | null;
  endDate: Date | null;
  avgPerWeek: number;
  skipExisting: boolean;
  allowDuplicates: boolean;
  // Custom article mode
  customTopic: string | null; // Natural language topic
  topicFile: string | null; // Path to file containing topic
  targetWords: number | null; // Target word count
  // Media options
  inlineImages: number; // Number of inline images to embed (0 = featured only)
  infographics: number; // Number of infographics to generate (default: 1)
  // Checkpoint options
  resume: boolean;
  resumeId: string | null;
  listCheckpoints: boolean;
  cleanupCheckpoints: boolean;
};

// Checkpoint Stage type
type CheckpointStage =
  | "topic"
  | "content"
  | "infographic"
  | "images"
  | "upload"
  | "create";

// Checkpoint type (matches collection)
type Checkpoint = {
  id: string | number;
  generationId: string;
  stage: CheckpointStage;
  status: "in_progress" | "failed" | "completed";
  topic?: TopicIdea;
  article?: GeneratedArticle;
  articleId?: string | number;
  infographicData?: InfographicData;
  imageResults?: any;
  uploadedMedia?: any;
  costs: GenerationCosts;
  options: ArticleOptions;
  errorMessage?: string;
  startedAt: string;
  lastUpdatedAt: string;
};

// Parse command line arguments
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    count: 1,
    dryRun: false,
    backdate: false,
    startDate: null,
    endDate: null,
    avgPerWeek: 3,
    skipExisting: false,
    allowDuplicates: false,
    customTopic: null,
    topicFile: null,
    targetWords: null,
    inlineImages: 0,
    infographics: 1,
    resume: false,
    resumeId: null,
    listCheckpoints: false,
    cleanupCheckpoints: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--resume":
        result.resume = true;
        if (nextArg && !nextArg.startsWith("--")) {
          result.resumeId = nextArg;
          i++;
        }
        break;

      case "--list-checkpoints":
        result.listCheckpoints = true;
        break;

      case "--cleanup-checkpoints":
        result.cleanupCheckpoints = true;
        break;
      case "--topic":
        if (nextArg) {
          result.customTopic = nextArg;
          i++;
        }
        break;

      case "--topic-file":
        if (nextArg) {
          result.topicFile = nextArg;
          i++;
        }
        break;

      case "--words":
        if (nextArg) {
          result.targetWords = parseInt(nextArg, 10);
          if (isNaN(result.targetWords) || result.targetWords < 1) {
            console.error("Error: --words must be a positive integer");
            process.exit(1);
          }
          i++;
        }
        break;

      case "--images":
        if (nextArg) {
          result.inlineImages = parseInt(nextArg, 10);
          if (isNaN(result.inlineImages) || result.inlineImages < 0) {
            console.error("Error: --images must be a non-negative integer");
            process.exit(1);
          }
          i++;
        }
        break;

      case "--infographics":
        if (nextArg) {
          result.infographics = parseInt(nextArg, 10);
          if (isNaN(result.infographics) || result.infographics < 0) {
            console.error(
              "Error: --infographics must be a non-negative integer"
            );
            process.exit(1);
          }
          i++;
        }
        break;

      case "--count":
        if (nextArg) {
          result.count = parseInt(nextArg, 10);
          if (isNaN(result.count) || result.count < 1) {
            console.error("Error: --count must be a positive integer");
            process.exit(1);
          }
          i++;
        }
        break;

      case "--dry-run":
        result.dryRun = true;
        break;

      case "--backdate":
        result.backdate = true;
        break;

      case "--start":
        if (nextArg) {
          result.startDate = new Date(nextArg);
          if (isNaN(result.startDate.getTime())) {
            console.error("Error: --start must be a valid date (YYYY-MM-DD)");
            process.exit(1);
          }
          i++;
        }
        break;

      case "--end":
        if (nextArg) {
          result.endDate = new Date(nextArg);
          if (isNaN(result.endDate.getTime())) {
            console.error("Error: --end must be a valid date (YYYY-MM-DD)");
            process.exit(1);
          }
          i++;
        }
        break;

      case "--avg-per-week":
        if (nextArg) {
          result.avgPerWeek = parseFloat(nextArg);
          if (isNaN(result.avgPerWeek) || result.avgPerWeek <= 0) {
            console.error("Error: --avg-per-week must be a positive number");
            process.exit(1);
          }
          i++;
        }
        break;

      case "--skip-existing":
        result.skipExisting = true;
        break;

      case "--allow-duplicates":
        result.allowDuplicates = true;
        break;

      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
    }
  }

  // Validate backdate mode
  if (result.backdate) {
    if (!result.startDate) {
      console.error("Error: --backdate requires --start date");
      process.exit(1);
    }
    // Default end date to yesterday
    if (!result.endDate) {
      result.endDate = new Date();
      result.endDate.setDate(result.endDate.getDate() - 1);
    }
    // Set skip-existing as default unless allow-duplicates is set
    if (!result.allowDuplicates) {
      result.skipExisting = true;
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
Article Generation CLI

STANDARD MODE:
  npx tsx scripts/generate-articles.ts [options]

Options:
  --count <n>        Number of articles to generate (default: 1)
  --dry-run          Preview what would be generated without creating
  --help, -h         Show this help message

CHECKPOINT MODE:
  npx tsx scripts/generate-articles.ts --resume [id]
  npx tsx scripts/generate-articles.ts --list-checkpoints
  npx tsx scripts/generate-articles.ts --cleanup-checkpoints

Options:
  --resume [id]      Resume the last (or specific) failed generation
  --list-checkpoints Show all available checkpoints
  --cleanup-checkpoints Delete completed/old checkpoints

CUSTOM TOPIC MODE:
  npx tsx scripts/generate-articles.ts --topic "<description>" [options]

Options:
  --topic "<desc>"       Natural language description of the topic
  --topic-file <path>    Read topic from file (for complex multi-paragraph prompts)
  --words <n>            Target word count (3000+ triggers long-form mode)
  --images <n>       Number of inline images to embed in content (default: 0)
  --infographics <n> Number of infographics to generate (default: 1)

Examples:
  # Generate a 5000-word article with 3 inline images and 2 infographics
  npx tsx scripts/generate-articles.ts --topic "Next.js app router guide" --words 5000 --images 3 --infographics 2

BACKDATE MODE:
  npx tsx scripts/generate-articles.ts --backdate --start <date> [options]

Options:
  --backdate             Enable backdate mode
  --start YYYY-MM-DD     Start date for historical articles (required)
  --end YYYY-MM-DD       End date (default: yesterday)
  --avg-per-week <n>     Target articles per week (default: 3)
  --skip-existing        Skip days with existing articles (default in backdate)
  --allow-duplicates     Allow multiple articles on same day
  --dry-run              Estimate cost without generating

Examples:
  # Generate 1 article for today
  npx tsx scripts/generate-articles.ts

  # Generate 5 articles for today
  npx tsx scripts/generate-articles.ts --count 5

  # Backfill 2024 with ~3 articles/week
  npx tsx scripts/generate-articles.ts --backdate --start 2024-01-01 --end 2024-12-31

  # Estimate cost for backfill
  npx tsx scripts/generate-articles.ts --backdate --start 2024-01-01 --avg-per-week 4 --dry-run
  `);
}

// Check required environment variables
function checkEnvironment(): void {
  const missing: string[] = [];

  if (!process.env.GOOGLE_GENAI_API_KEY) {
    missing.push("GOOGLE_GENAI_API_KEY");
  }
  if (!process.env.REPLICATE_API_KEY) {
    missing.push("REPLICATE_API_KEY");
  }

  if (missing.length > 0) {
    console.error(`\nMissing required environment variables:`);
    missing.forEach((v) => console.error(`  - ${v}`));
    console.error(`\nPlease set these in your .env file and try again.\n`);
    process.exit(1);
  }
}

// Cost tracking type
type GenerationCosts = {
  topicResearch: { inputTokens: number; outputTokens: number; cost: number };
  topicParsing?: { inputTokens: number; outputTokens: number; cost: number };
  outlineGeneration?: {
    inputTokens: number;
    outputTokens: number;
    cost: number;
  };
  sectionGeneration?: Array<{
    section: string;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }>;
  composition?: { inputTokens: number; outputTokens: number; cost: number };
  articleGeneration: {
    inputTokens: number;
    outputTokens: number;
    cost: number;
  };
  infographicData: { inputTokens: number; outputTokens: number; cost: number };
  featuredImage: { model: string; predictTime: number; cost: number };
  infographicImage: { model: string; predictTime: number; cost: number };
  // Multiple images/infographics
  inlineImages?: Array<{
    context: string;
    model: string;
    predictTime: number;
    cost: number;
  }>;
  additionalInfographics?: Array<{
    headline: string;
    model: string;
    predictTime: number;
    cost: number;
  }>;
  totalCost: number;
  generatedAt: string;
};

// Options for single article generation
type ArticleOptions = {
  dryRun: boolean;
  settings: any;
  publishDate?: Date; // Custom publish date for backdating
  humanize?: boolean; // Apply humanization to content
  customTopic?: string | null; // Custom topic description
  targetWords?: number | null; // Target word count
  inlineImages?: number; // Number of inline images
  infographics?: number; // Number of infographics
};

/**
 * Checkpoint Management Helpers
 */
async function createCheckpoint(
  payload: any,
  options: ArticleOptions
): Promise<string> {
  const generationId = `gen-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  await payload.create({
    collection: "article-generation-checkpoints",
    data: {
      generationId,
      stage: "topic",
      status: "in_progress",
      options,
      costs: {
        topicResearch: { inputTokens: 0, outputTokens: 0, cost: 0 },
        articleGeneration: { inputTokens: 0, outputTokens: 0, cost: 0 },
        infographicData: { inputTokens: 0, outputTokens: 0, cost: 0 },
        featuredImage: { model: "", predictTime: 0, cost: 0 },
        infographicImage: { model: "", predictTime: 0, cost: 0 },
        inlineImages: [],
        additionalInfographics: [],
        totalCost: 0,
        generatedAt: new Date().toISOString(),
      },
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
  });
  return generationId;
}

async function updateCheckpoint(
  payload: any,
  generationId: string,
  data: Partial<Checkpoint>
): Promise<void> {
  const { docs } = await payload.find({
    collection: "article-generation-checkpoints",
    where: { generationId: { equals: generationId } },
    limit: 1,
  });

  if (docs.length > 0) {
    await payload.update({
      collection: "article-generation-checkpoints",
      id: docs[0].id,
      data: {
        ...data,
        lastUpdatedAt: new Date().toISOString(),
      },
    });
  }
}

async function loadCheckpoint(
  payload: any,
  generationId?: string
): Promise<Checkpoint | null> {
  const where: any = {};
  if (generationId) {
    where.generationId = { equals: generationId };
  } else {
    where.status = { equals: "in_progress" };
  }

  const { docs } = await payload.find({
    collection: "article-generation-checkpoints",
    where,
    sort: "-lastUpdatedAt",
    limit: 1,
  });

  return (docs[0] as unknown as Checkpoint) || null;
}

async function deleteCheckpoint(
  payload: any,
  generationId: string
): Promise<void> {
  const { docs } = await payload.find({
    collection: "article-generation-checkpoints",
    where: { generationId: { equals: generationId } },
    limit: 1,
  });

  if (docs.length > 0) {
    await payload.delete({
      collection: "article-generation-checkpoints",
      id: docs[0].id,
    });
  }
}

async function listCheckpoints(payload: any): Promise<void> {
  const { docs } = await payload.find({
    collection: "article-generation-checkpoints",
    sort: "-lastUpdatedAt",
    limit: 100,
  });

  if (docs.length === 0) {
    console.log("No checkpoints found.");
    return;
  }

  console.log(`\nAvailable Checkpoints:`);
  console.log(`${"─".repeat(80)}`);
  console.log(
    `${"ID".padEnd(20)} | ${"Stage".padEnd(12)} | ${"Status".padEnd(
      12
    )} | ${"Last Updated"}`
  );
  console.log(`${"─".repeat(80)}`);

  docs.forEach((cp: any) => {
    console.log(
      `${cp.generationId.padEnd(20)} | ${cp.stage.padEnd(
        12
      )} | ${cp.status.padEnd(12)} | ${new Date(
        cp.lastUpdatedAt
      ).toLocaleString()}`
    );
  });
  console.log(`${"─".repeat(80)}\n`);
}

async function cleanupCheckpoints(payload: any): Promise<void> {
  const { docs } = await payload.find({
    collection: "article-generation-checkpoints",
    where: {
      or: [
        { status: { equals: "completed" } },
        {
          lastUpdatedAt: {
            less_than: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }, // 7 days old
      ],
    },
    limit: 1000,
  });

  for (const cp of docs) {
    await payload.delete({
      collection: "article-generation-checkpoints",
      id: cp.id,
    });
  }
  console.log(`Cleaned up ${docs.length} checkpoints.`);
}

/**
 * Orchestrate the generation of a long-form article by sections
 */
async function generateLongFormArticle(
  topic: TopicIdea,
  targetWords: number,
  settings: any,
  prefix: string,
  costs: GenerationCosts
): Promise<GeminiUsageResult<GeneratedArticle>> {
  console.log(`${prefix} Long-form mode: Target ${targetWords} words`);

  // 1. Generate Outline
  console.log(`${prefix} Generating detailed article outline...`);
  const outlineResult = await generateArticleOutlineWithUsage(
    topic,
    targetWords,
    settings
  );
  const outline = outlineResult.data;
  costs.outlineGeneration = {
    inputTokens: outlineResult.usage.inputTokens,
    outputTokens: outlineResult.usage.outputTokens,
    cost: outlineResult.cost,
  };
  console.log(
    `${prefix} Outline created with ${
      outline.sections.length
    } sections ($${outlineResult.cost.toFixed(6)})`
  );

  // 2. Generate Sections
  const sections: string[] = [];
  costs.sectionGeneration = [];
  let totalSectionCost = 0;

  for (let i = 0; i < outline.sections.length; i++) {
    const section = outline.sections[i];
    console.log(
      `${prefix} Generating section ${i + 1}/${outline.sections.length}: "${
        section.heading
      }" (~${section.targetWords} words)...`
    );

    const previousContent = sections.join("\n\n");
    const sectionResult = await generateArticleSectionWithUsage(
      topic,
      outline,
      i,
      previousContent,
      settings
    );

    sections.push(sectionResult.data);
    costs.sectionGeneration.push({
      section: section.heading,
      inputTokens: sectionResult.usage.inputTokens,
      outputTokens: sectionResult.usage.outputTokens,
      cost: sectionResult.cost,
    });
    totalSectionCost += sectionResult.cost;

    console.log(
      `${prefix} Section ${i + 1} complete ($${sectionResult.cost.toFixed(6)})`
    );
  }
  console.log(
    `${prefix} All sections generated. Total section cost: $${totalSectionCost.toFixed(
      6
    )}`
  );

  // 3. Compose Final Article
  console.log(`${prefix} Composing final article and generating metadata...`);
  const compositionResult = await composeArticleWithUsage(
    topic,
    outline,
    sections,
    settings
  );
  costs.composition = {
    inputTokens: compositionResult.usage.inputTokens,
    outputTokens: compositionResult.usage.outputTokens,
    cost: compositionResult.cost,
  };

  return compositionResult;
}

// Generate a single article with all assets
async function generateSingleArticle(
  payload: Awaited<ReturnType<typeof getPayload>>,
  index: number,
  total: number,
  options: ArticleOptions,
  resumeCheckpoint?: Checkpoint
): Promise<{
  success: boolean;
  title?: string;
  slug?: string;
  error?: string;
  costs?: GenerationCosts;
}> {
  const {
    dryRun,
    settings,
    publishDate,
    humanize = true,
    customTopic,
    targetWords,
    inlineImages = 0,
    infographics = 1,
  } = options;
  const prefix = `[${index + 1}/${total}]`;

  // Track costs for each step
  const costs: GenerationCosts = resumeCheckpoint?.costs || {
    topicResearch: { inputTokens: 0, outputTokens: 0, cost: 0 },
    articleGeneration: { inputTokens: 0, outputTokens: 0, cost: 0 },
    infographicData: { inputTokens: 0, outputTokens: 0, cost: 0 },
    featuredImage: { model: "", predictTime: 0, cost: 0 },
    infographicImage: { model: "", predictTime: 0, cost: 0 },
    inlineImages: [],
    additionalInfographics: [],
    totalCost: 0,
    generatedAt: new Date().toISOString(),
  };

  let generationId = resumeCheckpoint?.generationId;
  let articleId = resumeCheckpoint?.articleId;
  let categoryId: number | undefined;
  let article: GeneratedArticle | undefined = resumeCheckpoint?.article;

  try {
    // Initialize Checkpoint if not resuming
    if (!dryRun && !resumeCheckpoint) {
      generationId = await createCheckpoint(payload, options);
      console.log(`${prefix} Generation ID: ${generationId}`);
    }

    // Step 1: Research or Parse topic
    let topic: TopicIdea | undefined = resumeCheckpoint?.topic;

    if (!topic) {
      if (customTopic) {
        console.log(`${prefix} Parsing custom topic: "${customTopic}"...`);
        const topicResult = await parseCustomTopicWithUsage(
          customTopic,
          settings
        );
        topic = topicResult.data;
        costs.topicParsing = {
          inputTokens: topicResult.usage.inputTokens,
          outputTokens: topicResult.usage.outputTokens,
          cost: topicResult.cost,
        };
        console.log(
          `${prefix} Custom Topic: "${
            topic.title
          }" ($${topicResult.cost.toFixed(6)})`
        );
      } else {
        console.log(`${prefix} Researching trending topic...`);
        const topicResult = await researchTrendingTopicsWithUsage(settings);
        topic = topicResult.data;
        costs.topicResearch = {
          inputTokens: topicResult.usage.inputTokens,
          outputTokens: topicResult.usage.outputTokens,
          cost: topicResult.cost,
        };
        console.log(
          `${prefix} Topic: "${topic.title}" ($${topicResult.cost.toFixed(6)})`
        );
      }
      console.log(
        `${prefix} Keyword: ${topic.targetKeyword} (${topic.location})`
      );

      if (generationId) {
        await updateCheckpoint(payload, generationId, {
          stage: "content",
          topic,
          costs,
        });
      }
    } else {
      console.log(`${prefix} Resuming with topic: "${topic.title}"`);
    }

    // Identify category early for draft saving
    const { docs: categories } = await payload.find({
      collection: "article-categories",
      limit: 100,
    });

    if (categories.length > 0) {
      const keyword = topic.targetKeyword.toLowerCase();
      const matchedCategory = categories.find((c: any) => {
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
      categoryId = matchedCategory?.id || categories[0].id;
    } else {
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

    // Step 2: Generate article content (standard or long-form)
    let generationCost = 0;

    const isLongForm = targetWords && targetWords >= 3000;

    if (!article) {
      if (isLongForm) {
        const articleResult = await generateLongFormArticle(
          topic,
          targetWords,
          settings,
          prefix,
          costs
        );
        article = articleResult.data;
        generationCost =
          (costs.outlineGeneration?.cost || 0) +
          (costs.sectionGeneration?.reduce((sum, s) => sum + s.cost, 0) || 0) +
          (costs.composition?.cost || 0);
      } else {
        console.log(`${prefix} Generating article content...`);
        const articleResult = await generateArticleWithUsage(topic, settings);
        article = articleResult.data;
        costs.articleGeneration = {
          inputTokens: articleResult.usage.inputTokens,
          outputTokens: articleResult.usage.outputTokens,
          cost: articleResult.cost,
        };
        generationCost = articleResult.cost;
      }

      // Apply humanization to make content more natural
      if (humanize) {
        const originalContent = article.content;
        article = {
          ...article,
          content: humanizeContent(article.content, "moderate"),
          excerpt: humanizeContent(article.excerpt, "moderate"),
        };
        const lengthDiff = originalContent.length - article.content.length;
        if (lengthDiff !== 0) {
          console.log(
            `${prefix} Humanized content (${
              lengthDiff > 0 ? "-" : "+"
            }${Math.abs(lengthDiff)} chars)`
          );
        }
      }

      console.log(
        `${prefix} Article: "${article.title}" ($${generationCost.toFixed(6)})`
      );
      console.log(
        `${prefix} Word count: ~${article.content.split(/\s+/).length} words`
      );

      // Insert placeholders for inline images and additional infographics
      if (inlineImages > 0 || infographics > 1) {
        article = {
          ...article,
          content: insertImagePlaceholders(
            article.content,
            inlineImages,
            infographics
          ),
        };
        console.log(
          `${prefix} Added placeholders for ${inlineImages} images and ${Math.max(
            0,
            infographics - 1
          )} additional infographics`
        );
      }

      if (generationId) {
        await updateCheckpoint(payload, generationId, {
          stage: "infographic",
          article,
          costs,
        });
      }

      // Step 2b: Save intermediate draft to Articles collection
      // This ensures the work is not lost if subsequent steps fail
      if (generationId && !dryRun) {
        console.log(`${prefix} Saving intermediate draft to Articles...`);
        try {
          const draftArticle = await payload.create({
            collection: "articles",
            data: {
              title: article.title,
              slug: `${article.slug}-draft-${Date.now()}`,
              status: "draft",
              category: categoryId,
              excerpt: article.excerpt,
              content: markdownToLexical(article.content),
              seo: {
                metaTitle: article.metaTitle,
                metaDescription: article.metaDescription,
                keywords: article.keywords,
              },
            },
          });

          await updateCheckpoint(payload, generationId, {
            articleId: draftArticle.id,
          });
          console.log(`${prefix} Draft saved with ID: ${draftArticle.id}`);
        } catch (draftError) {
          console.warn(
            `${prefix} Failed to save intermediate draft: ${
              draftError instanceof Error
                ? draftError.message
                : String(draftError)
            }`
          );
          // Continue anyway, we still have the checkpoint
        }
      }
    } else {
      console.log(`${prefix} Resuming with article: "${article.title}"`);
    }

    if (dryRun) {
      console.log(
        `${prefix} [DRY RUN] Would create article with slug: ${article.slug}`
      );
      console.log(`${prefix} [DRY RUN] Excerpt: ${article.excerpt}`);
      if (inlineImages > 0) {
        console.log(
          `${prefix} [DRY RUN] Would generate ${inlineImages} inline images`
        );
      }
      if (infographics > 1) {
        console.log(
          `${prefix} [DRY RUN] Would generate ${infographics} total infographics`
        );
      }
      // Estimate ~$0.01 per image for cost estimation
      const estimatedImageCost = (inlineImages + infographics) * 0.01;
      costs.totalCost =
        (costs.topicResearch?.cost || 0) +
        (costs.topicParsing?.cost || 0) +
        (costs.articleGeneration?.cost || 0) +
        (costs.outlineGeneration?.cost || 0) +
        (costs.sectionGeneration?.reduce((sum, s) => sum + s.cost, 0) || 0) +
        (costs.composition?.cost || 0) +
        estimatedImageCost;
      console.log(
        `${prefix} [DRY RUN] Estimated total cost: $${costs.totalCost.toFixed(
          6
        )} (includes ~$${estimatedImageCost.toFixed(4)} for images)`
      );
      return { success: true, title: article.title, slug: article.slug, costs };
    }

    // Step 3: Extract infographic data
    let infographicData: InfographicData | undefined =
      resumeCheckpoint?.infographicData;
    if (!infographicData) {
      console.log(`${prefix} Extracting infographic data...`);
      const infographicDataResult = await generateInfographicDataWithUsage(
        article,
        settings
      );
      infographicData = infographicDataResult.data;
      costs.infographicData = {
        inputTokens: infographicDataResult.usage.inputTokens,
        outputTokens: infographicDataResult.usage.outputTokens,
        cost: infographicDataResult.cost,
      };
      console.log(
        `${prefix} Infographic: ${infographicData.statistics.length} stats, ${
          infographicData.steps.length
        } steps ($${infographicDataResult.cost.toFixed(6)})`
      );

      if (generationId) {
        await updateCheckpoint(payload, generationId, {
          stage: "images",
          infographicData,
          costs,
        });
      }
    } else {
      console.log(`${prefix} Resuming with infographic data`);
    }

    // Step 3b: Identify inline image contexts if needed
    let imageContexts: string[] = [];
    if (inlineImages > 0) {
      console.log(
        `${prefix} Identifying optimal positions for ${inlineImages} inline images...`
      );
      const placementResult = await identifyImagePlacementsWithUsage(
        article,
        inlineImages,
        settings
      );
      imageContexts = placementResult.data;
      console.log(
        `${prefix} Image contexts identified ($${placementResult.cost.toFixed(
          6
        )})`
      );
    }

    // Step 4: Generate all images in parallel
    let imageResults: any[] | undefined = resumeCheckpoint?.imageResults;

    if (!imageResults) {
      const totalImages = 1 + inlineImages + infographics; // featured + inline + infographics
      console.log(
        `${prefix} Generating ${totalImages} images (this may take ${Math.ceil(
          totalImages * 15
        )}-${Math.ceil(totalImages * 30)} seconds)...`
      );

      // Build parallel image generation tasks
      const imageGenerationTasks: Promise<any>[] = [
        generateFeaturedImageWithUsage(article, settings),
        generateInfographicWithUsage(article, infographicData, settings),
      ];

      // Add inline image tasks
      for (let i = 0; i < inlineImages; i++) {
        const context = imageContexts[i] || `Visual for section ${i + 1}`;
        imageGenerationTasks.push(
          generateInlineImageWithUsage(article, context, i, settings)
        );
      }

      // Add additional infographic tasks (index 1+ since 0 is the main one)
      for (let i = 1; i < infographics; i++) {
        // Generate different infographic data for variety
        imageGenerationTasks.push(
          generateInfographicWithUsage(article, infographicData, settings)
        );
      }

      imageResults = await Promise.all(imageGenerationTasks);

      if (generationId) {
        await updateCheckpoint(payload, generationId, {
          stage: "upload",
          imageResults,
          costs,
        });
      }
    } else {
      console.log(`${prefix} Resuming with previously generated images`);
    }

    // Extract results
    const featuredImageResult = imageResults[0];
    const infographicImageResult = imageResults[1];
    const inlineImageResults = imageResults.slice(2, 2 + inlineImages);
    const additionalInfographicResults = imageResults.slice(2 + inlineImages);

    costs.featuredImage = {
      model: featuredImageResult.model,
      predictTime: featuredImageResult.predictTime,
      cost: featuredImageResult.cost,
    };
    costs.infographicImage = {
      model: infographicImageResult.model,
      predictTime: infographicImageResult.predictTime,
      cost: infographicImageResult.cost,
    };

    // Track inline image costs
    costs.inlineImages = inlineImageResults.map((r: any) => ({
      context: r.context || "",
      model: r.model,
      predictTime: r.predictTime,
      cost: r.cost,
    }));

    // Track additional infographic costs
    costs.additionalInfographics = additionalInfographicResults.map(
      (r: any, i: number) => ({
        headline: `Infographic ${i + 2}`,
        model: r.model,
        predictTime: r.predictTime,
        cost: r.cost,
      })
    );

    const totalImagesGenerated = 1 + inlineImages + infographics;
    console.log(
      `${prefix} All ${totalImagesGenerated} images generated successfully (Style: ${featuredImageResult.style})`
    );

    // Calculate total cost
    const inlineImagesCost =
      costs.inlineImages?.reduce((sum, img) => sum + img.cost, 0) || 0;
    const additionalInfographicsCost =
      costs.additionalInfographics?.reduce((sum, inf) => sum + inf.cost, 0) ||
      0;

    costs.totalCost =
      (costs.topicResearch?.cost || 0) +
      (costs.topicParsing?.cost || 0) +
      (costs.articleGeneration?.cost || 0) +
      (costs.outlineGeneration?.cost || 0) +
      (costs.sectionGeneration?.reduce((sum, s) => sum + s.cost, 0) || 0) +
      (costs.composition?.cost || 0) +
      costs.infographicData.cost +
      costs.featuredImage.cost +
      costs.infographicImage.cost +
      inlineImagesCost +
      additionalInfographicsCost;
    console.log(
      `${prefix} Total generation cost: $${costs.totalCost.toFixed(6)}`
    );

    // Step 5: Download all images
    let uploadedMedia: any = resumeCheckpoint?.uploadedMedia;

    if (!uploadedMedia) {
      console.log(`${prefix} Downloading ${totalImagesGenerated} images...`);
      const downloadTasks = [
        downloadImage(featuredImageResult.url),
        downloadImage(infographicImageResult.url),
        ...inlineImageResults.map((r: any) => downloadImage(r.url)),
        ...additionalInfographicResults.map((r: any) => downloadImage(r.url)),
      ];
      const imageBuffers = await Promise.all(downloadTasks);

      const featuredImageBuffer = imageBuffers[0];
      const infographicBuffer = imageBuffers[1];
      const inlineImageBuffers = imageBuffers.slice(2, 2 + inlineImages);
      const additionalInfographicBuffers = imageBuffers.slice(2 + inlineImages);

      // Step 6: Upload to Payload Media with keyword-rich filenames and alt text
      console.log(
        `${prefix} Uploading ${totalImagesGenerated} images to Payload...`
      );

      // Generate keyword-rich filename from target keyword
      const keywordSlug = article.targetKeyword
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const featuredImageDoc = await payload.create({
        collection: "media",
        data: {
          alt: `${article.targetKeyword} - ${article.title} | Excelsior Creative Orange County`,
          caption: `${article.excerpt} | Keywords: ${article.keywords}`,
        },
        file: {
          data: featuredImageBuffer,
          name: `${keywordSlug}-${
            article.slug
          }-featured-image-${Date.now()}.png`,
          mimetype: "image/png",
          size: featuredImageBuffer.length,
        },
      });

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

      // Upload inline images and build media map
      const inlineMediaIds: number[] = [];
      const additionalInfographicMediaIds: number[] = [];

      for (let i = 0; i < inlineImageBuffers.length; i++) {
        const buffer = inlineImageBuffers[i];
        const context = imageContexts[i] || `Section ${i + 1}`;
        const doc = await payload.create({
          collection: "media",
          data: {
            alt: `${article.targetKeyword} - ${context} | Excelsior Creative`,
            caption: `Illustration for ${article.title}`,
          },
          file: {
            data: buffer,
            name: `${keywordSlug}-inline-${i + 1}-${
              article.slug
            }-${Date.now()}.png`,
            mimetype: "image/png",
            size: buffer.length,
          },
        });
        inlineMediaIds.push(doc.id);
      }

      // Upload additional infographics
      for (let i = 0; i < additionalInfographicBuffers.length; i++) {
        const buffer = additionalInfographicBuffers[i];
        const doc = await payload.create({
          collection: "media",
          data: {
            alt: `${article.targetKeyword} Infographic ${
              i + 2
            } | Excelsior Creative`,
            caption: `Additional infographic for ${article.title}`,
          },
          file: {
            data: buffer,
            name: `${keywordSlug}-infographic-${i + 2}-${
              article.slug
            }-${Date.now()}.png`,
            mimetype: "image/png",
            size: buffer.length,
          },
        });
        additionalInfographicMediaIds.push(doc.id);
      }

      uploadedMedia = {
        featured: featuredImageDoc.id,
        infographic: infographicDoc.id,
        inline: inlineMediaIds,
        additionalInfographics: additionalInfographicMediaIds,
      };

      if (generationId) {
        await updateCheckpoint(payload, generationId, {
          stage: "create",
          uploadedMedia,
          costs,
        });
      }
    } else {
      console.log(`${prefix} Resuming with previously uploaded media`);
    }

    // Map media to content placeholders
    const mediaMap = new Map<string, number>();
    uploadedMedia.inline.forEach((id: number, i: number) => {
      mediaMap.set(`image:${i}`, id);
    });
    uploadedMedia.additionalInfographics.forEach((id: number, i: number) => {
      mediaMap.set(`infographic:${i + 1}`, id);
    });

    // Step 8: Ensure unique slug
    let finalSlug = article.slug;
    const { docs: existingArticles } = await payload.find({
      collection: "articles",
      where: { slug: { equals: article.slug } },
      limit: 1,
    });

    if (existingArticles.length > 0) {
      // If we are updating an existing draft, we should keep its slug
      if (!articleId) {
        finalSlug = `${article.slug}-${Date.now()}`;
        console.log(`${prefix} Slug exists, using: ${finalSlug}`);
      } else {
        finalSlug = existingArticles[0].slug;
      }
    }

    // Step 9: Create or Update the article
    const publishTime = publishDate || getRandomPublishTime();
    const lexicalContent = markdownToLexical(article.content, mediaMap);

    const articleData: any = {
      title: article.title,
      slug: finalSlug,
      status: "published",
      publishedAt: publishTime.toISOString(),
      category: categoryId,
      featuredImage: uploadedMedia.featured,
      imageStyle: featuredImageResult.style as
        | "illustration"
        | "photorealistic-people"
        | "photorealistic-abstract"
        | "tech-minimal",
      infographic: uploadedMedia.infographic,
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
      generationCosts: {
        topicResearch: costs.topicResearch,
        topicParsing: costs.topicParsing,
        outlineGeneration: costs.outlineGeneration,
        sectionGeneration: costs.sectionGeneration,
        composition: costs.composition,
        articleGeneration: costs.articleGeneration,
        infographicData: costs.infographicData,
        featuredImage: costs.featuredImage,
        infographicImage: costs.infographicImage,
        inlineImages: costs.inlineImages,
        additionalInfographics: costs.additionalInfographics,
        totalCost: costs.totalCost,
        generatedAt: costs.generatedAt,
      },
    };

    let newArticle;
    if (articleId) {
      console.log(`${prefix} Updating existing draft article: ${articleId}`);
      newArticle = await payload.update({
        collection: "articles",
        id: articleId,
        data: articleData,
      });
    } else {
      newArticle = await payload.create({
        collection: "articles",
        data: articleData,
      });
    }

    console.log(
      `${prefix} Article ${articleId ? "updated" : "created"}: ${
        newArticle.slug
      }`
    );
    console.log(`${prefix} Publish time: ${publishTime.toLocaleString()}`);
    console.log(`${prefix} Generation cost: $${costs.totalCost.toFixed(4)}`);

    // Step 10: Finalize Checkpoint
    if (generationId) {
      await deleteCheckpoint(payload, generationId);
    }

    // Send Slack notification (non-blocking)
    sendSlackNotification(article.title, finalSlug, costs.totalCost);

    return { success: true, title: article.title, slug: finalSlug, costs };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`${prefix} Error: ${errorMessage}`);

    // Attempt to save draft if it hasn't been saved yet but article content exists
    if (!articleId && article && generationId && !dryRun) {
      console.log(`${prefix} Attempting to save emergency draft...`);
      try {
        const draftArticle = await payload.create({
          collection: "articles",
          data: {
            title: article.title,
            slug: `${article.slug}-failed-${Date.now()}`,
            status: "draft",
            category: categoryId || 1,
            excerpt: article.excerpt,
            content: markdownToLexical(article.content),
            seo: {
              metaTitle: article.metaTitle,
              metaDescription: article.metaDescription,
              keywords: article.keywords,
            },
          },
        });
        articleId = draftArticle.id;
        console.log(`${prefix} Emergency draft saved with ID: ${articleId}`);
      } catch (draftError) {
        console.warn(
          `${prefix} Failed to save emergency draft: ${
            draftError instanceof Error
              ? draftError.message
              : String(draftError)
          }`
        );
      }
    }

    if (generationId) {
      await updateCheckpoint(payload, generationId, {
        status: "failed",
        errorMessage,
        articleId: articleId, // Save the draft ID to the checkpoint if we have one
      });
      console.log(
        `${prefix} Checkpoint updated with failure status for recovery.`
      );
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Estimate cost for backdate operation based on recent article costs
 */
async function estimateBackdateCost(
  payload: Awaited<ReturnType<typeof getPayload>>,
  articleCount: number
): Promise<{ avgCost: number; sampleSize: number; estimatedTotal: number }> {
  // Get recent articles with generation costs
  const { docs: recentArticles } = await payload.find({
    collection: "articles",
    where: {
      "generationCosts.totalCost": { greater_than: 0 },
    },
    sort: "-createdAt",
    limit: 20,
  });

  if (recentArticles.length === 0) {
    // Default estimate if no data
    return {
      avgCost: 0.015, // ~$0.015 per article estimate
      sampleSize: 0,
      estimatedTotal: articleCount * 0.015,
    };
  }

  const costs = recentArticles
    .map((a) => (a as any).generationCosts?.totalCost || 0)
    .filter((c) => c > 0);

  const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;

  return {
    avgCost,
    sampleSize: costs.length,
    estimatedTotal: articleCount * avgCost,
  };
}

/**
 * Get existing article publish dates for collision detection
 */
async function getExistingArticleDates(
  payload: Awaited<ReturnType<typeof getPayload>>
): Promise<Date[]> {
  const { docs } = await payload.find({
    collection: "articles",
    limit: 1000,
    depth: 0,
  });

  return docs
    .filter((a) => a.publishedAt)
    .map((a) => new Date(a.publishedAt as string));
}

// Main function
async function main(): Promise<void> {
  const startTime = Date.now();
  const args = parseArgs();

  // Load topic from file if specified
  if (args.topicFile) {
    if (!fs.existsSync(args.topicFile)) {
      console.error(`Error: Topic file not found: ${args.topicFile}`);
      process.exit(1);
    }
    args.customTopic = fs.readFileSync(args.topicFile, "utf-8").trim();
    console.log(`Loaded custom topic from file: ${args.topicFile}`);
  }

  // Initialize Payload
  console.log("Initializing Payload CMS...\n");
  const payload = await getPayload({ config });

  // Fetch settings from CMS
  console.log("Fetching generation settings from CMS...");
  const settings = await getGenerationSettings(payload);

  // Handle checkpoint list/cleanup
  if (args.listCheckpoints) {
    await listCheckpoints(payload);
    process.exit(0);
  }

  if (args.cleanupCheckpoints) {
    await cleanupCheckpoints(payload);
    process.exit(0);
  }

  if (args.backdate) {
    await runBackdateMode(payload, args, settings);
  } else {
    await runStandardMode(payload, args, settings, startTime);
  }
}

/**
 * Run backdate mode - generate articles for historical dates
 */
async function runBackdateMode(
  payload: Awaited<ReturnType<typeof getPayload>>,
  args: CliArgs,
  settings: any
): Promise<void> {
  const startTime = Date.now();

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         EXCELSIOR CREATIVE ARTICLE BACKDATE GENERATOR         ║
╠═══════════════════════════════════════════════════════════════╣
║  Mode: BACKDATE (historical article generation)               ║
${
  args.dryRun
    ? "║  DRY RUN: Cost estimation only                               ║\n"
    : ""
}╚═══════════════════════════════════════════════════════════════╝
`);

  // Get existing article dates if needed
  let existingDates: Date[] = [];
  if (args.skipExisting) {
    console.log("Fetching existing article dates...");
    existingDates = await getExistingArticleDates(payload);
    console.log(`Found ${existingDates.length} existing articles\n`);
  }

  // Generate organic publish dates
  console.log("Generating organic publish schedule...");
  const publishDates = generateOrganicDates(args.startDate!, args.endDate!, {
    avgPerWeek: args.avgPerWeek,
    existingDates,
    skipExisting: args.skipExisting,
  });

  // Display distribution summary
  const summary = getDateDistributionSummary(publishDates);
  console.log(`
Publish Schedule Summary
${"─".repeat(40)}
Total articles:     ${summary.total}
Date range:         ${summary.dateRange?.start.toLocaleDateString()} - ${summary.dateRange?.end.toLocaleDateString()}
Avg per week:       ${summary.avgPerWeek}

By day of week:
  ${Object.entries(summary.byDayOfWeek)
    .map(([d, c]) => `${d}: ${c}`)
    .join("  ")}

By time slot:
  Morning: ${summary.byTimeSlot.morning}  Afternoon: ${
    summary.byTimeSlot.afternoon
  }  Evening: ${summary.byTimeSlot.evening}
`);

  // Dry run: estimate costs and exit
  if (args.dryRun) {
    console.log("Estimating costs...\n");
    const estimate = await estimateBackdateCost(payload, publishDates.length);

    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    BACKDATE COST ESTIMATE                      ║
╠═══════════════════════════════════════════════════════════════╣
║  Articles to generate:  ${publishDates.length.toString().padEnd(37)}║
║  Avg cost per article:  $${estimate.avgCost.toFixed(4).padEnd(35)}║
║  Sample size:           ${estimate.sampleSize.toString().padEnd(37)}║
╠═══════════════════════════════════════════════════════════════╣
║  ESTIMATED TOTAL COST:  $${estimate.estimatedTotal.toFixed(2).padEnd(35)}║
╚═══════════════════════════════════════════════════════════════╝

To proceed with generation, remove the --dry-run flag.
`);
    process.exit(0);
  }

  // Check environment
  checkEnvironment();

  // Confirm before proceeding
  const estimate = await estimateBackdateCost(payload, publishDates.length);
  console.log(`
Estimated cost: $${estimate.estimatedTotal.toFixed(2)}
`);

  // Generate articles
  const results: Array<{
    success: boolean;
    title?: string;
    slug?: string;
    error?: string;
    costs?: GenerationCosts;
    publishDate?: Date;
  }> = [];

  let runningCost = 0;

  for (let i = 0; i < publishDates.length; i++) {
    const { date } = publishDates[i];
    console.log(`\n${"─".repeat(60)}`);
    console.log(
      `Publishing for: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    );

    const result = await generateSingleArticle(
      payload,
      i,
      publishDates.length,
      {
        dryRun: false,
        settings,
        publishDate: date,
        humanize: true,
        customTopic: args.customTopic,
        targetWords: args.targetWords,
        inlineImages: args.inlineImages,
        infographics: args.infographics,
      }
    );

    results.push({ ...result, publishDate: date });

    if (result.costs) {
      runningCost += result.costs.totalCost;
      console.log(`Running total cost: $${runningCost.toFixed(4)}`);
    }

    // Progress bar
    const progress = (((i + 1) / publishDates.length) * 100).toFixed(1);
    const eta =
      ((Date.now() - startTime) / (i + 1)) * (publishDates.length - i - 1);
    console.log(`Progress: ${progress}% | ETA: ${formatDuration(eta)}`);

    // Delay between articles
    if (i < publishDates.length - 1) {
      console.log(`\nWaiting 3 seconds before next article...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Final summary
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const duration = (Date.now() - startTime) / 1000;
  const totalCost = results.reduce(
    (sum, r) => sum + (r.costs?.totalCost || 0),
    0
  );

  console.log(`
${"─".repeat(60)}

╔═══════════════════════════════════════════════════════════════╗
║                   BACKDATE GENERATION COMPLETE                 ║
╠═══════════════════════════════════════════════════════════════╣
║  Total:        ${publishDates.length.toString().padEnd(46)}║
║  Success:      ${successful.length.toString().padEnd(46)}║
║  Failed:       ${failed.length.toString().padEnd(46)}║
║  Duration:     ${formatDuration(duration * 1000).padEnd(46)}║
║  Total Cost:   $${totalCost.toFixed(4).padEnd(44)}║
╚═══════════════════════════════════════════════════════════════╝
`);

  if (failed.length > 0) {
    console.log("\nFailed articles:");
    failed.forEach((r) => {
      console.log(`  ✗ ${r.publishDate?.toLocaleDateString()}: ${r.error}`);
    });
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

/**
 * Run standard mode - generate articles for current date
 */
async function runStandardMode(
  payload: Awaited<ReturnType<typeof getPayload>>,
  args: CliArgs,
  settings: any,
  startTime: number
): Promise<void> {
  const {
    count,
    dryRun,
    customTopic,
    targetWords,
    inlineImages,
    infographics,
    resume,
    resumeId,
  } = args;

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║             EXCELSIOR CREATIVE ARTICLE GENERATOR              ║
╠═══════════════════════════════════════════════════════════════╣
║  Generating ${count} value-driven article${
    count > 1 ? "s" : ""
  } with AI-powered images    ${count < 10 ? " " : ""}║
${customTopic ? `║  TOPIC: ${customTopic.slice(0, 50).padEnd(53)}║\n` : ""}${
    targetWords ? `║  WORDS: ${targetWords.toString().padEnd(53)}║\n` : ""
  }${
    inlineImages > 0 || infographics > 1
      ? `║  MEDIA: ${inlineImages} inline images, ${infographics} infographics${" ".repeat(
          Math.max(
            0,
            33 - String(inlineImages).length - String(infographics).length
          )
        )}║\n`
      : ""
  }${
    resume
      ? `║  RESUME: ${
          resumeId
            ? resumeId.slice(0, 40).padEnd(41)
            : "Latest available".padEnd(41)
        }║\n`
      : ""
  }${
    dryRun
      ? "║  MODE: DRY RUN (preview only, no changes)                    ║\n"
      : ""
  }╚═══════════════════════════════════════════════════════════════╝
`);

  // Check environment
  if (!dryRun) {
    checkEnvironment();
  }

  // Handle Resume
  let resumeCheckpoint: Checkpoint | null = null;
  if (resume) {
    resumeCheckpoint = await loadCheckpoint(payload, resumeId || undefined);
    if (!resumeCheckpoint) {
      console.error(
        `Error: No active checkpoint found${
          resumeId ? ` with ID ${resumeId}` : ""
        }`
      );
      process.exit(1);
    }
    console.log(
      `Resuming generation ${resumeCheckpoint.generationId} from stage: ${resumeCheckpoint.stage}`
    );
  }

  const results: Array<{
    success: boolean;
    title?: string;
    slug?: string;
    error?: string;
    costs?: GenerationCosts;
  }> = [];

  // Generate articles sequentially to avoid rate limits
  for (let i = 0; i < count; i++) {
    console.log(`\n${"─".repeat(60)}`);
    const result = await generateSingleArticle(
      payload,
      i,
      count,
      {
        dryRun,
        settings,
        humanize: true,
        customTopic: resumeCheckpoint?.options?.customTopic || customTopic,
        targetWords: resumeCheckpoint?.options?.targetWords || targetWords,
        inlineImages: resumeCheckpoint?.options?.inlineImages || inlineImages,
        infographics: resumeCheckpoint?.options?.infographics || infographics,
      },
      resumeCheckpoint || undefined
    );

    // Clear resume checkpoint after first use
    resumeCheckpoint = null;

    results.push(result);

    // Small delay between articles to respect API rate limits
    if (i < count - 1) {
      console.log(`\nWaiting 2 seconds before next article...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Summary
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Calculate total costs
  const totalCosts = successful.reduce(
    (sum, r) => sum + (r.costs?.totalCost || 0),
    0
  );
  const costStr = `$${totalCosts.toFixed(4)}`;

  console.log(`
${"─".repeat(60)}

╔═══════════════════════════════════════════════════════════════╗
║                        GENERATION COMPLETE                     ║
╠═══════════════════════════════════════════════════════════════╣
║  Total:     ${count
    .toString()
    .padEnd(3)}                                                ║
║  Success:   ${successful.length
    .toString()
    .padEnd(3)}                                                ║
║  Failed:    ${failed.length
    .toString()
    .padEnd(3)}                                                ║
║  Duration:  ${duration.padEnd(6)}s                                           ║
║  Cost:      ${costStr.padEnd(10)}                                        ║
╚═══════════════════════════════════════════════════════════════╝
`);

  if (successful.length > 0) {
    console.log("Created articles:");
    successful.forEach((r) => {
      console.log(`  ✓ ${r.title}`);
      console.log(`    → /articles/${r.slug}`);
    });
  }

  if (failed.length > 0) {
    console.log("\nFailed articles:");
    failed.forEach((r, i) => {
      console.log(`  ✗ Article ${i + 1}: ${r.error}`);
    });
  }

  console.log("");
  process.exit(failed.length > 0 ? 1 : 0);
}

/**
 * Send notification to Slack via Webhook
 */
async function sendSlackNotification(
  title: string,
  slug: string,
  cost: number
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return; // Silently skip if no webhook configured
  }

  const articleUrl = `https://excelsiorcreative.com/articles/${slug}`;
  const message = {
    text: `New article published: *${title}*\n${articleUrl}\n_Generation cost: $${cost.toFixed(
      4
    )}_`,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error(`Slack notification failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
  }
}

/**
 * Format milliseconds to human readable duration
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// Run
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
