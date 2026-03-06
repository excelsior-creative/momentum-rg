"use client";

import { processContent } from "@/data/process-content";
import { siteConfig } from "@/data/site-config";
import type { Article, Media } from "@/payload-types";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import Navigation from "./Navigation";
import VelocityScroll from "./VelocityScroll";
import GradientMesh from "./GradientMesh";

const Work = dynamic(() => import("./Work"), {
  loading: () => <div className="min-h-[800px] bg-brand-dark-gray" />,
});
const Services = dynamic(() => import("./Services"), {
  loading: () => <div className="min-h-[600px] bg-brand-dark-gray" />,
});
const Process = dynamic(() => import("./Process"), {
  loading: () => <div className="min-h-[600px] bg-brand-dark-gray" />,
});
const AILab = dynamic(() => import("./AILab"), {
  loading: () => <div className="min-h-[600px] bg-brand-dark-gray" />,
});
const Launchpad = dynamic(() => import("./Launchpad"), {
  loading: () => <div className="min-h-[600px] bg-brand-dark-gray" />,
});
const RecentArticles = dynamic(() => import("./RecentArticles"), {
  loading: () => <div className="min-h-[600px] bg-brand-dark-gray" />,
});
const Contact = dynamic(() => import("./Contact"), {
  loading: () => <div className="min-h-[600px] bg-brand-dark-gray" />,
});
const Footer = dynamic(() => import("./Footer"), {
  loading: () => <div className="min-h-[400px] bg-brand-dark-gray" />,
});
const IconScrollContent = dynamic(() => import("./IconScrollContent"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});

// Separate the client-only parts
// Define a simpler type for featured projects (what we actually fetch)
export type FeaturedProject = {
  id: number;
  title: string;
  slug: string;
  category: string;
  image?: number | Media | null;
  imagePath?: string | null;
};

interface MainContentProps {
  projects: FeaturedProject[];
  articles: Article[];
}

export default function MainContent({ projects, articles }: MainContentProps) {
  // Use static siteConfig
  const heroSettings = {
    headlineTop: siteConfig.hero.headlineTop,
    headlineBottom: siteConfig.hero.headlineBottom,
    subheadline: siteConfig.hero.subheadline,
    videoUrl: siteConfig.hero.videoUrl,
    primaryCtaText: siteConfig.hero.primaryCtaText,
    secondaryCtaText: siteConfig.hero.secondaryCtaText,
  };

  const manifestoSettings = {
    headline: siteConfig.manifesto.headline,
    headlineAccent: siteConfig.manifesto.headlineAccent,
    location: siteConfig.manifesto.location,
    description: siteConfig.manifesto.description,
    promiseTitle: siteConfig.manifesto.promiseTitle,
    promiseDescription: siteConfig.manifesto.promiseDescription,
    stats: siteConfig.stats,
  };

  const processSettings = {
    sectionBadge: processContent.hero.badge,
    headline: processContent.hero.headline,
    ctaText: processContent.hero.ctaText,
    ctaLink: processContent.hero.ctaLink,
    steps: processContent.phases.steps.map((s) => ({
      num: s.number,
      title: s.title,
      desc: s.description,
    })),
  };

  return (
    <main className="relative min-h-screen bg-brand-dark-gray selection:bg-[#FF5722] selection:text-white">
      {/* Background Layer */}
      <GradientMesh />

      {/* Navigation - now self-contained or client island */}
      <Navigation />

      {/* Sections */}
      <Hero settings={heroSettings} />

      <VelocityScroll>
        <IconScrollContent />
      </VelocityScroll>

      <Manifesto settings={manifestoSettings} />

      <Services />

      <Process settings={processSettings} />

      <Work projects={projects} />

      <AILab />

      <Launchpad />

      <RecentArticles articles={articles} />

      <Contact />

      <Footer />
    </main>
  );
}
