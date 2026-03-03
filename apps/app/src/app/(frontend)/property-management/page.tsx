import React from "react";
import { Container } from "@/components/Container";
import { generatePageMetadata } from "@/lib/metadata";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  DollarSign,
  Wrench,
  FileText,
  BarChart3,
  Users,
} from "lucide-react";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Property Management Services",
  description:
    "Full-service property management in Orange County, LA County, and Riverside County. Tenant screening, rent collection, maintenance, and compliance — handled for you.",
  path: "/property-management",
  keywords: [
    "property management Orange County",
    "landlord services",
    "rental property management",
    "tenant screening",
    "multi-unit management",
  ],
});

const services = [
  {
    icon: Users,
    title: "Tenant Screening & Placement",
    description:
      "We run comprehensive background checks, credit reports, income verification, and rental history reviews to ensure you get reliable, qualified tenants.",
  },
  {
    icon: DollarSign,
    title: "Rent Collection",
    description:
      "Online payment processing, automatic reminders, and prompt disbursement to your account — every month, like clockwork.",
  },
  {
    icon: Wrench,
    title: "Maintenance Coordination",
    description:
      "24/7 maintenance requests handled by our trusted vendor network. Preventive inspections keep your property in top condition and protect your investment.",
  },
  {
    icon: FileText,
    title: "Lease Management",
    description:
      "Legally compliant California leases, renewals, and addenda — drafted and managed to protect your interests at every stage of the tenancy.",
  },
  {
    icon: BarChart3,
    title: "Financial Reporting",
    description:
      "Monthly statements, year-end tax documents, and on-demand reporting give you full visibility into your property's performance.",
  },
  {
    icon: Shield,
    title: "Legal Compliance",
    description:
      "California's landlord-tenant laws are complex. We stay current on rent control, habitability requirements, and eviction procedures so you don't have to.",
  },
];

const steps = [
  {
    num: "01",
    title: "Free Property Evaluation",
    desc: "We assess your property, discuss your goals, and recommend an optimal rental strategy.",
  },
  {
    num: "02",
    title: "Onboarding & Marketing",
    desc: "We handle all paperwork, photograph your property professionally, and list it across premium rental platforms.",
  },
  {
    num: "03",
    title: "Tenant Placement",
    desc: "We screen applicants thoroughly, select the best-qualified tenant, and execute a solid lease.",
  },
  {
    num: "04",
    title: "Ongoing Management",
    desc: "We manage everything from day-to-day operations to annual inspections — you collect income, we handle the rest.",
  },
];

export default function PropertyManagementPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-brand relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <Container>
          <div className="relative z-10 max-w-2xl">
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">
              Property Management
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
              Simple Approach.{" "}
              <span className="text-gold">Serious Results.</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              We take the stress out of being a landlord. From tenant screening
              to maintenance to compliance, Momentum Realty Group manages your
              investment so you can focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-brand font-heading font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-white/90 transition-colors"
              >
                Get a Free Evaluation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/property-management/multi-unit"
                className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
              >
                Multi-Unit Management
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              What&apos;s Included
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 text-foreground">
              Full-Service Management
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Every aspect of your rental property, handled with care and
              expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-7 bg-white border border-border rounded-xl hover:border-brand/30 hover:shadow-lg transition-all group"
              >
                <div className="w-11 h-11 rounded-lg bg-brand/5 flex items-center justify-center mb-5 group-hover:bg-brand transition-colors">
                  <Icon className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-warm-gray">
        <Container>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              The Process
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 text-foreground">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand text-white font-heading font-bold text-xl flex items-center justify-center mx-auto mb-5">
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-foreground text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal">
        <Container>
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Ready to Stop Managing Yourself?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Contact us for a free property evaluation and learn what your
              rental can achieve under professional management.
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
