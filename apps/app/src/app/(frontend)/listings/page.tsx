import React from "react";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import type { Property } from "@/payload-types";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "For Sale", value: "for-sale" },
  { label: "For Lease", value: "for-lease" },
  { label: "Sold", value: "sold" },
];

type SearchParams = { status?: string; page?: string };

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "all";
  const page = parseInt(params.page || "1");
  const limit = 12;

  let properties: Property[] = [];
  let totalPages = 1;
  let totalDocs = 0;
  let error = false;

  try {
    const payload = await getPayload({ config });

    const whereClause =
      statusFilter !== "all"
        ? { status: { equals: statusFilter } }
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

  return (
    <div>
      {/* Header */}
      <div className="bg-brand py-14 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
        <Container>
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">
            Browse Properties
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mt-3">
            Property Listings
          </h1>
          <p className="text-white/70 mt-3 text-lg">
            {error
              ? "Orange County, LA County & Riverside County"
              : `${totalDocs} properties across Orange County, LA County & Riverside County`}
          </p>
        </Container>
      </div>

      <Container>
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mt-8 mb-10">
          {STATUS_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value === "all" ? "/listings" : `/listings?status=${f.value}`}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${
                statusFilter === f.value
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-brand border-border hover:border-brand"
              }`}
            >
              {f.label}
            </Link>
          ))}
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
          <div className="text-center py-20 text-muted-foreground">
            No properties found.
          </div>
        )}

        {/* Pagination */}
        {!error && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12 pb-12">
            {page > 1 && (
              <Button asChild variant="outline">
                <Link
                  href={`/listings?${statusFilter !== "all" ? `status=${statusFilter}&` : ""}page=${page - 1}`}
                >
                  Previous
                </Link>
              </Button>
            )}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Button asChild variant="outline">
                <Link
                  href={`/listings?${statusFilter !== "all" ? `status=${statusFilter}&` : ""}page=${page + 1}`}
                >
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
