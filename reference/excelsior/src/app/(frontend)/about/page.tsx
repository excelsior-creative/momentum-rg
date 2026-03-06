import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import {
  ChecklistBlock,
  CtaBlock,
  StoryBlock,
  TeamBlock,
  ValuesBlock,
} from "@/components/blocks";
import { aboutContent } from "@/data/about-content";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "About Us",
    description: aboutContent.hero.subheadline,
    path: "/about",
    keywords: [
      "web development agency",
      "about Excelsior Creative",
      "custom software engineering team",
      "nonprofit technology partner",
      "national software development firm",
    ],
  });
}

export default function AboutPage() {
  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      <PageHero
        breadcrumb={{ current: "About Us" }}
        icon={aboutContent.hero.icon as any}
        headline={aboutContent.hero.headline}
        headlineAccent={aboutContent.hero.headlineAccent}
        subheadline={aboutContent.hero.subheadline}
        description={aboutContent.hero.description}
        imagePath={aboutContent.hero.imagePath}
      />

      <StoryBlock
        block={{
          blockType: "story-block",
          sectionBadge: aboutContent.story.sectionBadge,
          headline: aboutContent.story.headline,
          headlineAccent: aboutContent.story.headlineAccent,
          paragraphs: aboutContent.story.paragraphs.map((p) => ({ text: p })),
          footerLinkText: aboutContent.story.footerLinkText,
          footerLinkUrl: aboutContent.story.footerLinkUrl,
          stats: aboutContent.story.stats as any,
        }}
      />

      <ValuesBlock
        block={{
          blockType: "values-block",
          theme: "dark",
          sectionBadge: aboutContent.values.sectionBadge,
          headline: aboutContent.values.headline,
          headlineAccent: aboutContent.values.headlineAccent,
          description: aboutContent.values.description,
          values: aboutContent.values.items as any,
        }}
      />

      <TeamBlock
        block={{
          blockType: "team-block",
          theme: "light",
          sectionBadge: aboutContent.team.sectionBadge,
          headline: aboutContent.team.headline,
          headlineAccent: aboutContent.team.headlineAccent,
          description: aboutContent.team.description,
          members: aboutContent.team.members as any,
          footerText: aboutContent.team.footerText,
          footerLinkText: aboutContent.team.footerLinkText,
          footerLinkUrl: aboutContent.team.footerLinkUrl,
        }}
      />

      <ChecklistBlock
        block={{
          blockType: "checklist-block",
          theme: "dark",
          sectionBadge: aboutContent.difference.sectionBadge,
          headline: aboutContent.difference.headline,
          headlineAccent: aboutContent.difference.headlineAccent,
          items: aboutContent.difference.items.map((text) => ({ text })),
          sidebar: aboutContent.difference.sidebar as any,
        }}
      />

      <CtaBlock
        block={{
          blockType: "cta-block",
          theme: "light",
          headline: aboutContent.cta.headline,
          description: aboutContent.cta.description,
          buttonText: aboutContent.cta.buttonText,
          buttonLink: aboutContent.cta.buttonLink,
          secondaryText: aboutContent.cta.secondaryText,
        }}
      />

      <Footer />
    </div>
  );
}
