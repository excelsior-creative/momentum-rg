import {
  formatKeywordWithLocation,
  getRandomKeywords,
} from "@/config/seo-keywords";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import type { Payload } from "payload";
import Replicate from "replicate";
import {
  ArticleMetadataSchema,
  ArticleOutlineSchema,
  GeneratedArticleSchema,
  InfographicDataSchema,
  TopicIdeaSchema,
  IndustryContextSchema,
  IndustryPageSchema,
} from "./schemas";

const apiKey = process.env.GOOGLE_GENAI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

// Types for article generation
export type TopicIdea = {
  title: string;
  angle: string;
  targetKeyword: string;
  location: string;
  reasoning: string;
};

export type GeneratedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Lexical JSON format
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  targetKeyword: string;
};

export type GeneratedImages = {
  featuredImageUrl: string;
  infographicUrl: string;
};

export type ArticleOutline = {
  title: string;
  slug: string;
  sections: Array<{
    heading: string;
    subheadings: string[];
    keyPoints: string[];
    targetWords: number;
  }>;
  totalEstimatedWords: number;
};

// Structured data for value-driven infographics
export type InfographicData = {
  headline: string;
  problemStatement: string;
  statistics: Array<{
    value: string;
    label: string;
    source?: string;
  }>;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  proTips: string[];
  callToAction: string;
};

export type IndustryContext = {
  personas: string[];
  challenges: string[];
  keywords: string[];
  insights: string[];
};

export type IndustryPageData = {
  hero: {
    headline: string;
    tagline: string;
    description: string;
  };
  painPoints: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  services: Array<{
    serviceTitle: string;
    industrySpecificBenefit: string;
  }>;
  process: Array<{
    stepNumber: string;
    title: string;
    description: string;
  }>;
  statistics: Array<{
    value: string;
    label: string;
    source?: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    title: string;
    description: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
};

export type ContentGenerationSettings = {
  topicResearch: { prompt: string };
  articleGeneration: { prompt: string };
  featuredImageStyles: Array<{
    name: string;
    model: string;
    prompt: string;
  }>;
  infographic: {
    dataExtractionPrompt: string;
    imageGenerationPrompt: string;
  };
};

// Usage tracking types
export type TokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type GeminiUsageResult<T> = {
  data: T;
  usage: TokenUsage;
  cost: number;
};

export type ReplicateUsageResult = {
  url: string;
  style: string;
  model: string;
  predictTime: number;
  cost: number;
};

// Pricing constants (per million tokens for Gemini, per second for Replicate)
const PRICING = {
  // Gemini 3 Flash Preview pricing
  geminiFlash: {
    inputPerMillion: 0.1,
    outputPerMillion: 0.4,
  },
  // Gemini 3 Pro Preview pricing
  geminiPro: {
    inputPerMillion: 1.25,
    outputPerMillion: 10.0,
  },
  // Replicate pricing (varies by model, using approximate GPU rates)
  replicate: {
    "google/nano-banana-pro": 0.0023, // per GPU second (Nvidia T4)
  },
} as const;

/**
 * Calculate cost for Gemini API usage
 */
function calculateGeminiCost(
  usage: TokenUsage,
  model: "flash" | "pro"
): number {
  const pricing = model === "pro" ? PRICING.geminiPro : PRICING.geminiFlash;
  const inputCost = (usage.inputTokens / 1_000_000) * pricing.inputPerMillion;
  const outputCost =
    (usage.outputTokens / 1_000_000) * pricing.outputPerMillion;
  return inputCost + outputCost;
}

/**
 * Calculate cost for Replicate prediction
 */
function calculateReplicateCost(predictTime: number, model: string): number {
  const ratePerSecond =
    PRICING.replicate[model as keyof typeof PRICING.replicate] || 0.0023;
  return predictTime * ratePerSecond;
}

/**
 * Simple retry helper for transient API failures
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  context: string,
  maxRetries = 2,
  delayMs = 2000
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (attempt < maxRetries) {
        console.warn(
          `[${context}] Attempt ${
            attempt + 1
          } failed: ${error.message}. Retrying in ${delayMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error(
          `[${context}] Final attempt (${attempt + 1}) failed:`,
          error
        );
      }
    }
  }
  throw lastError;
}

/**
 * Retry helper specifically for Replicate API calls
 * Handles 429 rate limits with exponential backoff
 */
async function withReplicateRetry<T>(
  fn: () => Promise<T>,
  context: string,
  maxRetries = 5,
  baseDelayMs = 10000
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a rate limit error
      const is429 =
        error?.message?.includes("429") ||
        error?.status === 429 ||
        error?.response?.status === 429;

      if (!is429 || attempt >= maxRetries) {
        throw error;
      }

      // Extract retry_after from error if available
      let delayMs = baseDelayMs * Math.pow(2, attempt);
      const retryAfterMatch = error?.message?.match(/retry_after"?:\s*(\d+)/);
      if (retryAfterMatch) {
        delayMs = (parseInt(retryAfterMatch[1], 10) + 1) * 1000;
      }

      console.log(
        `[${context}] Rate limited (429). Retry ${
          attempt + 1
        }/${maxRetries} in ${Math.round(delayMs / 1000)}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

/**
 * Robustly parse JSON from AI responses, handling markdown code blocks.
 * With structured output enabled, the model is much more reliable.
 */
function safeParseJSON<T>(text: string): T {
  // 1. Clean up markdown code blocks if present
  let cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

  try {
    return JSON.parse(cleanText) as T;
  } catch (initialError: any) {
    // Check if the JSON is likely truncated
    const isTruncated =
      cleanText.endsWith("{") ||
      cleanText.endsWith("[") ||
      cleanText.endsWith(":") ||
      cleanText.endsWith(",") ||
      (cleanText.match(/"[^"]*$/) && !cleanText.endsWith("\""));

    const errorMessage = isTruncated
      ? "AI response appears to be truncated (cut off mid-JSON)"
      : `Failed to parse AI response as JSON: ${initialError.message}`;

    console.warn(`[safeParseJSON] ${errorMessage}`);
    console.warn(`[safeParseJSON] Text length: ${cleanText.length} chars`);
    console.warn(
      `[safeParseJSON] Last 100 chars: "...${cleanText.slice(-100)}"`
    );

    throw new Error(errorMessage);
  }
}

/**
 * Fetch generation settings from Payload CMS
 */
export async function getGenerationSettings(
  payload: Payload
): Promise<ContentGenerationSettings> {
  try {
    const settings = await payload.findGlobal({
      slug: "content-generation-settings" as any,
    });
    return settings as unknown as ContentGenerationSettings;
  } catch (error) {
    console.error(
      "Failed to fetch generation settings, using defaults:",
      error
    );
    // Return defaults if global not found or fails
    return {
      topicResearch: {
        prompt: `You are an SEO content strategist for Excelsior Creative, a web development agency in Orange County, California.
Your task: Analyze these target keywords and identify ONE compelling article topic that would rank well and provide value to potential clients.
TARGET KEYWORDS:
{{keywordList}}
Respond in this exact JSON format:
{ "title": "...", "angle": "...", "targetKeyword": "...", "location": "...", "reasoning": "..." }`,
      },
      articleGeneration: {
        prompt: `You are an expert content writer for Excelsior Creative. Write a comprehensive, PROBLEM-SOLVING blog article.
TOPIC: {{title}}
ANGLE: {{angle}}
TARGET KEYWORD: {{targetKeyword}}
TARGET LOCATION: {{location}}
Respond in JSON format with title, slug, excerpt, content (markdown), metaTitle, metaDescription, keywords.`,
      },
      featuredImageStyles: [
        {
          name: "illustration",
          model: "google/nano-banana-pro",
          prompt: `Create a professional blog featured image for: "{{title}}". Summary: {{excerpt}}. Style: Modern editorial illustration, tech aesthetic, orange (#FF5722) accent. No text.`,
        },
      ],
      infographic: {
        dataExtractionPrompt: `Extract structured info for an infographic from this article: {{title}}. Content: {{content}}. Return JSON with headline, problemStatement, statistics, steps, proTips, callToAction.`,
        imageGenerationPrompt: `Create a detailed professional infographic. Title: "{{headline}}". Subtitle: "{{problemStatement}}". Stats: {{statsSection}}. Steps: {{stepsSection}}. Tips: {{tipsSection}}. Footer: "{{callToAction}} | excelsiorcreative.com". 4K, 9:16, dark theme, orange accent.`,
      },
    };
  }
}

