#!/usr/bin/env npx tsx
/**
 * Industry Landing Page Generation CLI Script
 *
 * Generates SEO-optimized industry landing pages with tailored copy and featured images.
 * Uses Gemini for content generation and Replicate for images.
 *
 * Usage:
 *   npx tsx scripts/generate-industry-pages.ts                    # Generate for all industries in industries.txt
 *   npx tsx scripts/generate-industry-pages.ts --industry "Dental" # Generate for a specific industry
 *   npx tsx scripts/generate-industry-pages.ts --count 5          # Generate 5 industries
 *   npx tsx scripts/generate-industry-pages.ts --dry-run          # Preview costs without creating
 *   npx tsx scripts/generate-industry-pages.ts --resume           # Resume last failed generation
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "../src/payload.config";
import {
  downloadImage,
  generateIndustryContextWithUsage,
  generateIndustryPageSectionsWithUsage,
  generateIndustryFeaturedImageWithUsage,
  generateInfographicDataWithUsage,
  generateInfographicWithUsage,
  getGenerationSettings,
  type IndustryContext,
  type IndustryPageData,
} from "../src/services/contentGenerationService";

// CLI arguments type
type CliArgs = {
  industry: string | null;
  count: number | null;
  dryRun: boolean;
  resume: boolean;
  resumeId: string | null;
  listCheckpoints: boolean;
  cleanupCheckpoints: boolean;
  skipExisting: boolean;
};

// Checkpoint type
type Checkpoint = {
  id: string | number;
  generationId: string;
  industryName: string;
  stage: "context" | "content" | "infographic" | "images" | "upload" | "create";
  status: "in_progress" | "failed" | "completed";
  context?: IndustryContext;
  pageData?: IndustryPageData;
  infographicData?: any;
  imageResult?: any;
  infographicResult?: any;
  uploadedMedia?: {
    featured: number;
    infographic: number;
  };
  costs: GenerationCosts;
  options: any;
  errorMessage?: string;
  startedAt: string;
  lastUpdatedAt: string;
};

type GenerationCosts = {
  industryResearch: { inputTokens: number; outputTokens: number; cost: number };
  contentGeneration: { inputTokens: number; outputTokens: number; cost: number };
  infographicData: { inputTokens: number; outputTokens: number; cost: number };
  featuredImage: { model: string; predictTime: number; cost: number };
  infographicImage: { model: string; predictTime: number; cost: number };
  totalCost: number;
  generatedAt: string;
};

// Parse command line arguments
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    industry: null,
    count: null,
    dryRun: false,
    resume: false,
    resumeId: null,
    listCheckpoints: false,
    cleanupCheckpoints: false,
    skipExisting: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--industry":
        if (nextArg) {
          result.industry = nextArg;
          i++;
        }
        break;
      case "--count":
        if (nextArg) {
          result.count = parseInt(nextArg, 10);
          i++;
        }
        break;
      case "--dry-run":
        result.dryRun = true;
        break;
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
      case "--force":
        result.skipExisting = false;
        break;
    }
  }

  return result;
}

// Check required environment variables
function checkEnvironment(): void {
  const missing: string[] = [];
  if (!process.env.GOOGLE_GENAI_API_KEY) missing.push("GOOGLE_GENAI_API_KEY");
  if (!process.env.REPLICATE_API_KEY) missing.push("REPLICATE_API_KEY");

  if (missing.length > 0) {
    console.error(`\nMissing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

/**
 * Checkpoint Management
 */
const CHECKPOINT_DIR = path.join(process.cwd(), "scripts/checkpoints");

function ensureCheckpointDir() {
  if (!fs.existsSync(CHECKPOINT_DIR)) {
    fs.mkdirSync(CHECKPOINT_DIR, { recursive: true });
  }
}

function getCheckpointPath(industryName: string): string {
  const slug = industryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return path.join(CHECKPOINT_DIR, `${slug}.json`);
}

