import ServicePageLayout from "@/components/ServicePageLayout";
import { services } from "@/data/services";
import { notFound } from "next/navigation";
import { generateServiceMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find(s => s.slug === "web-hosting");
  if (!service) return { title: "Not Found" };
  
  return generateServiceMetadata({
    title: service.title,
    description: service.description,
    slug: service.slug,
    keywords: [
      service.title.toLowerCase(),
      "managed enterprise web hosting",
      "high-performance Next.js hosting",
      "managed cloud infrastructure",
      "secure website maintenance",
      "99.99% uptime hosting services",
    ],
  });
}

export default function WebHostingPage() {
  const service = services.find(s => s.slug === "web-hosting");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}

