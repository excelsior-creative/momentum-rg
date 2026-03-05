import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { ArrowRight } from "lucide-react";

const points = [
  {
    title: "1031 Exchanges",
    body: "Defer capital gains and maximize your investment through strategic like-kind exchanges.",
  },
  {
    title: "Investment Portfolios",
    body: "Scale your real estate holdings with expert guidance on multi-unit and commercial properties.",
  },
  {
    title: "Probate & Estate Sales",
    body: "Compassionate, experienced handling of inherited and estate properties from start to close.",
  },
  {
    title: "Multi-Unit Management",
    body: "End-to-end property management for apartment buildings, duplexes, and commercial spaces.",
  },
];

export const ComplexTransactionsSection = () => {
  return (
    <section className="bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        {/* Left: photo */}
        <div className="relative min-h-[400px] lg:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://momentumrg.com/wp-content/uploads/2025/06/6daf30f51f90728aaf76113795821975d6fd2d41-scaled.png"
            alt="Complex Real Estate Transactions"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Right: content */}
        <div className="py-16 md:py-20 px-8 md:px-16 bg-charcoal flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display mb-4">
            Don&apos;t Find Out The Hard Way
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-white leading-tight mb-6">
            Complex Transactions
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8">
            With over 25 years of experience, Momentum Realty Group specializes in
            transactions that require creative problem-solving and deep market
            knowledge. We offer solutions that other firms simply cannot.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {points.map(({ title, body }) => (
              <div key={title} className="flex gap-3">
                <div className="w-1 bg-gold flex-shrink-0 rounded-full mt-1" />
                <div>
                  <h3 className="font-heading font-medium text-white text-base mb-1">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-cta hover:bg-cta-light text-white font-display font-semibold px-8 py-4 uppercase tracking-wide transition-colors text-sm self-start"
          >
            Discuss Your Situation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
