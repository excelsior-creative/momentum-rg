"use client";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import {
  combineSchemas,
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import type { Article, Media } from "@/payload-types";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calendar, Newspaper, Share2, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AdminImageGenerator from "./AdminImageGenerator";
import { useContactDialog } from "./ContactDialogProvider";
import RichText from "./RichText";
import InfographicLightbox from "./InfographicLightbox";
import { useState } from "react";
import { services, iconMap } from "@/data/services";

interface ArticlePageLayoutProps {
  article: Article;
  relatedArticles?: Article[];
  isRelatedByCategory?: boolean;
}

// Helper to get media URL
function getMediaUrl(
  media: Media | number | null | undefined
): string | undefined {
  if (!media || typeof media === "number") return undefined;
  return media.url || undefined;
}

// Helper to format date
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Related Article Card Component
const RelatedArticleCard = ({ article }: { article: Article }) => {
  const category =
    typeof article.category === "object" ? article.category : null;
  const imageUrl = getMediaUrl(article.featuredImage as Media);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block border-b border-zinc-200 pb-4 last:border-b-0 last:pb-0"
    >
      <div className="flex gap-4">
        <div className="relative w-20 h-20 flex-shrink-0 bg-zinc-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              sizes="80px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-zinc-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {category && (
            <span className="text-[10px] font-mono text-[#FF5722] uppercase tracking-wider block mb-1">
              {category.name}
            </span>
          )}
          <h4 className="text-sm font-bold text-zinc-900 group-hover:text-[#FF5722] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h4>
        </div>
      </div>
    </Link>
  );
};

