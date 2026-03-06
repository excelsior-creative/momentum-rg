import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'Display category (e.g., "Social Impact", "Aerospace & Engineering")',
      },
    },
    {
      name: 'filterCategory',
      type: 'select',
      required: true,
      options: [
        { label: 'Nonprofit', value: 'nonprofit' },
        { label: 'Professional', value: 'professional' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Uploaded project image',
      },
    },
    {
      name: 'imagePath',
      type: 'text',
      admin: {
        description: 'Static path to image (e.g., /work/zero-abuse.jpg). Used if image is not uploaded.',
      },
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'External website URL',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Brief summary of the organization and what they do (2-3 sentences)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed article-style write-up about the organization (2-3 paragraphs)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for categorization (e.g., Healthcare, Education)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'Show this project prominently',
      },
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
    // Project Details (for future project detail pages)
    {
      name: 'client',
      type: 'text',
    },
    {
      name: 'year',
      type: 'text',
    },
    {
      name: 'challenge',
      type: 'richText',
      admin: {
        description: 'The challenge or problem we solved',
      },
    },
    {
      name: 'solution',
      type: 'richText',
      admin: {
        description: 'Our approach and solution',
      },
    },
    {
      name: 'results',
      type: 'array',
      fields: [
        {
          name: 'metric',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'testimonial',
      type: 'group',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
        },
        {
          name: 'author',
          type: 'text',
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}

