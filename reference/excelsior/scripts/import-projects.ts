import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import { chromium, type Page } from "playwright";
import sharp from "sharp";
import config from "../src/payload.config";

// Website list from user input
const WEBSITES = [
  "1in6.org",
  "ackiusadvisory.com",
  "adventuresoftheheart.org",
  "albanos.com",
  "anaheimcf.org",
  "asianamericanfutures.org",
  "baximus.com",
  "blueprintcfo.com",
  "brighterfuturesoc.org",
  "calaoc.org",
  "canyonlakeinsider.com",
  "claoc.org",
  "crownservices.org",
  "dallasseverinjurylawyer.com",
  "dearhero.org",
  "envisionoc.org",
  "faithinmotionrivco.org",
  "ferrumhealth.com",
  "fosterall.org",
  "fourstonesrealestate.com",
  "frankdesantisvoice.com",
  "fvhsbaronbaseball.com",
  "garnercreative.com",
  "goldfutureschallenge.org",
  "greendoorhospitality.com",
  "hammer.vodka",
  "happeningnowwithhammer.com",
  "his-oc.org",
  "hotdogshoppe.com",
  "joinpursuit.co",
  "josfcenter.org",
  "kahanidigital.com",
  "karinasbackpackproject.org",
  "kiptonquarry.com",
  "leonarddlane.com",
  "lidolive.com",
  "lostvalleyoutfitters.com",
  "massviolencesurvivorsfund.org",
  "mercyhouse.net",
  "mkc-law.com",
  "momentumrg.com",
  "neilsahota.com",
  "nicholas-endowment.org",
  "ocaip.org",
  "occcopico.org",
  "ocfellows.org",
  "ocgrantmakers.org",
  "ocphilanthropycentral.org",
  "petrocores.com",
  "portal.zeroabuseproject.org",
  "processcreative.co",
  "prosomnus.com",
  "richcompanyinc.com",
  "rmsff.org",
  "roammotorcars.com",
  "santabellainvestments.com",
  "sierralobo.com",
  "simonbuildersprogram.org",
  "solaraccess.energy",
  "solaraccessenergy.com",
  "solveai.world",
  "solvecc.org",
  "specialtytaxadvisors.com",
  "studioprocess.co",
  "summerworshipnightstour.com",
  "sunfamilyfoundation.org",
  "sunfoundation.com",
  "survivorspace.org",
  "susanchoi.law",
  "swizzmagik.com",
  "tarsadia.com",
  "tarsadiacapital.com",
  "tarsadiafoundation.org",
  "terrorismlaw.com",
  "tfome.com",
  "theblackbox.group",
  "thelivewell.co",
  "thelodgeattwomoons.com",
  "themontanahuntingoutfitters.com",
  "thentc.us",
  "thompsonfamilyfoundation.us",
  "umbergzipser.com",
  "vickerycreekllc.com",
  "wearegroundswell.org",
  "wyomingbiggameoutfitters.com",
  "zeroabuseproject.org",
];

// Initialize Gemini
const apiKey = process.env.GOOGLE_GENAI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const FORCE_RECAPTURE = process.argv.includes("--force");
const CONTENT_ONLY = process.argv.includes("--content-only");

async function needsRecapture(screenshotPath: string): Promise<boolean> {
  if (!fs.existsSync(screenshotPath)) return true;

  try {
    const metadata = await sharp(screenshotPath).metadata();
    // Recapture if not the new dimensions (1440x900)
    return metadata.width !== 1440 || metadata.height !== 900;
  } catch (error) {
    return true;
  }
}

type ProjectMetadata = {
  title: string;
  summary: string;
  description: string; // 2-3 paragraphs article-style content
  category: string;
  filterCategory: "nonprofit" | "professional";
  tags: string[];
};

// Convert plain text description to Lexical rich text format for Payload
function textToLexicalRichText(text: string) {
  // Split text into paragraphs
  const paragraphs = text.split("\n\n").filter((p) => p.trim());

  return {
    root: {
      type: "root",
      children: paragraphs.map((paragraph) => ({
        type: "paragraph",
        children: [{ type: "text", text: paragraph.trim(), version: 1 }],
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        version: 1,
      })),
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
    },
  };
}