export default function ArticlePageLayout({
  article,
  relatedArticles = [],
  isRelatedByCategory = true,
}: ArticlePageLayoutProps) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const { openContactDialog } = useContactDialog();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const category =
    typeof article.category === "object" ? article.category : null;
  const featuredImageUrl = getMediaUrl(article.featuredImage as Media);
  const infographicUrl = getMediaUrl(article.infographic as Media);

  // Generate structured data
  const structuredData = combineSchemas(
    generateArticleSchema(article),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Articles", url: "/articles" },
      { name: article.title, url: `/articles/${article.slug}` },
    ])
  );

  return (
    <div className="min-h-screen relative selection:bg-[#FF5722] selection:text-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navigation />

      {/* Hero Section - Dark Theme */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-brand-dark-gray text-zinc-100">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

        {/* Gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero SVG Art */}
        <motion.div
          style={{ y: heroY }}
          className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none z-0"
        >
          <Image
            src="/services/tree.svg"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain object-right"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-sm font-mono text-zinc-400 mb-8"
            >
              <Link href="/" className="hover:text-[#FF5722] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/articles"
                className="hover:text-[#FF5722] transition-colors"
              >
                Articles
              </Link>
              <span>/</span>
              <span className="text-zinc-400 truncate max-w-[200px]">
                {article.title}
              </span>
            </motion.div>

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {category && (
                <Link
                  href={`/articles?category=${category.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-1 bg-[#FF5722]/10 text-[#FF5722] text-sm font-mono uppercase tracking-wider mb-4 hover:bg-[#FF5722]/20 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {category.name}
                </Link>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-oswald leading-tight mb-6">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-zinc-400 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF5722]" />
                  <span className="text-sm">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                {article.structuredData?.author && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      By {article.structuredData.author}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title,
                        text: article.excerpt,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="flex items-center gap-2 hover:text-[#FF5722] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              <p className="text-xl text-zinc-300 leading-relaxed border-l-4 border-[#FF5722] pl-6">
                {article.excerpt}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Light Theme with 2-Column Layout */}
      <section className="py-16 bg-white text-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-8">
              {/* Featured Image */}
              {featuredImageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative aspect-[16/9] bg-zinc-100 overflow-hidden mb-12 rounded-lg"
                >
                  <Image
                    src={featuredImageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )}

              {/* Article Content with Larger Font */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-lg prose-zinc max-w-none text-zinc-900
                  prose-headings:font-oswald prose-headings:text-zinc-950 prose-headings:uppercase
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                  prose-p:text-zinc-900 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
                  prose-a:text-[#FF5722] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-zinc-950
                  prose-ul:text-zinc-900 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:text-zinc-900 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:leading-relaxed prose-li:text-lg prose-li:my-2
                  prose-blockquote:border-l-[#FF5722] prose-blockquote:bg-zinc-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-zinc-700
                  prose-img:rounded-lg prose-img:shadow-lg"
              >
                <RichText content={article.content} />
              </motion.div>

              {/* Infographic Display */}
              {infographicUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group relative cursor-pointer my-12"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <div className="relative aspect-[9/16] max-w-lg mx-auto bg-zinc-900 overflow-hidden rounded-lg border border-zinc-200 shadow-2xl">
                    <Image
                      src={infographicUrl}
                      alt={`${article.title} Infographic`}
                      fill
                      sizes="(max-width: 768px) 100vw, 512px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-[#FF5722] text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        View & Share Full Infographic
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                      Click to expand high-resolution infographic
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4">
              <div className="space-y-8">
                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <div className="bg-zinc-50 border border-zinc-200 p-6 relative">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF5722]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF5722]" />

                    <h3 className="text-lg font-bold uppercase font-oswald text-zinc-900 mb-6 flex items-center gap-2">
                      <span className="w-6 h-[2px] bg-[#FF5722]" />
                      {isRelatedByCategory
                        ? "Related Articles"
                        : "Recent Articles"}
                    </h3>
                    <div className="space-y-4">
                      {relatedArticles.slice(0, 5).map((relatedArticle) => (
                        <RelatedArticleCard
                          key={relatedArticle.id}
                          article={relatedArticle}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Infographic Sidebar Card */}
                {infographicUrl && (
                  <div
                    className="bg-zinc-50 border border-zinc-200 p-6 relative group cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF5722]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF5722]" />

                    <h3 className="text-lg font-bold uppercase font-oswald text-zinc-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-[2px] bg-[#FF5722]" />
                      Quick Reference
                    </h3>

                    <div className="relative aspect-[9/16] w-full bg-zinc-100 overflow-hidden rounded-sm border border-zinc-200">
                      <Image
                        src={infographicUrl}
                        alt={`${article.title} Infographic Preview`}
                        fill
                        sizes="(max-width: 1024px) 0vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-100"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                        <div className="bg-[#FF5722] p-2 rounded-full transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] font-mono text-zinc-500 mt-4 uppercase tracking-wider text-center group-hover:text-[#FF5722] transition-colors">
                      Click to expand & share
                    </p>
                  </div>
                )}

                {/* Core Services Sidebar Card */}
                <div className="bg-white border border-zinc-200 p-6 relative group">
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF5722]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF5722]" />

                  <h3 className="text-lg font-bold uppercase font-oswald text-zinc-900 mb-6 flex items-center gap-2">
                    <span className="w-6 h-[2px] bg-[#FF5722]" />
                    Expert Solutions
                  </h3>

                  <div className="space-y-4">
                    {["web-development", "software-development", "web-hosting"].map((slug) => {
                      const service = services.find((s) => s.slug === slug);
                      if (!service) return null;
                      const ServiceIcon = iconMap[service.icon];

                      return (
                        <Link
                          key={service.id}
                          href={`/services/${service.slug}`}
                          className="group/service block border-b border-zinc-100 last:border-0 pb-4 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-50 rounded flex items-center justify-center group-hover/service:bg-[#FF5722] group-hover/service:text-white transition-colors">
                              {ServiceIcon && <ServiceIcon className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-zinc-900 group-hover/service:text-[#FF5722] transition-colors uppercase font-oswald tracking-wider">
                                {service.title}
                              </h4>
                              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tight">
                                View Details →
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-zinc-900 p-6 relative">
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF5722]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E91E63]" />

                  <h3 className="text-lg font-bold uppercase font-oswald text-white mb-3">
                    Need Help?
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                    Our team is ready to help with your web development or
                    digital project.
                  </p>
                  <button
                    onClick={openContactDialog}
                    className="w-full py-3 bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(255,87,34,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Let's Cook</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories Card */}
                <div className="bg-white border border-zinc-200 p-6">
                  <h3 className="text-lg font-bold uppercase font-oswald text-zinc-900 mb-4">
                    Browse Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/articles"
                      className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-mono uppercase hover:bg-[#FF5722] hover:text-white transition-colors"
                    >
                      All
                    </Link>
                    {category && (
                      <Link
                        href={`/articles?category=${category.slug}`}
                        className="px-3 py-1 bg-[#FF5722] text-white text-xs font-mono uppercase"
                      >
                        {category.name}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Theme */}
      <section className="py-24 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5722]/5 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold uppercase font-oswald text-white mb-6">
                Need Expert{" "}
                <span className="text-gradient">Web Development?</span>
              </h2>
              <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
                Our team is ready to help with your web development, emergency
                repairs, or digital transformation projects in Orange County.
              </p>
              <button
                onClick={openContactDialog}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#FF5722] to-[#E91E63] px-8 py-4 text-white font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_60px_rgba(255,87,34,0.5)] transition-all hover:scale-105 rounded-full"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Infographic Lightbox */}
      {infographicUrl && (
        <InfographicLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          imageUrl={infographicUrl}
          title={article.title}
          excerpt={article.excerpt}
        />
      )}

      {/* Admin-only Image Generator */}
      <AdminImageGenerator
        articleId={article.id}
        hasExistingImage={!!featuredImageUrl}
      />
    </div>
  );
}
