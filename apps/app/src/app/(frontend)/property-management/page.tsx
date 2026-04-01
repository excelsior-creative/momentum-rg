import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  FileText,
  HandCoins,
  Home,
  Phone,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";
import { ContactFormWithProvider } from "@/components/ContactFormWithProvider";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";
import { combineSchemas, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Property Management in Orange County and Southern California",
  description:
    "Full-service property management in Orange County, LA County, Riverside County, and San Diego County. Momentum Realty Group helps rental owners with leasing, rent collection, maintenance coordination, reporting, and California compliance support.",
  path: "/property-management",
  keywords: [
    "property management Orange County",
    "landlord services",
    "rental property management",
    "tenant screening",
    "multi-unit management",
  ],
});

const stats = [
  { value: "25+", label: "Years of Experience" },
  { value: "500+", label: "Transactions Closed" },
  { value: "4", label: "Counties Served" },
  { value: "2009", label: "Founded" },
];

const services = [
  {
    icon: BadgeCheck,
    title: "Leasing Done Right",
    description:
      "Professional marketing, showings, screening, and lease execution designed to reduce vacancy and place qualified residents with confidence.",
  },
  {
    icon: HandCoins,
    title: "Reliable Rent Operations",
    description:
      "Online collection, owner disbursements, late-payment protocols, and clean communication that keep cash flow consistent and documented.",
  },
  {
    icon: Wrench,
    title: "Maintenance Without the Chaos",
    description:
      "24/7 maintenance coordination through trusted vendors, plus proactive follow-through that protects the property and saves you time.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspections & Oversight",
    description:
      "Move-in, move-out, and routine inspections help us catch issues early, maintain standards, and keep owners informed.",
  },
  {
    icon: BarChart3,
    title: "Clear Owner Reporting",
    description:
      "Monthly reporting and year-end documentation give you visibility into performance without making you chase down details.",
  },
  {
    icon: Shield,
    title: "California Compliance Support",
    description:
      "Leases, notices, renewals, rent increases, and escalation workflows are handled with California requirements in mind.",
  },
];

const propertyTypes = [
  {
    icon: Home,
    title: "Single-Family Homes",
    description:
      "Hands-on support for owners who want professional oversight without losing sight of asset quality or tenant experience.",
  },
  {
    icon: Building2,
    title: "Condos & Townhomes",
    description:
      "Management that accounts for HOA constraints, vendor coordination, and occupancy standards that protect value.",
  },
  {
    icon: Building2,
    title: "Multi-Unit Residential",
    description:
      "Duplexes, triplexes, fourplexes, and apartment properties managed with systems built for efficiency and consistency.",
  },
  {
    icon: FileText,
    title: "Select Commercial",
    description:
      "For qualifying mixed-use and commercial assets, we bring the same disciplined communication and operational follow-through.",
  },
];

const differentiators = [
  "25+ years navigating Southern California real estate",
  "Creative solutions other firms cannot offer",
  "Owner-first strategy focused on your long-term goals",
  "Responsive communication with practical decision support",
  "Coverage across Orange County, LA County, Riverside County, and San Diego County",
  "Systems built to reduce your involvement, not your returns",
];

const included = [
  "Tenant screening and placement",
  "Lease preparation and renewals",
  "Online rent collection and owner disbursement",
  "Maintenance coordination and vendor dispatch",
  "Regular property inspections",
  "Monthly statements and year-end reporting",
  "Late-payment and notice workflows",
  "Eviction coordination with experienced counsel when needed",
];

const faqs = [
  {
    question: "What types of properties do you manage?",
    answer:
      "We manage single-family homes, condos, multi-unit residential buildings, and select commercial properties across Orange County, Los Angeles County, Riverside County, and San Diego County.",
  },
  {
    question: "What does full-service management include?",
    answer:
      "Our service covers leasing, screening, lease preparation, rent collection, maintenance coordination, inspections, financial reporting, and compliance support so owners can stay informed without handling daily operations.",
  },
  {
    question: "How do you handle tenant issues or non-payment?",
    answer:
      "We use clear processes that begin with automated reminders and escalate to formal notices when needed. If a matter requires legal action, we coordinate with experienced California landlord-tenant counsel.",
  },
];

