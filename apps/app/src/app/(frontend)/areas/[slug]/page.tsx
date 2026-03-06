import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { AREAS, AREA_SLUGS, type AreaSlug } from "@/lib/areas";

export async function generateStaticParams() {
  return AREA_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = AREAS[slug as AreaSlug];
  if (!area) return {};

  return generatePageMetadata({
    title: `${area.name} Real Estate | Momentum Realty Group`,
    description: `Homes for sale in ${area.name}, ${area.county}. Browse listings, neighborhood guides, and connect with Momentum Realty Group — ${area.name}'s trusted local real estate experts.`,
    path: `/areas/${slug}`,
    keywords: [
      `${area.name} homes for sale`,
      `${area.name} real estate`,
      `${area.name} realtor`,
      ...area.zipCodes.map((z) => `${z} homes for sale`),
      "Momentum Realty Group",
      "Karl Parize",
    ],
  });
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = AREAS[slug as AreaSlug];

  if (!area) notFound();

  return (
    <div>
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: area.name, path: `/areas/${slug}` },
        ])}
      />
      <PageHero
        badge={area.county}
        title={area.name}
        titleAccent={area.tagline}
        backgroundImage={area.heroImage}
      >
        <Breadcrumbs
          inverted
          className="mt-8"
          items={[
            { label: "Home", href: "/" },
            { label: area.name },
          ]}
        />
      </PageHero>

      {/* Highlights */}
      <section className="bg-charcoal py-10 border-b border-white/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {area.highlights.map((h) => (
              <div key={h.label} className="flex flex-col items-center gap-2">
                <h.icon className="w-5 h-5 text-gold" />
                <p className="text-white font-heading text-lg font-medium">{h.value}</p>
                <p className="text-white/50 text-xs font-display uppercase tracking-wider">{h.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Overview */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand font-display">
                Area Overview
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground">
                Living &amp; Buying in {area.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{area.description}</p>
              <p className="text-muted-foreground leading-relaxed">{area.whyBuy}</p>

              <Button asChild variant="cta" size="marketing" className="mt-4">
                <Link href={`/listings?city=${area.cityFilter}`}>
                  Browse {area.name} Listings
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Sidebar CTA */}
            <div className="bg-warm-gray border border-border rounded-2xl p-8 space-y-5 self-start">
              <h3 className="font-heading text-xl font-medium text-foreground">
                Talk to a Local Expert
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Karl Parize has closed transactions across {area.name} for over 25 years. Schedule
                a free consultation to discuss your goals.
              </p>
              <div className="pt-2 space-y-3">
                <Button asChild variant="cta" size="marketing" className="w-full">
                  <Link href="/contact">Free Consultation</Link>
                </Button>
                <Button asChild variant="ctaOutline" size="marketing" className="w-full">
                  <a href="tel:7143363375">(714) 336-3375</a>
                </Button>
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
                  alt="Karl Parize"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                />
                <div>
                  <p className="font-heading font-medium text-sm">Karl Parize</p>
                  <p className="text-xs text-brand font-display uppercase tracking-wide">Broker / Owner</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Neighborhoods */}
      <section className="py-16 bg-warm-gray border-y border-border">
        <Container>
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand font-display">
              Neighborhoods
            </span>
            <h2 className="font-heading text-3xl font-medium mt-2 text-foreground">
              {area.name} Neighborhoods &amp; Zip Codes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {area.neighborhoods.map((n) => (
              <div
                key={n.name}
                className="bg-white rounded-2xl p-7 border border-border hover:border-brand/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-heading text-lg font-medium text-foreground">{n.name}</h3>
                  <span className="text-xs font-semibold bg-brand/10 text-brand border border-brand/20 px-2.5 py-1 rounded-full font-display">
                    {n.zip}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{n.description}</p>
                <Link
                  href={`/listings?city=${area.cityFilter}`}
                  className="inline-flex items-center gap-1.5 text-brand hover:text-brand-dark text-sm font-display font-semibold mt-4 transition-colors"
                >
                  View listings <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-charcoal">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-white mb-4">
              Ready to Buy or Sell in {area.name}?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Get expert guidance from a broker who knows this market inside and out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="cta" size="hero">
                <Link href="/contact">Contact Karl</Link>
              </Button>
              <Button asChild variant="ctaInverse" size="hero">
                <Link href={`/listings?city=${area.cityFilter}`}>Browse Listings</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
