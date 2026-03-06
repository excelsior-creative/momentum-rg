import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingImageGallery } from "@/components/ListingImageGallery";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { Bed, Bath, Maximize, Car, MapPin, Calendar, Hash, ChevronLeft, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";
import {
  combineSchemas,
  generateBreadcrumbSchema,
  generateListingSchema,
} from "@/lib/structured-data";
import { AREAS, getAreaSlugByCity } from "@/lib/areas";
import type { Media, Property } from "@/payload-types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  "for-sale":    { label: "For Sale",     className: "bg-gold text-charcoal" },
  sold:          { label: "Sold",         className: "bg-gray-800 text-white" },
  "in-escrow":   { label: "In Escrow",    className: "bg-cta text-white" },
  "for-lease":   { label: "For Lease",    className: "bg-blue-600 text-white" },
  leased:        { label: "Leased",       className: "bg-blue-800 text-white" },
  pending:       { label: "Pending",      className: "bg-yellow-500 text-charcoal" },
  "on-hold":     { label: "On Hold",      className: "bg-gray-500 text-white" },
  "coming-soon": { label: "Coming Soon",  className: "bg-green-600 text-white" },
  cancelled:     { label: "Cancelled",    className: "bg-red-700 text-white" },
};

const TYPE_LABELS: Record<string, string> = {
  "single-family-home": "Single Family Home",
  condo:                "Condo",
  townhouse:            "Townhouse",
  duplex:               "Duplex",
  fourplex:             "Fourplex",
  "multi-unit":         "Multi Unit",
  apartment:            "Apartment",
  land:                 "Land",
  "co-op":              "Co-Op",
};

const DEFAULT_LISTING_HERO_IMAGE =
  "https://momentumrg.com/wp-content/uploads/2022/03/orange-county-real-estate-2.jpg";

function getMediaUrl(media?: number | Media | null) {
  if (!media || typeof media !== "object") {
    return null;
  }

  return media.url || null;
}

