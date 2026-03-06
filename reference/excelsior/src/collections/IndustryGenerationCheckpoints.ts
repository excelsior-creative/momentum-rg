import type { CollectionConfig } from "payload";

export const IndustryGenerationCheckpoints: CollectionConfig = {
  slug: "industry-generation-checkpoints",
  admin: {
    group: "System",
    description: "Tracks in-progress industry page generations for recovery",
    useAsTitle: "generationId",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "generationId",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "industryName",
      type: "text",
      required: true,
    },
    {
      name: "stage",
      type: "select",
      defaultValue: "context",
      options: [
        { label: "Context Research", value: "context" },
        { label: "Page Content", value: "content" },
        { label: "Infographic Data", value: "infographic" },
        { label: "Images", value: "images" },
        { label: "Upload", value: "upload" },
        { label: "Create", value: "create" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "in_progress",
      options: [
        { label: "In Progress", value: "in_progress" },
        { label: "Failed", value: "failed" },
        { label: "Completed", value: "completed" },
      ],
    },
    {
      name: "context",
      type: "json",
    },
    {
      name: "pageData",
      type: "json",
    },
    {
      name: "infographicData",
      type: "json",
    },
    {
      name: "imageResult",
      type: "json",
    },
    {
      name: "uploadedMedia",
      type: "json",
    },
    {
      name: "costs",
      type: "json",
    },
    {
      name: "options",
      type: "json",
    },
    {
      name: "errorMessage",
      type: "text",
    },
    {
      name: "startedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: "lastUpdatedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

