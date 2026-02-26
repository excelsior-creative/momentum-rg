import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Shield, TrendingUp, Users, ArrowRight } from "lucide-react";

const points = [
  {
    icon: Shield,
    title: "1031 Exchanges",
    body: "Defer capital gains and maximize your investment through strategic like-kind exchanges.",
  },
  {
    icon: TrendingUp,
    title: "Investment Portfolios",
    body: "Scale your real estate holdings with expert guidance on multi-unit and commercial properties.",
  },
  {
    icon: Users,
    title: "Probate & Estate Sales",
    body: "Compassionate, experienced handling of inherited and estate properties from start to close.",
  },
];

export const ComplexTransactionsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-brand relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <Container>
        <div className="relative z-10">
          {/* Header */}
          <div className="max-w-2xl mb-14">
            <span className="inline-block text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">
              DON&apos;T Find Out The Hard Way
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-5">
              Complex Transactions
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Momentum Realty Group was founded by Karl in 2009 to help others
              achieve the dream of ownership and peace of mind. With over a
              decade&apos;s worth of experience, Karl designed Momentum to break
              the mold of the traditional brokerage model and put primary focus
              on the &ldquo;why&rdquo; of each client.
            </p>
          </div>

          {/* Feature points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {points.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-brand font-heading font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-white/90 transition-colors text-base"
          >
            Discuss Your Situation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Container>
    </section>
  );
};
