"use client";

import {
  combineSchemas,
  generateFAQPageSchema,
  generateWebPageSchema,
} from "@/lib/structured-data";
import { motion, useScroll, useTransform } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight, ChevronDown, LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useContactDialog } from "./ContactDialogProvider";
import Footer from "./Footer";
import Navigation from "./Navigation";
import Button from "./ui/Button";
import SectionBadge from "./ui/SectionBadge";

interface IndustryPageLayoutProps {
  data: any; // Using any for simplicity with dynamic data
}

// FAQ Accordion Item
const FAQItem: React.FC<{
  faq: { question: string; answer: string };
  index: number;
}> = ({ faq, index }) => {
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

// Pain Point Card
const PainPointCard: React.FC<{
  point: { title: string; description: string; icon: string };
  index: number;
}> = ({ point, index }) => {
  const IconComponent = LucideIcons[point.icon as keyof typeof LucideIcons] as
    | LucideIcon
    | undefined;
  const Icon = IconComponent || LucideIcons.Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-zinc-100 border border-zinc-200 p-8 hover:border-[#FF5722]/50 transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-300 group-hover:border-[#FF5722] transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-300 group-hover:border-[#FF5722] transition-colors" />

      <div className="w-14 h-14 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
      </div>

      <h4 className="text-xl font-bold uppercase font-oswald text-zinc-900 mb-3 group-hover:text-[#FF5722] transition-colors">
        {point.title}
      </h4>

      <p className="text-zinc-600 text-sm leading-relaxed">
        {point.description}
      </p>
    </motion.div>
  );
};

// Process Step
const ProcessStepCard: React.FC<{
  step: { stepNumber: string; title: string; description: string };
  index: number;
}> = ({ step, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="relative flex gap-6 group"
    >
      <div className="flex-shrink-0 w-16 h-16 bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-[#FF5722] transition-colors">
        <span className="text-2xl font-bold font-oswald text-[#FF5722]">
          {step.stepNumber}
        </span>
      </div>

      <div className="flex-1 pb-12 border-l border-white/10 pl-6 group-last:border-l-0">
        <h4 className="text-xl font-bold uppercase font-oswald text-white mb-2">
          {step.title}
        </h4>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {step.description}
        </p>
      </div>

      {index < 3 && (
        <div className="absolute left-8 top-16 w-[2px] h-12 bg-gradient-to-b from-[#FF5722]/50 to-transparent" />
      )}
    </motion.div>
  );
};

const IndustryPageLayout: React.FC<IndustryPageLayoutProps> = ({ data }) => {
  const { openContactDialog } = useContactDialog();
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroImageOpacity = useTransform(scrollY, [0, 300], [0.15, 0.05]);

  const featuredImageUrl =
    typeof data.featuredImage === "object" ? data.featuredImage.url : null;
  const infographicUrl =
    typeof data.infographic === "object" ? data.infographic.url : null;

  // Generate structured data
  const pageUrl = `/industries/${data.slug}`;
  const webPageSchema = generateWebPageSchema({
    title: data.industryName,
    description: data.hero.description,
    url: pageUrl,
  });

  const faqSchema =
    data.faqs && data.faqs.length > 0 ? generateFAQPageSchema(data.faqs) : null;

  const combinedSchema = combineSchemas(webPageSchema, faqSchema);

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
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E91E63]/10 rounded-full blur-[100px] pointer-events-none" />

        {featuredImageUrl && (
          <motion.div
            style={{ y: heroImageY, opacity: heroImageOpacity }}
            className="absolute right-0 top-0 w-1/2 h-full pointer-events-none hidden lg:block"
          >
            <div className="relative w-full h-full">
              <Image
                src={featuredImageUrl}
                alt={data.industryName}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-mono text-zinc-400 mb-8"
            >
              <Link href="/" className="hover:text-[#FF5722] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/industries"
                className="hover:text-[#FF5722] transition-colors"
              >
                Industries
              </Link>
              <span>/</span>
              <span className="text-[#FF5722]">{data.industryName}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold uppercase font-oswald leading-[0.95] mb-6"
            >
              <span className="text-white">
                {data.hero.headline.split(" ")[0]}
              </span>
              <br />
              <span className="text-gradient">
                {data.hero.headline.split(" ").slice(1).join(" ")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-zinc-300 mb-8 font-light"
            >
              {data.hero.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-zinc-400 leading-relaxed border-l-4 border-[#FF5722]/30 pl-6 text-lg"
            >
              {data.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Button onClick={openContactDialog} showFlame>
                Let's Transform Your Business
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-zinc-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <SectionBadge className="mb-2">Industry_Challenges</SectionBadge>
            <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900">
              The Hurdles <span className="text-gradient">You Face</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.painPoints.map((point: any, i: number) => (
              <PainPointCard key={i} point={point} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Services/Benefits Section */}
      <section className="py-24 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <SectionBadge className="mb-2">Our_Solutions</SectionBadge>
            <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-white">
              Why We Are <span className="text-gradient">The Best Choice</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {data.services.map((service: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-800/50 border border-white/5 p-8 rounded-lg"
              >
                <h3 className="text-2xl font-bold uppercase font-oswald text-[#FF5722] mb-4">
                  {service.serviceTitle}
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {service.industrySpecificBenefit}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infographic Section */}
      {infographicUrl && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionBadge className="mb-2">Visual_Strategy</SectionBadge>
                <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900 mb-6">
                  Industry <span className="text-gradient">Insights</span>
                </h2>
                <p className="text-zinc-600 text-lg leading-relaxed mb-8">
                  We've distilled the key metrics and processes that drive
                  success in the {data.industryName} sector. This infographic
                  outlines our strategic approach to solving your most pressing
                  digital challenges.
                </p>
                <Button onClick={openContactDialog} variant="secondary">
                  Download Full Guide
                </Button>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-[9/16] max-w-md mx-auto shadow-2xl rounded-2xl overflow-hidden border border-zinc-200"
              >
                <Image
                  src={infographicUrl}
                  alt={`${data.industryName} Infographic`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-24 bg-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionBadge className="mb-2">Our_Approach</SectionBadge>
              <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-white mb-6">
                How We <span className="text-gradient">Work</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Our tailored methodology for {data.industryName} ensures that
                every digital asset we create is aligned with your specific
                business goals and industry standards.
              </p>
            </div>

            <div className="space-y-2">
              {data.process.map((step: any, i: number) => (
                <ProcessStepCard key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-brand-dark-gray border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {data.statistics.map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-6xl font-bold font-oswald text-[#FF5722] mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-400 uppercase tracking-widest text-xs font-bold">
                  {stat.label}
                </div>
                {stat.source && (
                  <div className="text-zinc-600 text-[10px] mt-2 italic">
                    Source: {stat.source}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900">
              Industry <span className="text-gradient">Questions</span>
            </h2>
          </div>

          <div className="border-t border-zinc-200">
            {data.faqs.map((faq: any, i: number) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-dark-gray relative overflow-hidden">
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
              {data.cta.title}
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              {data.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={openContactDialog}>
                Start Your Transformation
              </Button>
              <Link
                href="/work"
                className="text-sm font-mono uppercase tracking-widest text-zinc-500 hover:text-[#FF5722] transition-colors flex items-center gap-2 group"
              >
                <span>View Case Studies</span>
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

export default IndustryPageLayout;
