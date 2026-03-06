import ArticlePageLayout from "@/components/ArticlePageLayout";
import { SITE_URL } from "@/lib/metadata";
import { getArticleBySlug, getArticles } from "@/lib/payload";
import type { Media } from "@/payload-types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Revalidate page every 60 seconds
export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Helper to get media URL
function getMediaUrl(
  media: Media | number | null | undefined
): string | undefined {
  if (!media || typeof media === "number") return undefined;
  return media.url || undefined;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const metaTitle = article.seo?.metaTitle || article.title;
  const metaDescription = article.seo?.metaDescription || article.excerpt;
  const ogImage =
    getMediaUrl(article.seo?.ogImage as Media) ||
    getMediaUrl(article.featuredImage as Media);
  const absoluteOgImage =
    ogImage && !ogImage.startsWith("http") ? `${SITE_URL}${ogImage}` : ogImage;

  return {
    title: `${metaTitle} | Excelsior Creative`,
    description: metaDescription,
    keywords: article.seo?.keywords || undefined,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: [article.structuredData?.author || "Excelsior Creative"],
      images: absoluteOgImage ? [{ url: absoluteOgImage }] : [],
    },
    robots: article.seo?.noIndex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical:
        article.seo?.canonicalUrl || `${SITE_URL}/articles/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get related articles from the same category
  const allArticles = await getArticles();
  const category =
    typeof article.category === "object" ? article.category : null;

  // First try to get articles from the same category
  const sameCategoryArticles = allArticles
    .filter((a) => {
      if (a.id === article.id) return false;
      const aCategory = typeof a.category === "object" ? a.category : null;
      return aCategory?.slug === category?.slug;
    })
    .slice(0, 3);

  // If no related articles in same category, fall back to recent articles
  const hasRelatedInCategory = sameCategoryArticles.length > 0;
  const relatedArticles = hasRelatedInCategory
    ? sameCategoryArticles
    : allArticles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <ArticlePageLayout
      article={article}
      relatedArticles={relatedArticles}
      isRelatedByCategory={hasRelatedInCategory}
    />
  );
}
