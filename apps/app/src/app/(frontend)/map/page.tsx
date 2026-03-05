import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { generatePageMetadata } from "@/lib/metadata";
import { MapLoader } from "@/components/MapLoader";
import Link from "next/link";
import type { Metadata } from "next";
import type { Property } from "@/payload-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = generatePageMetadata({
  title: "Property Map | Momentum Realty Group",
  description:
    "Explore Momentum Realty Group listings on an interactive map across Orange County, LA County, and Riverside County.",
  path: "/map",
  keywords: [
    "Orange County property map",
    "homes for sale map Long Beach",
    "interactive property search",
    "Momentum Realty Group listings map",
  ],
});

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "For Sale", value: "for-sale" },
  { label: "For Lease", value: "for-lease" },
  { label: "Sold", value: "sold" },
];

type SearchParams = { status?: string };

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "all";

  let properties: Property[] = [];
  let totalDocs = 0;

  try {
    const payload = await getPayload({ config });

    const whereClause =
      statusFilter !== "all" ? { status: { equals: statusFilter } } : undefined;

    const result = await payload.find({
      collection: "properties",
      where: whereClause,
      limit: 500,
      depth: 0,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        price: true,
        address: true,
        city: true,
        zipCode: true,
        latitude: true,
        longitude: true,
        bedrooms: true,
        bathrooms: true,
        propertyType: true,
      },
    });

    properties = result.docs as Property[];
    totalDocs = result.totalDocs;
  } catch (err) {
    console.error("Map page: failed to fetch properties", err);
  }

  // Serialize for client component
  const mapProperties = properties.map((p) => ({
    id: String(p.id),
    title: p.title || "",
    address: p.address || null,
    city: p.city || null,
    zipCode: p.zipCode || null,
    price: p.price || null,
    status: p.status || null,
    propertyType: p.propertyType || null,
    slug: p.slug || null,
    latitude: p.latitude || null,
    longitude: p.longitude || null,
    bedrooms: p.bedrooms || null,
    bathrooms: p.bathrooms || null,
  }));

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Compact header */}
      <div className="bg-charcoal border-b border-white/10 px-4 md:px-10 py-3 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors hidden sm:block">
            ← Home
          </Link>
          <div>
            <span className="font-heading text-white text-base font-medium">Property Map</span>
            <span className="text-white/40 text-xs ml-2 font-display">
              {totalDocs} listing{totalDocs !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value === "all" ? "/map" : `/map?status=${f.value}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors font-display ${
                statusFilter === f.value
                  ? "bg-cta text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <Link
          href="/listings"
          className="text-white/60 hover:text-white text-xs font-display transition-colors hidden md:block"
        >
          List View →
        </Link>
      </div>

      {/* Legend */}
      <div className="bg-charcoal border-b border-white/10 px-4 md:px-10 py-2 flex items-center gap-5 text-xs text-white/50 font-display flex-shrink-0">
        <span className="text-white/30 text-xs">Legend:</span>
        {[
          { color: "#E8862C", label: "For Sale" },
          { color: "#3B82F6", label: "For Lease" },
          { color: "#F59E0B", label: "In Escrow / Pending" },
          { color: "#6B7280", label: "Sold" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Map — fills remaining space */}
      <div className="flex-1 relative">
        <MapLoader
          properties={mapProperties}
          className="absolute inset-0"
        />

        {mapProperties.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-warm-gray">
            <div className="text-center">
              <p className="font-heading text-xl text-foreground mb-2">No listings to display</p>
              <Link href="/listings" className="text-brand hover:underline text-sm">
                View all listings →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
