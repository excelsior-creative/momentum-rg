import type { CollectionConfig } from 'payload'

export const ContentGenerationRuns: CollectionConfig = {
  slug: 'content-generation-runs',
  admin: {
    useAsTitle: 'topicTitle',
    defaultColumns: ['topicTitle', 'status', 'primaryKeyword', 'startedAt', 'completedAt'],
    group: 'Automation',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'queued',
      options: [
        { label: 'Queued', value: 'queued' },
        { label: 'Skipped', value: 'skipped' },
        { label: 'Generating', value: 'generating' },
        { label: 'Published', value: 'published' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'triggerSource',
      type: 'select',
      required: true,
      defaultValue: 'cron',
      options: [
        { label: 'Cron', value: 'cron' },
        { label: 'Manual', value: 'manual' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'fingerprint',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Stable dedupe key for the selected topic brief',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'topicTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'topicQuery',
      type: 'text',
    },
    {
      name: 'primaryKeyword',
      type: 'text',
    },
    {
      name: 'secondaryKeywords',
      type: 'array',
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'geoTarget',
      type: 'text',
    },
    {
      name: 'audienceSegment',
      type: 'text',
    },
    {
      name: 'searchIntent',
      type: 'text',
    },
    {
      name: 'topicScore',
      type: 'number',
    },
    {
      name: 'skipReason',
      type: 'textarea',
    },
    {
      name: 'errorMessage',
      type: 'textarea',
    },
    {
      name: 'providerData',
      type: 'json',
    },
    {
      name: 'models',
      type: 'group',
      fields: [
        {
          name: 'researchProvider',
          type: 'text',
        },
        {
          name: 'textModel',
          type: 'text',
        },
        {
          name: 'imageModel',
          type: 'text',
        },
      ],
    },
    {
      name: 'costs',
      type: 'group',
      fields: [
        {
          name: 'candidateCount',
          type: 'number',
        },
        {
          name: 'estimatedInputTokens',
          type: 'number',
        },
        {
          name: 'estimatedOutputTokens',
          type: 'number',
        },
      ],
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