/**
 * Research trending topics related to SEO keywords using Gemini
 */
export async function researchTrendingTopics(
  settings?: ContentGenerationSettings
): Promise<TopicIdea> {
  const result = await researchTrendingTopicsWithUsage(settings);
  return result.data;
}

/**
 * Research trending topics with usage tracking
 */
export async function researchTrendingTopicsWithUsage(
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<TopicIdea>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const selectedKeywords = getRandomKeywords(8);
  const keywordList = selectedKeywords
    .map(formatKeywordWithLocation)
    .join("\n- ");

  const promptTemplate =
    settings?.topicResearch.prompt ||
    `You are an SEO content strategist for Excelsior Creative, a web development agency in Orange County, California.

Your task: Analyze these target keywords and identify ONE compelling article topic that would rank well and provide value to potential clients.

TARGET KEYWORDS:
{{keywordList}}

Consider:
1. Current trends in web development and digital marketing
2. Common pain points for business owners needing web services
3. Seasonal relevance and timely topics
4. Local Orange County business context

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "title": "Article title (compelling, 50-60 chars for SEO)",
  "angle": "The unique angle or hook for this article",
  "targetKeyword": "The primary keyword to target",
  "location": "The location to target (e.g., Orange County, Irvine, etc.)",
  "reasoning": "Brief explanation of why this topic will perform well"
}`;

  const prompt = promptTemplate.replace("{{keywordList}}", keywordList);

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-flash-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 2000,
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: TopicIdeaSchema,
        },
      });

      const text = response.text || "";
      const data = safeParseJSON<TopicIdea>(text);

      // Extract usage metadata
      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "flash");

      return { data, usage, cost };
    }, "researchTrendingTopics");
  } catch (error) {
    console.error("Topic research error:", error);
    // Fallback to a random keyword-based topic
    const fallbackKeyword = selectedKeywords[0];
    return {
      data: {
        title: `Complete Guide to ${fallbackKeyword.keyword} in ${fallbackKeyword.location}`,
        angle: "Comprehensive how-to guide with actionable tips",
        targetKeyword: fallbackKeyword.keyword,
        location: fallbackKeyword.location || "Orange County",
        reasoning: "Fallback topic based on target keywords",
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      cost: 0,
    };
  }
}

/**
 * Parse a natural language topic description into a structured TopicIdea
 */
export async function parseCustomTopicWithUsage(
  topicDescription: string,
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<TopicIdea>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const prompt = `You are an SEO content strategist for Excelsior Creative. 
Convert this natural language topic description into a structured article topic.

TOPIC DESCRIPTION:
"${topicDescription}"

REQUIREMENTS:
1. Create a compelling, SEO-friendly title (50-60 chars)
2. Define a unique angle or hook
3. Identify the primary target keyword
4. Identify the target location (default to 'Orange County' if not specified)
5. Explain the SEO reasoning

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "title": "...",
  "angle": "...",
  "targetKeyword": "...",
  "location": "...",
  "reasoning": "..."
}`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-flash-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 2000,
          temperature: 0.5,
          responseMimeType: "application/json",
          responseSchema: TopicIdeaSchema,
        },
      });

      const text = response.text || "";
      const data = safeParseJSON<TopicIdea>(text);

      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "flash");

      return { data, usage, cost };
    }, "parseCustomTopic");
  } catch (error) {
    console.error("Custom topic parsing error:", error);
    throw new Error("Failed to parse custom topic description");
  }
}

/**
 * Generate a detailed outline for long-form articles
 */
export async function generateArticleOutlineWithUsage(
  topic: TopicIdea,
  targetWords: number,
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<ArticleOutline>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const prompt = `You are an expert content strategist. Create a detailed outline for a comprehensive article.
Target word count: ${targetWords} words.

TOPIC: ${topic.title}
ANGLE: ${topic.angle}
KEYWORD: ${topic.targetKeyword}
LOCATION: ${topic.location}

The outline should break the article into 5-8 logical sections.
Each section MUST include a target word count that sums up to the total target.

Respond in this exact JSON format:
{
  "title": "${topic.title}",
  "slug": "...",
  "sections": [
    {
      "heading": "...",
      "subheadings": ["...", "..."],
      "keyPoints": ["...", "..."],
      "targetWords": 600
    }
  ],
  "totalEstimatedWords": ${targetWords}
}`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-flash-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 2000,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: ArticleOutlineSchema,
        },
      });

      const text = response.text || "";
      const data = safeParseJSON<ArticleOutline>(text);

      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "flash");

      return { data, usage, cost };
    }, "generateArticleOutline");
  } catch (error) {
    console.error("Outline generation error:", error);
    throw new Error("Failed to generate article outline");
  }
}

/**
 * Generate a single section of a long-form article
 */
