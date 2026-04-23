import React from "react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { siteMediaPaths, wpMediaUrl } from "@/lib/wpMediaUrl";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Multi-Unit Property Management in Southern California",
  description:
    "Expert multi-unit property management for duplexes, triplexes, fourplexes, and apartment properties in Orange County, LA County, and Riverside County.",
  path: "/property-management/multi-unit",
  keywords: [
    "multi unit property management",
    "apartment management Orange County",
    "duplex management",
    "triplex management",
    "multifamily property management California",
  ],
});

const included = [
  "Full tenant screening & lease execution",
  "Rent collection & owner disbursement",
  "24/7 maintenance request handling",
  "Preventive maintenance scheduling",
  "Annual property inspections",
  "Monthly & year-end financial statements",
  "Utility management support",
  "Lease renewals & rent increase strategy",
  "Vacancy marketing across premium platforms",
  "Legal compliance & eviction coordination",
  "Insurance claim facilitation",
  "Capital improvement planning",
];

const propertyTypes = [
  { label: "Duplexes", desc: "Two-unit residential buildings managed as one portfolio." },
  { label: "Triplexes & Fourplexes", desc: "Small multi-family at scale — maximum efficiency." },
  { label: "Apartment Complexes", desc: "5+ unit buildings with full-service operations." },
  {
    label: "Mixed-Use Properties",
    desc: "Residential + commercial units in a single building.",
  },
];

const portfolioPriorities = [
  {
    title: "Occupancy and Turnover Control",
    description:
      "Vacancy in multi-unit assets compounds quickly. We focus on lease cadence, resident communication, and make-ready execution that keeps units moving back to market faster.",
  },
  {
    title: "Rent Roll Visibility",
    description:
      "Owners need clean reporting across the whole property, not just one unit at a time. We keep collections, disbursements, and performance reporting organized and usable.",
  },
  {
    title: "Vendor and Maintenance Coordination",
    description:
      "As unit counts rise, maintenance can turn chaotic. We help centralize vendor communication, work-order follow-through, and recurring upkeep planning.",
  },
  {
    title: "California Compliance Support",
    description:
      "Multi-unit ownership brings more operational complexity around notices, renewals, habitability, and resident issues. We help owners manage that complexity with a consistent process.",
  },
];

export default function MultiUnitManagementPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Multi-Unit Management"
        title="Your Multifamily Portfolio,"
        titleAccent="Professionally Managed"
        subtitle="Managing multiple units multiplies complexity. Momentum Realty Group brings expertise, systems, and local market knowledge to keep your portfolio performing — with minimal headaches for you."
        backgroundImage={wpMediaUrl(siteMediaPaths.heroOrangeCounty)}
      />

      {/* Property Types */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              Property Types
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 text-foreground">
              What We Manage
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
            {propertyTypes.map(({ label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-6 bg-white border border-border rounded-xl hover:border-brand/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-brand/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground mb-1">{label}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div className="bg-warm-gray rounded-2xl p-10 md:p-14">
            <div className="text-center mb-10">
              <span className="text-sm font-semibold uppercase tracking-widest text-brand">
                Full Coverage
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold mt-3 text-foreground">
                Everything Included
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Why Momentum */}
      <section className="py-20 bg-charcoal">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Why Momentum
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-4 mb-6">
                The Momentum Difference
              </h2>
              <div className="space-y-5 text-white/70 leading-relaxed">
                <p>
                  Karl Parize founded Momentum Realty Group with a clear mission:
                  break the mold of the traditional brokerage and put the
                  client&apos;s &ldquo;why&rdquo; at the center of every decision.
                </p>
                <p>
                  For multi-unit owners, that means more than just collecting rent.
                  We optimize your occupancy rates, protect your asset, and create
                  systems that reduce your involvement without reducing your returns.
                </p>
                <p>
                  With deep roots in Orange County and over a decade serving
                  landlords across Southern California, our team understands the
                  local market dynamics that determine your profitability.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { stat: "15+", label: "Years managing Southern CA properties" },
                { stat: "3", label: "Counties served: OC, LA, Riverside" },
                { stat: "100%", label: "Owner-first approach on every portfolio" },
              ].map(({ stat, label }) => (
                <div
                  key={stat}
                  className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="text-4xl font-heading font-bold text-brand shrink-0">
                    {stat}
                  </div>
                  <p className="text-white/70 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24 border-t border-border bg-warm-gray">
        <Container>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              Operational Priorities
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 text-foreground">
              What matters most on multi-unit assets
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Managing duplexes and apartment properties is not just a scaled-up version of
              single-family management. The asset performs when the systems behind occupancy,
              maintenance, and reporting stay tight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioPriorities.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-white p-7 shadow-sm"
              >
                <h3 className="font-heading text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-warm-gray border-t border-border">
        <Container>
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Ready to Maximize Your Portfolio?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a no-obligation consultation to discuss your multi-unit
              properties and learn how we can improve your bottom line.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="cta" size="marketing">
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="ctaOutline" size="marketing">
                <Link href="/property-management">View All Services</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
