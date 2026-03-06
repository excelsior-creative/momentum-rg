import MainContent from "@/components/MainContent";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/metadata";
import { getFeaturedProjects, getArticles } from "@/lib/payload";
import { siteConfig } from "@/data/site-config";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const siteName = siteConfig.siteName;
  const tagline = siteConfig.tagline;
  const description = siteConfig.description;

  return {
    title: `${siteName} | ${tagline}`,
    description,
    keywords: [
      "web development agency",
      "custom software development",
      "React Next.js developers",
      "nonprofit technology partner",
      "AI solutions for business",
      "full-stack web development",
      "enterprise software engineering",
      "custom web application development",
      "professional web design",
      "SaaS platform development",
    ],
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title: `${siteName} | ${tagline}`,
      description,
      type: "website",
      siteName,
      url: SITE_URL,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${siteName} - Web Development Orange County`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | ${tagline}`,
      description,
      images: [DEFAULT_OG_IMAGE],
      creator: "@excelsiorcreative",
    },
  };
}

export default async function Home() {
  const [projects, articles] = await Promise.all([
    getFeaturedProjects(),
    getArticles({ limit: 3 }),
  ]);

  return (
    <MainContent
      projects={projects}
      articles={articles}
    />
  );
}
