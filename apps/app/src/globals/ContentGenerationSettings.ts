import type { GlobalConfig } from 'payload'

export const ContentGenerationSettings: GlobalConfig = {
  slug: 'content-generation-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    // API Configuration
    {
      name: 'apiConfig',
      type: 'group',
      fields: [
        { name: 'baseUrl', type: 'text', label: 'API Base URL' },
        { name: 'apiKey', type: 'text', label: 'API Key' },
      ],
    },
    // Company Context
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
    // Keywords
    {
      name: 'keywords',
      type: 'array',
      fields: [{ name: 'keyword', type: 'text', required: true }],
    },
    // Prompt Templates
    {
      name: 'topicResearch',
      label: 'Post Topic Research',
      type: 'group',
      fields: [{ name: 'prompt', type: 'textarea' }],
    },
    {
      name: 'postGeneration',
      label: 'Post Content Generation',
      type: 'group',
      fields: [{ name: 'prompt', type: 'textarea' }],
    },
    // Image Styles
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
    // Infographic Settings
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

