"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import nextDynamic from "next/dynamic";

const PropertyMap = nextDynamic(
  () => import("./PropertyMap").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-warm-gray animate-pulse rounded-xl flex items-center justify-center">
        <MapPin className="w-8 h-8 text-muted-foreground/30" />
      </div>
    ),
  },
);

interface MapProperty {
  id: string;
  title: string;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  price?: number | null;
  status?: string | null;
  propertyType?: string | null;
  slug?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
}

export const MapSection = () => {
  const [properties, setProperties] = useState<MapProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties-map-data")
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 md:py-28 bg-warm-gray">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand font-display">
              Explore Properties
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-foreground">
              Browse the Interactive Map
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              See all active listings across Orange County, LA County, and Riverside County on one map.
              Click any pin for details.
            </p>
          </div>
          <Button
            asChild
            className="bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide px-8 h-12 flex-shrink-0 transition-colors"
          >
            <Link href="/map">
              Full Map View
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Map preview */}
        <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-border">
          {!loading && (
            <PropertyMap properties={properties} className="absolute inset-0" />
          )}
          {loading && (
            <div className="absolute inset-0 bg-warm-gray animate-pulse flex items-center justify-center rounded-xl">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-brand/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Loading map...</p>
              </div>
            </div>
          )}
          {/* Overlay CTA at bottom */}
          <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
            <div className="bg-charcoal/90 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-heading">
                  {properties.length > 0
                    ? `${properties.length} properties on map`
                    : "Interactive property map"}
                </p>
                <p className="text-white/50 text-xs mt-0.5">Orange, LA &amp; Riverside Counties</p>
              </div>
              <Link
                href="/map"
                className="pointer-events-auto bg-cta hover:bg-cta-light text-white text-xs font-display font-semibold uppercase tracking-wide px-4 py-2 rounded-lg transition-colors"
              >
                Explore All →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
