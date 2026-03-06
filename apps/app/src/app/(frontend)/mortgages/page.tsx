import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Clock3,
  Home,
  Landmark,
  RefreshCcw,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Mortgage Services",
  description:
    "Mortgage guidance for purchases, refinances, and home equity decisions across Orange County, LA County, and Riverside County.",
  path: "/mortgages",
  keywords: [
    "mortgage services Orange County",
    "home loan guidance California",
    "refinance help Orange County",
    "home equity options",
    "purchase loan guidance",
  ],
});

const mortgageServices = [
  {
    icon: Home,
    title: "Purchase Financing Guidance",
    description:
      "Whether you are buying your first home or preparing a move-up purchase, we help you understand financing options, monthly payment tradeoffs, and what a competitive offer really looks like.",
  },
  {
    icon: RefreshCcw,
    title: "Refinance Conversations",
    description:
      "When rates, equity, or long-term goals change, we help you evaluate whether refinancing makes sense and what questions to ask before moving forward.",
  },
  {
    icon: Wallet,
    title: "Home Equity Strategy",
    description:
      "If you are considering using equity for renovations, debt consolidation, or another property decision, we help you think through timing, risk, and the bigger picture.",
  },
];

const processSteps = [
  {
    title: "Clarify the goal",
    description:
      "We start with the reason behind the loan decision so the financing path supports the outcome you actually want.",
  },
  {
    title: "Compare the options",
    description:
      "Fixed-rate, refinance, cash-out, and equity-related scenarios can look similar on paper. We help break down the practical pros, cons, and likely next steps.",
  },
  {
    title: "Move with confidence",
    description:
      "Once the direction is clear, we help you prepare for the conversation, timeline, and documentation so the process feels organized instead of reactive.",
  },
];

const momentumAdvantages = [
  "Local perspective across Orange County, LA County, and Riverside County",
  "Guidance that connects financing decisions to your larger real-estate goals",
  "Clear communication without unnecessary jargon or pressure",
  "Support for both short-term needs and long-term ownership strategy",
];

export default function MortgagesPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Mortgage Services"
        title="Financing Guidance."
        titleAccent="Practical Next Steps."
        subtitle="Mortgage decisions can shape your monthly payment, your negotiating power, and your long-term flexibility. Momentum Realty Group helps clients think through purchase financing, refinances, and home equity options with clarity."
        backgroundImage="/about-california-home.png"
      />

      <section className="border-b border-border bg-white py-20 md:py-28">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              How We Help
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              General mortgage support built around real decisions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every loan conversation is different, but most clients need the
              same thing: better context, cleaner comparisons, and a path that
              fits their broader plan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {mortgageServices.map(({ icon: Icon, title, description }) => (
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
                Decision Support
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
                We make the moving pieces easier to understand.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Mortgage choices are rarely just about rates. They affect cash
                  flow, leverage, resale timing, renovation plans, and how much
                  flexibility you keep after closing.
                </p>
                <p>
                  Our role is to help you sort through the tradeoffs, identify
                  the questions that matter, and move forward with a plan that
                  supports your actual goals instead of forcing a one-size-fits-all
                  answer.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {processSteps.map(({ title, description }, index) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal text-sm font-semibold text-white">
                      0{index + 1}
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
                Why Momentum
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
                Mortgage guidance connected to the full real-estate picture.
              </h2>
              <p className="mt-5 max-w-2xl text-white/70">
                Because Momentum works across sales, property strategy, and
                ownership decisions, we help clients think beyond a single loan
                product and focus on what will serve them best over time.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Landmark, label: momentumAdvantages[0] },
                { icon: BadgeDollarSign, label: momentumAdvantages[1] },
                { icon: Clock3, label: momentumAdvantages[2] },
                { icon: Wallet, label: momentumAdvantages[3] },
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
              Need to talk through a mortgage decision?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Reach out for a straightforward conversation about financing,
              refinancing, or home equity options and how they fit your goals.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild variant="cta" size="marketing">
                <Link href="/contact">
                  Talk With Our Team
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
