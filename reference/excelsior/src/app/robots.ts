import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // OpenAI (ChatGPT)
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'OAI-ImageBot', allow: '/' },

      // Anthropic (Claude)
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },

      // AI Search Engines
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
      { userAgent: 'PhindBot', allow: '/' },
      { userAgent: 'ExaBot', allow: '/' },
      { userAgent: 'AndiBot', allow: '/' },
      { userAgent: 'Timpibot', allow: '/' },

      // Google & Apple AI
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },

      // ByteDance & Amazon AI
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },

      // Enterprise & Research AI
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'AI2Bot', allow: '/' },
      { userAgent: 'academic-ai', allow: '/' },

      // Social Platform AI
      { userAgent: 'Grok-bot', allow: '/' },
      { userAgent: 'Facebookbot', allow: '/' },
      { userAgent: 'LinkedInBot', allow: '/' },
      { userAgent: 'TwitterBot', allow: '/' },
      { userAgent: 'SlackBot', allow: '/' },
      { userAgent: 'TelegramBot', allow: '/' },
      { userAgent: 'DiscordBot', allow: '/' },

      // Web Scraping & AI Tools
      { userAgent: 'FirecrawlAgent', allow: '/' },
      { userAgent: 'ImagesiftBot', allow: '/' },
      { userAgent: 'Kangaroo Bot', allow: '/' },
      { userAgent: 'omgilibot', allow: '/' },
      { userAgent: 'Diffbot', allow: '/' },

      // Search & SEO Bots (for completeness)
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'DuckDuckBot', allow: '/' },
      { userAgent: 'SemrushBot', allow: '/' },
      { userAgent: 'AhrefsBot', allow: '/' },
      { userAgent: 'PetalBot', allow: '/' },
      { userAgent: 'SeznamBot', allow: '/' },
      { userAgent: 'Naverbot', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },

      // Common Crawl (for AI training)
      { userAgent: 'CCBot', allow: '/' },

      // Default rule - allow all but restrict admin/api areas
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
