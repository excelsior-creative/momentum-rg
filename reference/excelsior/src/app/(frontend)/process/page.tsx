import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { 
  ProcessStepsBlock, 
  DifferentiatorBlock, 
  ExpectationsBlock, 
  CtaBlock 
} from "@/components/blocks";
import { generatePageMetadata } from "@/lib/metadata";
import { processContent } from "@/data/process-content";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Our Process",
    description: processContent.hero.subheadline,
    path: "/process",
    keywords: [
      "web development process",
      "software development lifecycle",
      "agile project methodology",
      "custom software engineering process",
      "modern web design workflow",
    ],
  });
}

export default function ProcessPage() {
  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      <PageHero
        breadcrumb={{ current: "Process" }}
        icon={processContent.hero.icon as any}
        badge={processContent.hero.badge}
        headline={processContent.hero.headline}
        headlineAccent={processContent.hero.headlineAccent}
        subheadline={processContent.hero.subheadline}
        description={processContent.hero.description}
        ctaText={processContent.hero.ctaText}
        ctaLink={processContent.hero.ctaLink}
        imagePath={processContent.hero.imagePath}
      />

      <ProcessStepsBlock block={{
        blockType: "process-steps-block",
        theme: "light",
        sectionBadge: processContent.phases.sectionBadge,
        headline: processContent.phases.headline,
        headlineAccent: processContent.phases.headlineAccent,
        description: processContent.phases.description,
        steps: processContent.phases.steps.map(step => ({
          ...step,
          details: step.details.map(item => ({ item })),
          deliverables: step.deliverables.map(item => ({ item })),
          links: (step as any).links
        })) as any
      }} />

      <DifferentiatorBlock block={{
        blockType: "differentiator-block",
        theme: "dark",
        sectionBadge: processContent.differentiators.sectionBadge,
        headline: processContent.differentiators.headline,
        headlineAccent: processContent.differentiators.headlineAccent,
        description: processContent.differentiators.description,
        items: processContent.differentiators.items as any
      }} />

      <ExpectationsBlock block={{
        blockType: "expectations-block",
        sectionBadge: processContent.expectations.sectionBadge,
        headline: processContent.expectations.headline,
        headlineAccent: processContent.expectations.headlineAccent,
        description: processContent.expectations.description,
        expectations: processContent.expectations.items as any,
        timeline: processContent.expectations.timeline as any,
        timelineNote: processContent.expectations.timelineNote
      }} />

      <CtaBlock block={{
        blockType: "cta-block",
        theme: "dark",
        headline: "Ready to Get Started?",
        description: "Every great project starts with a conversation. Let's discuss your vision, timeline, and how our process can bring it to life.",
        buttonText: "Start Your Project",
        buttonLink: "/#contact",
        secondaryText: "Or email us directly at hello@excelsiorcreative.com"
      }} />

      <Footer />
    </div>
  );
}
