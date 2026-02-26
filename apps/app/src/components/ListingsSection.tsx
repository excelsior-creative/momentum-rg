import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { PropertyCard } from "./PropertyCard";
import { ArrowRight } from "lucide-react";
import { getPayload } from "payload";
import config from "@/payload.config";

export const ListingsSection = async () => {
  const payload = await getPayload({ config });

  const { docs: featured } = await payload.find({
    collection: "properties",
    where: {
      or: [
        { status: { equals: "for-sale" } },
        { status: { equals: "in-escrow" } },
      ],
    },
    limit: 3,
    sort: "-dateAdded",
  });

  // Fallback: show any recent properties if no active listings
  const properties =
    featured.length > 0
      ? featured
      : (
          await payload.find({
            collection: "properties",
            limit: 3,
            sort: "-dateAdded",
          })
        ).docs;

  if (properties.length === 0) return null;

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
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </Container>
    </section>
  );
};
