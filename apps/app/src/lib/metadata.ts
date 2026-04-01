import type { Metadata } from "next";

export const DEFAULT_SITE_URL = "https://momentumrg.com";
export const SITE_NAME = "Momentum Realty Group";
export const SITE_TAGLINE = "Putting Purpose Behind Every Property";
export const DEFAULT_DESCRIPTION =
  "Momentum Realty Group — Orange County real estate experts. Helping buyers, sellers, and investors across Orange County, LA County, and Riverside County since 2009.";
export const SITE_PHONE = "+17143363375";
export const SITE_EMAIL = "karl@momentumrg.com";
export const SITE_ADDRESS = {
  streetAddress: "10554 Progress Way, Unit C",
  addressLocality: "Cypress",
  addressRegion: "CA",
  postalCode: "90630",
  addressCountry: "US",
} as const;
export const SITE_GEO = {
  latitude: 33.6553,
  longitude: -117.8622,
} as const;
export const SERVICE_AREA_CITIES = [
  "Long Beach",
  "Huntington Beach",
  "La Habra",
  "La Mirada",
  "Anaheim",
  "Riverside",
] as const;

function normalizeSiteUrl(candidate?: string | null) {
  if (!candidate) return DEFAULT_SITE_URL;

  const trimmed = candidate.trim();
  if (!trimmed) return DEFAULT_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

function resolveSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL;

  if (configuredUrl) {
    return normalizeSiteUrl(configuredUrl);
  }

  // Preview deployments should still canonicalize to production.
  return DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();
export const DEFAULT_OG_IMAGE = "/opengraph-image";
export const DEFAULT_TWITTER_IMAGE = "/twitter-image";

export function buildAbsoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function isPreviewDeployment() {
  return process.env.VERCEL_ENV === "preview";
}

function resolvePageTitle(title: string): Metadata["title"] {
  return title.includes(SITE_NAME) ? { absolute: title } : title;
}

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
    "real estate",
    "Orange County real estate",
    "homes for sale Orange County",
    "real estate broker",
    "Karl Parize",
    "Momentum Realty Group",
    "property listings",
    "buy home Orange County",
    "sell home Orange County",
    "Long Beach real estate",
    "Huntington Beach homes for sale",
    "La Habra real estate",
    "La Mirada homes",
    "property management Orange County",
    "1031 exchange Orange County",
    "investment property Orange County",
    "homes 90804",
    "homes 90803",
    "homes 90815",
    "homes 92649",
    "homes 90631",
    "Riverside County real estate",
    "Los Angeles County real estate",
    "multi-unit property management",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  manifest: "/manifest.webmanifest",
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
        url: buildAbsoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [buildAbsoluteUrl(DEFAULT_TWITTER_IMAGE)],
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
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
};

/**
 * Generate page-specific metadata
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
  const url = buildAbsoluteUrl(path);
  const image = buildAbsoluteUrl(ogImage || DEFAULT_OG_IMAGE);

  return {
    title: resolvePageTitle(title),
    description,
    keywords: keywords || (defaultMetadata.keywords as string[]),
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
  const url = buildAbsoluteUrl(`/articles/${slug}`);
  const image = buildAbsoluteUrl(ogImage || DEFAULT_OG_IMAGE);

  return {
    title: resolvePageTitle(title),
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

