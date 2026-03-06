import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface PageHeroProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
  contentClassName?: string;
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
  backgroundImage = "https://momentumrg.com/wp-content/uploads/2022/03/orange-county-real-estate-2.jpg",
  className,
  contentClassName,
  children,
}: PageHeroProps) => {
  return (
    <section className={cn("relative py-24 md:py-32 overflow-hidden", className)}>
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      {/* Background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

      <Container className="relative z-10">
        <div className={cn("max-w-2xl", contentClassName)}>
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
          <div className="mt-6 h-px w-24 bg-gold/70" aria-hidden="true" />
          {children}
        </div>
      </Container>
    </section>
  );
};
