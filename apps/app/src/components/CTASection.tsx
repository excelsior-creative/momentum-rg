"use client";

import React from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const whyPoints = [
  "25+ years navigating every market cycle",
  "Creative solutions other firms can't offer",
  "Expert in 1031 exchanges & complex deals",
  "End-to-end service from offer to close",
  "3-county coverage: OC, LA, Riverside",
  "Personal attention on every transaction",
];

export const CTASection = () => {
  return (
    <>
      {/* Why Karl Section — split photo + content */}
      <section className="bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          {/* Left: photo */}
          <div className="relative min-h-[360px] lg:min-h-0 order-2 lg:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://momentumrg.com/wp-content/uploads/2025/06/New-Project-1-scaled.png"
              alt="Orange County Real Estate — Momentum Realty Group"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {/* Quote overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 border-l-4 border-brand shadow-xl">
                <p className="font-heading text-foreground text-base italic leading-relaxed">
                  &ldquo;I designed Momentum to break the mold of the traditional brokerage model and put primary focus on the <em>why</em> of my clientele.&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
                    alt="Karl Parize"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gold/40"
                  />
                  <div>
                    <p className="font-heading font-medium text-sm text-foreground">Karl Parize</p>
                    <p className="text-xs text-muted-foreground">Founder &amp; Principal Broker</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="py-16 md:py-20 px-8 md:px-16 flex flex-col justify-center order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand font-display mb-4">
              Why Choose Momentum
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground leading-tight mb-6">
              Real Experience.{" "}
              <span className="text-brand italic">Real Results.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              With over two decades of experience in Southern California real estate,
              Karl Parize brings creative problem-solving and genuine personal service
              to every client — from first-time buyers to multi-property investors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {whyPoints.map((point) => (
                <div key={point} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80 leading-snug">{point}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                asChild
                className="bg-brand hover:bg-brand-light text-white px-8 h-12 font-display uppercase tracking-wide transition-colors"
              >
                <Link href="/about">
                  Meet Karl
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white px-8 h-12 font-display uppercase tracking-wide transition-colors"
              >
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-brand py-20 md:py-28">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
        <m.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none"
        />
        <m.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none"
        />

        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Let&apos;s Connect
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-medium text-white mt-4 mb-6">
              Ready to Make Your Move?
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Whether you&apos;re buying, selling, or investing — we&apos;re here to guide
              every step. Reach out today for a no-pressure consultation with Karl.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-light text-brand font-semibold px-10 h-14 text-base transition-colors border-none shadow-lg"
              >
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white px-10 h-14 text-base transition-colors"
              >
                <Link href="/listings">Browse Listings</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