const steps = [
  {
    num: "01",
    title: "Free Property Evaluation",
    desc: "We review the property, your goals, and the rental strategy that best fits the asset and your expectations.",
  },
  {
    num: "02",
    title: "Launch & Leasing",
    desc: "We prepare the listing, market the property, manage showings, and qualify applicants to protect your standards.",
  },
  {
    num: "03",
    title: "Onboard the Resident",
    desc: "We execute the lease, coordinate move-in details, and set expectations early so the tenancy starts on solid footing.",
  },
  {
    num: "04",
    title: "Operate & Optimize",
    desc: "From rent collection to maintenance and inspections, we keep the property moving while you stay informed on results.",
  },
];

const marketCoverage = [
  {
    title: "Orange County Rentals",
    description:
      "For owners in markets like Huntington Beach, La Habra, Anaheim, and surrounding Orange County cities, we focus on pricing discipline, resident retention, and protecting the long-term value of the asset.",
  },
  {
    title: "LA County Properties",
    description:
      "From Long Beach to La Mirada and nearby neighborhoods, we help owners manage leasing, maintenance coordination, and day-to-day resident communication without losing visibility into performance.",
  },
  {
    title: "Riverside County Investments",
    description:
      "For Inland Empire rentals and growth-oriented portfolios, we help owners stay ahead of vacancy, maintenance, and operational drag while keeping reporting clear and actionable.",
  },
  {
    title: "San Diego County Properties",
    description:
      "From North County coastal communities to the urban core, we help San Diego owners manage leasing, resident communications, and day-to-day operations with the same disciplined approach we bring across Southern California.",
  },
];

