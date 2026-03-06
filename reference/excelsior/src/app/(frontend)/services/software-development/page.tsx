import ServicePageLayout from "@/components/ServicePageLayout";
import { services } from "@/data/services";
import { notFound } from "next/navigation";
import { generateServiceMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find(s => s.slug === "software-development");
  if (!service) return { title: "Not Found" };
  
  return generateServiceMetadata({
    title: service.title,
    description: service.description,
    slug: service.slug,
    keywords: [
      service.title.toLowerCase(),
      "custom software development agency",
      "SaaS platform engineering",
      "enterprise software solutions",
      "full-stack development firm",
      "custom API development",
    ],
  });
}

export default function SoftwareDevelopmentPage() {
  const service = services.find(s => s.slug === "software-development");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}

