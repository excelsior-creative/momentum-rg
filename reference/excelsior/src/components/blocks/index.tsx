"use client";

import Button from "@/components/ui/Button";
import SectionBadge from "@/components/ui/SectionBadge";
import { getIcon as getIconComponent } from "@/lib/icons";
import type { Media } from "@/payload-types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  FileCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useContactDialog } from "../ContactDialogProvider";

// Helper to get image URL from Payload media
function getMediaUrl(
  media: number | Media | null | undefined
): string | undefined {
  if (!media) return undefined;
  if (typeof media === "number") return undefined;
  return media.url || undefined;
}

// Type definitions for blocks (formerly from Page collection)
export type BlockType =
  | {
      blockType: "cta-block";
      theme?: "dark" | "light" | null;
      headline: string;
      description?: string | null;
      buttonText: string;
      buttonLink: string;
      secondaryText?: string | null;
    }
  | {
      blockType: "values-block";
      theme?: "dark" | "light" | null;
      sectionBadge?: string | null;
      headline: string;
      headlineAccent?: string | null;
      description?: string | null;
      values?: Array<{
        icon: string;
        title: string;
        description: string;
        link?: string | null;
      }> | null;
    }
  | {
      blockType: "team-block";
      theme?: "dark" | "light" | null;
      sectionBadge?: string | null;
      headline: string;
      headlineAccent?: string | null;
      description?: string | null;
      members?: Array<{
        name: string;
        role: string;
        bio?: string | null;
        photo?: number | Media | null;
        imagePath?: string | null;
      }> | null;
      footerText?: string | null;
      footerLinkText?: string | null;
      footerLinkUrl?: string | null;
    }
  | {
      blockType: "story-block";
      sectionBadge?: string | null;
      headline: string;
      headlineAccent?: string | null;
      paragraphs?: Array<{ text: string }> | null;
      footerLinkText?: string | null;
      footerLinkUrl?: string | null;
      stats?: Array<{
        value: string;
        label: string;
        hoverColor?: "black" | "orange" | "pink" | null;
      }> | null;
    }
  | {
      blockType: "checklist-block";
      theme?: "dark" | "light" | null;
      sectionBadge?: string | null;
      headline: string;
      headlineAccent?: string | null;
      items?: Array<{ text: string }> | null;
      sidebar?: {
        title?: string | null;
        description?: string | null;
        stats?: Array<{ value: string; label: string }> | null;
        linkText?: string | null;
        linkUrl?: string | null;
      } | null;
    }
  | {
      blockType: "process-steps-block";
      theme?: "dark" | "light" | null;
      sectionBadge?: string | null;
      headline: string;
      headlineAccent?: string | null;
      description?: string | null;
      steps?: Array<{
        number: string;
        icon: string;
        title: string;
        tagline?: string | null;
        description: string;
        details?: Array<{ item: string }> | null;
        deliverables?: Array<{ item: string }> | null;
        links?: Array<{ label: string; href: string }> | null;
      }> | null;
    }
  | {
      blockType: "differentiator-block";
      theme?: "dark" | "light" | null;
      sectionBadge?: string | null;
      headline?: string | null;
      headlineAccent?: string | null;
      description?: string | null;
      items?: Array<{
        icon: string;
        title: string;
        description: string;
      }> | null;
    }
  | {
      blockType: "expectations-block";
      sectionBadge?: string | null;
      headline?: string | null;
      headlineAccent?: string | null;
      description?: string | null;
      expectations?: Array<{
        icon: string;
        title: string;
        description: string;
      }> | null;
      timeline?: Array<{ phase: string; duration: string }> | null;
      timelineNote?: string | null;
    }
  | {
      blockType: "legal-content-block";
      sections?: Array<{ heading: string; content: any }> | null;
      contactInfo?: {
        show?: boolean | null;
        companyName?: string | null;
        location?: string | null;
        email?: string | null;
      } | null;
    }
  | {
      blockType: "faq-block";
      theme?: "dark" | "light" | null;
      sectionBadge?: string | null;
      headline: string;
      headlineAccent?: string | null;
      faqs?: Array<{ question: string; answer: string }> | null;
    }
  | {
      blockType: "feature-grid-block";
      theme?: "dark" | "light" | null;
      categoryTitle: string;
      categoryDescription?: string | null;
      features?: Array<{
        icon: string;
        title: string;
        description: string;
      }> | null;
    }
  | {
      blockType: "passion-cards-block";
      theme?: "dark" | "light" | null;
      sectionBadge?: string | null;
      headline: string;
      headlineAccent?: string | null;
      description?: string | null;
      cards?: Array<{
        icon: string;
        title: string;
        description: string;
      }> | null;
    }
  | {
      blockType: "partner-checklist-block";
      theme?: "dark" | "light" | null;
      sectionBadge?: string | null;
      headline: string;
      headlineAccent?: string | null;
      description?: string | null;
      items?: Array<{ text: string }> | null;
      bottomNote?: string | null;
    };

