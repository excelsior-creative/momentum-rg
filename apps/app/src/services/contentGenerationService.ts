import { GoogleGenAI } from '@google/genai'
import crypto from 'crypto'
import type { Payload } from 'payload'
import Replicate from 'replicate'
import slugify from 'slugify'

import {
  DEFAULT_CONTENT_GENERATION_SETTINGS,
  DEFAULT_KEYWORD_SEEDS,
} from '@/lib/content-generation/defaults'
import { markdownToLexical } from '@/lib/content-generation/markdownToLexical'
import {
  GeneratedArticleSchema,
  InfographicDataSchema,
  TopicBriefSchema,
} from '@/lib/content-generation/schemas'

const GENERATION_RUNS_COLLECTION = 'content-generation-runs' as const
const SETTINGS_GLOBAL = 'content-generation-settings' as const
const POSTS_COLLECTION = 'posts' as const
const MEDIA_COLLECTION = 'media' as const
const CATEGORIES_COLLECTION = 'categories' as const
const TAGS_COLLECTION = 'tags' as const
const USERS_COLLECTION = 'users' as const

type TriggerSource = 'cron' | 'manual'

type TopicOverride = {
  primaryKeyword: string
  geography?: string
  audience?: string
  angle?: string
}

type GenerateOptions = {
  dryRun?: boolean
  force?: boolean
  topicOverride?: TopicOverride
  triggerSource?: TriggerSource
}

type LiveTopicCandidate = {
  audience: string
  geography: string
  providerScore: number
  query: string
  source: string
  suggestion: string
}

type TopicBrief = {
  angle: string
  audience: string
  categoryName: string
  geography: string
  primaryKeyword: string
  rationale: string
  score: number
  searchIntent: string
  secondaryKeywords: string[]
  slug: string
  tagNames: string[]
  title: string
}

type GeneratedArticle = {
  content: string
  excerpt: string
  keywords: string[]
  metaDescription: string
  metaTitle: string
  slug: string
  title: string
}

type InfographicData = {
  callToAction: string
  headline: string
  highlights: string[]
  steps: Array<{ detail: string; title: string }>
  subheadline: string
}

type ResolvedSettings = {
  audienceSegments: string[]
  bannedTopics: string[]
  cadenceHours: number
  companyContext: {
    companyName: string
    expertise: string
    location: string
    primaryColor: string
    secondaryColor: string
  }
  enabled: boolean
  featuredImageStyles: Array<{ model: string; name: string; prompt: string }>
  infographic: { dataExtractionPrompt: string; imageGenerationPrompt: string }
  keywordSeeds: string[]
  maxResearchSeeds: number
  maxTopicCandidates: number
  qualityThreshold: number
  researchPrompt: string
  researchProvider: string
  systemAuthorEmail: string
  targetGeographies: string[]
  topicResearchPrompt: string
  postGenerationPrompt: string
}

function requireEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function getResearchModel() {
  return process.env.GOOGLE_GENAI_RESEARCH_MODEL || 'gemini-2.5-flash'
}

function getTextModel() {
  return process.env.GOOGLE_GENAI_TEXT_MODEL || 'gemini-2.5-pro'
}

function normalizeStringArray(values: unknown, key?: string) {
  if (!Array.isArray(values)) return []

  return values
    .map((entry) => {
      if (typeof entry === 'string') return entry.trim()
      if (entry && typeof entry === 'object' && key && key in entry) {
        const value = entry[key as keyof typeof entry]
        return typeof value === 'string' ? value.trim() : ''
      }
      return ''
    })
    .filter(Boolean)
}

