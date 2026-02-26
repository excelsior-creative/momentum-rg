import React from "react";
import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import { ListingsSection } from "@/components/ListingsSection";
import { ComplexTransactionsSection } from "@/components/ComplexTransactionsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BlogTeaserSection } from "@/components/BlogTeaserSection";
import nextDynamic from "next/dynamic";

const CTASection = nextDynamic(
  () => import("@/components/CTASection").then((mod) => mod.CTASection)
);

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesSection />
      <AboutSection />
      <ListingsSection />
      <ComplexTransactionsSection />
      <TestimonialsSection />
      <BlogTeaserSection />
      <CTASection />
    </div>
  );
}
