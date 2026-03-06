import type { CollectionConfig } from "payload";

export const IndustryLandingPages: CollectionConfig = {
  slug: "industry-landing-pages",
  admin: {
    useAsTitle: "industryName",
    defaultColumns: ["industryName", "slug", "updatedAt"],
    group: "Content",
  },
  fields: [
    {
      name: "industryName",
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
        description: "URL path (e.g., dental, real-estate)",
      },
    },
    {
      name: "hero",
      type: "group",
      fields: [
        {
          name: "headline",
          type: "text",
          required: true,
        },
        {
          name: "tagline",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "painPoints",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
        },
        {
          name: "icon",
          type: "text",
          admin: {
            description: "Lucide icon name",
          },
        },
      ],
    },
    {
      name: "services",
      type: "array",
      fields: [
        {
          name: "serviceTitle",
          type: "text",
          required: true,
        },
        {
          name: "industrySpecificBenefit",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "process",
      type: "array",
      fields: [
        {
          name: "stepNumber",
          type: "text",
          required: true,
        },
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "statistics",
      type: "array",
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
        },
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "source",
          type: "text",
        },
      ],
    },
    {
      name: "faqs",
      type: "array",
      fields: [
        {
          name: "question",
          type: "text",
          required: true,
        },
        {
          name: "answer",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "infographic",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "AI-generated infographic for this industry",
      },
    },
    {
      name: "seo",
      type: "group",
      label: "SEO Settings",
      fields: [
        {
          name: "metaTitle",
          type: "text",
        },
        {
          name: "metaDescription",
          type: "textarea",
        },
        {
          name: "keywords",
          type: "text",
        },
      ],
    },
    {
      name: "generationCosts",
      type: "group",
      label: "AI Generation Costs",
      admin: {
        condition: (data) => data?.generationCosts?.totalCost !== undefined,
      },
      fields: [
        {
          name: "industryResearch",
          type: "group",
          fields: [
            { name: "inputTokens", type: "number" },
            { name: "outputTokens", type: "number" },
            { name: "cost", type: "number" },
          ],
        },
        {
          name: "contentGeneration",
          type: "group",
          fields: [
            { name: "inputTokens", type: "number" },
            { name: "outputTokens", type: "number" },
            { name: "cost", type: "number" },
          ],
        },
        {
          name: "featuredImage",
          type: "group",
          fields: [
            { name: "model", type: "text" },
            { name: "predictTime", type: "number" },
            { name: "cost", type: "number" },
          ],
        },
        {
          name: "infographicData",
          type: "group",
          fields: [
            { name: "inputTokens", type: "number" },
            { name: "outputTokens", type: "number" },
            { name: "cost", type: "number" },
          ],
        },
        {
          name: "infographicImage",
          type: "group",
          fields: [
            { name: "model", type: "text" },
            { name: "predictTime", type: "number" },
            { name: "cost", type: "number" },
          ],
        },
        {
          name: "totalCost",
          type: "number",
        },
        {
          name: "generatedAt",
          type: "date",
        },
      ],
    },
  ],
};

