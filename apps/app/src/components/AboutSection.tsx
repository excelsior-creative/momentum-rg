import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "25+", label: "Years Experience" },
  { value: "2009", label: "Founded" },
  { value: "3", label: "Counties Served" },
  { value: "500+", label: "Transactions Closed" },
];

export const AboutSection = () => {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: local hero image */}
          <div className="relative">
            {/* Background accent */}
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-warm-gray rounded-full -z-10 hidden lg:block" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/10 rounded-full -z-10 hidden lg:block" />

            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about-california-home.png"
                alt="Exterior of a California home"
                className="w-full h-[480px] object-cover"
              />
              {/* Karl floating card */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-charcoal/95 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 shadow-xl border border-gold/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
                    alt="Karl Parize"
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold/50 flex-shrink-0"
                  />
                  <div>
                    <p className="font-heading text-white text-base font-medium">Karl Parize</p>
                    <p className="text-gold text-xs font-display uppercase tracking-wider mt-0.5">
                      Owner &amp; Principal Broker
                    </p>
                    <p className="text-white/50 text-xs mt-0.5">NMLS #313044 · CBRE #01364278</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              About Momentum
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-foreground leading-tight">
              Putting Purpose Behind{" "}
              <span className="text-gold italic">Every Property</span>
            </h2>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed">
              Momentum Realty Group was founded by Karl in 2009 to help others
              achieve the dream of ownership and peace of mind. With over 25 years
              of experience in real estate, Karl designed Momentum to break the mold
              of the traditional brokerage model and put primary focus on the
              &ldquo;why&rdquo; of his clientele.
            </p>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              First-time home buyers and seasoned investors alike experience unique
              service and results generated from the personal touch and
              understanding that Karl brings to each and every case.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-heading font-semibold text-gold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-display uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <Button asChild variant="cta" size="marketing">
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ctaOutline" size="marketing">
                <Link href="/contact">Contact Karl</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
