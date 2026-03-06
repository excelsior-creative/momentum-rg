import React from "react";
import { Container } from "@/components/Container";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy | Momentum Realty Group",
  description: "Privacy Policy for Momentum Realty Group — how we collect, use, and protect your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div>
      {/* Header */}
      <div
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2D2D2D 100%)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
        <Container className="relative z-10">
          <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-display">
            Legal
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-medium text-white mt-3">
            Privacy Policy
          </h1>
          <p className="text-white/50 mt-3 text-sm font-display">
            Last updated: March 1, 2025
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="max-w-3xl mx-auto prose prose-gray text-base leading-relaxed">
          <p className="text-muted-foreground">
            Momentum Realty Group (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website momentumrg.com
            (the &ldquo;Site&rdquo;). This Privacy Policy describes how we collect, use, and protect your
            personal information when you use our Site or contact us about our real estate services.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            1. Information We Collect
          </h2>
          <p className="text-muted-foreground">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
            <li><strong>Contact Information</strong> — Name, email address, phone number, and any other information you provide via our contact form.</li>
            <li><strong>Property Inquiry Information</strong> — Details about properties you&rsquo;re interested in buying, selling, or renting.</li>
            <li><strong>Usage Data</strong> — Pages visited, time spent on the Site, browser type, and referring URL (collected via analytics tools).</li>
            <li><strong>Cookies</strong> — Small files stored on your device to improve site functionality and user experience.</li>
          </ul>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            2. How We Use Your Information
          </h2>
          <p className="text-muted-foreground">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
            <li>Respond to your inquiries and provide real estate services</li>
            <li>Send you property listings and market updates (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with applicable legal and regulatory obligations (including California DRE and NMLS requirements)</li>
          </ul>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            3. Sharing Your Information
          </h2>
          <p className="text-muted-foreground">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
            <li>Service providers who assist us in operating our website or conducting our business (e.g., CRM software, email platforms)</li>
            <li>Other real estate professionals (such as co-listing agents, escrow companies, or lenders) as necessary to complete a transaction you initiate</li>
            <li>Law enforcement or regulatory bodies when required by law</li>
          </ul>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            4. California Privacy Rights (CCPA)
          </h2>
          <p className="text-muted-foreground">
            If you are a California resident, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
            <li>Know what personal information we collect and how it is used</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of the sale of personal information (we do not sell personal information)</li>
            <li>Non-discrimination for exercising your privacy rights</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            To exercise these rights, contact us at{" "}
            <a href="mailto:karl@momentumrg.com" className="text-brand hover:underline">
              karl@momentumrg.com
            </a>
            .
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            5. Data Retention
          </h2>
          <p className="text-muted-foreground">
            We retain your personal information for as long as necessary to provide our services and
            comply with applicable law, including California DRE record-keeping requirements (typically
            3 years for transaction records).
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            6. Security
          </h2>
          <p className="text-muted-foreground">
            We implement industry-standard security measures to protect your personal information.
            However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            7. Third-Party Links
          </h2>
          <p className="text-muted-foreground">
            Our Site may contain links to third-party websites. We are not responsible for the
            privacy practices of those sites.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            8. Contact Us
          </h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, contact us at:
          </p>
          <div className="mt-4 p-6 bg-warm-gray rounded-xl border border-border text-muted-foreground">
            <p className="font-medium text-foreground">Momentum Realty Group</p>
            <p>10554 Progress Way,</p>
            <p>Unit C</p>
            <p>Cypress, CA 90630</p>
            <p className="mt-2">
              <a href="tel:7143363375" className="text-brand hover:underline">(714) 336-3375</a>
            </p>
            <p>
              <a href="mailto:karl@momentumrg.com" className="text-brand hover:underline">karl@momentumrg.com</a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
