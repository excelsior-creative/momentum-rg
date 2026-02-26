import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'publishedDate'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500, // 1.5 seconds
      },
    },
    maxPerDoc: 25,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true // Authenticated sees drafts
      return { _status: { equals: 'published' } } // Public sees published only
    },
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data.slug) {
          return {
            ...data,
            slug: slugify(data.title, { lower: true, strict: true }),
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        // Trigger revalidation when post is published or updated while published
        if (doc._status === 'published') {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
          const secret = process.env.REVALIDATION_SECRET

          if (!siteUrl || !secret) {
            console.warn('Revalidation skipped: missing NEXT_PUBLIC_SITE_URL or REVALIDATION_SECRET')
            return doc
          }

          try {
            const res = await fetch(`${siteUrl}/api/revalidate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                secret,
                tag: 'posts',
                paths: [`/blog/${doc.slug}`, '/blog'],
              }),
            })

            if (!res.ok) {
              console.error('Revalidation failed:', await res.text())
            } else {
              console.log(`Revalidated: /blog/${doc.slug} and /blog`)
            }
          } catch (err) {
            console.error('Revalidation request failed:', err)
          }
        }
        return doc
      },
    ],
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'infographic',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional infographic image for this post',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