export async function generateArticleSectionWithUsage(
  topic: TopicIdea,
  outline: ArticleOutline,
  sectionIndex: number,
  previousContent: string,
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<string>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const section = outline.sections[sectionIndex];
  const isFirstSection = sectionIndex === 0;
  const isLastSection = sectionIndex === outline.sections.length - 1;

  const prompt = `You are an expert content writer for Excelsior Creative. 
Write a section for a long-form article.

ARTICLE TOPIC: ${topic.title}
SECTION HEADING: ${section.heading}
SUBHEADINGS TO COVER: ${section.subheadings.join(", ")}
KEY POINTS TO INCLUDE: ${section.keyPoints.join(", ")}
TARGET WORD COUNT FOR THIS SECTION: ${section.targetWords} words

${
  !isFirstSection
    ? `CONTEXT FROM PREVIOUS SECTIONS:
${previousContent.slice(-1500)}

Ensure a smooth transition from the previous content.`
    : ""
}

${
  isLastSection
    ? "This is the final section. Include a conclusion and a call-to-action for Excelsior Creative."
    : ""
}

WRITING STYLE:
- Human, conversational, expert
- Use natural transitions
- Avoid AI clichés
- Be thorough and provide real value

Respond with ONLY the markdown content for this section (including the H2 heading).`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-pro-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 4000,
          temperature: 0.7,
        },
      });

      const content = response.text || "";

      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "pro");

      return { data: content, usage, cost };
    }, "generateArticleSection");
  } catch (error) {
    console.error("Section generation error:", error);
    throw new Error(`Failed to generate section: ${section.heading}`);
  }
}

/**
 * Final pass to compose sections and generate SEO metadata
 */
export async function composeArticleWithUsage(
  topic: TopicIdea,
  outline: ArticleOutline,
  sections: string[],
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<GeneratedArticle>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const fullContent = sections.join("\n\n");

  const prompt = `You are an expert editor for Excelsior Creative. 
Review and finalize this comprehensive article.

TOPIC: ${topic.title}
CONTENT:
${fullContent.slice(0, 4000)}... [Content Truncated for Metadata Generation]

Your task:
1. Review the content for flow and coherence
2. Generate SEO metadata (slug, excerpt, meta title, meta description, keywords)

Respond in this exact JSON format:
{
  "title": "${topic.title}",
  "slug": "${outline.slug}",
  "excerpt": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": "...",
  "content": "[CONTENT_PLACEHOLDER]"
}

Note: The 'content' field should be exactly "[CONTENT_PLACEHOLDER]" - the actual content will be injected programmatically.`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-flash-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 2000,
          temperature: 0.3,
          responseMimeType: "application/json",
          responseSchema: ArticleMetadataSchema,
        },
      });

      const text = response.text || "";
      const parsed = safeParseJSON<any>(text);

      const data: GeneratedArticle = {
        ...parsed,
        content: fullContent, // Ensure we use the full content, not truncated
        targetKeyword: topic.targetKeyword,
      };

      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "flash");

      return { data, usage, cost };
    }, "composeArticle");
  } catch (error) {
    console.error("Article composition error:", error);
    throw new Error("Failed to compose final article");
  }
}

/**
 * Generate a full SEO-optimized article using Gemini
 */
export async function generateArticle(
  topic: TopicIdea,
  settings?: ContentGenerationSettings
): Promise<GeneratedArticle> {
  const result = await generateArticleWithUsage(topic, settings);
  return result.data;
}

/**
 * Generate a full SEO-optimized article with usage tracking
 */
export async function generateArticleWithUsage(
  topic: TopicIdea,
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<GeneratedArticle>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const promptTemplate =
    settings?.articleGeneration.prompt ||
    `You are an expert content writer for Excelsior Creative, a premium web development agency in Orange County, California.

Write a comprehensive, PROBLEM-SOLVING blog article that genuinely helps readers. This is NOT SEO filler - this should provide real value.

TOPIC: {{title}}
ANGLE: {{angle}}
TARGET KEYWORD: {{targetKeyword}}
TARGET LOCATION: {{location}}

CONTENT PHILOSOPHY:
- Start with the PAIN POINT: What frustration brings someone to search for this?
- Provide ACTIONABLE SOLUTIONS: Step-by-step guidance they can implement today
- Include REAL NUMBERS: Statistics, timeframes, cost estimates where relevant
- Share EXPERT INSIGHTS: Things only a professional would know
- Address COMMON MISTAKES: Help them avoid pitfalls

WRITING STYLE (IMPORTANT - write like a human, not AI):
- Write conversationally, as if explaining to a colleague over coffee
- Use contractions naturally (don't, won't, it's, we're, you'll)
- Vary sentence length - mix short punchy sentences with longer explanatory ones
- Start some sentences with "And" or "But" occasionally - it's natural
- Include personal opinions where appropriate ("Honestly, this is often overlooked...")
- Avoid stiff transitions like "Furthermore", "Additionally", "Moreover" - use "Also", "Plus", or just start the sentence
- NEVER use "In today's digital landscape", "Let's dive in", or "It's important to note that"
- Avoid em-dashes (--) - use commas or semicolons instead
- Be direct - don't pad sentences with filler phrases
- Use simple words: "use" not "utilize", "help" not "facilitate", "start" not "commence"

REQUIREMENTS:
1. Write 1500-2000 words of genuinely helpful, actionable content
2. Open with empathy - acknowledge the reader's frustration or challenge
3. Include at least one numbered step-by-step process
4. Add 2-3 real statistics or data points (cite sources if possible)
5. Include a "Pro Tips" or "Expert Advice" section with quick wins
6. Naturally incorporate the target keyword 3-5 times
7. Include the location naturally where appropriate
8. Structure with clear H2 and H3 headings
9. End with a helpful call-to-action mentioning Excelsior Creative

FORMAT YOUR RESPONSE AS JSON (no markdown, just raw JSON):
{
  "title": "SEO-optimized article title (include keyword if natural)",
  "slug": "url-friendly-slug-with-keyword",
  "excerpt": "Compelling 150-160 char meta description that promises value",
  "content": "Full article in Markdown format with ## for H2 and ### for H3",
  "metaTitle": "SEO title tag (max 60 chars)",
  "metaDescription": "Meta description (max 160 chars)",
  "keywords": "comma, separated, relevant, keywords"
}`;

  const prompt = promptTemplate
    .replace("{{title}}", topic.title)
    .replace("{{angle}}", topic.angle)
    .replace("{{targetKeyword}}", topic.targetKeyword)
    .replace("{{location}}", topic.location);

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-pro-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 8000,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: GeneratedArticleSchema,
        },
      });

      const text = response.text || "";
      const parsed = safeParseJSON<any>(text);

      const data: GeneratedArticle = {
        ...parsed,
        targetKeyword: topic.targetKeyword,
      };

      // Extract usage metadata
      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "pro");

      return { data, usage, cost };
    }, "generateArticle");
  } catch (error) {
    console.error("Article generation error:", error);
    throw new Error("Failed to generate article content");
  }
}