function getPropertyImageUrls(property: Property) {
  const candidateUrls = [
    getMediaUrl(property.featuredImage),
    ...(property.gallery || []).map((item) => getMediaUrl(item.image)),
    ...((property.wpImageUrls || []).map((item) => item.url || null)),
  ].filter(Boolean) as string[];

  return Array.from(new Set(candidateUrls));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "properties",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });

    const property = result.docs[0] as Property | undefined;
    if (!property) return {};

    const priceStr = property.price ? ` — ${formatPrice(property.price)}` : "";
    const cityStr = property.city ? ` in ${property.city}` : "";
    const images = getPropertyImageUrls(property);
    const areaSlug = getAreaSlugByCity(property.city);
    const area = areaSlug ? AREAS[areaSlug] : null;

    return generatePageMetadata({
      title: property.title,
      description:
        property.excerpt ||
        `${property.title}${priceStr}${cityStr}. View property details, market context${area ? ` for ${area.name}` : ""}, and contact Momentum Realty Group.`,
      path: `/listings/${slug}`,
      ogImage: images[0] || undefined,
      keywords: [
        property.city || "",
        property.county || "",
        property.zipCode || "",
        property.propertyType ? TYPE_LABELS[property.propertyType] || "" : "",
        "real estate",
        "Orange County",
      ].filter(Boolean),
    });
  } catch {
    return {};
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let property: Property | null = null;

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "properties",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    property = (result.docs[0] as Property) || null;
  } catch (err) {
    console.error("Failed to fetch property:", err);
  }

  if (!property) {
    notFound();
  }

  const statusInfo = STATUS_MAP[property.status] ?? {
    label: property.status,
    className: "bg-gray-600 text-white",
  };

  const images = getPropertyImageUrls(property);
  const heroImage = images[0] || DEFAULT_LISTING_HERO_IMAGE;
  const areaSlug = getAreaSlugByCity(property.city);
  const area = areaSlug ? AREAS[areaSlug] : null;
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Listings", path: "/listings" },
      { name: property.title, path: `/listings/${slug}` },
    ]),
    generateListingSchema({ property, images }),
  );

  const fullAddress = [
    property.address,
    property.city,
    property.state,
    property.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  const specs = [
    property.bedrooms != null && { icon: Bed,      label: `${property.bedrooms} Bedroom${property.bedrooms !== 1 ? "s" : ""}` },
    property.bathrooms != null && { icon: Bath,     label: `${property.bathrooms} Bathroom${property.bathrooms !== 1 ? "s" : ""}` },
    property.sqft && { icon: Maximize, label: `${property.sqft.toLocaleString()} sqft` },
    property.garage != null && { icon: Car,      label: `${property.garage} Car Garage` },
  ].filter(Boolean) as { icon: React.ComponentType<any>; label: string }[];

  const details = [
    property.propertyType && { label: "Property Type", value: TYPE_LABELS[property.propertyType] || property.propertyType },
    property.lotSize      && { label: "Lot Size",       value: property.lotSize },
    property.yearBuilt    && { label: "Year Built",     value: String(property.yearBuilt) },
    property.propertyId   && { label: "MLS / Property ID", value: property.propertyId },
    property.county       && { label: "County",         value: property.county },
    property.zipCode      && { label: "Zip Code",       value: property.zipCode },
    property.dateAdded    && { label: "Date Listed",    value: new Date(property.dateAdded).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div>
      <StructuredData data={schema} />

      <PageHero
        title={property.title}
        backgroundImage={heroImage}
        className="py-28 md:py-36"
        contentClassName="max-w-none"
      >
        <Breadcrumbs
          inverted
          className="mt-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Listings", href: "/listings" },
            { label: property.title },
          ]}
        />
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mt-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Listings
        </Link>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
              {property.featured && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white">
                  Featured
                </span>
              )}
            </div>
            {fullAddress && (
              <p className="flex items-center gap-1.5 text-white/75 text-sm md:text-base">
                <MapPin className="w-4 h-4 shrink-0" />
                {fullAddress}
              </p>
            )}
          </div>

          {property.price && (
            <div className="sm:text-right">
              <p className="text-3xl md:text-4xl font-bold text-gold">
                {formatPrice(property.price)}
              </p>
              {property.priceOld && property.priceOld !== property.price && (
                <p className="text-white/50 line-through text-sm mt-0.5">
                  {formatPrice(property.priceOld)}
                </p>
              )}
            </div>
          )}
        </div>
      </PageHero>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-12">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">

            {/* Photo gallery */}
            {images.length > 0 ? (
              <ListingImageGallery images={images} title={property.title} />
            ) : (
              <div className="rounded-2xl overflow-hidden bg-gold/5 aspect-[16/9] flex flex-col items-center justify-center text-muted-foreground border border-border">
                <MapPin className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Photos not available</p>
              </div>
            )}

            {/* Specs bar */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {specs.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="bg-white rounded-xl p-4 flex flex-col items-center text-center gap-2 border border-border"
                  >
                    <Icon className="w-5 h-5 text-gold" />
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {property.excerpt && (
              <div>
                <h2 className="text-xl font-bold mb-3">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.excerpt}</p>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {f.feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Details table */}
            {details.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Property Details</h2>
                <div className="bg-white border border-border rounded-xl overflow-hidden divide-y divide-border">
                  {details.map(({ label, value }) => (
                    <div key={label} className="grid grid-cols-2 px-5 py-3 text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(property.city || area) && (
              <div className="rounded-2xl border border-border bg-warm-gray p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground">
                  Local Market Context
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Looking beyond the specs? We can help you compare this home to
                  nearby inventory, neighborhood trends, commute patterns, and
                  the broader market in {property.city || "the surrounding area"}.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {area && (
                    <Button asChild variant="outline">
                      <Link href={`/areas/${areaSlug}`}>Explore {area.name} Guide</Link>
                    </Button>
                  )}
                  {property.city && (
                    <Button asChild variant="outline">
                      <Link
                        href={`/listings?city=${areaSlug || property.city.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        More Homes in {property.city}
                      </Link>
                    </Button>
                  )}
                  <Button asChild className="bg-cta hover:bg-cta-light text-white">
                    <Link href="/contact">Ask About This Property</Link>
                  </Button>
                </div>
                {area && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {area.name} highlights: {area.whyBuy}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — Contact agent */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="border border-border rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gold/10 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
                      alt="Karl Parize"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Karl Parize</p>
                    <p className="text-sm text-muted-foreground">Broker / Owner</p>
                    <p className="text-xs text-muted-foreground">BRE# 01364278</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <a
                    href="tel:7143363375"
                    className="flex items-center gap-3 text-sm text-foreground hover:text-teal transition-colors"
                  >
                    <Phone className="w-4 h-4 text-teal shrink-0" />
                    (714) 336-3375
                  </a>
                  <a
                    href="mailto:karl@momentumrg.com"
                    className="flex items-center gap-3 text-sm text-foreground hover:text-teal transition-colors"
                  >
                    <Mail className="w-4 h-4 text-teal shrink-0" />
                    karl@momentumrg.com
                  </a>
                </div>

                <Button asChild className="w-full bg-cta hover:bg-cta-light text-white">
                  <Link href="/contact">Contact Agent</Link>
                </Button>
              </div>

              {/* Property ID / quick info */}
              {property.propertyId && (
                <div className="border border-border rounded-xl bg-white p-4 text-sm text-muted-foreground flex items-center gap-2 shadow-sm">
                  <Hash className="w-4 h-4 shrink-0" />
                  MLS# {property.propertyId}
                </div>
              )}

              {property.dateAdded && (
                <div className="border border-border rounded-xl bg-white p-4 text-sm text-muted-foreground flex items-center gap-2 shadow-sm">
                  <Calendar className="w-4 h-4 shrink-0" />
                  Listed {new Date(property.dateAdded).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
