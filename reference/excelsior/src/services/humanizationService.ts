/**
 * Humanization Service
 *
 * Post-processes AI-generated content to make it appear more human-written.
 * Removes obvious AI patterns and adds natural variations.
 */

type HumanizationLevel = "conservative" | "moderate";

/**
 * AI patterns to remove or replace.
 * Format: [pattern, replacement, probability]
 */
const AI_PATTERNS: Array<[RegExp, string | ((match: string) => string), number]> = [
  // Em-dash overuse (very common AI tell)
  [/\s*--\s*/g, ", ", 1.0],
  [/\s*—\s*/g, ", ", 0.8],

  // Overused AI transition phrases
  [/\bIn today's digital landscape,?\s*/gi, "", 1.0],
  [/\bIn today's fast-paced world,?\s*/gi, "", 1.0],
  [/\bIn this article,?\s*(we will|we'll|I will|I'll)\s*/gi, "We'll ", 1.0],
  [/\bLet's dive in\.?\s*/gi, "", 1.0],
  [/\bLet's get started\.?\s*/gi, "", 1.0],
  [/\bWithout further ado,?\s*/gi, "", 1.0],

  // Overly formal transitions
  [/\bFurthermore,\s*/gi, () => randomChoice(["Also, ", "Plus, ", "And "]), 0.9],
  [/\bAdditionally,\s*/gi, () => randomChoice(["Also, ", "Plus, ", ""]), 0.9],
  [/\bMoreover,\s*/gi, () => randomChoice(["Also, ", "And ", ""]), 0.9],
  [/\bConsequently,\s*/gi, () => randomChoice(["So, ", "As a result, "]), 0.9],
  [/\bNevertheless,\s*/gi, () => randomChoice(["Still, ", "But ", "Even so, "]), 0.9],
  [/\bIn conclusion,\s*/gi, () => randomChoice(["So, ", "Bottom line: ", ""]), 0.9],
  [/\bTo summarize,\s*/gi, () => randomChoice(["So, ", "In short, ", ""]), 0.9],

  // Filler phrases
  [/\bIt's important to note that\s*/gi, "", 1.0],
  [/\bIt's worth noting that\s*/gi, "", 1.0],
  [/\bIt should be noted that\s*/gi, "", 1.0],
  [/\bIt goes without saying that\s*/gi, "", 1.0],
  [/\bNeedless to say,?\s*/gi, "", 1.0],
  [/\bAs mentioned earlier,?\s*/gi, "", 0.8],
  [/\bAs we discussed,?\s*/gi, "", 0.8],

  // Overly formal words
  [/\butilize\b/gi, "use", 1.0],
  [/\butilizing\b/gi, "using", 1.0],
  [/\butilization\b/gi, "use", 1.0],
  [/\bleverage\b/gi, () => randomChoice(["use", "take advantage of"]), 0.9],
  [/\bleveraging\b/gi, () => randomChoice(["using", "taking advantage of"]), 0.9],
  [/\bfacilitate\b/gi, "help", 0.9],
  [/\bfacilitating\b/gi, "helping", 0.9],
  [/\bcommence\b/gi, "start", 1.0],
  [/\bcommencing\b/gi, "starting", 1.0],
  [/\bpurchase\b/gi, "buy", 0.7],
  [/\bpurchasing\b/gi, "buying", 0.7],
  [/\bprocure\b/gi, "get", 1.0],
  [/\bascertain\b/gi, "find out", 1.0],
  [/\bsubsequently\b/gi, "then", 0.9],
  [/\bprior to\b/gi, "before", 0.9],
  [/\bin order to\b/gi, "to", 0.9],
  [/\bdue to the fact that\b/gi, "because", 1.0],
  [/\bat this point in time\b/gi, "now", 1.0],
  [/\bin the event that\b/gi, "if", 1.0],

  // AI enthusiasm markers
  [/\bAbsolutely!\s*/gi, "", 0.9],
  [/\bGreat question!\s*/gi, "", 1.0],
  [/\bThat's a great point!\s*/gi, "", 1.0],
];

/**
 * Contraction patterns for more natural writing.
 * Applied with 80% probability to maintain some variation.
 */
const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bdo not\b/gi, "don't"],
  [/\bdoes not\b/gi, "doesn't"],
  [/\bdid not\b/gi, "didn't"],
  [/\bwill not\b/gi, "won't"],
  [/\bwould not\b/gi, "wouldn't"],
  [/\bcould not\b/gi, "couldn't"],
  [/\bshould not\b/gi, "shouldn't"],
  [/\bcan not\b/gi, "can't"],
  [/\bcannot\b/gi, "can't"],
  [/\bis not\b/gi, "isn't"],
  [/\bare not\b/gi, "aren't"],
  [/\bwas not\b/gi, "wasn't"],
  [/\bwere not\b/gi, "weren't"],
  [/\bhas not\b/gi, "hasn't"],
  [/\bhave not\b/gi, "haven't"],
  [/\bhad not\b/gi, "hadn't"],
  [/\bit is\b/gi, "it's"],
  [/\bthat is\b/gi, "that's"],
  [/\bwhat is\b/gi, "what's"],
  [/\bwho is\b/gi, "who's"],
  [/\bwhere is\b/gi, "where's"],
  [/\bthere is\b/gi, "there's"],
  [/\bhere is\b/gi, "here's"],
  [/\blet us\b/gi, "let's"],
  [/\bI am\b/g, "I'm"], // Case sensitive for I
  [/\bI have\b/g, "I've"],
  [/\bI will\b/g, "I'll"],
  [/\bI would\b/g, "I'd"],
  [/\bwe are\b/gi, "we're"],
  [/\bwe have\b/gi, "we've"],
  [/\bwe will\b/gi, "we'll"],
  [/\bthey are\b/gi, "they're"],
  [/\bthey have\b/gi, "they've"],
  [/\bthey will\b/gi, "they'll"],
  [/\byou are\b/gi, "you're"],
  [/\byou have\b/gi, "you've"],
  [/\byou will\b/gi, "you'll"],
];

/**
 * Humanize content by removing AI patterns and adding natural variations.
 */
export function humanizeContent(
  markdown: string,
  level: HumanizationLevel = "moderate"
): string {
  let result = markdown;

  // Step 1: Remove/replace AI patterns
  for (const [pattern, replacement, probability] of AI_PATTERNS) {
    if (Math.random() < probability) {
      result = result.replace(pattern, (match) => {
        if (typeof replacement === "function") {
          return replacement(match);
        }
        return replacement;
      });
    }
  }

  // Step 2: Apply contractions (moderate level only)
  if (level === "moderate") {
    for (const [pattern, replacement] of CONTRACTIONS) {
      // 80% chance to apply each contraction for variation
      if (Math.random() < 0.8) {
        result = result.replace(pattern, replacement);
      }
    }
  }

  // Step 3: Clean up artifacts
  result = cleanupArtifacts(result);

  // Step 4: Add natural variations (moderate level only)
  if (level === "moderate") {
    result = addNaturalVariations(result);
  }

  return result;
}

/**
 * Clean up common artifacts from AI text.
 */
function cleanupArtifacts(text: string): string {
  let result = text;

  // Fix double spaces
  result = result.replace(/  +/g, " ");

  // Fix space before punctuation
  result = result.replace(/\s+([.,;:!?])/g, "$1");

  // Fix multiple newlines (more than 2)
  result = result.replace(/\n{3,}/g, "\n\n");

  // Fix sentence starting with lowercase after period
  result = result.replace(/\.\s+([a-z])/g, (_, letter) => `. ${letter.toUpperCase()}`);

  // Remove trailing spaces on lines
  result = result.replace(/[ \t]+$/gm, "");

  // Fix comma splice before "and" in some cases (reduce over-punctuation)
  result = result.replace(/,\s*and\s+/gi, (match) => {
    return Math.random() < 0.3 ? " and " : match;
  });

  return result;
}

/**
 * Add natural variations to make text feel more human.
 */
function addNaturalVariations(text: string): string {
  let result = text;

  // Occasionally start sentences with "And" or "But" (5% chance per paragraph)
  const paragraphs = result.split(/\n\n/);
  const modifiedParagraphs = paragraphs.map((para) => {
    if (Math.random() < 0.05 && para.length > 100) {
      // Find a sentence that starts with "However" or similar and could be "But"
      para = para.replace(
        /(?<=\. )However,/,
        Math.random() < 0.5 ? "But" : "However,"
      );
    }
    return para;
  });
  result = modifiedParagraphs.join("\n\n");

  // Occasionally add casual connectors (very sparingly)
  if (Math.random() < 0.1) {
    const casualPhrases = [
      "Look, ",
      "Here's the thing: ",
      "Honestly, ",
      "The truth is, ",
    ];
    // Find a good spot (start of a paragraph that's making a point)
    result = result.replace(
      /\n\n([A-Z][^.]+important|[A-Z][^.]+key|[A-Z][^.]+critical)/,
      (match, sentence) => {
        const phrase = randomChoice(casualPhrases);
        return `\n\n${phrase}${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
      }
    );
  }

  return result;
}

/**
 * Helper to pick a random item from an array.
 */
function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Get statistics about humanization changes for logging.
 */
export function getHumanizationStats(
  original: string,
  humanized: string
): {
  originalLength: number;
  humanizedLength: number;
  contractionCount: number;
  patternReplacements: number;
} {
  const originalLength = original.length;
  const humanizedLength = humanized.length;

  // Count contractions in humanized
  const contractionPattern = /\b(don't|doesn't|didn't|won't|wouldn't|couldn't|shouldn't|can't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|it's|that's|what's|who's|where's|there's|here's|let's|I'm|I've|I'll|I'd|we're|we've|we'll|they're|they've|they'll|you're|you've|you'll)\b/gi;
  const contractionCount = (humanized.match(contractionPattern) || []).length;

  // Estimate pattern replacements by length difference and known patterns
  const patternReplacements = Math.abs(originalLength - humanizedLength) > 50 
    ? Math.floor(Math.abs(originalLength - humanizedLength) / 20)
    : 0;

  return {
    originalLength,
    humanizedLength,
    contractionCount,
    patternReplacements,
  };
}