/**
 * Extract structured data from article content for infographic generation
 * Uses Gemini to identify key statistics, actionable steps, and pro tips
 */
export async function generateInfographicData(
  article: GeneratedArticle,
  settings?: ContentGenerationSettings
): Promise<InfographicData> {
  const result = await generateInfographicDataWithUsage(article, settings);
  return result.data;
}

/**
 * Extract structured data with usage tracking
 */
export async function generateInfographicDataWithUsage(
  article: GeneratedArticle,
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<InfographicData>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const promptTemplate =
    settings?.infographic.dataExtractionPrompt ||
    `You are a data visualization expert. Analyze this article and extract structured information for creating a detailed, value-driven infographic.

ARTICLE TITLE: {{title}}
ARTICLE CONTENT:
{{content}}

Your task: Extract the most valuable, shareable information from this article to create an infographic that users would want to save and share.

REQUIREMENTS:
1. Find 2-4 compelling statistics with realistic numbers (if not in article, research typical industry stats)
2. Identify 4-6 clear, actionable steps or a process flow
3. Extract 3-4 pro tips that provide quick wins
4. Create a compelling headline that captures the main problem being solved

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "headline": "Short, impactful headline (max 8 words)",
  "problemStatement": "The core problem this article solves (1 sentence)",
  "statistics": [
    {"value": "43%", "label": "of small businesses experience this issue", "source": "Industry Report 2024"},
    {"value": "$5,600", "label": "average cost per minute of downtime", "source": "Gartner"}
  ],
  "steps": [
    {"number": 1, "title": "Step Title", "description": "Brief 5-7 word description"},
    {"number": 2, "title": "Step Title", "description": "Brief 5-7 word description"}
  ],
  "proTips": [
    "Actionable tip users can implement immediately",
    "Another quick-win tip"
  ],
  "callToAction": "Short CTA like 'Get Expert Help Today'"
}`;

  const prompt = promptTemplate
    .replace("{{title}}", article.title)
    .replace("{{content}}", article.content);

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-flash-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 4000,
          temperature: 0.5,
          responseMimeType: "application/json",
          responseSchema: InfographicDataSchema,
        },
      });

      const text = response.text || "";

      // Extract usage metadata
      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };

      try {
        const parsed = safeParseJSON<InfographicData>(text);

        // Validate required fields
        if (!parsed.headline || !parsed.statistics || !parsed.steps) {
          throw new Error("Missing required infographic data fields");
        }

        const cost = calculateGeminiCost(usage, "flash");

        // Warn if getting close to token limit
        if (usage.outputTokens >= 3800) {
          console.warn(
            `[generateInfographicData] Approaching token limit (${usage.outputTokens}/4000)`
          );
        }

        return { data: parsed, usage, cost };
      } catch (parseError) {
        // Log extra context on parse failure
        console.warn(
          `[generateInfographicData] Parse failed. Tokens used: ${usage.outputTokens}/4000`
        );
        throw parseError;
      }
    }, "generateInfographicData");
  } catch (error) {
    console.error("Infographic data extraction error:", error);
    // Return fallback data
    return {
      data: {
        headline: article.title.slice(0, 50),
        problemStatement: article.excerpt,
        statistics: [
          {
            value: "70%",
            label: "of businesses need this solution",
            source: "Industry Data",
          },
          {
            value: "3x",
            label: "faster results with expert help",
            source: "Case Studies",
          },
        ],
        steps: [
          {
            number: 1,
            title: "Assess",
            description: "Evaluate your current situation",
          },
          {
            number: 2,
            title: "Plan",
            description: "Create a strategic action plan",
          },
          {
            number: 3,
            title: "Execute",
            description: "Implement the solution",
          },
          {
            number: 4,
            title: "Review",
            description: "Monitor and optimize results",
          },
        ],
        proTips: [
          "Start with the highest-impact items first",
          "Document everything for future reference",
          "Don't hesitate to seek expert guidance",
        ],
        callToAction: "Get Expert Help Today",
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      cost: 0,
    };
  }
}

/**
 * Suggest relevant tags for an article based on its content
 */
export async function suggestArticleTags(
  article: { title: string; excerpt: string },
  availableTags: Array<{ id: number; name: string }>
): Promise<number[]> {
  if (!ai || availableTags.length === 0) {
    return [];
  }

  const tagsList = availableTags.map((t) => `${t.name} (id: ${t.id})`).join(", ");
  const prompt = `
    You are an expert editor for Excelsior Creative.
    Based on the following article snippet, select the 2-5 most relevant tags from the provided list.
    
    ARTICLE TITLE: ${article.title}
    ARTICLE EXCERPT: ${article.excerpt}
    
    AVAILABLE TAGS: ${tagsList}
    
    Instructions: Return ONLY a comma-separated list of tag IDs. No other text.
    Example: 1, 5, 12
  `;

  try {
    const result = await ai.models.generateContent({
      model: "models/gemini-2.0-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0.3,
      },
    });

    const text = result.text || "";
    const tagIds = text
      .trim()
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    return tagIds;
  } catch (error) {
    console.error("Tag suggestion error:", error);
    return [];
  }
}

// Lexical format bitmask values
const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;
const FORMAT_CODE = 16;

// Types for Lexical nodes
type LexicalTextNode = {
  type: "text";
  version: number;
  text: string;
  format: number;
  mode: "normal";
};

type LexicalLinkNode = {
  type: "link";
  version: number;
  url: string;
  target: "_blank" | "_self";
  rel: string;
  children: LexicalTextNode[];
};

type LexicalInlineNode = LexicalTextNode | LexicalLinkNode;

/**
 * Parse inline markdown formatting and return Lexical child nodes
 * Handles: **bold**, *italic*, ***bold+italic***, `code`, [links](url)
 */
function parseInlineMarkdown(text: string): LexicalInlineNode[] {
  const nodes: LexicalInlineNode[] = [];

  // Combined regex to match all inline formatting patterns
  // Order matters: check *** before ** before *
  const inlinePattern =
    /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlinePattern.exec(text)) !== null) {
    // Add any plain text before this match
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index);
      if (plainText) {
        nodes.push({
          type: "text",
          version: 1,
          text: plainText,
          format: 0,
          mode: "normal",
        });
      }
    }

    const fullMatch = match[0];

    if (match[2]) {
      // ***bold+italic*** (group 2)
      nodes.push({
        type: "text",
        version: 1,
        text: match[2],
        format: FORMAT_BOLD | FORMAT_ITALIC,
        mode: "normal",
      });
    } else if (match[3]) {
      // **bold** (group 3)
      nodes.push({
        type: "text",
        version: 1,
        text: match[3],
        format: FORMAT_BOLD,
        mode: "normal",
      });
    } else if (match[4]) {
      // *italic* (group 4)
      nodes.push({
        type: "text",
        version: 1,
        text: match[4],
        format: FORMAT_ITALIC,
        mode: "normal",
      });
    } else if (match[5]) {
      // `code` (group 5)
      nodes.push({
        type: "text",
        version: 1,
        text: match[5],
        format: FORMAT_CODE,
        mode: "normal",
      });
    } else if (match[6] && match[7]) {
      // [text](url) - link (groups 6 and 7)
      nodes.push({
        type: "link",
        version: 1,
        url: match[7],
        target: "_blank",
        rel: "noopener noreferrer",
        children: [
          {
            type: "text",
            version: 1,
            text: match[6],
            format: 0,
            mode: "normal",
          },
        ],
      });
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Add any remaining plain text after the last match
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      nodes.push({
        type: "text",
        version: 1,
        text: remainingText,
        format: 0,
        mode: "normal",
      });
    }
  }

  // If no matches were found, return the original text as a plain node
  if (nodes.length === 0 && text) {
    nodes.push({
      type: "text",
      version: 1,
      text,
      format: 0,
      mode: "normal",
    });
  }

  return nodes;
}

