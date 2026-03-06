import type { Media, Post, Property } from "@/payload-types";
import {
  buildAbsoluteUrl,
  DEFAULT_DESCRIPTION,
  SERVICE_AREA_CITIES,
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_GEO,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
} from "./metadata";

export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type BreadcrumbItem = {
  name: string;
  path: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

function absoluteMediaUrl(value?: string | null) {
  if (!value) return null;
  return value.startsWith("http") ? value : buildAbsoluteUrl(value);
}

export function generateBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: buildAbsoluteUrl("/icon"),
      width: 512,
      height: 512,
    },
    image: buildAbsoluteUrl("/opengraph-image"),
    description: DEFAULT_DESCRIPTION,
    foundingDate: "2009",
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    areaServed: SERVICE_AREA_CITIES.map((name) => ({
      "@type": "City",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      ...SITE_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_GEO.latitude,
      longitude: SITE_GEO.longitude,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE_PHONE,
        email: SITE_EMAIL,
        contactType: "customer service",
        areaServed: "US-CA",
        availableLanguage: ["English"],
      },
    ],
    employee: [
      {
        "@type": "Person",
        name: "Karl Parize",
        jobTitle: "Broker / Owner",
        telephone: SITE_PHONE,
        email: SITE_EMAIL,
      },
    ],
    sameAs: [SITE_URL],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@id": BUSINESS_ID,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/articles?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };
}

export function generateArticleSchema(article: Post) {
  const featuredImage = article.featuredImage as Media | undefined;
  const infographic = article.infographic as Media | undefined;
  const imageUrls = [featuredImage?.url, infographic?.url]
    .map((value) => absoluteMediaUrl(value))
    .filter((value): value is string => Boolean(value));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/articles/${article.slug}#article`,
    headline: article.title,
    description: article.meta?.description || article.excerpt,
    author: {
      "@id": BUSINESS_ID,
    },
    publisher: {
      "@id": BUSINESS_ID,
    },
    datePublished: article.publishedDate,
    dateModified: article.updatedAt,
    ...(imageUrls.length > 0 ? { image: imageUrls } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${article.slug}`,
    },
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#contact-page`,
    url: buildAbsoluteUrl("/contact"),
    name: `Contact ${SITE_NAME}`,
    description: "Contact Momentum Realty Group for real estate and property management guidance.",
    mainEntity: {
      "@id": BUSINESS_ID,
    },
  };
}

export function generateListingSchema({
  property,
  images,
}: {
  property: Property;
  images: string[];
}) {
  const pageUrl = buildAbsoluteUrl(`/listings/${property.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${pageUrl}#listing`,
    name: property.title,
    description: property.excerpt || undefined,
    url: pageUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    provider: {
      "@id": BUSINESS_ID,
    },
    broker: {
      "@id": BUSINESS_ID,
    },
    ...(images.length > 0 ? { image: images.map((image) => absoluteMediaUrl(image) || image) } : {}),
    ...(property.price
      ? {
          offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "USD",
            availability:
              property.status === "for-sale" || property.status === "for-lease"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
          },
        }
      : {}),
    ...(property.address || property.city || property.zipCode
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: property.address || undefined,
            addressLocality: property.city || undefined,
            addressRegion: property.state || "CA",
            postalCode: property.zipCode || undefined,
            addressCountry: "US",
          },
        }
      : {}),
    ...(property.sqft
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: property.sqft,
            unitCode: "FTK",
          },
        }
      : {}),
    ...(property.bedrooms != null ? { numberOfBedrooms: property.bedrooms } : {}),
    ...(property.bathrooms != null ? { numberOfBathroomsTotal: property.bathrooms } : {}),
    ...(property.bedrooms != null ? { numberOfRooms: property.bedrooms } : {}),
    ...(property.yearBuilt ? { yearBuilt: property.yearBuilt } : {}),
    ...(property.features?.length
      ? {
          amenityFeature: property.features.map((feature) => ({
            "@type": "LocationFeatureSpecification",
            name: feature.feature,
            value: true,
          })),
        }
      : {}),
    ...(property.dateAdded ? { datePosted: property.dateAdded } : {}),
  };
}

export function generateGlobalSchema() {
  return combineSchemas(generateBusinessSchema(), generateWebSiteSchema());
}

export function combineSchemas(...schemas: (object | null)[]) {
  const validSchemas = schemas.filter(Boolean);
  if (validSchemas.length === 0) return null;
  if (validSchemas.length === 1) return validSchemas[0];

  return {
    "@context": "https://schema.org",
    "@graph": validSchemas.map((schema) => {
      const { "@context": _, ...rest } = schema as { "@context"?: string };
      return rest;
    }),
  };
}
