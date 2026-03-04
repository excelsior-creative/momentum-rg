import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Phone } from "lucide-react";

// Real OC property photos from Momentum's WP CDN
const HERO_BG =
  "https://momentumrg.com/wp-content/uploads/2022/03/orange-county-real-estate-2.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Dark gradient overlay — matches old site's moody aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold z-10" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 py-24 md:py-36">
        <div className="max-w-2xl">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes heroFadeInUp {
                  from { opacity: 0; transform: translateY(24px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .hero-animate { animation: heroFadeInUp 0.7s ease-out forwards; }
                .hero-animate-1 { animation: heroFadeInUp 0.7s ease-out 0.15s forwards; opacity: 0; }
                .hero-animate-2 { animation: heroFadeInUp 0.7s ease-out 0.3s forwards; opacity: 0; }
                .hero-animate-3 { animation: heroFadeInUp 0.7s ease-out 0.45s forwards; opacity: 0; }
                @media (prefers-reduced-motion: reduce) {
                  .hero-animate,.hero-animate-1,.hero-animate-2,.hero-animate-3 { animation: none; opacity: 1; transform: none; }
                }
              `,
            }}
          />

          {/* Eyebrow */}
          <div className="hero-animate">
            <span className="inline-block text-gold text-xs font-semibold uppercase tracking-[0.3em] mb-5 font-display">
              Everything You Need
            </span>
          </div>

          {/* Heading — Playfair Display like the old site */}
          <h1 className="hero-animate-1 font-heading text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-tight mb-6">
            We do Real Estate{" "}
            <span className="text-gold italic">Better</span>
          </h1>

          {/* Body */}
          <p className="hero-animate-2 text-lg text-white/75 max-w-lg mb-10 leading-relaxed font-sans font-light">
            Real estate begins with property, but it doesn&apos;t end there. At
            Momentum Realty Group, we&apos;re committed to serving your real
            estate needs through the highest standards of professional
            excellence, creativity, and service.
          </p>

          {/* CTAs */}
          <div className="hero-animate-3 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-brand hover:bg-brand-light text-white font-display font-semibold px-8 h-14 text-base uppercase tracking-wide transition-colors border-none shadow-xl"
            >
              <Link href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border border-white/50 text-white hover:bg-white/10 hover:border-white px-8 h-14 text-base font-display uppercase tracking-wide transition-colors"
            >
              <a href="tel:7143363375">
                <Phone className="mr-2 h-4 w-4" />
                (714) 336-3375
              </a>
            </Button>
          </div>

          {/* Credentials bar */}
          <div className="hero-animate-3 mt-12 flex items-center gap-6 text-white/40 text-xs tracking-widest font-display uppercase">
            <span>NMLS #313044</span>
            <span className="w-px h-4 bg-white/20" />
            <span>CBRE #01364278</span>
            <span className="w-px h-4 bg-white/20" />
            <span>Est. 2009</span>
          </div>
        </div>
      </div>

      {/* Karl Parize floating card — matches old site's image-box treatment */}
      <div className="hidden xl:block absolute bottom-16 right-10 z-20">
        <div className="bg-black/80 backdrop-blur-sm border border-gold/30 rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
            alt="Karl Parize, Owner"
            className="w-16 h-16 rounded-full object-cover border-2 border-gold/50"
          />
          <div>
            <p className="font-heading text-white text-base font-medium">Karl Parize</p>
            <p className="text-gold text-xs font-display uppercase tracking-wider mt-0.5">Owner &amp; Principal</p>
          </div>
        </div>
      </div>
    </section>
  );
};
