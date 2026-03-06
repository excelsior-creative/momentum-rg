import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { BlockRenderer } from "@/components/blocks";
import { generatePageMetadata } from "@/lib/metadata";
import { termsContent } from "@/data/terms-content";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Terms of Service",
    description: "Review the terms of service for Excelsior Creative's web development and digital services.",
    path: "/terms",
    noIndex: true,
  });
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      <PageHero
        breadcrumb={{ current: "Terms of Service" }}
        icon={termsContent.hero.icon as any}
        headline={termsContent.hero.headline}
        headlineAccent={termsContent.hero.headlineAccent}
        lastUpdated={termsContent.hero.lastUpdated}
      />

      <BlockRenderer blocks={termsContent.blocks} />

      <Footer />
    </div>
  );
}
