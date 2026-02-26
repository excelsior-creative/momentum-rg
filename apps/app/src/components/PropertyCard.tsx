import React from "react";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import type { Property } from "@/payload-types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  "for-sale": { label: "For Sale", className: "bg-gold text-brand" },
  sold: { label: "Sold", className: "bg-gray-800 text-white" },
  "in-escrow": { label: "In Escrow", className: "bg-orange-500 text-white" },
  "for-lease": { label: "For Lease", className: "bg-blue-600 text-white" },
  leased: { label: "Leased", className: "bg-blue-800 text-white" },
  pending: { label: "Pending", className: "bg-yellow-500 text-brand" },
  "on-hold": { label: "On Hold", className: "bg-gray-500 text-white" },
  "coming-soon": { label: "Coming Soon", className: "bg-green-600 text-white" },
};

const TYPE_LABELS: Record<string, string> = {
  "single-family-home": "Single Family Home",
  condo: "Condo",
  townhouse: "Townhouse",
  duplex: "Duplex",
  fourplex: "Fourplex",
  "multi-unit": "Multi Unit",
  apartment: "Apartment",
  land: "Land",
  "co-op": "Co-Op",
};

type PropertyCardProps = {
  property: Property;
};

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const statusInfo = STATUS_LABELS[property.status || ""] || {
    label: property.status || "",
    className: "bg-gray-600 text-white",
  };

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-gold/40 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image / Placeholder */}
      <div className="relative h-52 bg-brand/5 flex items-center justify-center overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-brand/20" />
        <MapPin className="h-10 w-10 text-brand/20" />

        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>

        {/* Featured badge */}
        {property.featured && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-brand text-white">
            Featured
          </span>
        )}

        {/* Property type */}
        {property.propertyType && (
          <span className="absolute bottom-3 left-3 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
            {TYPE_LABELS[property.propertyType] || property.propertyType}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Price */}
        {property.price ? (
          <p className="text-2xl font-bold text-brand">
            {formatPrice(property.price)}
          </p>
        ) : (
          <p className="text-lg font-semibold text-muted-foreground">
            Contact for price
          </p>
        )}

        {/* Title / Address */}
        <p className="font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-brand transition-colors">
          {property.title}
        </p>

        {/* Location */}
        {(property.city || property.county) && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {[property.city, property.county].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Specs */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border text-sm text-muted-foreground">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" />
              {property.bedrooms} bd
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              {property.bathrooms} ba
            </span>
          )}
          {property.sqft && (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4" />
              {property.sqft.toLocaleString()} sqft
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
