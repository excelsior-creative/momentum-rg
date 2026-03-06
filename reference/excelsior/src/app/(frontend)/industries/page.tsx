import { getIndustryLandingPages } from "@/lib/payload";
import IndustriesPageContent from "@/components/IndustriesPageContent";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: "Industries We Serve - Custom Digital Solutions",
  description:
    "Explore our specialized web development and AI solutions for over 90 industries. From healthcare and legal to home services and creative agencies.",
  path: "/industries",
  keywords: [
    "industry specific web design",
    "specialized software development",
    "nonprofit web solutions",
    "healthcare digital marketing",
    "legal firm website design",
    "home services seo",
  ],
});

export default async function IndustriesPage() {
  const industries = await getIndustryLandingPages();

  return <IndustriesPageContent industries={industries} />;
}