async function analyzeScreenshot(
  screenshotPath: string,
  url: string,
  pageContent?: string
): Promise<ProjectMetadata> {
  if (!ai) {
    console.error("Gemini API key not found. Using fallback metadata.");
    return getFallbackMetadata(url);
  }

  try {
    // Read the screenshot as base64
    const imageBuffer = fs.readFileSync(screenshotPath);
    const base64Image = imageBuffer.toString("base64");

    const prompt = `You are analyzing a website screenshot and its text content to extract organization information for a portfolio showcase.

URL: ${url}

${pageContent ? `EXTRACTED TEXT CONTENT FROM HOMEPAGE:\n${pageContent}\n` : ""}

Analyze the provided website screenshot and the extracted text content above to extract:
1. **title**: The organization/company name (extract from logo, header, or content)
2. **summary**: A 2-3 sentence summary of what the organization does - this should be compelling and highlight their key value proposition. Use the extracted text to be specific about their mission and offerings.
3. **description**: A detailed article-style write-up about the organization (2-3 paragraphs). Include:
   - Who they are and their mission/purpose
   - What services, products, or programs they offer
   - Their impact, achievements, or what makes them unique
   - Any notable information visible on their website
   Write this in third person, professional tone, as if for a portfolio case study. Use the extracted text to provide factual and deep insights. Separate paragraphs with double newlines.
4. **category**: A display category (e.g., "Social Impact", "Healthcare", "Legal Services", "Real Estate", "Technology", "Hospitality", "Education", "Financial Services", "Aerospace & Engineering", "Environmental Services", "Arts & Entertainment", "Community Development", "Child Welfare", "Faith-Based")
5. **filterCategory**: Either "nonprofit" or "professional" (use nonprofit for .org domains, foundations, charities; professional for businesses, .com domains unless clearly nonprofit)
6. **tags**: An array of 3-5 relevant tags (e.g., ["Healthcare", "Technology", "AI"] or ["Nonprofit", "Youth Services", "Education"])

Respond with ONLY a valid JSON object in this exact format:
{
  "title": "Organization Name",
  "summary": "Brief compelling description of what they do.",
  "description": "First paragraph about who they are and their mission.\\n\\nSecond paragraph about their services and offerings.\\n\\nThird paragraph about their impact and achievements.",
  "category": "Category Name",
  "filterCategory": "nonprofit",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}

Do not include any markdown formatting, code blocks, or additional text. Just the raw JSON object.`;

    const response = await ai.models.generateContent({
      model: "models/gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 1500, // Increased for detailed description
        temperature: 0.4,
      },
    });

    const text = response.text || "";

    // Clean up response - remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.slice(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const metadata = JSON.parse(cleanText) as ProjectMetadata;

    // Validate and normalize
    if (
      !metadata.title ||
      !metadata.summary ||
      !metadata.description ||
      !metadata.category ||
      !metadata.filterCategory
    ) {
      throw new Error("Missing required fields in response");
    }

    if (
      metadata.filterCategory !== "nonprofit" &&
      metadata.filterCategory !== "professional"
    ) {
      metadata.filterCategory = url.includes(".org")
        ? "nonprofit"
        : "professional";
    }

    return metadata;
  } catch (error) {
    console.error(`Error analyzing ${url}:`, error);
    return getFallbackMetadata(url);
  }
}

function getFallbackMetadata(url: string): ProjectMetadata {
  const domain = url.replace(/^(www\.)?/, "").split(".")[0];
  const titleCase = domain.charAt(0).toUpperCase() + domain.slice(1);
  const isNonprofit = url.includes(".org");

  return {
    title: titleCase,
    summary: `${titleCase} is a ${
      isNonprofit ? "nonprofit organization" : "professional services company"
    } dedicated to serving their community and clients.`,
    description: `${titleCase} is an organization committed to excellence in their field. They provide valuable services and solutions to their target audience.\n\nWith a focus on quality and customer satisfaction, ${titleCase} has established themselves as a trusted name in their industry. Their team of dedicated professionals works tirelessly to deliver outstanding results.\n\nVisit their website to learn more about their services, mission, and how they can help you achieve your goals.`,
    category: isNonprofit ? "Social Impact" : "Professional Services",
    filterCategory: isNonprofit ? "nonprofit" : "professional",
    tags: [isNonprofit ? "Nonprofit" : "Business", "Services"],
  };
}

function urlToSlug(url: string): string {
  return url
    .replace(/^(www\.)?/, "")
    .replace(/\.[^.]+$/, "") // Remove TLD
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, ""); // Trim dashes
}

async function extractPageContent(page: Page): Promise<string> {
  return await page.evaluate(() => {
    // Get all visible text content
    const elementsToExtract = document.querySelectorAll(
      'h1, h2, h3, p, [class*="hero"], [class*="about"], meta[name="description"]'
    );

    const content: string[] = [];

    // Get meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) content.push(metaDesc.getAttribute("content") || "");

    // Get visible text
    elementsToExtract.forEach((el) => {
      const text = el.textContent?.trim();
      if (text && text.length > 20) content.push(text);
    });

    return content.slice(0, 25).join("\n\n");
  });
}