function resolveSettings(rawSettings: Record<string, any> | null | undefined): ResolvedSettings {
  const defaults = DEFAULT_CONTENT_GENERATION_SETTINGS

  return {
    enabled: rawSettings?.operations?.enabled ?? defaults.operations.enabled,
    cadenceHours: rawSettings?.operations?.cadenceHours || defaults.operations.cadenceHours,
    qualityThreshold:
      rawSettings?.operations?.qualityThreshold || defaults.operations.qualityThreshold,
    maxResearchSeeds:
      rawSettings?.operations?.maxResearchSeeds || defaults.operations.maxResearchSeeds,
    maxTopicCandidates:
      rawSettings?.operations?.maxTopicCandidates || defaults.operations.maxTopicCandidates,
    systemAuthorEmail:
      rawSettings?.operations?.systemAuthorEmail?.trim() || defaults.operations.systemAuthorEmail,
    companyContext: {
      companyName:
        rawSettings?.companyContext?.companyName?.trim() || defaults.companyContext.companyName,
      location: rawSettings?.companyContext?.location?.trim() || defaults.companyContext.location,
      expertise:
        rawSettings?.companyContext?.expertise?.trim() || defaults.companyContext.expertise,
      primaryColor:
        rawSettings?.companyContext?.primaryColor?.trim() || defaults.companyContext.primaryColor,
      secondaryColor:
        rawSettings?.companyContext?.secondaryColor?.trim() ||
        defaults.companyContext.secondaryColor,
    },
    researchProvider:
      rawSettings?.topicResearch?.provider?.trim() || defaults.research.provider,
    researchPrompt: rawSettings?.research?.prompt?.trim() || defaults.research.prompt,
    topicResearchPrompt:
      rawSettings?.topicResearch?.prompt?.trim() || defaults.topicResearch.prompt,
    postGenerationPrompt:
      rawSettings?.postGeneration?.prompt?.trim() || defaults.postGeneration.prompt,
    keywordSeeds:
      normalizeStringArray(rawSettings?.keywords, 'keyword').length > 0
        ? normalizeStringArray(rawSettings?.keywords, 'keyword')
        : [...DEFAULT_KEYWORD_SEEDS],
    targetGeographies:
      normalizeStringArray(rawSettings?.targetGeographies, 'name').length > 0
        ? normalizeStringArray(rawSettings?.targetGeographies, 'name')
        : [...defaults.targetGeographies],
    audienceSegments:
      normalizeStringArray(rawSettings?.audienceSegments, 'audience').length > 0
        ? normalizeStringArray(rawSettings?.audienceSegments, 'audience')
        : [...defaults.audienceSegments],
    bannedTopics:
      normalizeStringArray(rawSettings?.bannedTopics, 'topic').length > 0
        ? normalizeStringArray(rawSettings?.bannedTopics, 'topic')
        : [...defaults.bannedTopics],
    featuredImageStyles:
      Array.isArray(rawSettings?.featuredImageStyles) && rawSettings.featuredImageStyles.length > 0
        ? rawSettings.featuredImageStyles.map((style: Record<string, any>) => ({
            model: style?.model?.trim() || 'google/nano-banana-pro',
            name: style?.name?.trim() || 'Default Editorial',
            prompt: style?.prompt?.trim() || defaults.featuredImageStyles[0].prompt,
          }))
        : defaults.featuredImageStyles.map((style) => ({ ...style })),
    infographic: {
      dataExtractionPrompt:
        rawSettings?.infographic?.dataExtractionPrompt?.trim() ||
        defaults.infographic.dataExtractionPrompt,
      imageGenerationPrompt:
        rawSettings?.infographic?.imageGenerationPrompt?.trim() ||
        defaults.infographic.imageGenerationPrompt,
    },
  }
}

function safeParseJSON<T>(value: string): T {
  const cleanValue = value.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleanValue) as T
}

function buildFingerprint(topic: Pick<TopicBrief, 'primaryKeyword' | 'geography' | 'audience' | 'angle'>) {
  return crypto
    .createHash('sha256')
    .update(`${topic.primaryKeyword}|${topic.geography}|${topic.audience}|${topic.angle}`)
    .digest('hex')
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function similarityPercent(left: string, right: string) {
  const leftTokens = new Set(left.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean))
  const rightTokens = new Set(right.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean))
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length
  const union = new Set([...leftTokens, ...rightTokens]).size
  return Math.round((intersection / union) * 100)
}

async function generateStructuredJSON<T>({
  model,
  prompt,
  schema,
}: {
  model: string
  prompt: string
  schema: any
}) {
  const ai = new GoogleGenAI({ apiKey: requireEnv('GOOGLE_GENAI_API_KEY') })
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      maxOutputTokens: model === getResearchModel() ? 4000 : 8000,
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: model === getResearchModel() ? 0.5 : 0.7,
    },
  })

  return {
    data: safeParseJSON<T>(response.text || ''),
    usageMetadata: response.usageMetadata,
  }
}