/**
 * Check if a line is a numbered list item (e.g., "1. ", "2. ")
 * Returns the number if it's a list item, null otherwise
 */
function getNumberedListMatch(
  line: string
): { number: number; content: string } | null {
  const match = line.match(/^(\d+)\.\s+(.*)$/);
  if (match) {
    return { number: parseInt(match[1], 10), content: match[2] };
  }
  return null;
}

/**
 * Insert image placeholders into markdown content at optimal positions
 * Places images after H2 headings, distributed evenly through the content
 */
export function insertImagePlaceholders(
  markdown: string,
  imageCount: number,
  infographicCount: number
): string {
  if (imageCount === 0 && infographicCount <= 1) {
    return markdown;
  }

  const lines = markdown.split("\n");
  const h2Indices: number[] = [];

  // Find all H2 headings
  lines.forEach((line, index) => {
    if (line.startsWith("## ")) {
      h2Indices.push(index);
    }
  });

  if (h2Indices.length === 0) {
    return markdown;
  }

  // Calculate positions for images (distribute evenly among H2 sections)
  const totalMedia = imageCount + Math.max(0, infographicCount - 1); // -1 because first infographic is separate
  const step = Math.max(1, Math.floor(h2Indices.length / (totalMedia + 1)));

  let imageIndex = 0;
  let infographicIndex = 1; // Start at 1, index 0 is the main infographic
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);

    // Check if this is an H2 we should add media after
    const h2Position = h2Indices.indexOf(i);
    if (h2Position !== -1 && h2Position > 0) {
      // Skip the first H2 (intro)
      const mediaPosition = Math.floor(h2Position / step);

      // Add inline image placeholder
      if (imageIndex < imageCount && mediaPosition <= imageIndex + 1) {
        result.push("");
        result.push(`{{IMAGE:${imageIndex}}}`);
        result.push("");
        imageIndex++;
      }
      // Add additional infographic placeholder
      else if (
        infographicIndex < infographicCount &&
        mediaPosition <= imageCount + infographicIndex
      ) {
        result.push("");
        result.push(`{{INFOGRAPHIC:${infographicIndex}}}`);
        result.push("");
        infographicIndex++;
      }
    }
  }

  return result.join("\n");
}

/**
 * Convert markdown content to Lexical editor format
 * Compatible with Payload CMS richText field structure
 * Handles image placeholders {{IMAGE:n}} and {{INFOGRAPHIC:n}}
 */
export function markdownToLexical(
  markdown: string,
  mediaMap?: Map<string, number>
) {
  // Convert markdown to a Lexical structure
  const lines = markdown.split("\n");
  const children: Array<{
    type: string;
    version: number;
    [k: string]: unknown;
  }> = [];

  let isInsideCodeBlock = false;
  let codeBlockLines: string[] = [];
  let currentList: {
    type: string;
    version: number;
    listType: "bullet" | "number";
    direction: "ltr";
    format: "";
    indent: number;
    start: number;
    tag: string;
    children: Array<unknown>;
  } | null = null;

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (isInsideCodeBlock) {
        // Close code block
        children.push({
          type: "code",
          version: 1,
          direction: "ltr" as const,
          format: "" as const,
          indent: 0,
          children: [
            {
              type: "text",
              version: 1,
              text: codeBlockLines.join("\n"),
              format: 0,
              mode: "normal",
            },
          ],
        });
        codeBlockLines = [];
        isInsideCodeBlock = false;
      } else {
        // Open code block
        isInsideCodeBlock = true;
      }
      continue;
    }

    if (isInsideCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    const isBulletItem = line.startsWith("- ") || line.startsWith("* ");
    const numberedMatch = getNumberedListMatch(line);
    const isNumberedItem = numberedMatch !== null;
    const isListItem = isBulletItem || isNumberedItem;

    // Close current list if we hit a non-list line or a different list type
    if (currentList) {
      const currentIsBullet = currentList.listType === "bullet";
      if (
        !isListItem ||
        (isBulletItem && !currentIsBullet) ||
        (isNumberedItem && currentIsBullet)
      ) {
        children.push(currentList);
        currentList = null;
      }
    }

    if (line.startsWith("### ")) {
      children.push({
        type: "heading",
        version: 1,
        tag: "h3",
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        children: parseInlineMarkdown(line.replace("### ", "")),
      });
    } else if (line.startsWith("## ")) {
      children.push({
        type: "heading",
        version: 1,
        tag: "h2",
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        children: parseInlineMarkdown(line.replace("## ", "")),
      });
    } else if (line.startsWith("# ")) {
      children.push({
        type: "heading",
        version: 1,
        tag: "h1",
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        children: parseInlineMarkdown(line.replace("# ", "")),
      });
    } else if (isBulletItem) {
      // Create or add to current bullet list
      if (!currentList) {
        currentList = {
          type: "list",
          version: 1,
          listType: "bullet",
          direction: "ltr" as const,
          format: "" as const,
          indent: 0,
          start: 1,
          tag: "ul",
          children: [],
        };
      }
      const content = line.startsWith("- ") ? line.slice(2) : line.slice(2);
      currentList.children.push({
        type: "listitem",
        version: 1,
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        value: currentList.children.length + 1,
        children: parseInlineMarkdown(content),
      });
    } else if (isNumberedItem && numberedMatch) {
      // Create or add to current numbered list
      if (!currentList) {
        currentList = {
          type: "list",
          version: 1,
          listType: "number",
          direction: "ltr" as const,
          format: "" as const,
          indent: 0,
          start: numberedMatch.number,
          tag: "ol",
          children: [],
        };
      }
      currentList.children.push({
        type: "listitem",
        version: 1,
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        value: numberedMatch.number,
        children: parseInlineMarkdown(numberedMatch.content),
      });
    } else if (line.match(/^\{\{IMAGE:(\d+)\}\}$/)) {
      // Handle image placeholder
      const match = line.match(/^\{\{IMAGE:(\d+)\}\}$/);
      if (match && mediaMap) {
        const imageIndex = parseInt(match[1], 10);
        const mediaId = mediaMap.get(`image:${imageIndex}`);
        if (mediaId) {
          children.push({
            type: "upload",
            version: 3,
            id: crypto.randomUUID(),
            fields: null,
            relationTo: "media",
            value: mediaId,
          });
        }
      } else {
        // Keep placeholder as comment if no media map
        children.push({
          type: "paragraph",
          version: 1,
          direction: "ltr" as const,
          format: "" as const,
          indent: 0,
          textFormat: 0,
          children: [
            {
              type: "text",
              version: 1,
              text: `[Image ${
                parseInt(line.match(/\d+/)?.[0] || "0", 10) + 1
              }]`,
              format: 0,
              mode: "normal",
            },
          ],
        });
      }
    } else if (line.match(/^\{\{INFOGRAPHIC:(\d+)\}\}$/)) {
      // Handle infographic placeholder
      const match = line.match(/^\{\{INFOGRAPHIC:(\d+)\}\}$/);
      if (match && mediaMap) {
        const infographicIndex = parseInt(match[1], 10);
        const mediaId = mediaMap.get(`infographic:${infographicIndex}`);
        if (mediaId) {
          children.push({
            type: "upload",
            version: 3,
            id: crypto.randomUUID(),
            fields: null,
            relationTo: "media",
            value: mediaId,
          });
        }
      } else {
        // Keep placeholder as comment if no media map
        children.push({
          type: "paragraph",
          version: 1,
          direction: "ltr" as const,
          format: "" as const,
          indent: 0,
          textFormat: 0,
          children: [
            {
              type: "text",
              version: 1,
              text: `[Infographic ${
                parseInt(line.match(/\d+/)?.[0] || "0", 10) + 1
              }]`,
              format: 0,
              mode: "normal",
            },
          ],
        });
      }
    } else if (line.trim()) {
      children.push({
        type: "paragraph",
        version: 1,
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        textFormat: 0,
        children: parseInlineMarkdown(line),
      });
    }
  }

  // Don't forget to add any remaining list
  if (currentList) {
    children.push(currentList);
  }

  // Also close any unclosed code block
  if (isInsideCodeBlock && codeBlockLines.length > 0) {
    children.push({
      type: "code",
      version: 1,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      children: [
        {
          type: "text",
          version: 1,
          text: codeBlockLines.join("\n"),
          format: 0,
          mode: "normal",
        },
      ],
    });
  }

  return {
    root: {
      type: "root",
      version: 1,
      children,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
    },
  };
}