function createCheckpoint(industryName: string, options: any): string {
  ensureCheckpointDir();
  const generationId = `ind-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const checkpoint: Checkpoint = {
    id: 0, // Not used for file-based
    generationId,
    industryName,
    stage: "context",
    status: "in_progress",
    options,
    costs: {
      industryResearch: { inputTokens: 0, outputTokens: 0, cost: 0 },
      contentGeneration: { inputTokens: 0, outputTokens: 0, cost: 0 },
      infographicData: { inputTokens: 0, outputTokens: 0, cost: 0 },
      featuredImage: { model: "", predictTime: 0, cost: 0 },
      infographicImage: { model: "", predictTime: 0, cost: 0 },
      totalCost: 0,
      generatedAt: new Date().toISOString(),
    },
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(getCheckpointPath(industryName), JSON.stringify(checkpoint, null, 2));
  return generationId;
}

function updateCheckpoint(industryName: string, data: Partial<Checkpoint>): void {
  const filePath = getCheckpointPath(industryName);
  if (fs.existsSync(filePath)) {
    const current = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Checkpoint;
    const updated = {
      ...current,
      ...data,
      lastUpdatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  }
}

function loadCheckpoint(industryName?: string): Checkpoint | null {
  if (industryName) {
    const filePath = getCheckpointPath(industryName);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Checkpoint;
    }
    return null;
  }

  // Find latest in_progress or failed checkpoint
  ensureCheckpointDir();
  const files = fs.readdirSync(CHECKPOINT_DIR).filter(f => f.endsWith(".json"));
  if (files.length === 0) return null;

  const checkpoints = files
    .map(f => JSON.parse(fs.readFileSync(path.join(CHECKPOINT_DIR, f), "utf-8")) as Checkpoint)
    .filter(c => c.status !== "completed")
    .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());

  return checkpoints[0] || null;
}

function deleteCheckpoint(industryName: string): void {
  const filePath = getCheckpointPath(industryName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function listCheckpoints(): void {
  ensureCheckpointDir();
  const files = fs.readdirSync(CHECKPOINT_DIR).filter(f => f.endsWith(".json"));
  
  if (files.length === 0) {
    console.log("No checkpoints found.");
    return;
  }

  console.log("\n--- Active Checkpoints ---");
  files.forEach(f => {
    const cp = JSON.parse(fs.readFileSync(path.join(CHECKPOINT_DIR, f), "utf-8")) as Checkpoint;
    const date = new Date(cp.lastUpdatedAt).toLocaleString();
    console.log(`[${cp.status.toUpperCase()}] ${cp.industryName.padEnd(30)} | Stage: ${cp.stage.padEnd(12)} | Last updated: ${date}`);
  });
  console.log("--------------------------\n");
}

function cleanupCheckpoints(): void {
  ensureCheckpointDir();
  const files = fs.readdirSync(CHECKPOINT_DIR).filter(f => f.endsWith(".json"));
  let count = 0;
  
  files.forEach(f => {
    const filePath = path.join(CHECKPOINT_DIR, f);
    const cp = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Checkpoint;
    // Cleanup completed or old (older than 7 days) checkpoints
    const isOld = new Date().getTime() - new Date(cp.lastUpdatedAt).getTime() > 7 * 24 * 60 * 60 * 1000;
    
    if (cp.status === "completed" || isOld) {
      fs.unlinkSync(filePath);
      count++;
    }
  });
  
  console.log(`Cleaned up ${count} checkpoints.`);
}

/**
 * Main Generation Logic
 */
async function generateIndustryPage(
  payload: any,
  industryName: string,
  settings: any,
  options: any,
  resumeCheckpoint?: Checkpoint
): Promise<boolean> {
  const prefix = `[${industryName}]`;
  const costs: GenerationCosts = resumeCheckpoint?.costs || {
    industryResearch: { inputTokens: 0, outputTokens: 0, cost: 0 },
    contentGeneration: { inputTokens: 0, outputTokens: 0, cost: 0 },
    infographicData: { inputTokens: 0, outputTokens: 0, cost: 0 },
    featuredImage: { model: "", predictTime: 0, cost: 0 },
    infographicImage: { model: "", predictTime: 0, cost: 0 },
    totalCost: 0,
    generatedAt: new Date().toISOString(),
  };

  let generationId = resumeCheckpoint?.generationId;

  try {
    if (!options.dryRun && !resumeCheckpoint) {
      generationId = createCheckpoint(industryName, options);
    }

    // Phase 1: Context Research
    let context: IndustryContext | undefined = resumeCheckpoint?.context;
    if (!context) {
      console.log(`${prefix} Researching industry context...`);
      const contextResult = await generateIndustryContextWithUsage(industryName, settings);
      context = contextResult.data;
      costs.industryResearch = {
        inputTokens: contextResult.usage.inputTokens,
        outputTokens: contextResult.usage.outputTokens,
        cost: contextResult.cost,
      };
      
      if (!options.dryRun) {
        updateCheckpoint(industryName, { stage: "content", context, costs });
      }
    }

    // Phase 2: Page Content
    let pageData: IndustryPageData | undefined = resumeCheckpoint?.pageData;
    if (!pageData) {
      console.log(`${prefix} Generating page content (1500-2000 words)...`);
      const pageResult = await generateIndustryPageSectionsWithUsage(industryName, context, settings);
      pageData = pageResult.data;
      costs.contentGeneration = {
        inputTokens: pageResult.usage.inputTokens,
        outputTokens: pageResult.usage.outputTokens,
        cost: pageResult.cost,
      };

      if (!options.dryRun) {
        updateCheckpoint(industryName, { stage: "infographic", pageData, costs });
      }
    }

    // Phase 2b: Infographic Data
    let infographicData: any = resumeCheckpoint?.infographicData;
    if (!infographicData) {
      console.log(`${prefix} Extracting infographic data...`);
      const combinedContent = `${pageData.hero.headline}\n${pageData.hero.description}\n` + 
        pageData.painPoints.map(p => `${p.title}: ${p.description}`).join("\n");
      
      const infographicDataResult = await generateInfographicDataWithUsage({
        title: industryName,
        content: combinedContent,
      } as any, settings);
      
      infographicData = infographicDataResult.data;
      costs.infographicData = {
        inputTokens: infographicDataResult.usage.inputTokens,
        outputTokens: infographicDataResult.usage.outputTokens,
        cost: infographicDataResult.cost,
      };

      if (!options.dryRun) {
        updateCheckpoint(industryName, { stage: "images", infographicData, costs });
      }
    }

    if (options.dryRun) {
      const estimatedCost = costs.industryResearch.cost + costs.contentGeneration.cost + costs.infographicData.cost + 0.02; // Estimate for 2 images
      console.log(`${prefix} [DRY RUN] Estimated cost: $${estimatedCost.toFixed(4)}`);
      return true;
    }

    // Phase 3: Images (Featured + Infographic)
    let imageResult: any = resumeCheckpoint?.imageResult;
    let infographicResult: any = resumeCheckpoint?.infographicResult;

    if (!imageResult || !infographicResult) {
      console.log(`${prefix} Generating images (featured + infographic)...`);
      
      const imageTasks: Promise<any>[] = [];
      if (!imageResult) imageTasks.push(generateIndustryFeaturedImageWithUsage(industryName, pageData, settings));
      if (!infographicResult) imageTasks.push(generateInfographicWithUsage({ title: industryName } as any, infographicData, settings));

      const results = await Promise.all(imageTasks);
      
      let resIdx = 0;
      if (!imageResult) {
        imageResult = results[resIdx++];
        costs.featuredImage = {
          model: imageResult.model,
          predictTime: imageResult.predictTime,
          cost: imageResult.cost,
        };
      }
      if (!infographicResult) {
        infographicResult = results[resIdx++];
        costs.infographicImage = {
          model: infographicResult.model,
          predictTime: infographicResult.predictTime,
          cost: infographicResult.cost,
        };
      }

      updateCheckpoint(industryName, { stage: "upload", imageResult, infographicResult, costs });
    }

    // Phase 4: Media Upload
    let uploadedMedia: any = resumeCheckpoint?.uploadedMedia;
    if (!uploadedMedia) {
      console.log(`${prefix} Downloading and uploading images...`);
      
      const downloadTasks = [
        downloadImage(imageResult.url),
        downloadImage(infographicResult.url)
      ];
      const [imageBuffer, infographicBuffer] = await Promise.all(downloadTasks);

      const industrySlug = industryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const featuredDoc = await payload.create({
        collection: "media",
        data: {
          alt: `${industryName} Web Design & SEO | Excelsior Creative`,
          caption: `${pageData.hero.headline} - Tailored solutions for the ${industryName} industry.`,
        },
        file: {
          data: imageBuffer,
          name: `industry-${industrySlug}-${Date.now()}.png`,
          mimetype: "image/png",
          size: imageBuffer.length,
        },
      });

      const infographicDoc = await payload.create({
        collection: "media",
        data: {
          alt: `${industryName} Infographic | Excelsior Creative`,
          caption: `${infographicData.headline} - ${infographicData.problemStatement}`,
        },
        file: {
          data: infographicBuffer,
          name: `industry-infographic-${industrySlug}-${Date.now()}.png`,
          mimetype: "image/png",
          size: infographicBuffer.length,
        },
      });

      uploadedMedia = {
        featured: featuredDoc.id,
        infographic: infographicDoc.id
      };

      updateCheckpoint(industryName, { stage: "create", uploadedMedia, costs });
    }

    // Phase 5: Create Industry Page
    console.log(`${prefix} Creating industry landing page in CMS...`);
    const slug = industryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    const { docs: existing } = await payload.find({
      collection: "industry-landing-pages",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    costs.totalCost = costs.industryResearch.cost + 
                     costs.contentGeneration.cost + 
                     costs.infographicData.cost + 
                     (costs.featuredImage?.cost || 0) + 
                     (costs.infographicImage?.cost || 0);

    const data = {
      industryName,
      slug,
      hero: pageData.hero,
      painPoints: pageData.painPoints,
      services: pageData.services,
      process: pageData.process,
      statistics: pageData.statistics,
      faqs: pageData.faqs,
      cta: pageData.cta,
      featuredImage: uploadedMedia.featured,
      infographic: uploadedMedia.infographic,
      seo: pageData.seo,
      generationCosts: {
        ...costs,
        generatedAt: new Date().toISOString(),
      },
    };

    if (existing.length > 0) {
      await payload.update({
        collection: "industry-landing-pages",
        id: existing[0].id,
        data,
      });
      console.log(`${prefix} Updated existing page: /industries/${slug}`);
    } else {
      await payload.create({
        collection: "industry-landing-pages",
        data,
      });
      console.log(`${prefix} Created new page: /industries/${slug}`);
    }

    deleteCheckpoint(industryName);

    return true;
  } catch (error) {
    console.error(`${prefix} Error:`, error);
    if (!options.dryRun) {
      updateCheckpoint(industryName, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }
    return false;
  }
}

async function main() {
  const args = parseArgs();
  
  if (args.listCheckpoints) {
    listCheckpoints();
    process.exit(0);
  }

  if (args.cleanupCheckpoints) {
    cleanupCheckpoints();
    process.exit(0);
  }

  checkEnvironment();

  console.log("Initializing Payload...");
  const payload = await getPayload({ config });
  const settings = await getGenerationSettings(payload);

  if (args.resume) {
    const checkpoint = loadCheckpoint(args.industry || undefined);
    if (!checkpoint) {
      console.error(args.industry ? `No checkpoint found for industry: ${args.industry}` : "No active checkpoints found to resume.");
      process.exit(1);
    }
    console.log(`Resuming ${checkpoint.industryName} (Stage: ${checkpoint.stage})...`);
    await generateIndustryPage(payload, checkpoint.industryName, settings, args, checkpoint);
    process.exit(0);
  }

  // Get industries from file
  const industriesPath = path.join(process.cwd(), "scripts/industries.txt");
  const industries = fs.readFileSync(industriesPath, "utf-8")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));

  let targets = industries;
  if (args.industry) {
    targets = industries.filter(i => i.toLowerCase().includes(args.industry!.toLowerCase()));
  }

  if (args.count) {
    targets = targets.slice(0, args.count);
  }

  console.log(`Found ${targets.length} industries to process.`);

  for (const industry of targets) {
    if (args.skipExisting) {
      const slug = industry.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { totalDocs } = await payload.find({
        collection: "industry-landing-pages",
        where: { slug: { equals: slug } },
        limit: 1,
      });
      if (totalDocs > 0) {
        console.log(`[${industry}] Page already exists, skipping. Use --force to overwrite.`);
        continue;
      }
    }

    const success = await generateIndustryPage(payload, industry, settings, args);
    if (!success) {
      console.log(`Stopped at ${industry} due to error.`);
      break;
    }
    
    // Rate limit protection
    if (!args.dryRun) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

