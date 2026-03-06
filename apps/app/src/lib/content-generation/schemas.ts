import { Schema, Type } from '@google/genai'

export const TopicBriefSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'SEO article title targeting the primary keyword',
    },
    slug: {
      type: Type.STRING,
      description: 'URL-safe slug for the article',
    },
    primaryKeyword: {
      type: Type.STRING,
      description: 'The single keyword or search phrase to target',
    },
    secondaryKeywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'Supporting keywords closely related to the main topic',
    },
    geography: {
      type: Type.STRING,
      description: 'Local geography, market, or neighborhood being targeted',
    },
    audience: {
      type: Type.STRING,
      description: 'Primary audience segment for the article',
    },
    searchIntent: {
      type: Type.STRING,
      description: 'Informational or decision-support intent being served',
    },
    angle: {
      type: Type.STRING,
      description: 'Specific editorial angle that differentiates the piece',
    },
    rationale: {
      type: Type.STRING,
      description: 'Brief explanation for why this topic is worth publishing now',
    },
    score: {
      type: Type.INTEGER,
      description: '0-100 overall topic quality score',
    },
    categoryName: {
      type: Type.STRING,
      description: 'Suggested post category name',
    },
    tagNames: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'Suggested tags to create or reuse',
    },
  },
  required: [
    'title',
    'slug',
    'primaryKeyword',
    'secondaryKeywords',
    'geography',
    'audience',
    'searchIntent',
    'angle',
    'rationale',
    'score',
    'categoryName',
    'tagNames',
  ],
}

export const GeneratedArticleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
    },
    slug: {
      type: Type.STRING,
    },
    excerpt: {
      type: Type.STRING,
      description: 'Compelling 140-170 character article summary',
    },
    content: {
      type: Type.STRING,
      description:
        'Markdown article body using ## for H2 headings, ### for H3 headings, and simple bullet lists',
    },
    metaTitle: {
      type: Type.STRING,
      description: 'SEO title tag under 60 characters',
    },
    metaDescription: {
      type: Type.STRING,
      description: 'SEO meta description under 160 characters',
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'Comma-safe list of target keywords',
    },
  },
  required: [
    'title',
    'slug',
    'excerpt',
    'content',
    'metaTitle',
    'metaDescription',
    'keywords',
  ],
}

export const InfographicDataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: 'Short infographic headline with 4-8 words',
    },
    subheadline: {
      type: Type.STRING,
      description: 'One-sentence framing line for the infographic',
    },
    highlights: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'Three to five concise takeaways for the visual',
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
          },
          detail: {
            type: Type.STRING,
          },
        },
        required: ['title', 'detail'],
      },
      description: 'Three to five ordered steps, checks, or comparisons',
    },
    callToAction: {
      type: Type.STRING,
      description: 'Short CTA suitable for the bottom of the infographic',
    },
  },
  required: ['headline', 'subheadline', 'highlights', 'steps', 'callToAction'],
}
