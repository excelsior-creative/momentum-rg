import React from "react";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";
import type { Property } from "@/payload-types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = generatePageMetadata({
  title: "Property Listings | Momentum Realty Group",
  description:
    "Browse homes for sale and for lease across Orange County, LA County, and Riverside County. Find your next home with Momentum Realty Group.",
  path: "/listings",
  keywords: [
    "homes for sale Orange County",
    "property listings Long Beach",
    "homes for sale Huntington Beach",
    "La Habra real estate",
    "Momentum Realty Group listings",
  ],
});

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "For Sale", value: "for-sale" },
  { label: "For Lease", value: "for-lease" },
  { label: "Sold", value: "sold" },
];

const CITY_LABELS: Record<string, string> = {
  "long-beach": "Long Beach",
  "huntington-beach": "Huntington Beach",
  "la-habra": "La Habra",
  "la-mirada": "La Mirada",
  anaheim: "Anaheim",
  riverside: "Riverside",
};

type SearchParams = { status?: string; page?: string; city?: string };

function buildHref(base: Record<string, string>, overrides: Record<string, string>) {
  const merged = { ...base, ...overrides };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => {
    if (v && v !== "all" && v !== "1") params.set(k, v);
  });
  const q = params.toString();
  return q ? `/listings?${q}` : "/listings";
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "all";
  const cityFilter = params.city || "";
  const page = parseInt(params.page || "1");
  const limit = 12;

  let properties: Property[] = [];
  let totalPages = 1;
  let totalDocs = 0;
  let error = false;

  try {
    const payload = await getPayload({ config });

    // Build where clause supporting both status and city filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = [];
    if (statusFilter !== "all") {
      conditions.push({ status: { equals: statusFilter } });
    }
    if (cityFilter) {
      // city is stored as plain text, do a case-insensitive like
      const cityName = CITY_LABELS[cityFilter] || cityFilter;
      conditions.push({ city: { like: cityName } });
    }

    const whereClause =
      conditions.length === 1
        ? conditions[0]
        : conditions.length > 1
          ? { and: conditions }
          : undefined;

    const result = await payload.find({
      collection: "properties",
      where: whereClause,
      page,
      limit,
      sort: "-dateAdded",
    });

    properties = result.docs as Property[];
    totalPages = result.totalPages;
    totalDocs = result.totalDocs;
  } catch (err) {
    console.error("Failed to fetch properties:", err);
    error = true;
  }

  const cityLabel = cityFilter ? CITY_LABELS[cityFilter] || cityFilter : "";
  const currentFilters = { status: statusFilter, city: cityFilter, page: String(page) };

  return (
    <div>
      {/* Premium dark header matching site style */}
      <div
        className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2D2D2D 100%)" }}
      >
        {/* Gold accent line top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
        {/* Subtle background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(https://momentumrg.com/wp-content/uploads/2022/03/orange-county-real-estate-2.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <Container className="relative z-10">
          <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-display">
            {cityLabel ? `${cityLabel} Properties` : "Browse Properties"}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-medium text-white mt-3">
            {cityLabel ? `Homes in ${cityLabel}` : "Property Listings"}
          </h1>
          <p className="text-white/60 mt-3 text-lg font-sans">
            {error
              ? "Orange County, LA County & Riverside County"
              : `${totalDocs} propert${totalDocs === 1 ? "y" : "ies"}${cityLabel ? ` in ${cityLabel}` : " across Orange County, LA County & Riverside County"}`}
          </p>
        </Container>
      </div>

      <Container className="py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
          {/* Status filters */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <Link
                key={f.value}
                href={buildHref(currentFilters, { status: f.value, page: "1" })}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border font-display ${
                  statusFilter === f.value
                    ? "bg-charcoal text-white border-charcoal"
                    : "bg-white text-charcoal border-border hover:border-gold hover:text-gold"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>

          {/* City filter badge */}
          {cityLabel && (
            <Link
              href={buildHref(currentFilters, { city: "", page: "1" })}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-sm font-display text-charcoal hover:bg-gold/20 transition-colors"
            >
              📍 {cityLabel}
              <span className="text-muted-foreground">✕</span>
            </Link>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">Unable to load listings at this time.</p>
            <p className="mt-2 text-sm">Please try again later or contact us directly.</p>
          </div>
        )}

        {/* Grid */}
        {!error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {!error && properties.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No properties found.</p>
            {cityLabel && (
              <Link
                href="/listings"
                className="mt-4 inline-block text-teal hover:underline text-sm"
              >
                View all listings →
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {!error && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12 pb-4">
            {page > 1 && (
              <Button asChild variant="outline">
                <Link href={buildHref(currentFilters, { page: String(page - 1) })}>
                  Previous
                </Link>
              </Button>
            )}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Button asChild variant="outline">
                <Link href={buildHref(currentFilters, { page: String(page + 1) })}>
                  Next
                </Link>
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
