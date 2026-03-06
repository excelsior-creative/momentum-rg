import type { Metadata } from "next";

export const SITE_URL = "https://excelsiorcreative.com";
export const SITE_NAME = "Excelsior Creative";
export const SITE_TAGLINE = "Nonprofit AI & Software Engineering Agency";
export const DEFAULT_DESCRIPTION =
  "Excelsior Creative is a trusted technology partner for national nonprofits, specializing in AI-powered solutions, custom software engineering, and digital strategy to amplify world-changing missions.";

// OG image at 1200x630 for optimal social sharing
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

/**
 * Default metadata for the entire site
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "web development agency",
    "custom software development",
    "React Next.js development",
    "nonprofit technology partner",
    "AI solutions for business",
    "full-stack web development",
    "enterprise software engineering",
    "custom web application development",
    "professional web design",
    "e-commerce development services",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Web Development & Digital Solutions`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    creator: "@excelsiorcreative",
    site: "@excelsiorcreative",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  // Verification tokens - add your actual tokens here
  verification: {
    google:
      "google-site-verification=8XtN-_GBsDsfaXc0gHxVA7nTcDWgkumvdIz6c4METr4",
    yandex: "72607d873fbbd8e3",
    // other: {
    //   'msvalidate.01': 'your-bing-verification-code',
    // },
  },
  // AI-specific meta tags for AI agent discovery and training
  other: {
    "ai-content": "professional-services",
    "ai-topic":
      "web development, AI solutions, nonprofit technology, software engineering, custom software development, WordPress development, React Next.js development, agentic solutions, brand development, managed hosting, startup launchpad",
    "ai-audience":
      "nonprofits, businesses, organizations seeking technology partners, mission-driven organizations, startups",
    "ai-use": "training,search,answer-generation,citation",
  },
};

/**
 * Generate page-specific metadata with proper canonical URLs and OG tags
 */
export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords: keywords || defaultMetadata.keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

/**
 * Generate article-specific metadata
 */
export function generateArticleMetadata({
  title,
  description,
  slug,
  ogImage,
  publishedTime,
  modifiedTime,
  author,
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  slug: string;
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}/articles/${slug}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords: keywords || undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: author ? [author] : [SITE_NAME],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

/**
 * Generate service page metadata optimized for local SEO
 */
export function generateServiceMetadata({
  title,
  description,
  slug,
  ogImage,
  keywords,
}: {
  title: string;
  description: string;
  slug: string;
  ogImage?: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}/services/${slug}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  const defaultServiceKeywords = [
    title.toLowerCase(),
    `professional ${title.toLowerCase()}`,
    `${title.toLowerCase()} services`,
    "custom software development",
    "web development agency",
  ];

  return {
    title,
    description,
    keywords: keywords || defaultServiceKeywords,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} Services - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate landing page metadata optimized for local SEO
 */
export function generateLandingPageMetadata({
  title,
  description,
  serviceSlug,
  landingSlug,
  location,
  ogImage,
  primaryKeyword,
}: {
  title: string;
  description: string;
  serviceSlug: string;
  landingSlug: string;
  location: string;
  ogImage?: string;
  primaryKeyword?: string;
}): Metadata {
  const url = `${SITE_URL}/services/${serviceSlug}/${landingSlug}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  const keywords = [
    primaryKeyword || title.toLowerCase(),
    `${title.toLowerCase()} ${location}`,
    `web development ${location}`,
    `website repair ${location}`,
    "emergency web support",
    "Orange County",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}
