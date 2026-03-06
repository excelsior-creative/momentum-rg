import { getPayload, Where } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

// Get Payload instance (server-side only)
export async function getPayloadClient() {
  return getPayload({ config })
}

// Fetch all projects (cached across requests)
export const getProjects = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'projects',
      sort: 'order',
      limit: 100,
      select: {
        title: true,
        slug: true,
        category: true,
        filterCategory: true,
        image: true,
        imagePath: true,
        link: true,
      }
    })
    return docs
  },
  ['projects-all'],
  { revalidate: 3600, tags: ['projects'] }
)

// Fetch featured projects (cached across requests)
export const getFeaturedProjects = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'projects',
      where: {
        featured: { equals: true },
      },
      sort: 'order',
      limit: 10,
      select: {
        title: true,
        slug: true,
        category: true,
        image: true,
        imagePath: true,
      }
    })
    return docs
  },
  ['projects-featured'],
  { revalidate: 3600, tags: ['projects'] }
)

// Fetch single project by slug (cached across requests)
export const getProjectBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'projects',
        where: {
          slug: { equals: slug },
        },
        limit: 1,
      })
      return docs[0] || null
    },
    [`project-${slug}`],
    { revalidate: 3600, tags: ['projects', `project-${slug}`] }
  )()
})

// Fetch all article categories (cached across requests)
export const getArticleCategories = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'article-categories',
      sort: 'order',
      limit: 100,
      select: {
        name: true,
        slug: true,
        icon: true,
      }
    })
    return docs
  },
  ['article-categories'],
  { revalidate: 3600, tags: ['article-categories'] }
)

// Fetch single category by slug (cached across requests)
export const getArticleCategoryBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'article-categories',
        where: {
          slug: { equals: slug },
        },
        limit: 1,
      })
      return docs[0] || null
    },
    [`category-${slug}`],
    { revalidate: 3600, tags: ['article-categories'] }
  )()
})

// Fetch all published articles (cached with revalidation)
export async function getArticles(options?: {
  category?: string
  limit?: number
  featured?: boolean
}) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const where: Where = {
        status: { equals: 'published' },
      }

      if (options?.featured) {
        where.featured = { equals: true }
      }

      const { docs } = await payload.find({
        collection: 'articles',
        where,
        sort: '-publishedAt',
        limit: options?.limit || 100,
        depth: 1,
      })

      // Filter by category slug if provided
      if (options?.category) {
        return docs.filter((article) => {
          const category = article.category
          return typeof category === 'object' && category?.slug === options.category
        })
      }

      return docs
    },
    ['articles', JSON.stringify(options || {})],
    { revalidate: 3600, tags: ['articles'] }
  )()
}

// Fetch single article by slug (cached)
export const getArticleBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'articles',
        where: {
          slug: { equals: slug },
          status: { equals: 'published' },
        },
        depth: 1,
        limit: 1,
      })
      return docs[0] || null
    },
    [`article-${slug}`],
    { revalidate: 3600, tags: ['articles', `article-${slug}`] }
  )()
})

// Fetch all article tags (cached across requests)
export const getArticleTags = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'article-tags',
      sort: 'name',
      limit: 100,
      select: {
        name: true,
        slug: true,
        color: true,
      }
    })
    return docs
  },
  ['article-tags'],
  { revalidate: 3600, tags: ['article-tags'] }
)

// Fetch all industry landing pages (cached)
export const getIndustryLandingPages = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'industry-landing-pages',
      sort: 'industryName',
      limit: 200, // Fetch all for landing page filtering
      depth: 1,
      select: {
        industryName: true,
        slug: true,
        hero: true,
        featuredImage: true,
      }
    })
    return docs
  },
  ['industry-landing-pages-all'],
  { revalidate: 3600, tags: ['industry-landing-pages'] }
)
