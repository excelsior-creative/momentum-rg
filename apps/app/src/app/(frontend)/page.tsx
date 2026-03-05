import React from "react";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import { ListingsSection } from "@/components/ListingsSection";
import { ComplexTransactionsSection } from "@/components/ComplexTransactionsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { AreasSection } from "@/components/AreasSection";
import { BlogTeaserSection } from "@/components/BlogTeaserSection";
import { MapSection } from "@/components/MapSection";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import nextDynamic from "next/dynamic";

export const metadata: Metadata = generatePageMetadata({
  title: "Momentum Realty Group | Orange County Real Estate Experts",
  description:
    "Momentum Realty Group — Karl Parize's team of real estate experts serving Orange County, LA County, and Riverside County. Buying, selling, investing, and property management since 2009.",
  path: "/",
  keywords: [
    "Orange County real estate",
    "homes for sale Long Beach",
    "homes for sale Huntington Beach 92649",
    "La Habra homes 90631",
    "property management Orange County",
    "Karl Parize realtor",
    "Momentum Realty Group",
    "buy home Orange County",
    "sell home Orange County",
    "1031 exchange",
    "investment property",
    "multi-unit property management",
  ],
});

const CTASection = nextDynamic(
  () => import("@/components/CTASection").then((mod) => mod.CTASection)
);

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustBar />
      <ServicesSection />
      <AboutSection />
      <ListingsSection />
      <ComplexTransactionsSection />
      <TestimonialsSection />
      <AreasSection />
      <MapSection />
      <MortgageCalculator />
      <BlogTeaserSection />
      <CTASection />
    </div>
  );
}
