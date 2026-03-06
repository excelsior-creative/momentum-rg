import type { GlobalConfig } from "payload";

export const ContentGenerationSettings: GlobalConfig = {
  slug: "content-generation-settings",
  label: "Content Generation Settings",
  access: {
    read: () => true,
  },
  admin: {
    group: "Settings",
  },
  fields: [
    {
      name: "topicResearch",
      type: "group",
      label: "Topic Research Settings",
      fields: [
        {
          name: "prompt",
          type: "textarea",
          label: "Research Prompt",
          defaultValue: `You are an SEO content strategist for Excelsior Creative, a web development agency in Orange County, California.

Your task: Analyze these target keywords and identify ONE compelling article topic that would rank well and provide value to potential clients.

TARGET KEYWORDS:
{{keywordList}}

Consider:
1. Current trends in web development and digital marketing
2. Common pain points for business owners needing web services
3. Seasonal relevance and timely topics
4. Local Orange County business context

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "title": "Article title (compelling, 50-60 chars for SEO)",
  "angle": "The unique angle or hook for this article",
  "targetKeyword": "The primary keyword to target",
  "location": "The location to target (e.g., Orange County, Irvine, etc.)",
  "reasoning": "Brief explanation of why this topic will perform well"
}`,
          admin: {
            description: "Use {{keywordList}} as a placeholder for the keyword list.",
          },
        },
      ],
    },
    {
      name: "articleGeneration",
      type: "group",
      label: "Article Generation Settings",
      fields: [
        {
          name: "prompt",
          type: "textarea",
          label: "Article Prompt",
          defaultValue: `You are an expert content writer for Excelsior Creative, a premium web development agency in Orange County, California.

Write a comprehensive, PROBLEM-SOLVING blog article that genuinely helps readers. This is NOT SEO filler - this should provide real value.

TOPIC: {{title}}
ANGLE: {{angle}}
TARGET KEYWORD: {{targetKeyword}}
TARGET LOCATION: {{location}}

CONTENT PHILOSOPHY:
- Start with the PAIN POINT: What frustration brings someone to search for this?
- Provide ACTIONABLE SOLUTIONS: Step-by-step guidance they can implement today
- Include REAL NUMBERS: Statistics, timeframes, cost estimates where relevant
- Share EXPERT INSIGHTS: Things only a professional would know
- Address COMMON MISTAKES: Help them avoid pitfalls

REQUIREMENTS:
1. Write 1500-2000 words of genuinely helpful, actionable content
2. Open with empathy - acknowledge the reader's frustration or challenge
3. Include at least one numbered step-by-step process
4. Add 2-3 real statistics or data points (cite sources if possible)
5. Include a "Pro Tips" or "Expert Advice" section with quick wins
6. Naturally incorporate the target keyword 3-5 times
7. Include the location naturally where appropriate
8. Use a professional but approachable tone
9. Structure with clear H2 and H3 headings
10. End with a helpful call-to-action mentioning Excelsior Creative

FORMAT YOUR RESPONSE AS JSON (no markdown, just raw JSON):
{
  "title": "SEO-optimized article title (include keyword if natural)",
  "slug": "url-friendly-slug-with-keyword",
  "excerpt": "Compelling 150-160 char meta description that promises value",
  "content": "Full article in Markdown format with ## for H2 and ### for H3",
  "metaTitle": "SEO title tag (max 60 chars)",
  "metaDescription": "Meta description (max 160 chars)",
  "keywords": "comma, separated, relevant, keywords"
}`,
          admin: {
            description: "Use {{title}}, {{angle}}, {{targetKeyword}}, and {{location}} as placeholders.",
          },
        },
      ],
    },
    {
      name: "featuredImageStyles",
      type: "array",
      label: "Featured Image Styles",
      minRows: 1,
      defaultValue: [
        {
          name: "illustration",
          model: "google/nano-banana-pro",
          prompt: `Create a professional blog featured image for an article titled: "{{title}}"

Article summary: {{excerpt}}

Style: Modern, clean editorial illustration with a tech/creative agency aesthetic. 
Use bold colors with orange (#FF5722) as an accent. Abstract or conceptual representation 
of the topic. No text overlays. Suitable for a blog hero image. High quality, professional photography or illustration style.
Minimal, sophisticated design. Clean composition with visual impact.`,
        },
        {
          name: "photorealistic-people",
          model: "google/nano-banana-pro",
          prompt: `A high-end professional photograph for a tech blog titled "{{title}}".
The image should feature diverse, modern professionals in a sleek, high-tech Orange County office environment. 
Natural lighting, shallow depth of field, 8k resolution, photorealistic, cinematic composition. 
The mood should be innovative, trustworthy, and premium. 
Keywords: {{keywords}}. No text on image.`,
        },
        {
          name: "photorealistic-abstract",
          model: "google/nano-banana-pro",
          prompt: `Photorealistic close-up of high-end modern technology, sleek glass surfaces, and warm ambient lighting. 
Vibrant orange (#FF5722) highlights. Abstract but recognizable as tech/creative workspace. 
Professional photography style, macro lens, 8k resolution. For article: "{{title}}". No text.`,
        },
        {
          name: "tech-minimal",
          model: "google/nano-banana-pro",
          prompt: `Minimalist tech-focused illustration for "{{title}}". 
Flat design, geometric shapes, plenty of negative space. 
Primary color: dark navy, accent color: orange (#FF5722). 
Professional, clean, and modern aesthetic. No text.`,
        },
      ],
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "model",
          type: "text",
          required: true,
        },
        {
          name: "prompt",
          type: "textarea",
          required: true,
          admin: {
            description: "Use {{title}}, {{excerpt}}, and {{keywords}} as placeholders.",
          },
        },
      ],
    },
    {
      name: "infographic",
      type: "group",
      label: "Infographic Generation Settings",
      fields: [
        {
          name: "dataExtractionPrompt",
          type: "textarea",
          label: "Data Extraction Prompt",
          defaultValue: `You are a data visualization expert. Analyze this article and extract structured information for creating a detailed, value-driven infographic.

ARTICLE TITLE: {{title}}
ARTICLE CONTENT:
{{content}}

Your task: Extract the most valuable, shareable information from this article to create an infographic that users would want to save and share.

REQUIREMENTS:
1. Find 2-4 compelling statistics with realistic numbers (if not in article, research typical industry stats)
2. Identify 4-6 clear, actionable steps or a process flow
3. Extract 3-4 pro tips that provide quick wins
4. Create a compelling headline that captures the main problem being solved

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "headline": "Short, impactful headline (max 8 words)",
  "problemStatement": "The core problem this article solves (1 sentence)",
  "statistics": [
    {"value": "43%", "label": "of small businesses experience this issue", "source": "Industry Report 2024"},
    {"value": "$5,600", "label": "average cost per minute of downtime", "source": "Gartner"}
  ],
  "steps": [
    {"number": 1, "title": "Step Title", "description": "Brief 5-7 word description"},
    {"number": 2, "title": "Step Title", "description": "Brief 5-7 word description"}
  ],
  "proTips": [
    "Actionable tip users can implement immediately",
    "Another quick-win tip"
  ],
  "callToAction": "Short CTA like 'Get Expert Help Today'"
}`,
        },
        {
          name: "imageGenerationPrompt",
          type: "textarea",
          label: "Image Generation Prompt",
          defaultValue: `Create a detailed, professional infographic with the following EXACT content and text. 
All text must be clearly legible and accurately rendered.

INFOGRAPHIC TITLE (large, bold, at top):
"{{headline}}"

PROBLEM STATEMENT (subtitle):
"{{problemStatement}}"

STATISTICS SECTION (with icons, bold numbers):
{{statsSection}}

STEP-BY-STEP PROCESS (numbered flow with icons):
{{stepsSection}}

PRO TIPS SECTION (lightbulb icon, bullet points):
{{tipsSection}}

FOOTER (must include website URL):
"{{callToAction}} | Excelsior Creative | excelsiorcreative.com"

DESIGN REQUIREMENTS:
- 4K resolution, vertical format (9:16 aspect ratio)
- Dark background (#1a1a2e) with white and light gray text
- Accent color: vibrant orange (#FF5722) for highlights and icons
- Modern, clean flat design with geometric elements
- Clear visual hierarchy separating each section
- Professional tech/business aesthetic
- Use icons and visual elements for each statistic and step
- Ensure all text is crisp, legible, and accurately spelled
- Include subtle grid or pattern background for depth
- IMPORTANT: The footer MUST display the website URL "excelsiorcreative.com" prominently and legibly`,
          admin: {
            description: "Use {{headline}}, {{problemStatement}}, {{statsSection}}, {{stepsSection}}, {{tipsSection}}, and {{callToAction}} as placeholders.",
          },
        },
      ],
    },
  ],
};