async function fetchSerpApiAutocompleteSuggestions(query: string) {
  const apiKey = requireEnv('SERPAPI_API_KEY')
  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google_autocomplete')
  url.searchParams.set('q', query)
  url.searchParams.set('hl', 'en')
  url.searchParams.set('gl', 'us')
  url.searchParams.set('api_key', apiKey)

  const response = await fetch(url, { next: { revalidate: 0 } })
  if (!response.ok) {
    throw new Error(`SerpApi autocomplete failed (${response.status}) for query "${query}"`)
  }

  const payload = (await response.json()) as Record<string, any>
  const rawSuggestions = Array.isArray(payload.suggestions) ? payload.suggestions : []

  return rawSuggestions
    .map((entry: Record<string, any>) => {
      const value =
        entry?.value || entry?.query || entry?.suggestion || entry?.name || entry?.text || ''
      return typeof value === 'string' ? value.trim() : ''
    })
    .filter(Boolean)
}

async function discoverLiveTopicCandidates(settings: ResolvedSettings) {
  const baseKeywords = settings.keywordSeeds.slice(0, settings.maxResearchSeeds)
  const geographies = settings.targetGeographies.slice(0, Math.max(1, settings.targetGeographies.length))
  const audiences = settings.audienceSegments.slice(0, Math.max(1, settings.audienceSegments.length))
  const searchSeeds = baseKeywords.map((keyword, index) => {
    const geography = geographies[index % geographies.length]
    const audience = audiences[index % audiences.length]
    return {
      audience,
      geography,
      query: `${keyword} ${geography} real estate`,
    }
  })

  const results = await Promise.all(
    searchSeeds.map(async (seed) => ({
      ...seed,
      suggestions: await fetchSerpApiAutocompleteSuggestions(seed.query),
    })),
  )

  const relevantPattern =
    /(real estate|home|homes|house|housing|property|escrow|closing costs|mortgage|down payment|investor|investment|landlord|buyer|seller|condo|townhome|neighborhood|1031)/i

  return uniqueStrings(
    results.flatMap((result) =>
      result.suggestions
        .filter((suggestion) => relevantPattern.test(suggestion))
        .map((suggestion, index) =>
          JSON.stringify({
            audience: result.audience,
            geography: result.geography,
            providerScore: Math.max(30, 100 - index * 10),
            query: result.query,
            source: 'serpapi-autocomplete',
            suggestion,
          } satisfies LiveTopicCandidate),
        ),
    ),
  )
    .map((entry) => JSON.parse(entry) as LiveTopicCandidate)
    .slice(0, settings.maxTopicCandidates)
}

async function selectTopicBrief({
  options,
  payload,
  settings,
}: {
  options: GenerateOptions
  payload: Payload
  settings: ResolvedSettings
}) {
  const recentPosts = (await payload.find({
    collection: POSTS_COLLECTION,
    depth: 0,
    limit: 12,
    overrideAccess: true,
    sort: '-publishedDate',
    where: { _status: { equals: 'published' } },
  })) as any

  const candidates = options.topicOverride
    ? [
        {
          audience: options.topicOverride.audience || settings.audienceSegments[0],
          geography: options.topicOverride.geography || settings.targetGeographies[0],
          providerScore: 100,
          query: options.topicOverride.primaryKeyword,
          source: 'manual-override',
          suggestion: options.topicOverride.primaryKeyword,
        },
      ]
    : await discoverLiveTopicCandidates(settings)

  if (candidates.length === 0) {
    throw new Error('Live topic research returned no usable keyword candidates.')
  }

  const prompt = `${settings.researchPrompt}

${settings.topicResearchPrompt}

Company context:
${JSON.stringify(settings.companyContext, null, 2)}

Banned topics:
${JSON.stringify(settings.bannedTopics, null, 2)}

Recent published posts to avoid duplicating:
${JSON.stringify(recentPosts.docs, null, 2)}

Live keyword candidates:
${JSON.stringify(candidates, null, 2)}

Return one best-fit article topic brief for a Southern California real estate site.`

  const { data, usageMetadata } = await generateStructuredJSON<TopicBrief>({
    model: getResearchModel(),
    prompt,
    schema: TopicBriefSchema,
  })

  return {
    candidateCount: candidates.length,
    topic: {
      ...data,
      angle: options.topicOverride?.angle?.trim() || data.angle,
      primaryKeyword: data.primaryKeyword.trim(),
      secondaryKeywords: uniqueStrings(data.secondaryKeywords || []),
      slug: slugify(data.slug || data.title, { lower: true, strict: true }),
      tagNames: uniqueStrings(data.tagNames || []).slice(0, 6),
    },
    usageMetadata,
  }
}