/**
 * Generate featured image using Replicate's Nano Banana Pro model
 */
export async function generateFeaturedImage(
  article: GeneratedArticle,
  settings?: ContentGenerationSettings
): Promise<{ url: string; style: string }> {
  const result = await generateFeaturedImageWithUsage(article, settings);
  return { url: result.url, style: result.style };
}

/**
 * Generate featured image with usage tracking
 */
export async function generateFeaturedImageWithUsage(
  article: GeneratedArticle,
  settings?: ContentGenerationSettings
): Promise<ReplicateUsageResult> {
  // Select a random style from settings
  const styles = settings?.featuredImageStyles || [
    {
      name: "illustration",
      model: "google/nano-banana-pro",
      prompt: `Create a professional blog featured image for an article titled: "{{title}}"
Article summary: {{excerpt}}
Style: Modern, clean editorial illustration with a tech/creative agency aesthetic. 
Use bold colors with orange (#FF5722) as an accent. Abstract or conceptual representation 
of the topic. No text overlays.`,
    },
  ];

  const style = styles[Math.floor(Math.random() * styles.length)];
  const model = style.model || "google/nano-banana-pro";

  const prompt = style.prompt
    .replace("{{title}}", article.title)
    .replace("{{excerpt}}", article.excerpt)
    .replace("{{keywords}}", article.keywords);

  console.log(
    `Generating featured image for: ${article.title} using style: ${style.name} and model: ${model}`
  );

  // Use predictions.create to get metrics
  const prediction = await withReplicateRetry(
    () =>
      replicate.predictions.create({
        model: model as any,
        input: {
          prompt,
          resolution: "2K",
          image_input: [],
          aspect_ratio: "16:9",
          output_format: "png",
          safety_filter_level: "block_only_high",
        },
      }),
    "generateFeaturedImage"
  );

  // Wait for the prediction to complete
  let finalPrediction = await replicate.predictions.get(prediction.id);
  while (
    finalPrediction.status === "starting" ||
    finalPrediction.status === "processing"
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    finalPrediction = await replicate.predictions.get(prediction.id);
  }

  if (finalPrediction.status !== "succeeded") {
    throw new Error(
      `Image generation failed: ${finalPrediction.error || "Unknown error"}`
    );
  }

  const output = finalPrediction.output;
  const imageUrl =
    typeof output === "object" && output !== null && "url" in output
      ? (output as { url: () => string }).url()
      : Array.isArray(output)
      ? output[0]
      : String(output);

  // Extract metrics
  const predictTime = finalPrediction.metrics?.predict_time || 0;
  const cost = calculateReplicateCost(predictTime, model);

  console.log(
    `Featured image generated: ${imageUrl} (${predictTime.toFixed(
      2
    )}s, $${cost.toFixed(6)})`
  );
  return { url: imageUrl, style: style.name, model, predictTime, cost };
}

/**
 * Generate an inline/contextual image for a specific section of the article
 */
