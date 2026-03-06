import { Schema, Type } from "@google/genai";

export const TopicIdeaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Article title (compelling, 50-60 chars for SEO)",
    },
    angle: {
      type: Type.STRING,
      description: "The unique angle or hook for this article",
    },
    targetKeyword: {
      type: Type.STRING,
      description: "The primary keyword to target",
    },
    location: {
      type: Type.STRING,
      description: "The location to target (e.g., Orange County, Irvine, etc.)",
    },
    reasoning: {
      type: Type.STRING,
      description: "Brief explanation of why this topic will perform well",
    },
  },
  required: ["title", "angle", "targetKeyword", "location", "reasoning"],
};

export const GeneratedArticleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "SEO-optimized article title",
    },
    slug: {
      type: Type.STRING,
      description: "URL-friendly slug with keyword",
    },
    excerpt: {
      type: Type.STRING,
      description: "Compelling 150-160 char meta description",
    },
    content: {
      type: Type.STRING,
      description:
        "Full article in Markdown format with ## for H2 and ### for H3",
    },
    metaTitle: {
      type: Type.STRING,
      description: "SEO title tag (max 60 chars)",
    },
    metaDescription: {
      type: Type.STRING,
      description: "Meta description (max 160 chars)",
    },
    keywords: {
      type: Type.STRING,
      description: "comma, separated, relevant, keywords",
    },
  },
  required: [
    "title",
    "slug",
    "excerpt",
    "content",
    "metaTitle",
    "metaDescription",
    "keywords",
  ],
};

export const ArticleMetadataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "SEO-optimized article title",
    },
    slug: {
      type: Type.STRING,
      description: "URL-friendly slug with keyword",
    },
    excerpt: {
      type: Type.STRING,
      description: "Compelling 150-160 char meta description",
    },
    content: {
      type: Type.STRING,
      description: "Should be exactly '[CONTENT_PLACEHOLDER]'",
    },
    metaTitle: {
      type: Type.STRING,
      description: "SEO title tag (max 60 chars)",
    },
    metaDescription: {
      type: Type.STRING,
      description: "Meta description (max 160 chars)",
    },
    keywords: {
      type: Type.STRING,
      description: "comma, separated, relevant, keywords",
    },
  },
  required: [
    "title",
    "slug",
    "excerpt",
    "content",
    "metaTitle",
    "metaDescription",
    "keywords",
  ],
};

export const InfographicDataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: "Short, impactful headline (max 8 words)",
    },
    problemStatement: {
      type: Type.STRING,
      description: "The core problem this article solves (1 sentence)",
    },
    statistics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          value: { type: Type.STRING, description: "e.g., '43%' or '$5,600'" },
          label: {
            type: Type.STRING,
            description: "Brief description of the stat",
          },
          source: { type: Type.STRING, description: "Source of the statistic" },
        },
        required: ["value", "label"],
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          title: { type: Type.STRING },
          description: {
            type: Type.STRING,
            description: "Brief 5-7 word description",
          },
        },
        required: ["number", "title", "description"],
      },
    },
    proTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    callToAction: {
      type: Type.STRING,
      description: "Short CTA like 'Get Expert Help Today'",
    },
  },
  required: [
    "headline",
    "problemStatement",
    "statistics",
    "steps",
    "proTips",
    "callToAction",
  ],
};

export const ArticleOutlineSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    slug: { type: Type.STRING },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          heading: { type: Type.STRING },
          subheadings: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          targetWords: { type: Type.INTEGER },
        },
        required: ["heading", "subheadings", "keyPoints", "targetWords"],
      },
    },
    totalEstimatedWords: { type: Type.INTEGER },
  },
  required: ["title", "slug", "sections", "totalEstimatedWords"],
};

export const IndustryContextSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Target audience personas for this industry",
    },
    challenges: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Common business challenges in this industry",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Relevant keywords for SEO in this industry",
    },
    insights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Competitive landscape insights",
    },
  },
  required: ["personas", "challenges", "keywords", "insights"],
};

export const IndustryPageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hero: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        tagline: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["headline", "tagline", "description"],
    },
    painPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          icon: { type: Type.STRING, description: "Lucide icon name" },
        },
        required: ["title", "description", "icon"],
      },
    },
    services: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          serviceTitle: { type: Type.STRING },
          industrySpecificBenefit: { type: Type.STRING },
        },
        required: ["serviceTitle", "industrySpecificBenefit"],
      },
    },
    process: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["stepNumber", "title", "description"],
      },
    },
    statistics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          value: { type: Type.STRING },
          label: { type: Type.STRING },
          source: { type: Type.STRING },
        },
        required: ["value", "label"],
      },
    },
    faqs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["question", "answer"],
      },
    },
    cta: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["title", "description"],
    },
    seo: {
      type: Type.OBJECT,
      properties: {
        metaTitle: { type: Type.STRING },
        metaDescription: { type: Type.STRING },
        keywords: { type: Type.STRING },
      },
      required: ["metaTitle", "metaDescription", "keywords"],
    },
  },
  required: [
    "hero",
    "painPoints",
    "services",
    "process",
    "statistics",
    "faqs",
    "cta",
    "seo",
  ],
};