export default function PropertyManagementPage() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Property Management", path: "/property-management" },
    ]),
    generateFAQSchema(
      faqs.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    ),
  );

  return (
    <div className="flex flex-col">
      <StructuredData data={schema} />
      <PageHero
        badge="Property Management"
        title="Your Property."
        titleAccent="Professionally Protected."
        subtitle="Momentum Realty Group delivers full-service property management for owners who want stronger leasing, tighter operations, and less day-to-day stress. We handle the details, protect the asset, and keep your investment moving forward."
        backgroundImage="/property-management-home.jpg"
      />

      <section className="bg-charcoal">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center px-4 py-6 text-center"
              >
                <span className="font-heading text-2xl font-semibold text-gold md:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-display uppercase tracking-widest text-white/70">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-white/45 py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Why Owners Hire Us
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
                Property management that protects income, time, and peace of
                mind.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  We built this service for owners who are done chasing rent,
                  coordinating repairs, fielding tenant issues, and trying to
                  keep up with changing California requirements on their own.
                </p>
                <p>
                  Our role is simple: keep the property moving, communicate
                  clearly, and make decisions that support long-term value. You
                  stay informed. We handle the execution.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-8 py-4 font-heading font-semibold text-white shadow-lg transition-colors hover:bg-cta-light"
                >
                  Get a Free Evaluation
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="tel:7143363375"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <Phone className="h-5 w-5" />
                  (714) 336-3375
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white p-8 shadow-xl shadow-charcoal/5 md:p-10">
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                What You Can Expect
              </span>
              <div className="mt-6 space-y-5">
                {[
                  {
                    icon: Sparkles,
                    title: "Better tenant experiences",
                    description:
                      "Clear communication and organized operations create stronger resident relationships and smoother renewals.",
                  },
                  {
                    icon: DollarSign,
                    title: "Cleaner cash-flow execution",
                    description:
                      "We keep rent operations predictable so owners are not spending their month following up on basics.",
                  },
                  {
                    icon: CalendarClock,
                    title: "Less reactive ownership",
                    description:
                      "With systems for maintenance, notices, and inspections, you stop living in crisis-response mode.",
                  },
                ].map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/5">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-warm-gray py-20 md:py-28">
        <Container>
          <div className="mb-14 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              What&apos;s Included
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Full-Service Management
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Every core part of the management process is covered with owner
              communication, disciplined follow-through, and local market
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-xl border border-border bg-white p-7 transition-all hover:border-brand/30 hover:shadow-lg"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/5 transition-colors group-hover:bg-brand">
                  <Icon className="h-5 w-5 text-brand transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-3 font-heading text-lg font-bold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-white/70 py-20 md:py-28">
        <Container>
          <div className="mb-14 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Coverage
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              What We Manage
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Whether you own one rental or a larger portfolio, we bring the
              same owner-first discipline to leasing, operations, and oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {propertyTypes.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-border bg-white p-6 transition-all hover:border-brand/30 hover:shadow-md"
              >
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/5">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-charcoal py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Why Owners Choose Momentum
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
                Experience, creativity, and a service model built around your
                goals.
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-white/70">
                <p>
                  Karl Parize founded Momentum Realty Group to break the mold of
                  the traditional brokerage model and put the client&apos;s
                  &ldquo;why&rdquo; at the center of every decision.
                </p>
                <p>
                  In property management, that means more than collecting rent.
                  It means reducing friction for owners, protecting the asset,
                  and building repeatable systems that support better outcomes
                  over time.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {differentiators.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-sm text-white/75">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <p className="font-heading text-xl italic leading-relaxed text-white">
                  &ldquo;We designed Momentum to create peace of mind for owners
                  who want their investment handled with professionalism,
                  urgency, and personal attention.&rdquo;
                </p>
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="font-heading text-base text-white">
                    Karl Parize
                  </p>
                  <p className="text-sm uppercase tracking-widest text-gold">
                    Founder &amp; Principal Broker
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { stat: "25+", label: "Years of market experience" },
                  { stat: "4", label: "Southern California counties served" },
                  { stat: "Owner", label: "Focused guidance, not generic service" },
                ].map(({ stat, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
                  >
                    <div className="font-heading text-3xl font-bold text-gold">
                      {stat}
                    </div>
                    <p className="mt-2 text-sm text-white/70">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-brand/[0.03] py-20 md:py-28">
        <Container>
          <div className="mb-14 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              The Process
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold font-heading text-xl font-bold text-charcoal">
                  {step.num}
                </div>
                <h3 className="mb-3 font-heading text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-white/50 py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Owner Support
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
                The details that make management feel easy on your side.
              </h2>
              <div className="mt-6 rounded-2xl bg-warm-gray p-8 md:p-10">
                <div className="grid gap-4 sm:grid-cols-2">
                  {included.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Frequently Asked
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
                Common Questions from Owners
              </h2>
              <div className="mt-6 space-y-4">
                {faqs.map(({ question, answer }) => (
                  <div
                    key={question}
                    className="rounded-xl border border-border bg-white p-6"
                  >
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {question}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-warm-gray py-20 md:py-24">
        <Container>
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              Local Coverage
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Built for Southern California owners
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Different submarkets create different management headaches. Our role is to keep the
              operating plan aligned with the realities of the property and the market it sits in.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {marketCoverage.map(({ title, description }) => (
              <div key={title} className="rounded-2xl border border-border bg-white p-7">
                <h3 className="font-heading text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-charcoal py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Ready to Sign With Us?
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
                Let&apos;s talk about your property, your goals, and the right
                management plan.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/65">
                Reach out for a free evaluation and a direct conversation about
                how we would market, manage, and protect your investment.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "No-pressure consultation with a local expert",
                  "Clear view of how we approach leasing and operations",
                  "A practical plan tailored to the property you own",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-sm text-white/75">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild variant="cta" size="marketing">
                  <a href="tel:7143363375">
                    <Phone className="h-5 w-5" />
                    Call Now
                  </a>
                </Button>
                <Button asChild variant="ctaInverse" size="marketing">
                  <Link href="/property-management/multi-unit">
                    Multi-Unit Management
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-2xl md:p-10">
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Request Your Free Evaluation
              </span>
              <h3 className="mt-3 font-heading text-2xl font-bold text-foreground">
                Tell us about your property.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Share a few details and we&apos;ll follow up with next steps for
                pricing, leasing, and management support.
              </p>
              <div className="mt-8">
                <ContactFormWithProvider />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
