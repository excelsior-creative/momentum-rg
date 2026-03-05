"use client";

import nextDynamic from "next/dynamic";

// Must live in a Client Component — `ssr: false` is not allowed in Server Components
const PropertyMap = nextDynamic(
  () => import("@/components/PropertyMap").then((m) => ({ default: m.PropertyMap })),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-warm-gray animate-pulse rounded-xl" />,
  },
);

type MapProperty = {
  id: string;
  title: string;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  price: number | null;
  status: string | null;
  propertyType: string | null;
  slug: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
};

export function MapLoader({ properties, className }: { properties: MapProperty[]; className?: string }) {
  return <PropertyMap properties={properties} className={className} />;
}