async function generateArticleFromBrief(settings: ResolvedSettings, topic: TopicBrief) {
  const prompt = `${settings.postGenerationPrompt}

Topic brief:
${JSON.stringify(topic, null, 2)}

Requirements:
- write for Southern California buyers, sellers, or investors
- stay practical and evergreen
- no H1 heading inside the content body
- include 5 to 7 substantial sections
- use markdown with ## and ###
- do not invent statistics, mortgage rates, legal guidance, or market numbers
- end with a short CTA that fits Momentum Realty Group
`

  const { data, usageMetadata } = await generateStructuredJSON<GeneratedArticle>({
    model: getTextModel(),
    prompt,
    schema: GeneratedArticleSchema,
  })

  return {
    article: {
      ...data,
      keywords: uniqueStrings(data.keywords || []),
      slug: slugify(data.slug || topic.slug || data.title, { lower: true, strict: true }),
    },
    usageMetadata,
  }
}

async function generateInfographicData(settings: ResolvedSettings, article: GeneratedArticle, topic: TopicBrief) {
  const prompt = `${settings.infographic.dataExtractionPrompt}

Article brief:
${JSON.stringify(topic, null, 2)}

Article content:
${article.content}
`

  const { data } = await generateStructuredJSON<InfographicData>({
    model: getResearchModel(),
    prompt,
    schema: InfographicDataSchema,
  })

  return data
}

async function generateReplicateImage({
  aspectRatio,
  model,
  prompt,
}: {
  aspectRatio: string
  model: string
  prompt: string
}) {
  const replicate = new Replicate({ auth: requireEnv('REPLICATE_API_KEY') })

  const prediction = await replicate.predictions.create({
    model: model as any,
    input: {
      allow_fallback_model: true,
      aspect_ratio: aspectRatio,
      output_format: 'png',
      prompt,
      resolution: '2K',
      safety_filter_level: 'block_only_high',
    },
  })

  let current = await replicate.predictions.get(prediction.id)
  while (current.status === 'starting' || current.status === 'processing') {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    current = await replicate.predictions.get(prediction.id)
  }

  if (current.status !== 'succeeded') {
    throw new Error(`Image generation failed: ${current.error || 'Unknown error'}`)
  }

  const output = current.output
  if (typeof output === 'string') return output
  if (Array.isArray(output) && output[0]) return String(output[0])
  if (output && typeof output === 'object' && 'url' in output && typeof output.url === 'function') {
    return output.url()
  }
  return String(output)
}

