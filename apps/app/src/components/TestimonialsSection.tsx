import React from "react";
import { Container } from "./Container";
import { siteMediaPaths, wpMediaUrl } from "@/lib/wpMediaUrl";

const testimonials = [
  {
    quote:
      "Karl and his team are the gold standard. They made a complicated multi-property sale feel seamless and kept us informed every step of the way. Their market knowledge is truly second to none.",
    name: "Alex R.",
    detail: "Long Beach, CA",
  },
  {
    quote:
      "As a first-time homebuyer, I was intimidated by the process. Momentum Realty held my hand, explained everything clearly, and fought to get me the best deal possible. I couldn't be happier!",
    name: "Jamie L.",
    detail: "Orange County, CA",
  },
  {
    quote:
      "The professionalism and dedication from Momentum is unmatched. They helped us sell our home for over asking price in a shifting market. Their strategy and execution were flawless.",
    name: "The Rodriguez Family",
    detail: "Riverside County, CA",
  },
];

const StarRating = () => (
  <div className="flex gap-0.5 mb-5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className="w-4 h-4 text-gold"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

export const TestimonialsSection = () => {
  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        backgroundImage: `url(${wpMediaUrl(siteMediaPaths.heroSlideWarm)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/88 to-black/95" />

      <Container>
        <div className="relative z-10">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Client Reviews
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-white">
              Hear From Our Customers
            </h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Success stories from the people we&apos;re proud to have served.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-t-4 border-gold/60 hover:bg-white/10 transition-all duration-300 flex flex-col"
              >
                <StarRating />
                <p className="text-white/70 leading-relaxed flex-1 text-base font-heading font-normal italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="font-heading font-medium text-white text-base">{t.name}</p>
                  <p className="text-gold text-xs font-display uppercase tracking-wide mt-0.5">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
