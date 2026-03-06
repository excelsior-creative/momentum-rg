"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  Target,
  Shield,
  FileText,
  Rocket,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  target: Target,
  shield: Shield,
  "file-text": FileText,
  rocket: Rocket,
};

type PageHeroProps = {
  breadcrumb?: {
    current: string;
    parent?: { label: string; href: string };
  };
  icon?: string;
  badge?: string;
  headline?: string;
  headlineAccent?: string;
  subheadline?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imagePath?: string;
  lastUpdated?: string;
};

export default function PageHero({
  breadcrumb,
  icon,
  badge,
  headline,
  headlineAccent,
  subheadline,
  description,
  ctaText,
  ctaLink,
  imagePath,
  lastUpdated,
}: PageHeroProps) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const Icon = icon && icon !== "none" ? iconMap[icon] : null;

  return (
    <section className="relative min-h-[80vh] flex items-center pt-32 pb-20 overflow-hidden bg-brand-dark-gray">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF5722]/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-[#FF5722]/15 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#E91E63]/10 rounded-full blur-[150px]" />

      {/* Hero SVG Art */}
      {imagePath && (
        <motion.div
          style={{ y: heroY }}
          className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none z-0"
        >
          <Image
            src={imagePath}
            alt=""
            aria-hidden="true"
            fill
            sizes="50vw"
            className="object-contain object-right"
          />
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        {/* Breadcrumb */}
        {breadcrumb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm font-mono text-zinc-400 mb-8"
          >
            <Link href="/" className="hover:text-[#FF5722] transition-colors">
              Home
            </Link>
            {breadcrumb.parent && (
              <>
                <span>/</span>
                <Link href={breadcrumb.parent.href} className="hover:text-[#FF5722] transition-colors">
                  {breadcrumb.parent.label}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#FF5722]">{breadcrumb.current}</span>
          </motion.div>
        )}

        <div className="max-w-4xl">
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 bg-zinc-900/80 border border-[#FF5722]/30 px-4 py-2 rounded-full mb-4"
            >
              {Icon && <Icon className="w-5 h-5 text-[#FF5722]" />}
              <span className="text-[#FF5722] font-mono text-sm uppercase tracking-widest">
                {badge}
              </span>
            </motion.div>
          )}

          {/* Icon (without badge) */}
          {Icon && !badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_50px_rgba(255,87,34,0.3)]"
            >
              <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase font-oswald leading-[0.95] mb-6"
          >
            {headline}
            {headlineAccent && (
              <>
                <br />
                <span className="text-gradient">{headlineAccent}</span>
              </>
            )}
          </motion.h1>

          {/* Subheadline */}
          {subheadline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-8"
            >
              {subheadline}
            </motion.p>
          )}

          {/* Description */}
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="border-l-2 border-[#FF5722] pl-6 max-w-2xl mb-10"
            >
              <p className="text-zinc-300 leading-relaxed">{description}</p>
            </motion.div>
          )}

          {/* Last Updated (for legal pages) */}
          {lastUpdated && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-400 text-lg"
            >
              Last updated: {lastUpdated}
            </motion.p>
          )}

          {/* CTA */}
          {ctaText && ctaLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button as="link" href={ctaLink}>
                {ctaText}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

