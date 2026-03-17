import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";
import {
  ArrowRight,
  Clock,
  FileText,
  HandshakeIcon,
  Landmark,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Foreclosure Support",
  description:
    "Facing foreclosure in Orange County, LA County, or Riverside County? Momentum Realty Group helps homeowners understand their options, protect their equity, and move forward with a clear plan.",
  path: "/foreclosure",
  keywords: [
    "foreclosure help Orange County",
    "stop foreclosure California",
    "short sale specialist Orange County",
    "foreclosure options California",
    "foreclosure support Riverside County",
    "foreclosure real estate agent",
  ],
});

const supportServices = [
  {
    icon: Clock,
    title: "Timeline Guidance",
    description:
      "Foreclosure moves through strict legal stages with real deadlines. We help you understand exactly where you are in the process, what comes next, and how much time you have to act.",
  },
  {
    icon: FileText,
    title: "Short Sale Coordination",
    description:
      "A short sale can be a practical alternative to foreclosure — often preserving more of your credit and your equity. We handle the negotiation, documentation, and coordination with lenders.",
  },
  {
    icon: HandshakeIcon,
    title: "Loan Modification Support",
    description:
      "Sometimes the best path forward is staying in the home. We help you understand loan modification options and what to ask for before making any decisions.",
  },
];

const processSteps = [
  {
    title: "Understand your position",
    description:
      "We start with a confidential, no-pressure conversation about where you are in the process. No judgment — just a clear picture of your timeline and options.",
  },
  {
    title: "Evaluate every path forward",
    description:
      "Short sale, loan modification, deed-in-lieu, or a structured sale — we walk through the real pros and cons of each path so you can decide what fits your situation.",
  },
  {
    title: "Move with a plan",
    description:
      "Once you know what you want to do, we coordinate every step — lender communication, documentation, and closing — so the process doesn't overwhelm you.",
  },
];

const momentumAdvantages = [
  "Certified Short Sale & Foreclosure Resource (SFR) on our team",
  "Free, no-obligation consultations with no pressure to commit",
  "Bilingual support — hablamos español",
  "Local expertise across Orange County, LA County, and Riverside County",
];

export default function ForeclosurePage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Foreclosure Support"
        title="When Time Is Critical,"
        titleAccent="We Help You Act."
        subtitle="Foreclosure is one of the most stressful situations a homeowner can face. Momentum Realty Group helps you understand your options, protect what you can, and move forward with a clear plan — not a sales pitch."
        backgroundImage="/about-california-home.png"
      />

      <section className="border-b border-border bg-white py-20 md:py-28">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              How We Help
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Real support for a difficult situation
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our team includes a certified Short Sale &amp; Foreclosure
              Resource (SFR) who has spent two decades helping homeowners
              navigate exactly this. You are not alone.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {supportServices.map(({ icon: Icon, title, description }) => (
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
                Our Approach
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
                We give you options, not pressure.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Foreclosure is a multi-phase legal process with strict
                  deadlines — and most homeowners don&apos;t know what their
                  real options are until it&apos;s too late.
                </p>
                <p>
                  Our role is to give you the clearest possible picture of where
                  you stand, what each path costs you, and which approach gives
                  you the best outcome for your specific situation. No scripts.
                  No hard sells.
                </p>
                <blockquote className="border-l-4 border-brand/40 pl-5 py-1 italic text-foreground/80">
                  &ldquo;Together, we can find a perfect, personalized solution
                  for your unique situation. Our goal is to save your home and
                  your equity.&rdquo;
                </blockquote>
                <p className="text-sm text-muted-foreground">
                  — Esmeralda Novikoff, SFR · SRES · CA DRE #01409881
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/team/esmeralda"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                >
                  Meet Esmeralda
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
                Foreclosure guidance connected to the full real-estate picture.
              </h2>
              <p className="mt-5 max-w-2xl text-white/70">
                Because Momentum works across sales, property strategy, and
                ownership decisions, we help clients think beyond the immediate
                crisis and focus on what will serve them best over time.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, label: momentumAdvantages[0] },
                { icon: Phone, label: momentumAdvantages[1] },
                { icon: HandshakeIcon, label: momentumAdvantages[2] },
                { icon: Landmark, label: momentumAdvantages[3] },
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
              Facing foreclosure? Let&apos;s talk today.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We offer free, no-obligation consultations for homeowners in any
              stage of foreclosure. Reach out now — the earlier we connect, the
              more options you have.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild variant="cta" size="marketing">
                <Link href="/contact">
                  Talk With Our Team
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="marketing">
                <a href="tel:8778862699">
                  <Phone className="h-5 w-5" />
                  (877) 886-2699
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
