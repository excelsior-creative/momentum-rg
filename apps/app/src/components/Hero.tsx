import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-brand">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes heroFadeInUp {
              from { opacity: 0; transform: translateY(24px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .hero-animate { animation: heroFadeInUp 0.6s ease-out forwards; }
            .hero-animate-delay-1 { animation: heroFadeInUp 0.6s ease-out 0.12s forwards; opacity: 0; }
            .hero-animate-delay-2 { animation: heroFadeInUp 0.6s ease-out 0.24s forwards; opacity: 0; }
            .hero-animate-delay-3 { animation: heroFadeInUp 0.6s ease-out 0.36s forwards; opacity: 0; }
            @media (prefers-reduced-motion: reduce) {
              .hero-animate, .hero-animate-delay-1, .hero-animate-delay-2, .hero-animate-delay-3 {
                animation: none; opacity: 1; transform: none;
              }
            }
          `,
        }}
      />

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-24 md:py-36">
        <div className="max-w-3xl">
          <div className="hero-animate">
            <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-4">
              EVERYTHING YOU NEED
            </span>
          </div>

          <h1 className="hero-animate-delay-1 font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            We do Real Estate{" "}
            <span className="text-white drop-shadow-sm underline decoration-white/40 decoration-4 underline-offset-4">Better</span>
          </h1>

          <p className="hero-animate-delay-2 text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
            Real estate begins with property, but it doesn&apos;t end there.
            At Momentum Realty Group, we&apos;re committed to serving your
            real estate needs through the highest standards of professional
            excellence, creativity, and service.
          </p>

          <div className="hero-animate-delay-3 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-white/90 text-brand font-heading font-semibold px-8 h-14 text-base transition-colors border-none shadow-xl"
            >
              <Link href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/50 text-white hover:bg-white/15 hover:text-white px-8 h-14 text-base font-heading transition-colors"
            >
              <Link href="/listings">View Listings</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
