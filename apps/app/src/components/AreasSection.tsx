import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { MapPin } from "lucide-react";
import { AREA_LINKS } from "@/lib/areas";

export const AreasSection = () => {
  return (
    <section className="py-20 md:py-28 bg-warm-gray">
      <Container>
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
            Local Expertise
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-foreground">
            Areas We Serve
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-base leading-relaxed">
            Deep roots in Orange County, Los Angeles County, and Riverside County.
            We know these neighborhoods — the streets, the schools, the values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AREA_LINKS.map((area) => (
            <Link
              key={area.name}
              href={area.href}
              className="group bg-white rounded-xl p-6 border border-border hover:border-gold/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-medium text-foreground group-hover:text-gold transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-display uppercase tracking-wide mt-0.5">
                    {area.county}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {area.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {area.zipCodes.map((zip) => (
                  <span
                    key={zip}
                    className="text-xs bg-warm-gray text-foreground/60 px-2 py-0.5 rounded font-mono"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Don&apos;t see your area?{" "}
            <Link href="/contact" className="text-teal hover:underline font-medium">
              Contact us — we cover all of Southern California.
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
};
