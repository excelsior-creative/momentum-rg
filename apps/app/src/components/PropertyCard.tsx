import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import type { Property, Media } from "@/payload-types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  "for-sale": { label: "For Sale", bg: "#c8a951", text: "#2D2D2D" },
  sold: { label: "Sold", text: "#fff", bg: "#374151" },
  "in-escrow": { label: "In Escrow", text: "#fff", bg: "#E8862C" },
  "for-lease": { label: "For Lease", text: "#fff", bg: "#2563EB" },
  leased: { label: "Leased", text: "#fff", bg: "#1D4ED8" },
  pending: { label: "Pending", text: "#2D2D2D", bg: "#EAB308" },
  "on-hold": { label: "On Hold", text: "#fff", bg: "#6B7280" },
  "coming-soon": { label: "Coming Soon", text: "#fff", bg: "#16A34A" },
};

const TYPE_LABELS: Record<string, string> = {
  "single-family-home": "Single Family",
  condo: "Condo",
  townhouse: "Townhouse",
  duplex: "Duplex",
  fourplex: "Fourplex",
  "multi-unit": "Multi-Unit",
  apartment: "Apartment",
  land: "Land",
  "co-op": "Co-Op",
};

type PropertyCardProps = {
  property: Property;
};

function getImageUrl(property: Property): string | null {
  if (property.featuredImage && typeof property.featuredImage === "object") {
    const media = property.featuredImage as Media;
    if (media.url) return media.url;
  }
  if (property.wpImageUrls && property.wpImageUrls.length > 0) {
    const first = property.wpImageUrls[0];
    if (first?.url) return first.url;
  }
  return null;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const statusInfo = STATUS_CONFIG[property.status || ""] ?? {
    label: property.status || "",
    bg: "#6B7280",
    text: "#fff",
  };

  const imageUrl = getImageUrl(property);

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-transparent hover:border-gold/30"
    >
      {/* Image area */}
      <div className="relative h-56 bg-warm-gray overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={imageUrl.includes("momentumrg.com")}
            />
            {/* Gradient overlay for badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-warm-gray to-teal/5 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-gold/20" />
          </div>
        )}

        {/* Status badge */}
        <span
          className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full tracking-wide"
          style={{ background: statusInfo.bg, color: statusInfo.text }}
        >
          {statusInfo.label}
        </span>

        {/* Featured badge */}
        {property.featured && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-gold text-charcoal">
            Featured
          </span>
        )}

        {/* Property type — bottom of image */}
        {property.propertyType && (
          <span className="absolute bottom-3 left-3 text-xs bg-black/60 text-white/90 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {TYPE_LABELS[property.propertyType] ?? property.propertyType}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Price */}
        {property.price ? (
          <p className="text-xl font-bold text-charcoal tracking-tight">
            {formatPrice(property.price)}
          </p>
        ) : (
          <p className="text-base font-semibold text-muted-foreground">
            Contact for Price
          </p>
        )}

        {/* Title */}
        <p className="font-semibold text-foreground mt-1 leading-snug line-clamp-2 group-hover:text-gold transition-colors">
          {property.title}
        </p>

        {/* Location */}
        {(property.city || property.county) && (
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            {[property.city, property.county].filter(Boolean).join(", ")}
          </p>
        )}

        {/* Specs */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/60 text-sm text-muted-foreground">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-gold/60" />
              {property.bedrooms}
              <span className="text-xs hidden sm:inline">bd</span>
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-gold/60" />
              {property.bathrooms}
              <span className="text-xs hidden sm:inline">ba</span>
            </span>
          )}
          {property.sqft && (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-gold/60" />
              {property.sqft.toLocaleString()}
              <span className="text-xs hidden sm:inline">sqft</span>
            </span>
          )}
          {/* Fill remaining space */}
          <span className="flex-1" />
          <span className="text-xs font-medium text-teal opacity-0 group-hover:opacity-100 transition-opacity">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
};
