import { getArticles, getArticleCategories, getArticleTags } from '@/lib/payload'
import ArticlesPageContent from '@/components/ArticlesPageContent'
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

// Revalidate page every 60 seconds
export const revalidate = 60

export const metadata: Metadata = generatePageMetadata({
  title: 'Articles - Web Development Insights',
  description: 'Expert insights on web development, emergency website repair, and digital solutions for Orange County businesses. Stay informed with the latest trends and solutions.',
  path: '/articles',
  keywords: [
    'web development articles',
    'software engineering insights',
    'website tips',
    'digital solutions blog',
    'tech industry insights',
  ],
})

export default async function ArticlesPage() {
  const [articles, categories, tags] = await Promise.all([
    getArticles(),
    getArticleCategories(),
    getArticleTags(),
  ])

  return (
    <ArticlesPageContent 
      articles={articles} 
      categories={categories} 
      tags={tags} 
    />
  )
}
