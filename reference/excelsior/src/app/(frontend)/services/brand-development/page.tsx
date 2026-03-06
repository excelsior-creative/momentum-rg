import ServicePageLayout from "@/components/ServicePageLayout";
import { services } from "@/data/services";
import { notFound } from "next/navigation";
import { generateServiceMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find(s => s.slug === "brand-development");
  if (!service) return { title: "Not Found" };
  
  return generateServiceMetadata({
    title: service.title,
    description: service.description,
    slug: service.slug,
    keywords: [
      service.title.toLowerCase(),
      "professional branding agency",
      "corporate visual identity",
      "strategic brand development",
      "professional logo design",
      "brand messaging framework",
    ],
  });
}

export default function BrandDevelopmentPage() {
  const service = services.find(s => s.slug === "brand-development");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}

