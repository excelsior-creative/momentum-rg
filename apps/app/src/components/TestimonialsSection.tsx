import React from "react";
import { Container } from "./Container";

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
  <div className="flex gap-1 mb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className="w-5 h-5 text-gold"
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
    <section className="py-20 md:py-28 bg-warm-gray">
      <Container>
        <div className="text-center mb-14">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand">
            Client Reviews
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 text-foreground">
            Hear From Our Customers
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Success stories from the people we&apos;re proud to have served.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 border border-border shadow-sm flex flex-col hover:shadow-md transition-shadow"
            >
              <StarRating />
              <p className="text-muted-foreground leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 pt-5 border-t border-border">
                <p className="font-heading font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
