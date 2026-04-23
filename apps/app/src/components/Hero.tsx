"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { siteMediaPaths, wpMediaUrl } from "@/lib/wpMediaUrl";

// Real OC property photos (Vercel Blob after migration, else legacy WP CDN)
const SLIDES = [
  {
    image: wpMediaUrl(siteMediaPaths.heroOrangeCounty),
    heading: "We do Real Estate",
    accent: "Better",
    body: "Real estate begins with property, but it doesn't end there. At Momentum Realty Group, we're committed to serving your real estate needs through the highest standards of professional excellence, creativity, and service.",
  },
  {
    image: wpMediaUrl(siteMediaPaths.heroSlideWarm),
    heading: "Your Investment",
    accent: "Our Priority",
    body: "From first-time homebuyers to seasoned investors, we bring 25+ years of market expertise and creative problem-solving to every transaction in Orange, Los Angeles, and Riverside Counties.",
  },
  {
    image: wpMediaUrl(siteMediaPaths.heroSlideComplex),
    heading: "Complex Deals",
    accent: "Simplified",
    body: "1031 exchanges, multi-unit portfolios, probate sales — we specialize in the transactions other firms can't handle. Our depth of experience turns complicated deals into smooth closings.",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [next, isAutoPlaying]);

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden min-h-[72vh] flex items-center">
      {/* Background slides */}
      <AnimatePresence mode="sync">
        <m.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.heading}
            fill
            priority={current === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </m.div>
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/60 to-black/25" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-28">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <m.div
            key={`eyebrow-${current}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-block text-gold text-xs font-semibold uppercase tracking-[0.3em] mb-5 font-display">
              Everything You Need
            </span>
          </m.div>

          {/* Heading */}
          <m.h1
            key={`heading-${current}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-tight mb-6"
          >
            {slide.heading}{" "}
            <span className="text-gold italic">{slide.accent}</span>
          </m.h1>

          {/* Body */}
          <m.p
            key={`body-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg text-white/75 max-w-lg mb-10 leading-relaxed font-sans font-light"
          >
            {slide.body}
          </m.p>

          {/* CTAs */}
          <m.div
            key={`ctas-${current}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild variant="cta" size="hero">
              <Link href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ctaInverse" size="hero">
              <a href="tel:7143363375">
                <Phone className="mr-2 h-4 w-4" />
                (714) 336-3375
              </a>
            </Button>
          </m.div>

          {/* Credentials bar */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex items-center gap-6 text-white/40 text-xs tracking-widest font-display uppercase"
          >
            <span>DRE #01364278</span>
            <span className="w-px h-4 bg-white/20" />
            <span>Est. 2009</span>
          </m.div>
        </div>
      </div>

      {/* Karl Parize floating card */}
      <div className="hidden xl:block absolute bottom-12 right-10 z-20">
        <div className="bg-black/80 backdrop-blur-sm border border-gold/30 rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
          <Image
            src={wpMediaUrl(siteMediaPaths.karlParize)}
            alt="Karl Parize, Owner"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-2 border-gold/50"
          />
          <div>
            <p className="font-heading text-white text-base font-medium">Karl Parize</p>
            <p className="text-gold text-xs font-display uppercase tracking-wider mt-0.5">
              Owner &amp; Principal
            </p>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-6">
        <button
          onClick={() => { prev(); setIsAutoPlaying(false); }}
          className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/70 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Slide dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setIsAutoPlaying(false); }}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-8 h-2 bg-gold"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => { next(); setIsAutoPlaying(false); }}
          className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/70 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