async function captureScreenshot(
  browser: ReturnType<typeof chromium.launch> extends Promise<infer T>
    ? T
    : never,
  url: string,
  outputDir: string
): Promise<{ screenshotPath: string | null; pageContent: string | null }> {
  const slug = urlToSlug(url);
  const screenshotPath = path.join(outputDir, `${slug}.jpg`);

  const shouldRecapture =
    FORCE_RECAPTURE || (await needsRecapture(screenshotPath));

  // If we don't need to recapture and we are not in content-only mode, we can just return the existing path
  if (!shouldRecapture && !CONTENT_ONLY) {
    console.log(
      `  Screenshot already correct (1440x900): ${slug}.jpg (use --force to override)`
    );
    return { screenshotPath, pageContent: null };
  }

  const page = await browser.newPage();

  try {
    // Set viewport for consistent screenshots (MacBook Pro resolution)
    await page.setViewportSize({ width: 1440, height: 900 });

    // Navigate with timeout
    await page.goto(`https://${url}`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Wait a bit for any animations
    await page.waitForTimeout(2000);

    // Extract page content for Gemini
    const pageContent = await extractPageContent(page);

    if (!shouldRecapture) {
      console.log(
        `  Skipping screenshot recapture for ${slug}.jpg, but extracted page content.`
      );
      return { screenshotPath, pageContent };
    }

    // Capture screenshot
    await page.screenshot({
      path: screenshotPath,
      type: "jpeg",
      quality: 85,
    });

    console.log(`  Captured: ${slug}.jpg`);
    return { screenshotPath, pageContent };
  } catch (error) {
    console.error(
      `  Failed to process ${url}:`,
      error instanceof Error ? error.message : error
    );
    // If it exists, return path anyway so we can still attempt analysis if content-only
    return {
      screenshotPath: fs.existsSync(screenshotPath) ? screenshotPath : null,
      pageContent: null,
    };
  } finally {
    await page.close();
  }
}

async function uploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  screenshotPath: string,
  title: string
): Promise<number | null> {
  try {
    const filename = path.basename(screenshotPath);
    const fileBuffer = fs.readFileSync(screenshotPath);

    // Create a File-like object for Payload
    const file = {
      data: fileBuffer,
      mimetype: "image/jpeg",
      name: filename,
      size: fileBuffer.length,
    };

    const media = await payload.create({
      collection: "media",
      data: {
        alt: `${title} website screenshot`,
      },
      file,
    });

    return media.id;
  } catch (error) {
    console.error(`  Failed to upload media for ${title}:`, error);
    return null;
  }
}

async function createOrUpdateProject(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  metadata: ProjectMetadata,
  mediaId: number | null,
  order: number
): Promise<boolean> {
  const slug = urlToSlug(url);

  try {
    // Check if project already exists
    const existing = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    // Convert description to Lexical rich text format
    const descriptionRichText = textToLexicalRichText(metadata.description);

    const projectData = {
      title: metadata.title,
      slug,
      category: metadata.category,
      filterCategory: metadata.filterCategory,
      image: mediaId || undefined,
      imagePath: mediaId ? undefined : `/work/${slug}.jpg`,
      link: `https://${url}`,
      summary: metadata.summary,
      description: descriptionRichText,
      tags: metadata.tags.map((tag) => ({ tag })),
      order,
    };

    if (existing.docs.length > 0) {
      // Update existing project with new content
      console.log(`  Updating existing project: ${slug}`);
      await payload.update({
        collection: "projects",
        id: existing.docs[0].id,
        data: projectData,
      });
    } else {
      // Create new project
      await payload.create({
        collection: "projects",
        data: {
          ...projectData,
          featured: false,
        },
      });
      console.log(`  Created new project: ${metadata.title}`);
    }

    return true;
  } catch (error) {
    console.error(`  Failed to save project ${url}:`, error);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting portfolio import...");
  console.log(`📋 Processing ${WEBSITES.length} websites\n`);

  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), "public", "work");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Initialize Payload
  console.log("⚙️ Initializing Payload CMS...");
  const payload = await getPayload({ config });

  // Launch browser
  console.log("🌐 Launching browser...\n");
  const browser = await chromium.launch({ headless: true });

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < WEBSITES.length; i++) {
    const url = WEBSITES[i];
    const order = i + 10; // Start at 10 to leave room for featured projects

    console.log(`[${i + 1}/${WEBSITES.length}] Processing ${url}...`);

    // 1. Capture screenshot and/or extract content
    const { screenshotPath, pageContent } = await captureScreenshot(
      browser,
      url,
      outputDir
    );

    if (!screenshotPath) {
      failCount++;
      continue;
    }

    // 2. Analyze with Gemini
    console.log(
      `  Analyzing with Gemini${
        pageContent ? " (using extracted text)" : ""
      }...`
    );
    const metadata = await analyzeScreenshot(
      screenshotPath,
      url,
      pageContent || undefined
    );
    console.log(`  → ${metadata.title} (${metadata.filterCategory})`);

    // 3. Upload media to Payload (skip if CONTENT_ONLY and image already exists)
    let mediaId: number | null = null;
    if (!CONTENT_ONLY || !fs.existsSync(screenshotPath)) {
      console.log(`  Uploading media...`);
      mediaId = await uploadMedia(payload, screenshotPath, metadata.title);
    } else {
      console.log(`  Skipping media upload (content-only mode)`);
      // Find existing media if needed, but createOrUpdateProject handles it if we pass null
    }

    // 4. Create or update project record
    const success = await createOrUpdateProject(
      payload,
      url,
      metadata,
      mediaId,
      order
    );

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    console.log("");

    // Small delay between requests to be respectful
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await browser.close();

  console.log("\n✅ Import completed!");
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Import failed:", error);
  process.exit(1);
});
