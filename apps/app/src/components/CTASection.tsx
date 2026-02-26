"use client";

import React from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { ArrowRight, Shield, Target } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "Proven Through Every Market",
    description:
      "With over 16 years of experience, we've helped clients succeed in every kind of market. Our tested methods ensure you make informed, confident decisions — whether navigating challenges or taking advantage of opportunities as they arise.",
  },
  {
    icon: Target,
    title: "Strategic, Client-First Advice",
    description:
      "We offer clear and personalized insights into real estate trends. Our client-first approach makes the process approachable, minimizes risk, and builds confidence — whether you're purchasing your first home or making your next strategic investment.",
  },
];

export const CTASection = () => {
  return (
    <>
      {/* Know The Market Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <Container>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Real-world experience. Real-time insights.
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-brand">
              Know The Market
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl border border-border p-8 hover:border-gold/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/5 flex items-center justify-center mb-5">
                  <pillar.icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold text-brand mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Container>
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
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Let&apos;s Connect
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
              How to Make a Living With Your Real Estate Portfolio
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Providing sound financial guidance on investment properties and
              long-term income planning has always been at the core of what we
              do. We treat every client like family.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-light text-brand font-semibold px-10 h-14 text-base transition-colors border-none shadow-lg"
              >
                <Link href="/contact">
                  Get Started Today
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
