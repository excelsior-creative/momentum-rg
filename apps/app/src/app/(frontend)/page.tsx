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
      {/* Local Business JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Momentum Realty Group",
            url: "https://momentumrg.com",
            logo: "https://momentumrg.com/logo.svg",
            image: "https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg",
            description:
              "Momentum Realty Group — Orange County real estate experts serving buyers, sellers, and investors across OC, LA County, and Riverside County since 2009.",
            telephone: "+17143363375",
            email: "karl@momentumrg.com",
            foundingDate: "2009",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1451 Quail Street, Suite 110B",
              addressLocality: "Newport Beach",
              addressRegion: "CA",
              postalCode: "92660",
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 33.6553,
              longitude: -117.8622,
            },
            areaServed: [
              { "@type": "City", name: "Long Beach" },
              { "@type": "City", name: "Huntington Beach" },
              { "@type": "City", name: "La Habra" },
              { "@type": "City", name: "Anaheim" },
              { "@type": "City", name: "Riverside" },
            ],
            employee: {
              "@type": "Person",
              name: "Karl Parize",
              jobTitle: "Broker / Owner",
              telephone: "+17143363375",
              email: "karl@momentumrg.com",
              hasCredential: ["CBRE #01364278", "NMLS #313044"],
            },
            sameAs: ["https://momentumrg.com"],
          }),
        }}
      />
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
