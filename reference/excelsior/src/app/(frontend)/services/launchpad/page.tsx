import ServicePageLayout from "@/components/ServicePageLayout";
import { services } from "@/data/services";
import { notFound } from "next/navigation";
import { generateServiceMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find(s => s.slug === "launchpad");
  if (!service) return { title: "Not Found" };
  
  return generateServiceMetadata({
    title: service.title,
    description: service.description,
    slug: service.slug,
    keywords: [
      service.title.toLowerCase(),
      "startup venture partnership",
      "startup product development",
      "tech startup incubator",
      "MVP development services",
      "venture studio for startups",
    ],
  });
}

export default function LaunchpadPage() {
  const service = services.find(s => s.slug === "launchpad");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}

