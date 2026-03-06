export const DEFAULT_CONTENT_GENERATION_SETTINGS = {
  companyContext: {
    companyName: 'Momentum Realty Group',
    location: 'Southern California',
    expertise:
      'Momentum Realty Group helps buyers, sellers, investors, and property owners across Orange County, Long Beach, Los Angeles County, and nearby Southern California markets.',
    primaryColor: '#C4A35A',
    secondaryColor: '#2D2D2D',
  },
  operations: {
    enabled: false,
    cadenceHours: 72,
    qualityThreshold: 70,
    maxResearchSeeds: 8,
    maxTopicCandidates: 24,
    systemAuthorEmail: '',
  },
  research: {
    provider: 'serpapi',
    prompt:
      'You are an SEO strategist for a Southern California real estate brokerage. Choose the topic most likely to rank for a real search query while helping buyers, sellers, or investors make a better decision.',
  },
  topicResearch: {
    prompt:
      'Choose one article topic from the live keyword candidates. Prioritize Southern California real estate intent, informational usefulness, ranking opportunity, and local specificity. Avoid generic national-market summaries.',
  },
  postGeneration: {
    prompt:
      'Write a high-quality, non-fluffy article for Southern California real estate searchers. Be specific, practical, and local. Do not invent statistics, rates, legal claims, or inventory figures. If a fact is uncertain, keep the guidance evergreen and decision-oriented instead of making up numbers.',
  },
  featuredImageStyles: [
    {
      name: 'Default Editorial',
      model: 'google/nano-banana-pro',
      prompt:
        'Create a polished editorial hero image for a Southern California real estate article. The image should feel premium, natural, bright, and local without visible branding or text overlays.',
    },
  ],
  infographic: {
    dataExtractionPrompt:
      'Turn the article into an easy-to-scan infographic brief with concise highlights and actionable steps. Prefer checklists, comparisons, and process guidance over unsupported statistics.',
    imageGenerationPrompt:
      'Create a clean vertical infographic for a Southern California real estate audience. Use minimal, legible text, a premium editorial design, and a gold-on-charcoal inspired palette. Avoid clutter and keep the copy concise.',
  },
  targetGeographies: [
    'Orange County',
    'Long Beach',
    'Huntington Beach',
    'La Habra',
    'Anaheim',
    'Riverside',
  ],
  audienceSegments: [
    'first-time buyers',
    'move-up buyers',
    'sellers',
    'real estate investors',
    'landlords',
    '1031 exchange buyers',
  ],
  bannedTopics: ['breaking mortgage rate predictions', 'legal advice', 'tax advice'],
} as const

export const DEFAULT_KEYWORD_SEEDS = [
  'home buying checklist',
  'best neighborhoods',
  'how much house can I afford',
  'closing costs',
  'investment property analysis',
  'house hacking',
  '1031 exchange timing',
  'selling before buying',
  'down payment assistance',
  'property management tips',
] as const
