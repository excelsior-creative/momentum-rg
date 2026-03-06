import type { Article, Media } from '@/payload-types'
import { SITE_URL } from './metadata'
const SITE_NAME = 'Excelsior Creative'
const SITE_DESCRIPTION = 'Excelsior Creative is a trusted technology partner for national nonprofits, specializing in AI-powered solutions, custom software engineering, and digital strategy to amplify world-changing missions.'

// Orange County geo coordinates (central Irvine area)
const GEO_COORDINATES = {
  latitude: 33.6846,
  longitude: -117.8265,
}

// Service areas for local SEO
const SERVICE_AREAS = [
  'Orange County',
  'Irvine',
  'Anaheim',
  'Santa Ana',
  'Huntington Beach',
  'Costa Mesa',
  'Newport Beach',
  'Fullerton',
  'Garden Grove',
  'Orange',
]

// Helper to get media URL
function getMediaUrl(media: Media | number | null | undefined): string {
  if (!media || typeof media === 'number') return ''
  return media.url ? `${SITE_URL}${media.url}` : ''
}

// Helper to get location display name
export function getLocationName(location: string): string {
  const locationMap: Record<string, string> = {
    'orange-county': 'Orange County, CA',
    'irvine': 'Irvine, CA',
    'anaheim': 'Anaheim, CA',
    'santa-ana': 'Santa Ana, CA',
    'huntington-beach': 'Huntington Beach, CA',
    'oc': 'Orange County, CA',
  }
  return locationMap[location] || 'Orange County, CA'
}

/**
 * Generate Organization schema - used site-wide for company identity
 * This is the primary company schema that should appear on every page
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/excelsior-creative-logo-white.svg`,
      width: 512,
      height: 512,
    },
    description: SITE_DESCRIPTION,
    email: 'hello@excelsiorcreative.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Irvine',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO_COORDINATES.latitude,
      longitude: GEO_COORDINATES.longitude,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    sameAs: [
      'https://www.linkedin.com/company/excelsiorcreative/',
      'https://www.facebook.com/exctio/',
    ],
    foundingDate: '2015',
    knowsAbout: [
      'Web Development Orange County',
      'Web Development',
      'Web Design Orange County',
      'AI Solutions',
      'Custom Software',
      'Nonprofit Technology',
      'Emergency Website Repair Orange County',
      'E-commerce Development',
      'SEO Optimization',
    ],
  }
}

/**
 * Generate WebSite schema with potential for sitelinks search box
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/articles?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  }
}

/**
 * Generate combined global schema for every page
 * Includes Organization and WebSite schemas
 */
export function generateGlobalSchema() {
  return combineSchemas(
    generateOrganizationSchema(),
    generateWebSiteSchema()
  )
}

// Generate Article schema
export function generateArticleSchema(article: Article) {
  const featuredImageUrl = getMediaUrl(article.featuredImage as Media)
  const ogImageUrl = getMediaUrl(article.seo?.ogImage as Media)

  return {
    '@context': 'https://schema.org',
    '@type': article.structuredData?.articleType || 'Article',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Organization',
      name: article.structuredData?.author || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: ogImageUrl || featuredImageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${article.slug}`,
    },
  }
}

// Generate BreadcrumbList schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

// Generate WebPage schema
export function generateWebPageSchema(page: {
  title: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: `${SITE_URL}${page.url}`,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  }
}

// Combine multiple schemas into a single graph
export function combineSchemas(...schemas: (object | null)[]) {
  const validSchemas = schemas.filter(Boolean)
  if (validSchemas.length === 0) return null
  if (validSchemas.length === 1) return validSchemas[0]

  return {
    '@context': 'https://schema.org',
    '@graph': validSchemas.map((schema) => {
      // Remove @context from individual schemas when combining
      const { '@context': _, ...rest } = schema as { '@context'?: string }
      return rest
    }),
  }
}

/**
 * Generate FAQPage schema for service pages
 */
export function generateFAQPageSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate ProfessionalService schema for service pages
 */
export function generateServiceSchema(service: {
  name: string
  description: string
  url: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}${service.url}/#service`,
    name: service.name,
    description: service.description,
    url: `${SITE_URL}${service.url}`,
    image: service.image || `${SITE_URL}/og-image.jpg`,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
  }
}
