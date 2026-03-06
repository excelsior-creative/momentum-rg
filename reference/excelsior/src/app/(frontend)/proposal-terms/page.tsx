import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { BlockRenderer } from "@/components/blocks";
import { generatePageMetadata } from "@/lib/metadata";
import { proposalTermsContent } from "@/data/proposal-terms-content";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Proposal Terms & Conditions",
    description: "Review the proposal terms and conditions for Excelsior Creative's web development and digital services.",
    path: "/proposal-terms",
    noIndex: true,
  });
}

export default function ProposalTermsPage() {
  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      <PageHero
        breadcrumb={{ current: "Proposal Terms" }}
        icon={proposalTermsContent.hero.icon as any}
        headline={proposalTermsContent.hero.headline}
        headlineAccent={proposalTermsContent.hero.headlineAccent}
        lastUpdated={proposalTermsContent.hero.lastUpdated}
      />

      <BlockRenderer blocks={proposalTermsContent.blocks} />

      <Footer />
    </div>
  );
}
