import React from "react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";
import { combineSchemas, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structured-data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to the most common questions about buying, selling, and investing in real estate with Momentum Realty Group.",
  path: "/faqs",
  keywords: [
    "real estate FAQ",
    "home buying questions",
    "selling a home",
    "foreclosure options California",
    "Orange County real estate",
  ],
});

const faqs = [
  {
    category: "Buying a Home",
    questions: [
      {
        q: "How do I know I'm ready to buy a home?",
        a: "You're likely ready to buy when you have stable income, a solid credit score (typically 620+), savings for a down payment (3–20% of the purchase price), and a manageable debt-to-income ratio. We recommend speaking with a lender first to get pre-approved — it clarifies your budget and strengthens your offer.",
      },
      {
        q: "What is a pre-approval and why do I need one?",
        a: "A pre-approval is a lender's written commitment to loan you a specific amount based on your financials. In Southern California's competitive market, having a pre-approval letter makes your offer significantly more credible to sellers and is often required before touring properties.",
      },
      {
        q: "How long does it take to buy a home?",
        a: "From the time your offer is accepted, escrow typically takes 30–45 days. The full process — including finding the right home — usually takes 2–6 months depending on inventory and your readiness.",
      },
      {
        q: "What costs should I budget for beyond the down payment?",
        a: "Plan for closing costs (2–5% of the loan amount), home inspection fees, appraisal fees, moving expenses, and initial home maintenance. We walk every buyer through a full cost breakdown before they make an offer.",
      },
    ],
  },
  {
    category: "Selling a Home",
    questions: [
      {
        q: "How do you determine what my home is worth?",
        a: "We conduct a comprehensive Comparative Market Analysis (CMA) — examining recent sales of similar homes in your neighborhood, current market conditions, your home's condition, and unique features. This gives you a data-backed pricing strategy designed to maximize your return.",
      },
      {
        q: "Should I make repairs before listing?",
        a: "It depends on the repairs. Cosmetic improvements (paint, landscaping, staging) almost always pay off. Major structural repairs are more situational. We'll walk through your home and give you honest guidance on what to fix, what to skip, and what to disclose.",
      },
      {
        q: "How long will my home be on the market?",
        a: "In Orange County and surrounding areas, well-priced homes often receive offers within 1–2 weeks. Proper pricing, professional photography, and strategic marketing are key. Overpriced homes tend to sit — and that perception hurts you.",
      },
      {
        q: "What are seller closing costs?",
        a: "Sellers typically pay real estate commissions (split between buyer and seller agents), title insurance, transfer taxes, and any negotiated buyer concessions. Total seller closing costs usually run 6–9% of the sale price.",
      },
    ],
  },
  {
    category: "Property Management",
    questions: [
      {
        q: "What types of properties do you manage?",
        a: "We manage single-family homes, condos, multi-unit residential buildings (duplexes, triplexes, apartment complexes), and select commercial properties across Orange County, Los Angeles County, and Riverside County.",
      },
      {
        q: "What does your property management service include?",
        a: "Our full-service property management covers tenant screening and placement, lease preparation, rent collection, maintenance coordination, regular inspections, financial reporting, and legal compliance. We handle the headaches so you can enjoy the income.",
      },
      {
        q: "How do you handle tenant issues or non-payment?",
        a: "We have clear protocols for late payments, beginning with automated reminders and escalating to formal notices as needed. In the rare case eviction is necessary, we coordinate with attorneys experienced in California landlord-tenant law.",
      },
    ],
  },
  {
    category: "Foreclosure & Distressed Properties",
    questions: [
      {
        q: "What should I do if I've received a Notice of Default?",
        a: "Contact us immediately. A Notice of Default is the formal start of the foreclosure process in California, and you typically have 90 days before a Notice of Trustee Sale is filed. The earlier we connect, the more options remain open — from loan modification to a structured short sale.",
      },
      {
        q: "What is a short sale and is it better than foreclosure?",
        a: "A short sale is when you sell your home for less than you owe, with lender approval. It typically does less damage to your credit than a completed foreclosure, may allow you to stay in the home longer during the process, and can give you more control over the outcome. Our team includes a certified Short Sale & Foreclosure Resource (SFR) who handles these transactions regularly.",
      },
      {
        q: "What is a 1031 exchange and should I use one?",
        a: "A 1031 exchange allows you to defer capital gains taxes when selling an investment property by reinvesting the proceeds into a 'like-kind' property. It's one of the most powerful wealth-building tools in real estate. Karl has extensive experience guiding clients through this complex process.",
      },
    ],
  },
];

export default function FAQsPage() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQs", path: "/faqs" },
    ]),
    generateFAQSchema(
      faqs.flatMap((section) =>
        section.questions.map((item) => ({
          question: item.q,
          answer: item.a,
        })),
      ),
    ),
  );

  return (
    <div className="flex flex-col">
      <StructuredData data={schema} />
      <PageHero
        badge="FAQ"
        title="Frequently Asked"
        titleAccent="Questions"
        subtitle="Real answers to the questions we hear most. Can't find what you're looking for? Reach out directly."
        backgroundImage="https://momentumrg.com/wp-content/uploads/2025/06/6daf30f51f90728aaf76113795821975d6fd2d41-scaled.png"
      />

      {/* FAQ Content */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="max-w-3xl mx-auto space-y-16">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-8 pb-4 border-b border-border">
                  {section.category}
                </h2>
                <div className="space-y-8">
                  {section.questions.map((item) => (
                    <div key={item.q}>
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                        {item.q}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
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
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Karl and his team are available to answer any questions specific to
              your situation. Let&apos;s have a conversation.
            </p>
            <Button asChild variant="cta" size="marketing">
              <Link href="/contact">
                Talk to Karl
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
