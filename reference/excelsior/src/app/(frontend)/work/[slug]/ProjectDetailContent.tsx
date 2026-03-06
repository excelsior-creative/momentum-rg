"use client";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import RichText from "@/components/RichText";
import Button from "@/components/ui/Button";
import type { Media, Project } from "@/payload-types";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Tag, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services, iconMap } from "@/data/services";
import { combineSchemas, generateBreadcrumbSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/metadata";

type Props = {
  project: Project;
};

function getMediaUrl(
  media: number | Media | null | undefined
): string | undefined {
  if (!media) return undefined;
  if (typeof media === "number") return undefined;
  return media.url || undefined;
}

export default function ProjectDetailContent({ project }: Props) {
  const imageUrl = getMediaUrl(project.image) || project.imagePath || undefined;
  const tags = project.tags?.map((t) => t.tag) || [];
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Generate structured data for CreativeWork
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/work/${project.slug}/#project`,
    name: project.title,
    description: project.summary || project.description,
    url: `${SITE_URL}/work/${project.slug}`,
    image: imageUrl ? `${SITE_URL}${imageUrl}` : undefined,
    datePublished: project.createdAt,
    dateModified: project.updatedAt,
    author: {
      '@id': `${SITE_URL}/#organization`,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    about: tags.map(tag => ({ '@type': 'Thing', name: tag })),
    genre: project.category || 'Web Development',
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Work', url: '/work' },
    { name: project.title, url: `/work/${project.slug}` },
  ]);

  const combinedSchema = combineSchemas(creativeWorkSchema, breadcrumbSchema);

  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      {/* Structured Data */}
      {combinedSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
        />
      )}

      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

        {/* Gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero SVG Art */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none z-0">
          <Image
            src="/services/horse.svg"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain object-right"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
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
              href="/work"
              className="hover:text-[#FF5722] transition-colors"
            >
              Work
            </Link>
            <span>/</span>
            <span className="text-[#FF5722]">{project.title}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2 text-[#FF5722] font-mono text-sm tracking-widest mb-4">
                <span className="w-2 h-2 bg-[#FF5722] animate-pulse" />
                <span className="uppercase">[ {project.category} ]</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold uppercase font-oswald leading-[0.95] mb-6">
                {project.title}
              </h1>

              {/* Summary */}
              {project.summary && (
                <p className="text-xl text-zinc-400 leading-relaxed mb-8 border-l-2 border-[#FF5722]/30 pl-4">
                  {project.summary}
                </p>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 text-zinc-300 text-sm font-mono rounded"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              {project.link && (
                <Button
                  as="link"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </motion.div>

            {/* Project Screenshot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <button
                onClick={() => imageUrl && setLightboxOpen(true)}
                className="relative aspect-[8/5] bg-zinc-900 border border-white/10 overflow-hidden group cursor-zoom-in w-full transition-all duration-300 shadow-[0_0_0_rgba(255,87,34,0)] hover:shadow-[0_0_40px_rgba(255,87,34,0.5)] hover:border-[#FF5722]/50"
                disabled={!imageUrl}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF5722] z-20" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF5722] z-20" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF5722] z-20" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF5722] z-20" />

                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${project.title} website screenshot`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-zinc-600 font-mono text-sm">
                      No preview available
                    </span>
                  </div>
                )}

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="w-12 h-12 text-white/80" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Details Section - Light Theme */}
      <section className="py-16 bg-zinc-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Client Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-zinc-200"
            >
              <h3 className="text-xs font-mono text-[#FF5722] uppercase tracking-widest mb-2">
                Client
              </h3>
              <p className="text-xl font-bold text-zinc-900">
                {project.client || project.title}
              </p>
            </motion.div>

            {/* Year */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-zinc-200"
            >
              <h3 className="text-xs font-mono text-[#FF5722] uppercase tracking-widest mb-2">
                Year
              </h3>
              <p className="text-xl font-bold text-zinc-900">
                {project.year || new Date().getFullYear()}
              </p>
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-zinc-200"
            >
              <h3 className="text-xs font-mono text-[#FF5722] uppercase tracking-widest mb-2">
                Industry
              </h3>
              <p className="text-xl font-bold text-zinc-900">
                {project.category}
              </p>
            </motion.div>
          </div>

          {/* Services Used Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 p-8 bg-zinc-900 border border-white/10"
          >
            <h3 className="text-xs font-mono text-[#FF5722] uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FF5722]" />
              Services Provided
            </h3>
            <div className="flex flex-wrap gap-4">
              {/* Default to Web Development as most projects are web-based */}
              {["web-development", "software-development"].map((slug) => {
                const service = services.find((s) => s.slug === slug);
                if (!service) return null;
                const ServiceIcon = iconMap[service.icon];

                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:border-[#FF5722] hover:bg-white/10 transition-all group"
                  >
                    {ServiceIcon && <ServiceIcon className="w-4 h-4 text-[#FF5722]" />}
                    <span className="text-sm font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white">
                      {service.title}
                    </span>
                  </Link>
                );
              })}
              {/* If category matches a service (e.g. Brand), show it too */}
              {project.category.toLowerCase().includes("brand") && (
                <Link
                  href="/services/brand-development"
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:border-[#FF5722] hover:bg-white/10 transition-all group"
                >
                  <div className="w-4 h-4 text-[#FF5722] flex items-center justify-center font-bold">B</div>
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white">
                    Brand Development
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description Section - Light Theme */}
      {project.description && (
        <section className="py-16 bg-zinc-100 relative">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xs font-mono text-[#FF5722] uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF5722]" />
                About This Organization
              </h2>
              <div className="prose prose-lg max-w-none text-zinc-800 prose-p:text-zinc-700 prose-p:leading-relaxed prose-p:mb-6 prose-headings:font-oswald prose-headings:uppercase prose-headings:text-zinc-900 prose-a:text-[#FF5722] prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 prose-li:text-zinc-700 [&>div>p]:mb-6 [&>div]:text-zinc-700 [&_p]:text-zinc-700">
                <RichText content={project.description} />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-zinc-900 relative overflow-hidden">
        {/* Background effects */}
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

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-white mb-6">
              Want Results <span className="text-gradient">Like This?</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help transform your digital presence
              and drive real impact for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="link" href="/#contact">
                Start Your Project
              </Button>
              <Button as="link" href="/work" variant="secondary">
                View More Work
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imageUrl}
                alt={`${project.title} website screenshot`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 90vw"
              />
            </motion.div>

            {/* Click anywhere hint */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm font-mono">
              Click anywhere to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
