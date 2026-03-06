import ServicePageLayout from "@/components/ServicePageLayout";
import { services } from "@/data/services";
import { generateServiceMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find((s) => s.slug === "seo-services");
  if (!service) return { title: "Not Found" };

  return generateServiceMetadata({
    title: service.title,
    description: service.description,
    slug: service.slug,
    keywords: [
      "seo services orange county",
      "search engine optimization agency",
      "technical seo audit",
      "local seo marketing",
      "organic growth strategy",
      "keyword research services",
      "ai-powered seo",
    ],
  });
}

export default function SEOServicesPage() {
  const service = services.find((s) => s.slug === "seo-services");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}

