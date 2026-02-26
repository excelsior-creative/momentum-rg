import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { Bed, Bath, Maximize, ArrowRight, MapPin } from "lucide-react";

// Static featured listings matching the reference site content
const featuredListings = [
  {
    id: 1,
    address: "826 Coriander Drive Unit #D",
    city: "Torrance, CA 90502",
    county: "Los Angeles County",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 593,
    price: 410000,
    added: "October 23, 2025",
    type: "For Sale",
    href: "/listings",
  },
  {
    id: 2,
    address: "34670 Capitol St",
    city: "Temecula, CA 92592",
    county: "Riverside County",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3282,
    price: 1499990,
    added: "August 26, 2025",
    type: "For Sale",
    href: "/listings",
  },
  {
    id: 3,
    address: "3471 N El Dorado Dr",
    city: "Long Beach, CA 90808",
    county: "Los Angeles County",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    price: 989990,
    added: "March 2, 2020",
    type: "Sold",
    href: "/listings",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export const ListingsSection = () => {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Our Listings
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-brand">
              Find Home Listings In Your Area
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-brand text-brand hover:bg-brand hover:text-white transition-colors self-start md:self-end"
          >
            <Link href="/listings">
              View All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {featuredListings.map((listing) => (
            <Link
              key={listing.id}
              href={listing.href}
              className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-gold/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="relative h-52 bg-brand/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-brand/20" />
                <MapPin className="h-10 w-10 text-brand/30" />
                {/* Type badge */}
                <span
                  className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                    listing.type === "Sold"
                      ? "bg-gray-800 text-white"
                      : "bg-gold text-brand"
                  }`}
                >
                  {listing.type}
                </span>
              </div>

              <div className="p-6">
                <p className="text-2xl font-bold text-brand">
                  {formatPrice(listing.price)}
                </p>
                <p className="font-semibold text-foreground mt-1">
                  {listing.address}
                </p>
                <p className="text-sm text-muted-foreground">{listing.city}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {listing.county}
                </p>

                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Bed className="h-4 w-4" />
                    {listing.bedrooms} bd
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4" />
                    {listing.bathrooms} ba
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Maximize className="h-4 w-4" />
                    {listing.sqft.toLocaleString()} sqft
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};
