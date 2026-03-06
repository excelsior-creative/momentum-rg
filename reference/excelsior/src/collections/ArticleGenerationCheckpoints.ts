import type { CollectionConfig } from "payload";

export const ArticleGenerationCheckpoints: CollectionConfig = {
  slug: "article-generation-checkpoints",
  admin: {
    group: "System",
    description: "Tracks in-progress article generations for recovery",
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
      name: "stage",
      type: "select",
      defaultValue: "topic",
      options: [
        { label: "Topic", value: "topic" },
        { label: "Content", value: "content" },
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
      name: "topic",
      type: "json",
    },
    {
      name: "article",
      type: "json",
    },
    {
      name: "articleId",
      type: "relationship",
      relationTo: "articles",
      admin: {
        description: "The ID of the draft article created from this generation",
      },
    },
    {
      name: "infographicData",
      type: "json",
    },
    {
      name: "imageResults",
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
