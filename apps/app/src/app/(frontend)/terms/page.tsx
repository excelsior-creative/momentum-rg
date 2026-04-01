import React from "react";
import { Container } from "@/components/Container";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service | Momentum Realty Group",
  description: "Terms of Service for Momentum Realty Group — terms and conditions for using our website and real estate services.",
  path: "/terms",
});

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-white/50 mt-3 text-sm font-display">
            Last updated: March 1, 2025
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="max-w-3xl mx-auto text-base leading-relaxed">
          <p className="text-muted-foreground">
            Welcome to Momentum Realty Group. By accessing or using our website at momentumrg.com
            (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Service. Please read them carefully.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            1. Services
          </h2>
          <p className="text-muted-foreground">
            Momentum Realty Group provides real estate brokerage, mortgage, and property management
            services in Orange County, Los Angeles County, and Riverside County, California. Our licensed
            professionals hold California DRE license #01364278.
          </p>
          <p className="text-muted-foreground mt-4">
            Information on this Site is provided for general informational purposes only and does not
            constitute legal, financial, or real estate advice. You should consult with a qualified
            professional before making any real estate decision.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            2. Property Listings
          </h2>
          <p className="text-muted-foreground">
            Property listings displayed on this Site are provided for informational purposes only.
            All listings are subject to change, withdrawal, or prior sale without notice. We make no
            representations or warranties regarding the accuracy, completeness, or timeliness of
            listing information.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            3. Use of the Site
          </h2>
          <p className="text-muted-foreground">
            You agree to use this Site only for lawful purposes. You may not:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
            <li>Use the Site in any way that violates applicable federal, state, or local laws</li>
            <li>Scrape, crawl, or systematically extract listing data without prior written permission</li>
            <li>Transmit any unsolicited or unauthorized advertising or promotional material</li>
            <li>Attempt to gain unauthorized access to any part of the Site</li>
          </ul>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            4. Intellectual Property
          </h2>
          <p className="text-muted-foreground">
            All content on this Site, including text, graphics, logos, and images, is the property
            of Momentum Realty Group or its content suppliers and is protected by applicable copyright
            and trademark laws. Unauthorized reproduction or distribution is prohibited.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            5. Disclaimer of Warranties
          </h2>
          <p className="text-muted-foreground">
            This Site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind,
            express or implied. Momentum Realty Group does not warrant that the Site will be
            uninterrupted, error-free, or free of viruses.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            6. Limitation of Liability
          </h2>
          <p className="text-muted-foreground">
            To the fullest extent permitted by law, Momentum Realty Group shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages arising from your
            use of this Site or our services.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            7. Equal Housing Opportunity
          </h2>
          <p className="text-muted-foreground">
            Momentum Realty Group is committed to the Fair Housing Act. We do not discriminate based
            on race, color, national origin, religion, sex, familial status, disability, or any other
            protected class. All listings are available to qualified buyers and renters without regard
            to protected characteristics.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            8. Governing Law
          </h2>
          <p className="text-muted-foreground">
            These Terms are governed by the laws of the State of California. Any disputes shall be
            resolved in the courts of Orange County, California.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            9. Changes to These Terms
          </h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these Terms at any time. Continued use of the Site after
            any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2 className="font-heading text-2xl font-medium mt-10 mb-4 text-foreground">
            10. Contact
          </h2>
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
