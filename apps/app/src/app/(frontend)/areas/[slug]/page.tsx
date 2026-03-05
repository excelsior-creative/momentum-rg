import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { generatePageMetadata } from "@/lib/metadata";
import { ArrowRight, MapPin, Home, TrendingUp, School, Car } from "lucide-react";
import type { Metadata } from "next";

// ─── Area Data ───────────────────────────────────────────────────────────────

const AREAS = {
  "long-beach": {
    name: "Long Beach",
    county: "Los Angeles County",
    zipCodes: ["90804", "90803", "90815", "90807", "90806"],
    heroImage: "https://momentumrg.com/wp-content/uploads/2022/03/orange-county-real-estate-2.jpg",
    tagline: "Where the Coast Meets Community",
    description:
      "Long Beach is California's seventh-largest city — a cosmopolitan port city with diverse neighborhoods, a thriving arts scene, and some of LA County's most accessible waterfront real estate.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$685K–$1.1M" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~5.2%" },
      { icon: MapPin, label: "Key Zip Codes", value: "90804, 90803, 90815" },
      { icon: School, label: "Schools", value: "Long Beach USD" },
    ],
    neighborhoods: [
      {
        name: "Belmont Shore / Belmont Heights",
        zip: "90803",
        description:
          "The most prestigious coastal neighborhood in Long Beach. Walkable blocks steps from the beach, Second Street dining, and the Belmont Pier. Single-family homes and condos from $800K to $3M+.",
      },
      {
        name: "Central Long Beach",
        zip: "90804",
        description:
          "The best-value entry point into Long Beach real estate. Strong revitalization, diverse architecture, and a genuine community feel. Bungalows and duplexes from $550K.",
      },
      {
        name: "East Long Beach / Los Altos",
        zip: "90815",
        description:
          "Established, tree-lined streets with quality LBUSD schools and family-friendly parks. One of the most in-demand zip codes for move-up buyers. SFRs from $700K.",
      },
      {
        name: "Bixby Knolls",
        zip: "90807",
        description:
          "A charming, walkable neighborhood known for its Art Deco architecture, Atlantic Avenue boutiques, and strong community identity. Homes from $750K.",
      },
    ],
    whyBuy:
      "Long Beach offers something rare in Southern California: genuine neighborhood diversity at a price point below coastal OC. With $4B+ in planned downtown investment, strong rental demand driven by CSULB and Long Beach City College, and direct Metro A-Line access to downtown LA, Long Beach real estate fundamentals are strong.",
    cityFilter: "long-beach",
  },
  "huntington-beach": {
    name: "Huntington Beach",
    county: "Orange County",
    zipCodes: ["92649", "92648", "92646", "92647"],
    heroImage: "https://momentumrg.com/wp-content/uploads/2025/06/New-Project-1-scaled.png",
    tagline: "Surf City, USA — Coastal Living at Its Best",
    description:
      "Huntington Beach is Orange County's beachfront crown jewel. Known worldwide as Surf City USA, it offers 10 miles of uninterrupted coastline, world-class surf breaks, and a real estate market that has historically outperformed inland OC by 15–25%.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$1.1M–$3.5M" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~6.1%" },
      { icon: MapPin, label: "Key Zip Codes", value: "92649, 92648, 92646" },
      { icon: Car, label: "Commute", value: "30 min to Irvine, 45 min to LA" },
    ],
    neighborhoods: [
      {
        name: "Huntington Harbour",
        zip: "92649",
        description:
          "An exclusive waterfront community with private channels, bayfront docks, and a boating lifestyle unique to Southern California. Homes range from $900K townhomes to $8M+ waterfront estates.",
      },
      {
        name: "Downtown / Main Street Corridor",
        zip: "92648",
        description:
          "Ground zero for Huntington Beach lifestyle. Walk to the pier, Pacific City, and 5-star surf breaks. High demand from investors and second-home buyers. Condos from $600K, SFRs from $1.2M.",
      },
      {
        name: "South Huntington Beach",
        zip: "92646",
        description:
          "Family-oriented with top-rated Huntington Beach Union HSD schools and quiet, established neighborhoods. Strong appreciation and long-term holding value. SFRs from $900K.",
      },
    ],
    whyBuy:
      "Coastal OC real estate has proven to be one of the most recession-resistant asset classes in California. Limited land supply, strict coastal development restrictions, and international buyer demand keep Huntington Beach prices supported. Strong vacation rental potential in short-term-rental-permitted zones.",
    cityFilter: "huntington-beach",
  },
  "la-habra": {
    name: "La Habra",
    county: "Orange County (with LA County border)",
    zipCodes: ["90631", "90632"],
    heroImage: "https://momentumrg.com/wp-content/uploads/2022/03/orange-county-real-estate-2.jpg",
    tagline: "OC Value with LA County Connectivity",
    description:
      "La Habra sits at the northern edge of Orange County, straddling the LA County line. It's consistently one of the best-value markets in OC — offering suburban quality of life at prices $200K–$400K below Fullerton or Brea.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$750K–$1.1M" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~4.8%" },
      { icon: MapPin, label: "Key Zip Code", value: "90631" },
      { icon: Car, label: "Freeway Access", value: "5, 57, 60 Fwys" },
    ],
    neighborhoods: [
      {
        name: "Central La Habra",
        zip: "90631",
        description:
          "The heart of La Habra with the Imperial Highway commercial corridor, city parks, and established SFR neighborhoods. Entry-level homes from $650K.",
      },
      {
        name: "La Habra Heights Adjacent",
        zip: "90631",
        description:
          "Larger lots, more privacy, and a semi-rural feel near the La Habra Heights border. Great for buyers seeking land and space at accessible price points.",
      },
    ],
    whyBuy:
      "La Habra is the secret of OC real estate. You get Orange County address, La Habra City School District quality, and price points 20–30% below the OC median. Add Cal State Fullerton 10 minutes away for rental demand, and you have a fundamentally sound buy-and-hold investment market.",
    cityFilter: "la-habra",
  },
};

type AreaSlug = keyof typeof AREAS;

export async function generateStaticParams() {
  return Object.keys(AREAS).map((slug) => ({ slug }));
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
      <PageHero
        badge={area.county}
        title={area.name}
        titleAccent={area.tagline}
        backgroundImage={area.heroImage}
      />

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

              <Link
                href={`/listings?city=${area.cityFilter}`}
                className="inline-flex items-center gap-2 bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide px-8 py-3.5 rounded-xl transition-colors mt-4"
              >
                Browse {area.name} Listings
                <ArrowRight className="w-4 h-4" />
              </Link>
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
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide px-6 py-3 rounded-lg w-full transition-colors"
                >
                  Free Consultation
                </Link>
                <a
                  href="tel:7143363375"
                  className="flex items-center justify-center gap-2 border border-border hover:border-brand text-foreground hover:text-brand font-display font-semibold px-6 py-3 rounded-lg w-full transition-colors text-sm"
                >
                  (714) 336-3375
                </a>
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
              <Link
                href="/contact"
                className="bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide px-10 py-4 rounded-xl transition-colors"
              >
                Contact Karl
              </Link>
              <Link
                href={`/listings?city=${area.cityFilter}`}
                className="bg-white/10 hover:bg-white/20 text-white font-display font-semibold uppercase tracking-wide px-10 py-4 rounded-xl border border-white/20 transition-colors"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
