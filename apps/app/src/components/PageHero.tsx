import React from "react";
import Image from "next/image";
import { Container } from "./Container";
import { siteMediaPaths, wpMediaUrl } from "@/lib/wpMediaUrl";

const defaultPageHeroBg = wpMediaUrl(siteMediaPaths.heroOrangeCounty);

interface PageHeroProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

/**
 * Shared dark photo hero used across inner pages.
 * Replaces the flat orange `bg-brand` header pattern.
 */
export const PageHero = ({
  badge,
  title,
  titleAccent,
  subtitle,
  backgroundImage = defaultPageHeroBg,
  children,
}: PageHeroProps) => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background photo */}
      <Image
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

      <Container className="relative z-10">
        <div className="max-w-2xl">
          {badge && (
            <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-display">
              {badge}
            </span>
          )}
          <h1 className="font-heading text-4xl md:text-5xl font-medium text-white mt-3 leading-tight">
            {title}
            {titleAccent && (
              <>
                {" "}
                <span className="text-gold italic">{titleAccent}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="text-white/60 mt-4 text-lg leading-relaxed max-w-xl">{subtitle}</p>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
};
