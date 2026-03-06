import ServicePageLayout from "@/components/ServicePageLayout";
import { services } from "@/data/services";
import { generateServiceMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find((s) => s.slug === "social-media");
  if (!service) return { title: "Not Found" };

  return generateServiceMetadata({
    title: service.title,
    description: service.description,
    slug: service.slug,
    keywords: [
      "social media marketing orange county",
      "social media management agency",
      "content creation services",
      "paid social advertising",
      "community management services",
      "social media strategy",
      "influencer marketing coordination",
    ],
  });
}

export default function SocialMediaPage() {
  const service = services.find((s) => s.slug === "social-media");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}

