import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { BlockRenderer } from "@/components/blocks";
import { generatePageMetadata } from "@/lib/metadata";
import { privacyContent } from "@/data/privacy-content";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Privacy Policy",
    description: "Learn how Excelsior Creative protects your privacy and handles your data.",
    path: "/privacy",
    noIndex: true,
  });
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      <PageHero
        breadcrumb={{ current: "Privacy Policy" }}
        icon={privacyContent.hero.icon as any}
        headline={privacyContent.hero.headline}
        headlineAccent={privacyContent.hero.headlineAccent}
        lastUpdated={privacyContent.hero.lastUpdated}
      />

      <BlockRenderer blocks={privacyContent.blocks} />

      <Footer />
    </div>
  );
}