// CTA Block Component
export function CtaBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "cta-block" }>;
}) {
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-32 relative overflow-hidden ${
        isDark ? "bg-zinc-900" : "bg-white"
      }`}
    >
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF5722]/5 to-transparent" />
      )}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2
            className={`text-4xl md:text-6xl font-bold uppercase font-oswald mb-6 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.headline?.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gradient">
              {block.headline?.split(" ").slice(-1)[0]}
            </span>
          </h2>
          {block.description && (
            <p
              className={`text-xl mb-10 max-w-2xl mx-auto ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {block.description}
            </p>
          )}
          <Button as="link" href={block.buttonLink || "/#contact"}>
            {block.buttonText}
          </Button>
          {block.secondaryText && (
            <p
              className={`mt-8 font-mono text-sm ${
                isDark ? "text-zinc-500" : "text-zinc-500"
              }`}
            >
              {block.secondaryText}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Values Block Component
export function ValuesBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "values-block" }>;
}) {
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-24 relative overflow-hidden ${
        isDark ? "bg-zinc-900" : "bg-zinc-50"
      }`}
    >
      {isDark && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF5722]/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF5722]/5 rounded-full blur-[200px]" />
        </>
      )}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          {block.sectionBadge && (
            <SectionBadge className="mb-2 justify-center">
              {block.sectionBadge}
            </SectionBadge>
          )}
          <h3
            className={`text-4xl md:text-5xl font-bold uppercase font-oswald mb-6 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.headline}{" "}
            <span className="text-gradient">{block.headlineAccent}</span>
          </h3>
          {block.description && (
            <p
              className={`max-w-2xl mx-auto leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {block.description}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.values?.map((value, index) => {
            const Icon = getIconComponent(value.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-zinc-200 p-8 hover:border-[#FF5722]/50 transition-all"
              >
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-200 group-hover:border-[#FF5722] transition-colors" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-200 group-hover:border-[#FF5722] transition-colors" />
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,87,34,0.3)]">
                  <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold uppercase font-oswald text-zinc-900 mb-3">
                  {value.title}
                </h4>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {value.description}
                </p>
                {value.link && (
                  <Link
                    href={value.link}
                    className="mt-4 inline-flex items-center gap-2 text-[#FF5722] text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Team Block Component
export function TeamBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "team-block" }>;
}) {
  const { openContactDialog } = useContactDialog();
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-24 ${isDark ? "bg-zinc-900" : "bg-zinc-50"} relative`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          {block.sectionBadge && (
            <SectionBadge className="mb-2 justify-center">
              {block.sectionBadge}
            </SectionBadge>
          )}
          <h3
            className={`text-4xl md:text-5xl font-bold uppercase font-oswald mb-6 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.headline}{" "}
            <span className="text-gradient">{block.headlineAccent}</span>
          </h3>
          {block.description && (
            <p
              className={`max-w-2xl mx-auto leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {block.description}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {block.members?.map((member, index) => {
            const photoUrl = (member as any).photo
              ? getMediaUrl((member as any).photo)
              : (member as any).imagePath;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative p-8 transition-all duration-300 ${
                  isDark
                    ? "bg-zinc-800 border border-white/10 hover:border-[#FF5722]/50"
                    : "bg-white border border-zinc-200 hover:border-[#FF5722]/50 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Corner accents */}
                <div
                  className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors ${
                    isDark
                      ? "border-white/10 group-hover:border-[#FF5722]"
                      : "border-zinc-200 group-hover:border-[#FF5722]"
                  }`}
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors ${
                    isDark
                      ? "border-white/10 group-hover:border-[#FF5722]"
                      : "border-zinc-200 group-hover:border-[#FF5722]"
                  }`}
                />

                <div className="w-32 h-32 bg-gradient-to-br from-[#FF5722]/20 to-[#E91E63]/20 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 border-[#FF5722]/30">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-16 h-16 text-[#FF5722]" />
                  )}
                </div>
                <h4
                  className={`text-xl font-bold uppercase font-oswald text-center mb-1 ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {member.name}
                </h4>
                <p className="text-[#FF5722] font-mono text-xs text-center mb-4 uppercase tracking-widest">
                  {member.role}
                </p>
                {member.bio && (
                  <p
                    className={`text-sm text-center leading-relaxed ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {member.bio}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
        {block.footerText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-zinc-500 text-sm font-mono">
              {block.footerText}{" "}
              {block.footerLinkUrl &&
                block.footerLinkText &&
                (block.footerLinkUrl === "/#contact" ? (
                  <button
                    onClick={openContactDialog}
                    className="text-[#FF5722] hover:underline"
                  >
                    {block.footerLinkText} →
                  </button>
                ) : (
                  <Link
                    href={block.footerLinkUrl}
                    className="text-[#FF5722] hover:underline"
                  >
                    {block.footerLinkText} →
                  </Link>
                ))}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Story Block Component
export function StoryBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "story-block" }>;
}) {
  return (
    <section className="py-24 bg-white text-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {block.sectionBadge && (
              <SectionBadge className="mb-2">{block.sectionBadge}</SectionBadge>
            )}
            <h3 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900 mb-6">
              {block.headline}{" "}
              <span className="text-gradient">{block.headlineAccent}</span>
            </h3>
            <div className="space-y-6 text-zinc-600 leading-relaxed">
              {block.paragraphs?.map((para, index) => (
                <p key={index}>{para.text}</p>
              ))}
              {block.footerLinkUrl && block.footerLinkText && (
                <div className="pt-4">
                  <Link
                    href={block.footerLinkUrl}
                    className="inline-flex items-center gap-2 text-[#FF5722] font-bold uppercase tracking-widest text-sm group"
                  >
                    <span>{block.footerLinkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              {block.stats?.map((stat, index) => {
                const hoverBg =
                  stat.hoverColor === "orange"
                    ? "hover:bg-[#FF5722]"
                    : stat.hoverColor === "pink"
                    ? "hover:bg-[#E91E63]"
                    : "hover:bg-black";
                return (
                  <div
                    key={index}
                    className={`border border-zinc-200 p-8 ${hoverBg} hover:text-white transition-all duration-300 group cursor-crosshair relative overflow-hidden bg-white`}
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div className="text-5xl font-bold font-oswald mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs uppercase tracking-widest font-mono text-zinc-500 group-hover:text-zinc-400">
                      {stat.label}
                    </div>
                    <div className="h-1 w-full bg-zinc-200 mt-4 overflow-hidden">
                      <div className="h-full bg-[#FF5722] w-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Checklist Block Component
export function ChecklistBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "checklist-block" }>;
}) {
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-24 relative overflow-hidden ${
        isDark ? "bg-brand-dark-gray" : "bg-white"
      }`}
    >
      {isDark && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      )}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {block.sectionBadge && (
              <SectionBadge className="mb-2">{block.sectionBadge}</SectionBadge>
            )}
            <h3
              className={`text-4xl md:text-5xl font-bold uppercase font-oswald mb-6 ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              {block.headline}{" "}
              <span className="text-gradient">{block.headlineAccent}</span>
            </h3>
            <ul className="space-y-6">
              {block.items?.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-[#FF5722]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5722]" />
                  </div>
                  <span
                    className={`leading-relaxed ${
                      isDark ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  >
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          {block.sidebar && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-zinc-900 border border-white/10 p-10 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF5722]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF5722]" />
                {block.sidebar.title && (
                  <h4 className="text-2xl font-bold uppercase font-oswald text-white mb-6">
                    {block.sidebar.title}
                  </h4>
                )}
                {block.sidebar.description && (
                  <p className="text-zinc-400 leading-relaxed mb-8">
                    {block.sidebar.description}
                  </p>
                )}
                {block.sidebar.stats && block.sidebar.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-6">
                    {block.sidebar.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold font-oswald text-[#FF5722] mb-1">
                          {stat.value}
                        </div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {block.sidebar.linkUrl && block.sidebar.linkText && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <Link
                      href={block.sidebar.linkUrl}
                      className="inline-flex items-center gap-2 text-[#FF5722] font-bold uppercase tracking-widest text-xs group"
                    >
                      <span>{block.sidebar.linkText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Process Steps Block Component
export function ProcessStepsBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "process-steps-block" }>;
}) {
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-24 relative ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          {block.sectionBadge && (
            <SectionBadge className="mb-2 justify-center">
              {block.sectionBadge}
            </SectionBadge>
          )}
          <h3
            className={`text-4xl md:text-5xl font-bold uppercase font-oswald mb-6 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.headline}{" "}
            <span className="text-gradient">{block.headlineAccent}</span>
          </h3>
          {block.description && (
            <p
              className={`max-w-2xl mx-auto leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {block.description}
            </p>
          )}
        </div>
        <div className="space-y-8">
          {block.steps?.map((step, index) => {
            const Icon = getIconComponent(step.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-white border border-zinc-200 p-8 md:p-10 hover:border-[#FF5722]/30 transition-all h-full shadow-sm">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-200 group-hover:border-[#FF5722] transition-colors" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-200 group-hover:border-[#FF5722] transition-colors" />
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,87,34,0.3)]">
                        <Icon
                          className="w-8 h-8 text-white"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[#FF5722] font-mono text-sm">
                        {step.number}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold uppercase font-oswald text-zinc-900 mt-1">
                        {step.title}
                      </h3>
                      {step.tagline && (
                        <p className="text-zinc-500 font-mono text-xs mt-1">
                          {step.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-700 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {step.details && step.details.length > 0 && (
                      <div>
                        <h4 className="text-zinc-900 font-bold text-lg uppercase font-oswald tracking-wider mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#FF5722]" />
                          What We Do
                        </h4>
                        <ul className="space-y-3">
                          {step.details.map((detail, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-base text-zinc-600"
                            >
                              <span className="text-[#FF5722] leading-none mt-[0.2rem]">
                                ›
                              </span>
                              <span className="leading-relaxed">
                                {detail.item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {step.deliverables && step.deliverables.length > 0 && (
                      <div>
                        <h4 className="text-zinc-900 font-bold text-lg uppercase font-oswald tracking-wider mb-4 flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-[#FF5722]" />
                          Deliverables
                        </h4>
                        <ul className="space-y-3">
                          {step.deliverables.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-base text-zinc-600"
                            >
                              <span className="text-[#FF5722] leading-none mt-[0.2rem]">
                                ›
                              </span>
                              <span className="leading-relaxed">
                                {item.item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {step.links && step.links.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap gap-4">
                      {step.links.map((link, i) => (
                        <Link
                          key={i}
                          href={link.href}
                          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#FF5722] hover:opacity-80 transition-opacity group/link"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Differentiator Block Component
export function DifferentiatorBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "differentiator-block" }>;
}) {
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-24 relative overflow-hidden ${
        isDark ? "bg-zinc-900" : "bg-white"
      }`}
    >
      {isDark && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      )}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          {block.sectionBadge && (
            <SectionBadge className="mb-2 justify-center">
              {block.sectionBadge}
            </SectionBadge>
          )}
          <h3
            className={`text-4xl md:text-5xl font-bold uppercase font-oswald mb-6 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.headline}{" "}
            <span className="text-gradient">{block.headlineAccent}</span>
          </h3>
          {block.description && (
            <p
              className={`max-w-2xl mx-auto leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {block.description}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {block.items?.map((item, index) => {
            const Icon = getIconComponent(item.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-zinc-900/50 border border-white/10 p-8 hover:border-[#FF5722]/50 transition-all"
              >
                <div className="w-14 h-14 mb-4 bg-gradient-to-br from-[#FF5722]/20 to-[#E91E63]/20 rounded-xl flex items-center justify-center group-hover:from-[#FF5722] group-hover:to-[#E91E63] transition-all">
                  <Icon
                    className="w-7 h-7 text-[#FF5722] group-hover:text-white transition-colors"
                    strokeWidth={1.5}
                  />
                </div>
                <h4 className="text-xl font-bold uppercase font-oswald text-white mb-3">
                  {item.title}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Expectations Block Component
export function ExpectationsBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "expectations-block" }>;
}) {
  return (
    <section className="py-24 bg-white relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5722]/5 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {block.sectionBadge && (
              <SectionBadge className="mb-2">{block.sectionBadge}</SectionBadge>
            )}
            <h3 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900 mb-6">
              {block.headline}
              <br />
              <span className="text-gradient">{block.headlineAccent}</span>
            </h3>
            {block.description && (
              <p className="text-zinc-600 leading-relaxed mb-8">
                {block.description}
              </p>
            )}
            <div className="space-y-6">
              {block.expectations?.map((exp, index) => {
                const Icon = getIconComponent(exp.icon);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-[#FF5722]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-[#FF5722]" />
                    </div>
                    <div>
                      <h4 className="text-zinc-900 font-bold text-lg mb-1">
                        {exp.title}
                      </h4>
                      <p className="text-zinc-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          {block.timeline && block.timeline.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-zinc-100 border border-zinc-200 p-10 relative"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF5722]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E91E63]" />
              <h4 className="text-2xl font-bold uppercase font-oswald text-zinc-900 mb-6">
                Typical Project Timeline
              </h4>
              <div className="space-y-6">
                {block.timeline.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-900 font-bold">
                        {item.phase}
                      </span>
                      <span className="text-zinc-500 font-mono text-sm">
                        {item.duration}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${(i + 1) * (100 / block.timeline!.length)}%`,
                        }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-[#FF5722] to-[#E91E63] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {block.timelineNote && (
                <div className="mt-8 pt-8 border-t border-zinc-200">
                  <p className="text-zinc-600 text-sm">{block.timelineNote}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Legal Content Block Component
export function LegalContentBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "legal-content-block" }>;
}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="prose prose-lg prose-zinc max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            {block.sections?.map((section, index) => (
              <section key={index}>
                <h2 className="text-2xl font-bold uppercase font-oswald text-zinc-900 mb-4">
                  {section.heading}
                </h2>
                {/* Rich text content would be rendered here */}
                <div className="text-zinc-700 leading-relaxed rich-text-content">
                  {Array.isArray(section.content) ? (
                    section.content.map((paragraph: string, pIndex: number) => (
                      <p key={pIndex} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              </section>
            ))}
            {block.contactInfo?.show && (
              <div className="mt-4 p-6 bg-zinc-100 border border-zinc-200">
                <p className="text-zinc-900 font-bold">
                  {block.contactInfo.companyName}
                </p>
                <p className="text-zinc-700">{block.contactInfo.location}</p>
                {block.contactInfo.email && (
                  <p className="text-zinc-700">
                    Email:{" "}
                    <a
                      href={`mailto:${block.contactInfo.email}`}
                      className="text-[#FF5722] hover:underline"
                    >
                      {block.contactInfo.email}
                    </a>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// FAQ Block Component
export function FaqBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "faq-block" }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isDark = block.theme === "dark";

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className={`py-24 relative overflow-hidden ${
        isDark ? "bg-zinc-900" : "bg-white"
      }`}
    >
      {/* Background effects for dark theme */}
      {isDark && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF5722]/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5722]/5 rounded-full blur-[200px]" />
        </>
      )}
      {/* Subtle gradient for light theme */}
      {!isDark && (
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5722]/5 rounded-full blur-[150px]" />
      )}

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {block.sectionBadge && (
            <SectionBadge className="mb-2 justify-center">
              {block.sectionBadge}
            </SectionBadge>
          )}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold uppercase font-oswald mb-6 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.headline}{" "}
            <span className="text-gradient">{block.headlineAccent}</span>
          </motion.h3>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {block.faqs?.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`group border ${
                isDark
                  ? "border-white/10 bg-zinc-800/50"
                  : "border-zinc-200 bg-zinc-50"
              } overflow-hidden transition-all hover:border-[#FF5722]/50`}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${
                  openIndex === index
                    ? isDark
                      ? "bg-zinc-800"
                      : "bg-zinc-100"
                    : ""
                }`}
              >
                <span
                  className={`text-lg font-bold font-oswald uppercase ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                    openIndex === index
                      ? "bg-gradient-to-br from-[#FF5722] to-[#E91E63]"
                      : isDark
                      ? "bg-white/10"
                      : "bg-zinc-200"
                  }`}
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index
                        ? "rotate-180 text-white"
                        : isDark
                        ? "text-white"
                        : "text-zinc-600"
                    }`}
                  />
                </div>
              </button>

              {/* Answer Content */}
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`px-6 pb-6 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      <div className="border-l-2 border-[#FF5722] pl-4">
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Feature Grid Block Component
export function FeatureGridBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "feature-grid-block" }>;
}) {
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-16 relative ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3
            className={`text-2xl md:text-3xl font-bold uppercase font-oswald mb-2 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.categoryTitle}
          </h3>
          {block.categoryDescription && (
            <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>
              {block.categoryDescription}
            </p>
          )}
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {block.features?.map((feature, index) => {
            const Icon = getIconComponent(feature.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`group relative p-6 border transition-all duration-300 shadow-sm ${
                  isDark
                    ? "bg-zinc-800/50 border-white/10 hover:border-[#FF5722]/50"
                    : "bg-white border-zinc-200 hover:border-[#FF5722]/50"
                }`}
              >
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-300 group-hover:border-[#FF5722] transition-colors" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-300 group-hover:border-[#FF5722] transition-colors" />
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h4
                  className={`text-lg font-bold uppercase font-oswald mb-2 group-hover:text-[#FF5722] transition-colors ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {feature.title}
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Passion Cards Block Component
export function PassionCardsBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "passion-cards-block" }>;
}) {
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-24 relative overflow-hidden ${
        isDark ? "bg-zinc-900" : "bg-white"
      }`}
    >
      {/* Background grid */}
      {isDark ? (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          {block.sectionBadge && (
            <SectionBadge className="mb-2 justify-center">
              {block.sectionBadge}
            </SectionBadge>
          )}
          <h3
            className={`text-4xl md:text-5xl font-bold uppercase font-oswald mb-6 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.headline}{" "}
            <span className="text-gradient">{block.headlineAccent}</span>
          </h3>
          {block.description && (
            <p
              className={`max-w-2xl mx-auto leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {block.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {block.cards?.map((card, index) => {
            const Icon = getIconComponent(card.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative border p-8 hover:border-[#FF5722]/50 transition-all text-center ${
                  isDark
                    ? "bg-zinc-900/50 border-white/10"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FF5722]/20 to-[#E91E63]/20 rounded-2xl flex items-center justify-center group-hover:from-[#FF5722] group-hover:to-[#E91E63] transition-all">
                  <Icon
                    className={`w-10 h-10 transition-colors ${
                      isDark
                        ? "text-[#FF5722] group-hover:text-white"
                        : "text-[#FF5722] group-hover:text-white"
                    }`}
                    strokeWidth={1.5}
                  />
                </div>
                <h4
                  className={`text-xl font-bold uppercase font-oswald mb-3 ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {card.title}
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Partner Checklist Block Component
export function PartnerChecklistBlock({
  block,
}: {
  block: Extract<BlockType, { blockType: "partner-checklist-block" }>;
}) {
  const isDark = block.theme === "dark";
  return (
    <section
      className={`py-24 relative overflow-hidden ${
        isDark ? "bg-zinc-900" : "bg-white"
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5722]/5 rounded-full blur-[150px]`}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          {block.sectionBadge && (
            <SectionBadge className="mb-2">{block.sectionBadge}</SectionBadge>
          )}
          <h3
            className={`text-4xl md:text-5xl font-bold uppercase font-oswald mb-6 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {block.headline}
            <br />
            <span className="text-gradient">{block.headlineAccent}</span>
          </h3>
          {block.description && (
            <p
              className={`leading-relaxed mb-8 ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {block.description}
            </p>
          )}

          <ul className="space-y-5">
            {block.items?.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 bg-[#FF5722]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-[#FF5722]" />
                </div>
                <span
                  className={`leading-relaxed ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {item.text}
                </span>
              </motion.li>
            ))}
          </ul>

          {block.bottomNote && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className={`mt-8 text-sm font-mono ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              {block.bottomNote}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Main Block Renderer
export function BlockRenderer({
  blocks,
}: {
  blocks: BlockType[] | null | undefined;
}) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case "cta-block":
            return <CtaBlock key={index} block={block} />;
          case "values-block":
            return <ValuesBlock key={index} block={block} />;
          case "team-block":
            return <TeamBlock key={index} block={block} />;
          case "story-block":
            return <StoryBlock key={index} block={block} />;
          case "checklist-block":
            return <ChecklistBlock key={index} block={block} />;
          case "process-steps-block":
            return <ProcessStepsBlock key={index} block={block} />;
          case "differentiator-block":
            return <DifferentiatorBlock key={index} block={block} />;
          case "expectations-block":
            return <ExpectationsBlock key={index} block={block} />;
          case "legal-content-block":
            return <LegalContentBlock key={index} block={block} />;
          case "faq-block":
            return <FaqBlock key={index} block={block} />;
          case "feature-grid-block":
            return <FeatureGridBlock key={index} block={block} />;
          case "passion-cards-block":
            return <PassionCardsBlock key={index} block={block} />;
          case "partner-checklist-block":
            return <PartnerChecklistBlock key={index} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
