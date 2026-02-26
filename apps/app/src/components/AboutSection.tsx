import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const highlights = [
  "Founded by Karl Parize in 2009",
  "Over 25 years of real estate experience",
  "Orange County, LA County & Riverside County",
  "First-time buyers to seasoned investors",
  "Full-service: Sales, Mortgages, Management",
  "Personal touch on every transaction",
];

export const AboutSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: content */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              About Momentum
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-brand leading-tight">
              Putting Purpose Behind{" "}
              <span className="text-gold">Every Property</span>
            </h2>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed">
              Momentum Realty Group was founded by Karl in 2009 to help others
              achieve the dream of ownership and peace of mind. With over a
              decade&apos;s worth of experience in real estate, Karl designed
              Momentum to break the mold of the traditional brokerage model and
              put primary focus of all transactions on the &ldquo;why&rdquo; of
              his clientele.
            </p>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              First-time home buyers and seasoned investors alike experience unique
              service and results generated from the personal touch and
              understanding that Karl brings to each and every case.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button
                asChild
                className="bg-brand hover:bg-brand-light text-white px-8 h-12 transition-colors"
              >
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: stat cards */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: "25+", label: "Years of Experience" },
              { value: "2009", label: "Founded" },
              { value: "3", label: "Counties Served" },
              { value: "100%", label: "Client-First Focus" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-border p-8 text-center hover:border-gold/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl font-bold text-brand">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
