# Configuration Guide

This skill can be customized for different websites and brands by modifying the configuration settings.

## SEO Keywords Structure
Organize keywords by category to help Gemini select relevant topics.

```typescript
export type KeywordCategory = "emergency" | "development" | "fixes" | "local";

export const seoKeywords = [
  { keyword: "Emergency website repair", category: "emergency", location: "Orange County" },
  // ... more keywords
];
```

## Prompt Templates
Customize the voice and style of the generation by updating the prompts in the `content-generation-settings` global.

### Topic Research Prompt
```text
Analyze these target keywords and identify ONE compelling article topic...
TARGET KEYWORDS: {{keywordList}}
```

### Article Generation Prompt
```text
You are an expert content writer for [Your Brand Name]. 
TOPIC: {{title}}
ANGLE: {{angle}}
...
```

## Image Styles
Define multiple styles for featured images to ensure variety.

```typescript
featuredImageStyles: [
  {
    name: "illustration",
    model: "google/nano-banana-pro",
    prompt: "Modern editorial illustration, tech aesthetic, [Brand Color] accent. No text."
  },
  {
    name: "photorealistic",
    model: "google/nano-banana-pro",
    prompt: "Professional photograph of a modern office environment..."
  }
]
```

## Humanization Settings
Adjust the `humanizeContent` function to match your brand's desired level of formality.
*   **Conservative**: Minimal changes, mostly removing AI filler.
*   **Moderate**: More aggressive changes, applying contractions and casual connectors.