async function downloadImageBuffer(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to download generated image (${response.status})`)
  return Buffer.from(await response.arrayBuffer())
}

async function uploadGeneratedMedia({
  alt,
  buffer,
  caption,
  filename,
  payload,
}: {
  alt: string
  buffer: Buffer
  caption: string
  filename: string
  payload: Payload
}) {
  return (payload.create as any)({
    collection: MEDIA_COLLECTION,
    data: { alt, caption },
    file: {
      data: buffer,
      mimetype: 'image/png',
      name: filename,
      size: buffer.length,
    },
    overrideAccess: true,
  })
}

async function resolveAuthorId(payload: Payload, systemAuthorEmail: string) {
  if (systemAuthorEmail) {
    const users = (await payload.find({
      collection: USERS_COLLECTION,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { email: { equals: systemAuthorEmail } },
    })) as any
    if (users.docs[0]?.id) return users.docs[0].id
  }

  const admins = (await payload.find({
    collection: USERS_COLLECTION,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { role: { equals: 'admin' } },
  })) as any

  if (!admins.docs[0]?.id) {
    throw new Error('No admin user available for generated post authorship.')
  }

  return admins.docs[0].id
}

async function findOrCreateNamedDoc(payload: Payload, collection: string, name: string) {
  const slug = slugify(name, { lower: true, strict: true })
  const existing = (await payload.find({
    collection: collection as any,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })) as any

  if (existing.docs[0]?.id) return existing.docs[0].id

  const created = await (payload.create as any)({
    collection: collection,
    data: { name, slug },
    overrideAccess: true,
  })

  return created.id
}

async function createRun(payload: Payload, data: Record<string, any>) {
  return (payload.create as any)({
    collection: GENERATION_RUNS_COLLECTION,
    data,
    overrideAccess: true,
  })
}

async function updateRun(payload: Payload, id: number, data: Record<string, any>) {
  return (payload.update as any)({
    id,
    collection: GENERATION_RUNS_COLLECTION,
    data,
    overrideAccess: true,
  })
}

async function createSkipRun(payload: Payload, reason: string, triggerSource: TriggerSource) {
  return createRun(payload, {
    completedAt: new Date().toISOString(),
    fingerprint: crypto.randomUUID(),
    skipReason: reason,
    startedAt: new Date().toISOString(),
    status: 'skipped',
    topicTitle: 'Skipped generation run',
    triggerSource,
  })
}

async function checkCadenceGate(payload: Payload, settings: ResolvedSettings) {
  const latestRun = (await payload.find({
    collection: GENERATION_RUNS_COLLECTION,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: '-completedAt',
    where: { status: { equals: 'published' } },
  })) as any

  const completedAt = latestRun.docs[0]?.completedAt
  if (!completedAt) return null

  const lastPublishTime = new Date(completedAt).getTime()
  const cadenceWindowMs = settings.cadenceHours * 60 * 60 * 1000
  const nextAllowedTime = lastPublishTime + cadenceWindowMs

  if (Date.now() < nextAllowedTime) {
    return `Cadence gate active until ${new Date(nextAllowedTime).toISOString()}`
  }

  return null
}

async function isTopicTooSimilar(payload: Payload, topic: TopicBrief) {
  const recentPosts = (await payload.find({
    collection: POSTS_COLLECTION,
    depth: 0,
    limit: 10,
    overrideAccess: true,
    sort: '-publishedDate',
    where: { _status: { equals: 'published' } },
  })) as any

  return recentPosts.docs.some((post: Record<string, any>) => {
    const titleSimilarity = similarityPercent(post.title || '', topic.title)
    const keywordSimilarity = similarityPercent(post.excerpt || '', topic.primaryKeyword)
    return titleSimilarity >= 65 || keywordSimilarity >= 45
  })
}

async function ensureUniqueSlug(payload: Payload, desiredSlug: string) {
  const slug = slugify(desiredSlug, { lower: true, strict: true })
  const existing = (await payload.find({
    collection: POSTS_COLLECTION,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })) as any

  return existing.docs.length === 0 ? slug : `${slug}-${Date.now()}`
}

export async function generateAutomatedArticle(payload: Payload, options: GenerateOptions = {}) {
  const triggerSource = options.triggerSource || 'cron'
  const rawSettings = (await (payload.findGlobal as any)({
    overrideAccess: true,
    slug: SETTINGS_GLOBAL,
  })) as Record<string, any>
  const settings = resolveSettings(rawSettings)

  if (!settings.enabled && !options.force) {
    const run = await createSkipRun(payload, 'Pipeline disabled in content generation settings.', triggerSource)
    return { action: 'skipped', reason: run.skipReason }
  }

  if (!options.force) {
    const cadenceReason = await checkCadenceGate(payload, settings)
    if (cadenceReason) {
      const run = await createSkipRun(payload, cadenceReason, triggerSource)
      return { action: 'skipped', reason: run.skipReason }
    }
  }

  const topicSelection = await selectTopicBrief({ options, payload, settings })
  const topic = topicSelection.topic

  if (topic.score < settings.qualityThreshold) {
    const run = await createSkipRun(
      payload,
      `Topic score ${topic.score} below threshold ${settings.qualityThreshold}.`,
      triggerSource,
    )
    return { action: 'skipped', reason: run.skipReason, topic }
  }

  if (await isTopicTooSimilar(payload, topic)) {
    const run = await createSkipRun(payload, 'Selected topic is too similar to a recent article.', triggerSource)
    return { action: 'skipped', reason: run.skipReason, topic }
  }

  const fingerprint = buildFingerprint(topic)
  const existingRun = (await payload.find({
    collection: GENERATION_RUNS_COLLECTION,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { fingerprint: { equals: fingerprint } },
  })) as any

  if (existingRun.docs.length > 0) {
    const run = await createSkipRun(payload, 'Topic fingerprint already exists in prior generation history.', triggerSource)
    return { action: 'skipped', reason: run.skipReason, topic }
  }

  let run = await createRun(payload, {
    audienceSegment: topic.audience,
    costs: {
      candidateCount: topicSelection.candidateCount,
      estimatedInputTokens: topicSelection.usageMetadata?.promptTokenCount || 0,
      estimatedOutputTokens: topicSelection.usageMetadata?.candidatesTokenCount || 0,
    },
    fingerprint,
    geoTarget: topic.geography,
    models: {
      imageModel: settings.featuredImageStyles[0]?.model || 'google/nano-banana-pro',
      researchProvider: settings.researchProvider,
      textModel: getTextModel(),
    },
    primaryKeyword: topic.primaryKeyword,
    providerData: topicSelection,
    searchIntent: topic.searchIntent,
    secondaryKeywords: topic.secondaryKeywords.map((keyword) => ({ keyword })),
    startedAt: new Date().toISOString(),
    status: 'generating',
    topicQuery: topic.primaryKeyword,
    topicScore: topic.score,
    topicTitle: topic.title,
    triggerSource,
  })

  try {
    const articleResult = await generateArticleFromBrief(settings, topic)
    const infographicData = await generateInfographicData(settings, articleResult.article, topic)

    const featuredPrompt = `${settings.featuredImageStyles[0]?.prompt}

Article title: ${articleResult.article.title}
Primary keyword: ${topic.primaryKeyword}
Audience: ${topic.audience}
Geography: ${topic.geography}
`

    const infographicPrompt = `${settings.infographic.imageGenerationPrompt}

Headline: ${infographicData.headline}
Subheadline: ${infographicData.subheadline}
Highlights: ${infographicData.highlights.join(' | ')}
Steps: ${infographicData.steps.map((step) => `${step.title}: ${step.detail}`).join(' | ')}
CTA: ${infographicData.callToAction}
`

    const [featuredImageUrl, infographicImageUrl] = await Promise.all([
      generateReplicateImage({
        aspectRatio: '16:9',
        model: settings.featuredImageStyles[0]?.model || 'google/nano-banana-pro',
        prompt: featuredPrompt,
      }),
      generateReplicateImage({
        aspectRatio: '9:16',
        model: settings.featuredImageStyles[0]?.model || 'google/nano-banana-pro',
        prompt: infographicPrompt,
      }),
    ])

    if (options.dryRun) {
      await updateRun(payload, run.id, {
        completedAt: new Date().toISOString(),
        providerData: { ...run.providerData, dryRun: true, featuredImageUrl, infographicImageUrl },
        status: 'skipped',
      })
      return { action: 'dry-run', article: articleResult.article, topic }
    }

    const [featuredImageBuffer, infographicBuffer] = await Promise.all([
      downloadImageBuffer(featuredImageUrl),
      downloadImageBuffer(infographicImageUrl),
    ])

    const safeSlug = await ensureUniqueSlug(payload, articleResult.article.slug || topic.slug)
    const authorId = await resolveAuthorId(payload, settings.systemAuthorEmail)
    const categoryId = await findOrCreateNamedDoc(payload, CATEGORIES_COLLECTION, topic.categoryName)
    const tagIds = await Promise.all(
      uniqueStrings([topic.primaryKeyword, ...topic.tagNames]).slice(0, 6).map((name) =>
        findOrCreateNamedDoc(payload, TAGS_COLLECTION, name),
      ),
    )

    const [featuredImageDoc, infographicDoc] = await Promise.all([
      uploadGeneratedMedia({
        alt: `${articleResult.article.title} featured image`,
        buffer: featuredImageBuffer,
        caption: `AI-generated editorial image for ${articleResult.article.title}`,
        filename: `${safeSlug}-featured.png`,
        payload,
      }),
      uploadGeneratedMedia({
        alt: `${articleResult.article.title} infographic`,
        buffer: infographicBuffer,
        caption: `${infographicData.headline} - ${infographicData.subheadline}`,
        filename: `${safeSlug}-infographic.png`,
        payload,
      }),
    ])

    const post = await (payload.create as any)({
      collection: POSTS_COLLECTION,
      data: {
        _status: 'published',
        author: authorId,
        categories: [categoryId],
        content: markdownToLexical(articleResult.article.content),
        excerpt: articleResult.article.excerpt,
        featuredImage: featuredImageDoc.id,
        infographic: infographicDoc.id,
        meta: {
          description: articleResult.article.metaDescription,
          image: featuredImageDoc.id,
          title: articleResult.article.metaTitle,
        },
        publishedDate: new Date().toISOString(),
        slug: safeSlug,
        tags: tagIds,
        title: articleResult.article.title,
      },
      overrideAccess: true,
    })

    run = await updateRun(payload, run.id, {
      completedAt: new Date().toISOString(),
      post: post.id,
      providerData: { ...run.providerData, infographicData },
      status: 'published',
    })

    return {
      action: 'published',
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
      },
      runId: run.id,
      topic,
    }
  } catch (error) {
    await updateRun(payload, run.id, {
      completedAt: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : 'Unknown generation error',
      status: 'failed',
    })
    throw error
  }
}
