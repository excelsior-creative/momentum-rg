import { getPayload } from "payload";
import config from "@/payload.config";
import IndustryPageLayout from "@/components/IndustryPageLayout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/metadata";

interface IndustryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  
  const { docs } = await payload.find({
    collection: "industry-landing-pages",
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  });

  if (!docs[0]) return { title: "Not Found" };

  const industry = docs[0];
  const seo = industry.seo || {};
  const ogImage = typeof industry.featuredImage === 'object' && industry.featuredImage?.url
    ? (industry.featuredImage.url.startsWith('http') ? industry.featuredImage.url : `${SITE_URL}${industry.featuredImage.url}`)
    : undefined;

  return {
    title: seo.metaTitle || `${industry.industryName} Web Design & SEO | Excelsior Creative`,
    description: seo.metaDescription || industry.hero.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.metaTitle || industry.industryName,
      description: seo.metaDescription || industry.hero.description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "industry-landing-pages",
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  });

  if (docs.length === 0) {
    notFound();
  }

  return <IndustryPageLayout data={docs[0]} />;
}

// Pre-generate some popular industry paths
export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "industry-landing-pages",
    limit: 100,
    select: {
      slug: true,
    },
  });

  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