export async function generateInlineImageWithUsage(
  article: GeneratedArticle,
  sectionContext: string,
  imageIndex: number,
  settings?: ContentGenerationSettings
): Promise<ReplicateUsageResult & { context: string }> {
  const model = "google/nano-banana-pro";

  const prompt = `Create a professional illustration for a blog article section.

ARTICLE: "${article.title}"
SECTION CONTEXT: "${sectionContext}"

Requirements:
- Professional, modern editorial illustration style
- Visually represents the concept described in the section context
- Tech/creative agency aesthetic with orange (#FF5722) accents
- Clean, uncluttered composition
- No text overlays or labels
- High quality, suitable for web publication`;

  console.log(
    `Generating inline image ${
      imageIndex + 1
    } for context: "${sectionContext.slice(0, 50)}..."`
  );

  const prediction = await withReplicateRetry(
    () =>
      replicate.predictions.create({
        model: model as any,
        input: {
          prompt,
          resolution: "2K",
          image_input: [],
          aspect_ratio: "16:9",
          output_format: "png",
          safety_filter_level: "block_only_high",
        },
      }),
    "generateInlineImage"
  );

  let finalPrediction = await replicate.predictions.get(prediction.id);
  while (
    finalPrediction.status === "starting" ||
    finalPrediction.status === "processing"
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    finalPrediction = await replicate.predictions.get(prediction.id);
  }

  if (finalPrediction.status !== "succeeded") {
    throw new Error(
      `Inline image generation failed: ${
        finalPrediction.error || "Unknown error"
      }`
    );
  }

  const output = finalPrediction.output;
  const imageUrl =
    typeof output === "object" && output !== null && "url" in output
      ? (output as { url: () => string }).url()
      : Array.isArray(output)
      ? output[0]
      : String(output);

  const predictTime = finalPrediction.metrics?.predict_time || 0;
  const cost = calculateReplicateCost(predictTime, model);

  console.log(
    `Inline image ${imageIndex + 1} generated (${predictTime.toFixed(
      2
    )}s, $${cost.toFixed(6)})`
  );

  return {
    url: imageUrl,
    style: "inline-illustration",
    model,
    predictTime,
    cost,
    context: sectionContext,
  };
}

/**
 * Identify optimal positions for inline images based on article structure
 * Returns section contexts that would benefit from visual illustration
 */
export async function identifyImagePlacementsWithUsage(
  article: GeneratedArticle,
  imageCount: number,
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<string[]>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const prompt = `Analyze this article and identify the ${imageCount} best sections for visual illustrations.

ARTICLE TITLE: ${article.title}
ARTICLE CONTENT:
${article.content.slice(0, 6000)}

For each of the ${imageCount} image placements, provide:
1. A brief description of what the image should illustrate (for AI image generation)
2. The H2 heading it should appear after

Return a JSON array of ${imageCount} strings, each being an image context description.
Example: ["A visual representation of responsive web design showing multiple device sizes", "An illustration of the step-by-step development process with connected nodes"]`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-flash-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 2000,
          temperature: 0.5,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "";
      const contexts = safeParseJSON<string[]>(text);

      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "flash");

      return { data: contexts, usage, cost };
    }, "identifyImagePlacements");
  } catch (error) {
    console.error("Image placement identification error:", error);
    // Return generic contexts as fallback
    const fallbackContexts = Array(imageCount)
      .fill(null)
      .map(
        (_, i) =>
          `Visual illustration for section ${i + 1} of article about ${
            article.title
          }`
      );
    return {
      data: fallbackContexts,
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      cost: 0,
    };
  }
}

/**
 * Generate infographic using Replicate with structured data
 * Uses 4K resolution for maximum detail and legible text
 */
export async function generateInfographic(
  article: GeneratedArticle,
  infographicData?: InfographicData,
  settings?: ContentGenerationSettings
): Promise<string> {
  const result = await generateInfographicWithUsage(
    article,
    infographicData,
    settings
  );
  return result.url;
}

/**
 * Generate infographic with usage tracking
 */
export async function generateInfographicWithUsage(
  article: GeneratedArticle,
  infographicData?: InfographicData,
  settings?: ContentGenerationSettings
): Promise<ReplicateUsageResult> {
  // If no structured data provided, generate it first
  const data =
    infographicData || (await generateInfographicData(article, settings));

  // Build a detailed, structured prompt with exact text to render
  const statsSection = data.statistics
    .map((stat) => `   - "${stat.value}" - ${stat.label}`)
    .join("\n");

  const stepsSection = data.steps
    .map((step) => `   ${step.number}. ${step.title}: ${step.description}`)
    .join("\n");

  const tipsSection = data.proTips.map((tip) => `   • ${tip}`).join("\n");

  const promptTemplate =
    settings?.infographic.imageGenerationPrompt ||
    `Create a detailed, professional infographic with the following EXACT content and text. 
All text must be clearly legible and accurately rendered.

INFOGRAPHIC TITLE (large, bold, at top):
"{{headline}}"

PROBLEM STATEMENT (subtitle):
"{{problemStatement}}"

STATISTICS SECTION (with icons, bold numbers):
{{statsSection}}

STEP-BY-STEP PROCESS (numbered flow with icons):
{{stepsSection}}

PRO TIPS SECTION (lightbulb icon, bullet points):
{{tipsSection}}

FOOTER (must include website URL):
"{{callToAction}} | Excelsior Creative | excelsiorcreative.com"

DESIGN REQUIREMENTS:
- 4K resolution, vertical format (9:16 aspect ratio)
- Dark background (#1a1a2e) with white and light gray text
- Accent color: vibrant orange (#FF5722) for highlights and icons
- Modern, clean flat design with geometric elements
- Clear visual hierarchy separating each section
- Professional tech/business aesthetic
- Use icons and visual elements for each statistic and step
- Ensure all text is crisp, legible, and accurately spelled
- Include subtle grid or pattern background for depth
- IMPORTANT: The footer MUST display the website URL "excelsiorcreative.com" prominently and legibly`;

  const prompt = promptTemplate
    .replace("{{headline}}", data.headline)
    .replace("{{problemStatement}}", data.problemStatement)
    .replace("{{statsSection}}", statsSection)
    .replace("{{stepsSection}}", stepsSection)
    .replace("{{tipsSection}}", tipsSection)
    .replace("{{callToAction}}", data.callToAction);

  const model = "google/nano-banana-pro";

  console.log(
    `Generating detailed infographic for: ${article.title} using ${model}`
  );
  console.log(
    `Infographic data: ${data.headline} with ${data.statistics.length} stats, ${data.steps.length} steps`
  );

  // Use predictions.create to get metrics
  const prediction = await withReplicateRetry(
    () =>
      replicate.predictions.create({
        model: model as any,
        input: {
          prompt,
          resolution: "4K",
          image_input: [],
          aspect_ratio: "9:16",
          output_format: "png",
          safety_filter_level: "block_only_high",
        },
      }),
    "generateInfographic"
  );

  // Wait for the prediction to complete
  let finalPrediction = await replicate.predictions.get(prediction.id);
  while (
    finalPrediction.status === "starting" ||
    finalPrediction.status === "processing"
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    finalPrediction = await replicate.predictions.get(prediction.id);
  }

  if (finalPrediction.status !== "succeeded") {
    throw new Error(
      `Infographic generation failed: ${
        finalPrediction.error || "Unknown error"
      }`
    );
  }

  const output = finalPrediction.output;
  const imageUrl =
    typeof output === "object" && output !== null && "url" in output
      ? (output as { url: () => string }).url()
      : Array.isArray(output)
      ? output[0]
      : String(output);

  // Extract metrics
  const predictTime = finalPrediction.metrics?.predict_time || 0;
  const cost = calculateReplicateCost(predictTime, model);

  console.log(
    `Infographic generated: ${imageUrl} (${predictTime.toFixed(
      2
    )}s, $${cost.toFixed(6)})`
  );
  return { url: imageUrl, style: "infographic", model, predictTime, cost };
}

