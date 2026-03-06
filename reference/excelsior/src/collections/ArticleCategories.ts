import type { CollectionConfig } from 'payload'

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly version (e.g., emergency-services)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'Zap (Emergency)', value: 'zap' },
        { label: 'Code', value: 'code' },
        { label: 'Wrench (Fixes)', value: 'wrench' },
        { label: 'Building', value: 'building' },
        { label: 'Globe', value: 'globe' },
        { label: 'Shield', value: 'shield' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        description: 'Display order (lower = first)',
      },
    },
  ],
}
