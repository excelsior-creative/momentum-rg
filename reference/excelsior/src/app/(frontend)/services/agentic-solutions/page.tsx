import ServicePageLayout from "@/components/ServicePageLayout";
import { services } from "@/data/services";
import { notFound } from "next/navigation";
import { generateServiceMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find(s => s.slug === "agentic-solutions");
  if (!service) return { title: "Not Found" };
  
  return generateServiceMetadata({
    title: service.title,
    description: service.description,
    slug: service.slug,
    keywords: [
      service.title.toLowerCase(),
      "AI agents for business",
      "autonomous AI agents",
      "enterprise AI automation",
      "LLM integration services",
      "agentic AI solutions",
    ],
  });
}

export default function AgenticSolutionsPage() {
  const service = services.find(s => s.slug === "agentic-solutions");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}