/**
 * Download image from URL and return as buffer
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Generate a random publish time for today between 8 AM and 8 PM
 */
export function getRandomPublishTime(): Date {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Random hour between 8 AM and 8 PM (8-20)
  const randomHour = Math.floor(Math.random() * 12) + 8;
  // Random minute
  const randomMinute = Math.floor(Math.random() * 60);

  today.setHours(randomHour, randomMinute, 0, 0);

  // If the random time is in the past (cron runs at 2 AM), it's fine - article is already "published"
  // If we want it to always be in the future, we can add a day
  if (today < now) {
    today.setDate(today.getDate() + 1);
  }

  return today;
}

/**
 * Generate initial industry research and context using Gemini
 */
export async function generateIndustryContextWithUsage(
  industryName: string,
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<IndustryContext>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const prompt = `You are an industry research expert for Excelsior Creative, a premium web development agency.
Research the "${industryName}" industry and provide strategic insights for creating a high-converting landing page.

Focus on:
1. Decision-maker personas (who hires us?)
2. Core business challenges related to digital presence
3. High-intent SEO keywords for this specific niche
4. Competitive landscape and what makes a brand stand out in this industry

Respond in this exact JSON format:
{
  "personas": ["persona 1", "persona 2"],
  "challenges": ["challenge 1", "challenge 2"],
  "keywords": ["keyword 1", "keyword 2"],
  "insights": ["insight 1", "insight 2"]
}`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-flash-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 2000,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: IndustryContextSchema,
        },
      });

      const text = response.text || "";
      const data = safeParseJSON<IndustryContext>(text);

      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "flash");

      return { data, usage, cost };
    }, "generateIndustryContext");
  } catch (error) {
    console.error("Industry context generation error:", error);
    throw new Error(`Failed to generate context for industry: ${industryName}`);
  }
}

/**
 * Generate full page content for an industry landing page
 */
export async function generateIndustryPageSectionsWithUsage(
  industryName: string,
  context: IndustryContext,
  settings?: ContentGenerationSettings
): Promise<GeminiUsageResult<IndustryPageData>> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const prompt = `You are a world-class conversion copywriter for Excelsior Creative. 
Create a comprehensive, high-converting landing page for the "${industryName}" industry.

INDUSTRY CONTEXT:
- Personas: ${context.personas.join(", ")}
- Challenges: ${context.challenges.join(", ")}
- Target Keywords: ${context.keywords.join(", ")}
- Strategy: ${context.insights.join(", ")}

Excelsior Creative Services: Web Development, Agentic AI Solutions, SEO, Brand Development.

REQUIREMENTS:
1. Write 1500-2000 words of tailored, persuasive copy.
2. Address specific industry pain points regarding web design, SEO, and AI.
3. Position Excelsior Creative as the ultimate expert for this specific industry.
4. Use a professional, authoritative, yet human and approachable tone.
5. Emphasize why they should work with us and why we are the best choice.

Sections to generate:
- Hero: Headline, tagline, and descriptive paragraph.
- Pain Points: 4-6 industry-specific challenges with detailed descriptions and a Lucide icon name.
- Services: How our 4 services directly benefit this specific industry.
- Process: A 4-step work process (01-04) tailored to their typical workflow.
- Statistics: 3-4 industry-relevant data points with labels and sources.
- FAQs: 5-6 common questions this industry would ask about our services.
- CTA: Compelling industry-specific call to action.
- SEO: Meta title, description, and keywords.

Respond in this exact JSON format:
{
  "hero": { "headline": "...", "tagline": "...", "description": "..." },
  "painPoints": [{ "title": "...", "description": "...", "icon": "lucide-icon-name" }],
  "services": [{ "serviceTitle": "...", "industrySpecificBenefit": "..." }],
  "process": [{ "stepNumber": "01", "title": "...", "description": "..." }],
  "statistics": [{ "value": "...", "label": "...", "source": "..." }],
  "faqs": [{ "question": "...", "answer": "..." }],
  "cta": { "title": "...", "description": "..." },
  "seo": { "metaTitle": "...", "metaDescription": "...", "keywords": "..." }
}`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "models/gemini-3-pro-preview",
        contents: prompt,
        config: {
          maxOutputTokens: 8000,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: IndustryPageSchema,
        },
      });

      const text = response.text || "";
      const data = safeParseJSON<IndustryPageData>(text);

      const usageMetadata = response.usageMetadata;
      const usage: TokenUsage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
      };
      const cost = calculateGeminiCost(usage, "pro");

      return { data, usage, cost };
    }, "generateIndustryPageSections");
  } catch (error) {
    console.error("Industry page generation error:", error);
    throw new Error(`Failed to generate content for industry page: ${industryName}`);
  }
}

/**
 * Generate industry-specific featured image
 */
export async function generateIndustryFeaturedImageWithUsage(
  industryName: string,
  pageData: IndustryPageData,
  settings?: ContentGenerationSettings
): Promise<ReplicateUsageResult> {
  const model = "google/nano-banana-pro";
  const prompt = `Create a professional, high-end hero image for a ${industryName} agency landing page.
Headline: "${pageData.hero.headline}"
Style: Modern, clean, professional photography or high-end 3D render. 
Theme: Professional workspace, technology, and success within the ${industryName} industry. 
Color Palette: Clean whites, grays, with Excelsior Creative's signature orange (#FF5722) as an accent. 
No text overlays. 4K resolution, 16:9 aspect ratio.`;

  console.log(`Generating featured image for industry: ${industryName}`);

  const prediction = await withReplicateRetry(
    () =>
      replicate.predictions.create({
        model: model as any,
        input: {
          prompt,
          resolution: "2K",
          aspect_ratio: "16:9",
          output_format: "png",
          safety_filter_level: "block_only_high",
        },
      }),
    "generateIndustryFeaturedImage"
  );

  let finalPrediction = await replicate.predictions.get(prediction.id);
  while (
    finalPrediction.status === "starting" ||
    finalPrediction.status === "processing"
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    finalPrediction = await replicate.predictions.get(prediction.id);
  }

  if (finalPrediction.status !== "succeeded") {
    throw new Error(`Image generation failed: ${finalPrediction.error || "Unknown error"}`);
  }

  const output = finalPrediction.output;
  const imageUrl =
    typeof output === "object" && output !== null && "url" in output
      ? (output as { url: () => string }).url()
      : Array.isArray(output)
      ? output[0]
      : String(output);

  const predictTime = finalPrediction.metrics?.predict_time || 0;
  const cost = calculateReplicateCost(predictTime, model);

  return { url: imageUrl, style: "industry-hero", model, predictTime, cost };
}
