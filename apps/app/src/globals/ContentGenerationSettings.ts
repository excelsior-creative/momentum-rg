import type { GlobalConfig } from 'payload'

export const ContentGenerationSettings: GlobalConfig = {
  slug: 'content-generation-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'apiConfig',
      type: 'group',
      fields: [
        { name: 'baseUrl', type: 'text', label: 'API Base URL' },
        { name: 'apiKey', type: 'text', label: 'API Key' },
      ],
    },
    {
      name: 'companyContext',
      type: 'group',
      fields: [
        { name: 'companyName', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'expertise', type: 'textarea' },
        { name: 'primaryColor', type: 'text' },
        { name: 'secondaryColor', type: 'text' },
      ],
    },
    {
      name: 'operations',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Master switch for the automated article pipeline.',
          },
        },
        {
          name: 'cadenceHours',
          type: 'number',
          defaultValue: 72,
          required: true,
          admin: {
            description: 'Minimum time between successful auto-published articles.',
          },
        },
        {
          name: 'qualityThreshold',
          type: 'number',
          defaultValue: 70,
          required: true,
          admin: {
            description: 'Minimum topic score required before the pipeline will publish.',
          },
        },
        {
          name: 'maxResearchSeeds',
          type: 'number',
          defaultValue: 8,
          required: true,
        },
        {
          name: 'maxTopicCandidates',
          type: 'number',
          defaultValue: 24,
          required: true,
        },
        {
          name: 'systemAuthorEmail',
          type: 'text',
          admin: {
            description: 'Optional dedicated Payload user email for generated posts.',
          },
        },
      ],
    },
    {
      name: 'keywords',
      type: 'array',
      admin: {
        description: 'Seed keywords and problem statements used to build live research queries.',
      },
      fields: [{ name: 'keyword', type: 'text', required: true }],
    },
    {
      name: 'targetGeographies',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'audienceSegments',
      type: 'array',
      fields: [{ name: 'audience', type: 'text', required: true }],
    },
    {
      name: 'bannedTopics',
      type: 'array',
      fields: [{ name: 'topic', type: 'text', required: true }],
    },
    {
      name: 'manualTopicQueue',
      type: 'array',
      admin: {
        description: 'Optional queue of hand-picked topics. The next available entry is consumed before live research.',
      },
      fields: [
        { name: 'primaryKeyword', type: 'text', required: true },
        { name: 'geography', type: 'text' },
        { name: 'audience', type: 'text' },
        { name: 'angle', type: 'textarea' },
      ],
    },
    {
      name: 'topicResearch',
      label: 'Post Topic Research',
      type: 'group',
      fields: [
        {
          name: 'provider',
          type: 'select',
          defaultValue: 'serpapi',
          options: [
            { label: 'SerpApi', value: 'serpapi' },
          ],
        },
        { name: 'prompt', type: 'textarea' },
      ],
    },
    {
      name: 'postGeneration',
      label: 'Post Content Generation',
      type: 'group',
      fields: [{ name: 'prompt', type: 'textarea' }],
    },
    {
      name: 'featuredImageStyles',
      label: 'Post Featured Image Styles',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'model', type: 'text' },
        { name: 'prompt', type: 'textarea', admin: { description: 'Prompt for the post featured image' } },
      ],
    },
    {
      name: 'infographic',
      label: 'Post Infographic Settings',
      type: 'group',
      fields: [
        { name: 'dataExtractionPrompt', type: 'textarea', admin: { description: 'Prompt to extract infographic data from the generated post' } },
        { name: 'imageGenerationPrompt', type: 'textarea', admin: { description: 'Prompt to generate the infographic image for the post' } },
      ],
    },
  ],
}

