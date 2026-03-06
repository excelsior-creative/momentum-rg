import ServicePageLayout from "@/components/ServicePageLayout";
import { services } from "@/data/services";
import { generateServiceMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find((s) => s.slug === "web-development");
  if (!service) return { title: "Not Found" };

  return generateServiceMetadata({
    title: service.title,
    description: service.description,
    slug: service.slug,
    keywords: [
      "wordpress development agency",
      "elementor pro development",
      "custom wordpress websites",
      "react next.js development",
      "ai-powered web development",
      "performance-driven web engineering",
      "headless cms implementation",
    ],
  });
}

export default function WebDevelopmentPage() {
  const service = services.find((s) => s.slug === "web-development");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}
