import React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { ListingsSearch } from "@/components/ListingsSearch";
import { generatePageMetadata } from "@/lib/metadata";
import { Map } from "lucide-react";
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

type SearchParams = {
  status?: string;
  page?: string;
  city?: string;
  q?: string;
  price?: string;
  type?: string;
};

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
  const textQuery = params.q || "";
  const priceRange = params.price || "";
  const typeFilter = params.type || "";
  const page = parseInt(params.page || "1");
  const limit = 12;

  let properties: Property[] = [];
  let totalPages = 1;
  let totalDocs = 0;
  let error = false;

  try {
    const payload = await getPayload({ config });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = [];

    if (statusFilter !== "all") {
      conditions.push({ status: { equals: statusFilter } });
    }

    if (cityFilter) {
      const cityName = CITY_LABELS[cityFilter] || cityFilter;
      conditions.push({ city: { like: cityName } });
    }

    if (typeFilter) {
      conditions.push({ propertyType: { equals: typeFilter } });
    }

    // Text search across title, address, city
    if (textQuery) {
      conditions.push({
        or: [
          { title: { like: textQuery } },
          { address: { like: textQuery } },
          { city: { like: textQuery } },
          { zipCode: { like: textQuery } },
        ],
      });
    }

    // Price range
    if (priceRange) {
      const [minStr, maxStr] = priceRange.split("-");
      const min = parseInt(minStr);
      const max = maxStr ? parseInt(maxStr) : null;

      if (!isNaN(min) && min > 0) conditions.push({ price: { greater_than_equal: min } });
      if (max && !isNaN(max)) conditions.push({ price: { less_than_equal: max } });
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
  const hasActiveSearch = textQuery || cityFilter || priceRange || typeFilter;
  const currentFilters = {
    status: statusFilter,
    city: cityFilter,
    q: textQuery,
    price: priceRange,
    type: typeFilter,
    page: String(page),
  };

  return (
    <div>
      {/* Premium dark header */}
      <div
        className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2D2D2D 100%)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
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
        {/* Search bar */}
        <Suspense>
          <ListingsSearch />
        </Suspense>

        {/* Status + Map row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <Link
                key={f.value}
                href={buildHref(currentFilters, { status: f.value, page: "1" })}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border font-display ${
                  statusFilter === f.value
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-charcoal border-border hover:border-brand hover:text-brand"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>

          <Link
            href={`/map${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal text-white text-sm font-display font-semibold hover:bg-charcoal/80 transition-colors"
          >
            <Map className="w-4 h-4" />
            Map View
          </Link>
        </div>

        {/* Active search indicator */}
        {hasActiveSearch && !error && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing {totalDocs} result{totalDocs !== 1 ? "s" : ""}
            {textQuery && <> for &ldquo;{textQuery}&rdquo;</>}
            {cityLabel && <> in {cityLabel}</>}
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">Unable to load listings at this time.</p>
            <p className="mt-2 text-sm">Please try again or contact us directly.</p>
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
            <Link href="/listings" className="mt-4 inline-block text-brand hover:underline text-sm">
              Clear all filters →
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!error && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12 pb-4">
            {page > 1 && (
              <Button asChild variant="outline">
                <Link href={buildHref(currentFilters, { page: String(page - 1) })}>Previous</Link>
              </Button>
            )}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Button asChild variant="outline">
                <Link href={buildHref(currentFilters, { page: String(page + 1) })}>Next</Link>
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
