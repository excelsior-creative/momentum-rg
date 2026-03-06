"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useContactDialog } from "./ContactDialogProvider";
import type { Media } from "@/payload-types";
import { ServiceData, iconMap, services } from "@/data/services";
import SectionBadge from "./ui/SectionBadge";
import Button from "./ui/Button";
import CalculatorSection from "./calculators/CalculatorSection";
import { combineSchemas, generateFAQPageSchema, generateServiceSchema } from "@/lib/structured-data";

// Props interface for service data
interface ServicePageLayoutProps {
  service: ServiceData;
}

// Helper to get image URL from Payload media (not really needed for static but kept for safety if we use Media types)
function getMediaUrl(media: number | Media | null | undefined): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'number') return undefined;
  return media.url || undefined;
}

// FAQ Accordion Item - Light theme version
const FAQItem: React.FC<{ faq: { question: string; answer: string }; index: number }> = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border-b border-zinc-200"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium text-zinc-900 group-hover:text-[#FF5722] transition-colors pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#FF5722] transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-zinc-600 leading-relaxed">{faq.answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Feature Card - Light theme
const FeatureCard: React.FC<{ feature: { title: string; description: string; icon: string }; index: number }> = ({
  feature,
  index,
}) => {
  const Icon = iconMap[feature.icon];
  if (!Icon) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-zinc-100 border border-zinc-200 p-8 hover:border-[#FF5722]/50 transition-all duration-300"
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-300 group-hover:border-[#FF5722] transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-300 group-hover:border-[#FF5722] transition-colors" />

      <div className="w-14 h-14 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
      </div>

      <h4 className="text-xl font-bold uppercase font-oswald text-zinc-900 mb-3 group-hover:text-[#FF5722] transition-colors">
        {feature.title}
      </h4>

      <p className="text-zinc-600 text-sm leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
};

// Process Step - Dark theme
const ProcessStepCard: React.FC<{ step: { number: string; title: string; description: string }; index: number }> = ({
  step,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="relative flex gap-6 group"
    >
      {/* Number */}
      <div className="flex-shrink-0 w-16 h-16 bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-[#FF5722] transition-colors">
        <span className="text-2xl font-bold font-oswald text-[#FF5722]">
          {step.number}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 pb-12 border-l border-white/10 pl-6 group-last:border-l-0">
        <h4 className="text-xl font-bold uppercase font-oswald text-white mb-2">
          {step.title}
        </h4>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Connector line */}
      {index < 3 && (
        <div className="absolute left-8 top-16 w-[2px] h-12 bg-gradient-to-b from-[#FF5722]/50 to-transparent" />
      )}
    </motion.div>
  );
};

// Case Study Card - Light theme
const CaseStudyCard: React.FC<{ study: { result: string; project?: any }; index: number }> = ({
  study,
  index,
}) => {
  const project = study.project;
  const title = project?.title || 'Case Study';
  const category = project?.category || 'Project';
  const imageUrl = project?.image ? getMediaUrl(project.image) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#FF5722]/50 transition-all shadow-sm hover:shadow-lg"
    >
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-zinc-100 to-zinc-200 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-zinc-400 font-mono text-xs">
              CASE_STUDY_{String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="text-[#FF5722] text-xs font-mono uppercase tracking-widest">
          {category}
        </span>
        <h4 className="text-lg font-bold uppercase font-oswald text-zinc-900 mt-2 mb-3">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <Check className="w-4 h-4 text-[#FF5722]" />
          <span>{study.result}</span>
        </div>
      </div>
    </motion.div>
  );
};

const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({ service }) => {
  const Icon = iconMap[service.icon];
  const heroRef = useRef<HTMLElement>(null);
  const { openContactDialog } = useContactDialog();
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroImageOpacity = useTransform(scrollY, [0, 300], [0.15, 0.05]);

  // Use uploaded media URL, or fall back to static path
  const heroImageUrl = service.heroImagePath || undefined;
  const features = service.features || [];
  const approach = service.approach || [];
  const faqs = service.faqs || [];

  // Generate schemas
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description,
    url: `/services/${service.slug}`,
    image: heroImageUrl,
  });

  const faqSchema = generateFAQPageSchema(faqs);
  const combinedSchema = combineSchemas(serviceSchema, faqSchema);

  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      {/* Structured Data */}
      {combinedSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
        />
      )}

      {/* Hero Section - Dark */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E91E63]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Parallax Hero Image */}
        {heroImageUrl && (
          <motion.div
            style={{ y: heroImageY, opacity: heroImageOpacity }}
            className="absolute right-0 top-0 w-1/2 h-full pointer-events-none hidden lg:block"
          >
            <div className="relative w-full h-full">
              <Image
                src={heroImageUrl}
                alt=""
                aria-hidden="true"
                fill
                sizes="50vw"
                className="object-contain object-right-top"
                priority
              />
            </div>
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-3xl">
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
                href="/#services"
                className="hover:text-[#FF5722] transition-colors"
              >
                Services
              </Link>
              <span>/</span>
              <span className="text-[#FF5722]">{service.title}</span>
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,87,34,0.3)]"
            >
              <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold uppercase font-oswald leading-[0.95] mb-6"
            >
              <span className="text-white">{service.title.split(" ")[0]}</span>
              <br />
              <span className="text-gradient">
                {service.title.split(" ").slice(1).join(" ") || "Services"}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-zinc-300 mb-8 font-light"
            >
              {service.tagline}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-zinc-400 leading-relaxed border-l-4 border-[#FF5722]/30 pl-6 text-lg"
            >
              {service.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Button onClick={openContactDialog} showFlame>
                Start Your Project
              </Button>
              <Button variant="secondary" as="link" href="/work">
                View Our Work
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Deliver Section - Light Theme */}
      {features.length > 0 && (
        <section className="py-24 bg-zinc-50 relative">
          <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <SectionBadge className="mb-2">What_We_Deliver</SectionBadge>
            <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900">
              Core <span className="text-gradient">Capabilities</span>
            </h2>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title || i} feature={feature} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Calculator Section */}
      {service.hasCalculator && (
        <CalculatorSection serviceSlug={service.slug} />
      )}

      {/* Our Approach Section - Dark Theme */}
      {approach.length > 0 && (
        <section className="py-24 bg-zinc-900 relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: Title */}
              <div>
                <SectionBadge className="mb-2">Our_Approach</SectionBadge>
                <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-white mb-6">
                  How We <Link href="/process" className="text-gradient hover:opacity-80 transition-opacity">Work</Link>
                </h2>
                <p className="text-zinc-400 leading-relaxed">
                  Our battle-tested methodology ensures every project delivers
                  exceptional results. We combine strategic thinking with
                  technical excellence to exceed expectations.
                </p>
              </div>

              {/* Right: Process Steps */}
              <div className="space-y-2">
                {approach.map((step, i) => (
                  <ProcessStepCard key={step.number || i} step={step} index={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section - Light Theme */}
      {faqs.length > 0 && (
        <section className="py-24 bg-white relative">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900">
                Common <span className="text-gradient">Questions</span>
              </h2>
            </div>

            <div className="border-t border-zinc-200">
              {faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services Section - Light Theme */}
      {service.relatedServices && service.relatedServices.length > 0 && (
        <section className="py-24 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <SectionBadge className="mb-2">Expand_Your_Impact</SectionBadge>
              <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900">
                Related <span className="text-gradient">Services</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.relatedServices.map((slug) => {
                const relatedService = services.find((s) => s.slug === slug);
                if (!relatedService) return null;
                const RelatedIcon = iconMap[relatedService.icon];

                return (
                  <Link
                    key={relatedService.id}
                    href={`/services/${relatedService.slug}`}
                    className="group bg-white border border-zinc-200 p-8 hover:border-[#FF5722]/30 transition-all hover:shadow-xl"
                  >
                    <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#FF5722] group-hover:text-white transition-colors">
                      {RelatedIcon && <RelatedIcon className="w-6 h-6" />}
                    </div>
                    <h3 className="text-xl font-bold uppercase font-oswald text-zinc-900 mb-3 group-hover:text-[#FF5722] transition-colors">
                      {relatedService.title}
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-6 line-clamp-2">
                      {relatedService.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-[#FF5722] text-sm font-bold uppercase tracking-widest">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Dark Theme */}
      <section className="py-32 bg-brand-dark-gray relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF5722]/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF5722]/5 rounded-full blur-[150px]" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold uppercase font-oswald text-white mb-6">
              {service.ctaTitle || "Ready to Get Started?"}
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              {service.ctaDescription || "Let's discuss your project and how we can help."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={openContactDialog}>
                Let&apos;s Talk
              </Button>
              <Link 
                href="/work" 
                className="text-sm font-mono uppercase tracking-widest text-zinc-500 hover:text-[#FF5722] transition-colors flex items-center gap-2 group"
              >
                <span>View Related Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicePageLayout;
