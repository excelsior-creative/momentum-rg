"use client";

import React, { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

const CITIES = [
  { label: "All Areas", value: "" },
  { label: "Long Beach", value: "long-beach" },
  { label: "Huntington Beach", value: "huntington-beach" },
  { label: "La Habra", value: "la-habra" },
  { label: "La Mirada", value: "la-mirada" },
  { label: "Anaheim", value: "anaheim" },
  { label: "Riverside", value: "riverside" },
];

const PRICE_RANGES = [
  { label: "Any Price", value: "" },
  { label: "Under $500K", value: "0-500000" },
  { label: "$500K – $750K", value: "500000-750000" },
  { label: "$750K – $1M", value: "750000-1000000" },
  { label: "$1M – $1.5M", value: "1000000-1500000" },
  { label: "$1.5M – $2M", value: "1500000-2000000" },
  { label: "$2M+", value: "2000000-" },
];

const PROPERTY_TYPES = [
  { label: "All Types", value: "" },
  { label: "Single Family", value: "single-family-home" },
  { label: "Condo", value: "condo" },
  { label: "Townhouse", value: "townhouse" },
  { label: "Multi-Unit", value: "multi-unit" },
  { label: "Duplex", value: "duplex" },
  { label: "Land", value: "land" },
];

export const ListingsSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "");

  const buildUrl = useCallback(
    (overrides: Record<string, string> = {}) => {
      const params = new URLSearchParams();
      const merged = {
        q: query,
        city,
        price: priceRange,
        type: propertyType,
        status: searchParams.get("status") || "",
        ...overrides,
      };

      Object.entries(merged).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });

      const q = params.toString();
      return q ? `/listings?${q}` : "/listings";
    },
    [query, city, priceRange, propertyType, searchParams],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      startTransition(() => {
        router.push(buildUrl({ page: "1" }));
      });
    },
    [buildUrl, router],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setCity("");
    setPriceRange("");
    setPropertyType("");
    startTransition(() => {
      router.push("/listings");
    });
  }, [router]);

  const hasActiveFilters = query || city || priceRange || propertyType;

  return (
    <form onSubmit={handleSearch} className="mb-8">
      {/* Main search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by address, city, or zip code…"
            className="w-full pl-12 pr-4 py-3.5 border border-border rounded-xl bg-white text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm shadow-sm"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-display font-semibold transition-all ${
            showFilters || hasActiveFilters
              ? "bg-cta border-cta text-white"
              : "bg-white border-border text-foreground hover:border-brand hover:text-brand"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white/70 inline-block" />
          )}
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3.5 bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide text-sm rounded-xl transition-colors shadow-sm disabled:opacity-70"
        >
          Search
        </button>
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="mt-3 p-5 bg-warm-gray rounded-xl border border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-2">
              Area
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-white text-sm text-foreground focus:border-brand outline-none"
            >
              {CITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-2">
              Price Range
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-white text-sm text-foreground focus:border-brand outline-none"
            >
              {PRICE_RANGES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-2">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-white text-sm text-foreground focus:border-brand outline-none"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs text-muted-foreground font-display">Active filters:</span>
          {query && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-display font-semibold">
              &ldquo;{query}&rdquo;
            </span>
          )}
          {city && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-display font-semibold">
              {CITIES.find((c) => c.value === city)?.label || city}
            </span>
          )}
          {priceRange && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-display font-semibold">
              {PRICE_RANGES.find((p) => p.value === priceRange)?.label || priceRange}
            </span>
          )}
          {propertyType && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-display font-semibold">
              {PROPERTY_TYPES.find((t) => t.value === propertyType)?.label || propertyType}
            </span>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-display ml-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}
    </form>
  );
};
