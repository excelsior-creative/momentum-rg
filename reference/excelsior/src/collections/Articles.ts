import type { CollectionConfig } from "payload";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishedAt", "updatedAt"],
    group: "Content",
  },
  fields: [
    // Core Content
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL path (e.g., emergency-website-repair-guide)",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      index: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      index: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "Publication date (used for sorting and display)",
      },
    },

    // Category & Relations
    {
      name: "category",
      type: "relationship",
      relationTo: "article-categories",
      required: true,
      index: true,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "article-tags",
      hasMany: true,
      index: true,
      admin: {
        description: "Tags for filtering and categorization",
      },
    },
    // Featured Image
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "imageStyle",
      type: "select",
      options: [
        { label: "Illustration", value: "illustration" },
        { label: "Photorealistic People", value: "photorealistic-people" },
        { label: "Photorealistic Abstract", value: "photorealistic-abstract" },
        { label: "Tech Minimal", value: "tech-minimal" },
      ],
      admin: {
        description: "The style used for the AI-generated featured image",
      },
    },
    {
      name: "infographic",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "AI-generated infographic for the article",
      },
    },

    // Content
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: {
        description: "Short summary for article cards and SEO (max 160 chars)",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },

    // SEO Meta
    {
      name: "seo",
      type: "group",
      label: "SEO Settings",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          admin: {
            description:
              "SEO title (defaults to article title if empty). Max 60 chars.",
          },
        },
        {
          name: "metaDescription",
          type: "textarea",
          admin: {
            description: "SEO meta description. Max 160 chars.",
          },
        },
        {
          name: "keywords",
          type: "text",
          admin: {
            description: "Comma-separated keywords for this article",
          },
        },
        {
          name: "canonicalUrl",
          type: "text",
          admin: {
            description: "Canonical URL if different from default",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Open Graph image (defaults to featured image)",
          },
        },
        {
          name: "noIndex",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Hide from search engines",
          },
        },
      ],
    },

    // Structured Data
    {
      name: "structuredData",
      type: "group",
      admin: {
        description: "For JSON-LD schema markup",
      },
      fields: [
        {
          name: "articleType",
          type: "select",
          defaultValue: "Article",
          options: [
            { label: "Article", value: "Article" },
            { label: "Blog Posting", value: "BlogPosting" },
            { label: "News Article", value: "NewsArticle" },
            { label: "How To", value: "HowTo" },
          ],
        },
        {
          name: "author",
          type: "text",
          defaultValue: "Excelsior Creative Team",
        },
      ],
    },

    // Display Options
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: {
        description: "Feature this article prominently",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Display order for featured articles",
      },
    },

    // AI Generation Costs
    {
      name: "generationCosts",
      type: "group",
      label: "AI Generation Costs",
      admin: {
        description: "Tracks the cost of AI-generated content for this article",
        condition: (data) => data?.generationCosts?.totalCost !== undefined,
      },
      fields: [
        {
          name: "topicResearch",
          type: "group",
          label: "Topic Research (Gemini Flash)",
          fields: [
            { name: "inputTokens", type: "number", admin: { readOnly: true } },
            { name: "outputTokens", type: "number", admin: { readOnly: true } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "topicParsing",
          type: "group",
          label: "Topic Parsing (Gemini Flash)",
          fields: [
            { name: "inputTokens", type: "number", admin: { readOnly: true } },
            { name: "outputTokens", type: "number", admin: { readOnly: true } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "outlineGeneration",
          type: "group",
          label: "Outline Generation (Gemini Flash)",
          fields: [
            { name: "inputTokens", type: "number", admin: { readOnly: true } },
            { name: "outputTokens", type: "number", admin: { readOnly: true } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "sectionGeneration",
          type: "array",
          label: "Section Generation (Gemini Pro)",
          fields: [
            { name: "section", type: "text", admin: { readOnly: true } },
            { name: "inputTokens", type: "number", admin: { readOnly: true } },
            { name: "outputTokens", type: "number", admin: { readOnly: true } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "composition",
          type: "group",
          label: "Article Composition (Gemini Flash)",
          fields: [
            { name: "inputTokens", type: "number", admin: { readOnly: true } },
            { name: "outputTokens", type: "number", admin: { readOnly: true } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "articleGeneration",
          type: "group",
          label: "Article Generation (Gemini Pro)",
          fields: [
            { name: "inputTokens", type: "number", admin: { readOnly: true } },
            { name: "outputTokens", type: "number", admin: { readOnly: true } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "infographicData",
          type: "group",
          label: "Infographic Data (Gemini Flash)",
          fields: [
            { name: "inputTokens", type: "number", admin: { readOnly: true } },
            { name: "outputTokens", type: "number", admin: { readOnly: true } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "featuredImage",
          type: "group",
          label: "Featured Image (Replicate)",
          fields: [
            { name: "model", type: "text", admin: { readOnly: true } },
            { name: "predictTime", type: "number", admin: { readOnly: true, description: "GPU seconds" } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "infographicImage",
          type: "group",
          label: "Infographic Image (Replicate)",
          fields: [
            { name: "model", type: "text", admin: { readOnly: true } },
            { name: "predictTime", type: "number", admin: { readOnly: true, description: "GPU seconds" } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "inlineImages",
          type: "array",
          label: "Inline Images (Replicate)",
          fields: [
            { name: "context", type: "text", admin: { readOnly: true } },
            { name: "model", type: "text", admin: { readOnly: true } },
            { name: "predictTime", type: "number", admin: { readOnly: true, description: "GPU seconds" } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "additionalInfographics",
          type: "array",
          label: "Additional Infographics (Replicate)",
          fields: [
            { name: "headline", type: "text", admin: { readOnly: true } },
            { name: "model", type: "text", admin: { readOnly: true } },
            { name: "predictTime", type: "number", admin: { readOnly: true, description: "GPU seconds" } },
            { name: "cost", type: "number", admin: { readOnly: true, description: "Cost in USD" } },
          ],
        },
        {
          name: "totalCost",
          type: "number",
          admin: {
            readOnly: true,
            description: "Total generation cost in USD",
          },
        },
        {
          name: "generatedAt",
          type: "date",
          admin: {
            readOnly: true,
            description: "When this article was generated",
          },
        },
      ],
    },
  ],
};
