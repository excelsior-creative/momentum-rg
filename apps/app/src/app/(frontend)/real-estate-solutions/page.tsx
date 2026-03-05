import React from "react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { generatePageMetadata } from "@/lib/metadata";
import Link from "next/link";
import {
  ArrowRight,
  Home,
  TrendingUp,
  Repeat2,
  Landmark,
  Users,
  Search,
} from "lucide-react";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Real Estate Solutions",
  description:
    "Creative real estate solutions in Orange County, LA County, and Riverside County. Buyer representation, seller services, investment strategy, 1031 exchanges, and more.",
  path: "/real-estate-solutions",
  keywords: [
    "real estate solutions Orange County",
    "buy a home Orange County",
    "sell a home California",
    "1031 exchange",
    "real estate investment",
    "Karl Parize realtor",
  ],
});

const solutions = [
  {
    icon: Home,
    title: "Buyer Representation",
    description:
      "From first-time buyers to seasoned investors, we guide you through every step — property search, offer strategy, negotiation, inspections, and close. Our knowledge of Southern California's micro-markets means you won't overpay.",
    href: "/contact",
  },
  {
    icon: TrendingUp,
    title: "Seller Services",
    description:
      "Strategic pricing, professional photography, targeted digital marketing, and expert negotiation. We don't just list your home — we build a campaign to attract qualified buyers and maximize your net proceeds.",
    href: "/contact",
  },
  {
    icon: Repeat2,
    title: "1031 Exchanges",
    description:
      "Defer capital gains taxes and grow your portfolio through strategic like-kind exchanges. Karl has guided numerous investors through the complex 1031 process with zero missteps.",
    href: "/contact",
  },
  {
    icon: Landmark,
    title: "Investment Properties",
    description:
      "Whether you're buying your first rental or expanding a multi-property portfolio, we analyze cap rates, cash flow, appreciation potential, and financing to find deals that make sense for your goals.",
    href: "/contact",
  },
  {
    icon: Users,
    title: "Probate & Estate Sales",
    description:
      "Compassionate, experienced handling of inherited and estate properties. We navigate the legal and emotional complexity to protect the estate's value and move the process forward efficiently.",
    href: "/contact",
  },
  {
    icon: Search,
    title: "Off-Market Opportunities",
    description:
      "Our network of relationships across Orange County, LA, and Riverside gives clients access to properties that never hit the MLS. If you know what you want, we'll find it.",
    href: "/contact",
  },
];

const stats = [
  { value: "25+", label: "Years of Experience" },
  { value: "3", label: "Counties Served" },
  { value: "$0", label: "Buyer Agent Fee*" },
  { value: "100%", label: "Client-Focused Approach" },
];

export default function RealEstateSolutionsPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Real Estate Solutions"
        title="Creative Solutions."
        titleAccent="Proven Results."
        subtitle="With over 25 years of experience navigating Southern California real estate, Karl Parize offers solutions that other firms can't. Whether you're buying, selling, or investing — we'll find a way that works for you."
        backgroundImage="https://momentumrg.com/wp-content/uploads/2025/06/ec0f2dd1aefdaf6488f3e6b01142695d1df501df-scaled.png"
      />

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="font-heading text-3xl md:text-4xl font-bold text-brand">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            *Buyer agent compensation subject to current NAR settlement guidelines. Ask us for details.
          </p>
        </Container>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              What We Offer
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 text-foreground">
              How We Can Help
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              From straightforward home purchases to complex investment
              strategies, Momentum handles the full spectrum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {solutions.map(({ icon: Icon, title, description, href }) => (
              <div
                key={title}
                className="group flex flex-col p-8 bg-white border border-border rounded-xl hover:border-brand/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-brand/5 flex items-center justify-center mb-5 group-hover:bg-brand transition-colors duration-300">
                  <Icon className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  {description}
                </p>
                <Link
                  href={href}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-brand hover:text-gold transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Quote / Karl section */}
      <section className="py-20 md:py-28 bg-warm-gray">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8 leading-snug">
              &ldquo;Success begets success when you seek to not only know the
              history, but the true desired outcome of your clients.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
                  alt="Karl Parize"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-heading font-bold text-foreground">Karl Parize</p>
                <p className="text-sm text-muted-foreground">Broker / Owner, Momentum Realty Group</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-charcoal">
        <Container>
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Let&apos;s Talk About Your Goals
            </h2>
            <p className="text-white/60 mb-8">
              No pressure, no pitch. Just a conversation about what you want to
              achieve and whether Momentum is the right fit.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand text-white font-heading font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-brand-light transition-colors"
            >
              Schedule a Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
