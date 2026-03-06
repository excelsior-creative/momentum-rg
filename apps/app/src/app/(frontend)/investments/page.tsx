import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  LineChart,
  PiggyBank,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Investment Services",
  description:
    "Investment-property guidance for acquisitions, portfolio planning, and property-management-informed decisions across Southern California.",
  path: "/investments",
  keywords: [
    "investment property Orange County",
    "rental property guidance California",
    "real estate investment strategy",
    "property management investment decisions",
    "portfolio planning real estate",
  ],
});

const investmentServices = [
  {
    icon: Building2,
    title: "First Rental Property Guidance",
    description:
      "If you are buying your first investment property, we help you evaluate location, rent potential, maintenance realities, and whether the deal fits your risk tolerance.",
  },
  {
    icon: LineChart,
    title: "Portfolio Growth Planning",
    description:
      "For experienced owners looking to expand, we help assess next-property opportunities, pacing, financing considerations, and how new assets fit the existing portfolio.",
  },
  {
    icon: PiggyBank,
    title: "Hold, Improve, or Reposition",
    description:
      "Sometimes the best move is not another purchase. We help clients think through renovation strategy, rent optimization, disposition timing, and other ownership decisions.",
  },
];

const decisionPoints = [
  {
    title: "Cash flow has to survive real operations",
    description:
      "Projected numbers only matter if the property can actually perform after leasing, maintenance, turnover, and ongoing management realities are considered.",
  },
  {
    title: "Acquisition strategy should match management reality",
    description:
      "A property may look strong on paper but create friction once you factor in tenant profile, deferred maintenance, layout issues, or compliance demands.",
  },
  {
    title: "Long-term returns come from better decisions early",
    description:
      "Choosing the right market, purchase timing, and operational plan can do more for returns than chasing a deal that only looks good in a spreadsheet.",
  },
];

const investorAdvantages = [
  "Real-estate and property-management perspective in one conversation",
  "Local knowledge across Orange County, LA County, and Riverside County",
  "Practical guidance around rentability, upkeep, and long-term ownership",
  "Decision support that stays focused on goals, not hype",
];

export default function InvestmentsPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Investment Services"
        title="Smarter Property Decisions."
        titleAccent="Stronger Long-Term Strategy."
        subtitle="Momentum Realty Group helps clients evaluate investment opportunities with a practical view of acquisition, ownership, and ongoing management. We focus on decisions that make sense in the real world, not just on paper."
        backgroundImage="/property-management-home.jpg"
      />

      <section className="border-b border-border bg-white py-20 md:py-28">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              Investment Support
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Guidance for the decisions that shape portfolio performance
            </h2>
            <p className="mt-4 text-muted-foreground">
              We help clients navigate the questions that come before and after
              a purchase so they can move with better context and fewer blind
              spots.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {investmentServices.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-white p-8 shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/5">
                  <Icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-warm-gray py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-brand">
                Property Management Lens
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
                Better investment calls start with better operational insight.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Investor decisions do not end at closing. Tenant placement,
                  turnover cost, maintenance burden, and rent collection all
                  affect whether a property performs the way you expected.
                </p>
                <p>
                  That is why our investment conversations are informed by
                  property-management realities. We help clients look beyond the
                  listing and think about how an asset will behave once it is in
                  operation.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {decisionPoints.map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-charcoal py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Why Investors Work With Momentum
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
                Strategy grounded in both the market and the day-to-day reality
                of ownership.
              </h2>
              <p className="mt-5 max-w-2xl text-white/70">
                We help clients think through opportunity, risk, and operational
                fit so investment choices stay aligned with their long-term
                property goals.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, label: investorAdvantages[0] },
                { icon: Building2, label: investorAdvantages[1] },
                { icon: Wrench, label: investorAdvantages[2] },
                { icon: PiggyBank, label: investorAdvantages[3] },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <Icon className="h-5 w-5 text-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-white py-16">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Looking at your next investment move?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Contact Momentum to talk through acquisition strategy, portfolio
              planning, and ownership decisions tied to long-term performance.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild variant="cta" size="marketing">
                <Link href="/contact">
                  Discuss Your Strategy
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
