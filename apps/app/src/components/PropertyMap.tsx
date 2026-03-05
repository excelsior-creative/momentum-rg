"use client";

import React, { useEffect, useRef } from "react";
import type { Property } from "@/payload-types";

// Zip code → approximate center coordinates for OC/LA/Riverside
const ZIP_CENTERS: Record<string, [number, number]> = {
  "90804": [33.7903, -118.1462], // Long Beach Central
  "90803": [33.7609, -118.1222], // Long Beach Belmont Shore
  "90815": [33.7947, -118.1095], // Long Beach East
  "90606": [33.9783, -118.0400], // Whittier area
  "90631": [33.9317, -117.9461], // La Habra
  "90638": [33.9017, -118.0135], // La Mirada
  "92649": [33.7215, -118.0468], // Huntington Harbour
  "92648": [33.6895, -118.0021], // Huntington Beach Central
  "92646": [33.6617, -117.9996], // Huntington Beach South
  "92801": [33.8366, -117.9143], // Anaheim
  "92802": [33.8117, -117.9199], // Anaheim (Disneyland area)
  "92804": [33.8167, -117.9677], // Anaheim West
  "92501": [33.9806, -117.3755], // Riverside
  "92503": [33.9139, -117.4391], // Riverside West
  "92663": [33.6328, -117.9358], // Newport Beach
  "92660": [33.6230, -117.8824], // Newport Beach East
  "92861": [33.8175, -117.7937], // Villa Park / Orange
  "92868": [33.7856, -117.8694], // Orange
};

// City → center fallback if no zip match
const CITY_CENTERS: Record<string, [number, number]> = {
  "Long Beach": [33.7701, -118.1937],
  "Huntington Beach": [33.6595, -118.0000],
  "La Habra": [33.9317, -117.9461],
  "La Mirada": [33.9017, -118.0135],
  "Anaheim": [33.8366, -117.9143],
  "Riverside": [33.9806, -117.3755],
  "Newport Beach": [33.6189, -117.9298],
  "Orange": [33.7879, -117.8531],
};

const DEFAULT_CENTER: [number, number] = [33.7701, -118.1937]; // Long Beach

interface MapProperty {
  id: string;
  title: string;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  price?: number | null;
  status?: string | null;
  propertyType?: string | null;
  slug?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
}

interface PropertyMapProps {
  properties: MapProperty[];
  className?: string;
}

function getCoords(p: MapProperty): [number, number] | null {
  if (p.latitude && p.longitude) return [p.latitude, p.longitude];
  if (p.zipCode && ZIP_CENTERS[p.zipCode]) return ZIP_CENTERS[p.zipCode];
  if (p.city && CITY_CENTERS[p.city]) return CITY_CENTERS[p.city];
  return null;
}

function formatPrice(price?: number | null): string {
  if (!price) return "Price on Request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

const STATUS_COLORS: Record<string, string> = {
  "for-sale": "#E8862C",
  "for-lease": "#3B82F6",
  sold: "#6B7280",
  "in-escrow": "#F59E0B",
  pending: "#F59E0B",
  default: "#E8862C",
};

export const PropertyMap = ({ properties, className = "" }: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet (client-side only)
    import("leaflet").then((L) => {
      // Fix the default icon path issue with webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: DEFAULT_CENTER,
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap tiles (free, no API key)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add property markers
      const bounds: [number, number][] = [];

      properties.forEach((property) => {
        const coords = getCoords(property);
        if (!coords) return;

        bounds.push(coords);
        const color = STATUS_COLORS[property.status || ""] || STATUS_COLORS.default;

        // Custom colored circle marker
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              background: ${color};
              border: 2px solid #fff;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255,255,255,0.9);
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        });

        const statusLabel = property.status
          ? property.status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : "Listing";

        const popup = L.popup({ maxWidth: 260, className: "momentum-popup" }).setContent(`
          <div style="font-family: system-ui, sans-serif; padding: 4px;">
            <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: ${color}; margin-bottom: 4px;">${statusLabel}</div>
            <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; line-height: 1.3; margin-bottom: 6px;">${property.title}</div>
            ${property.address ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">📍 ${property.address}${property.city ? `, ${property.city}` : ""}</div>` : ""}
            <div style="font-size: 16px; font-weight: 700; color: ${color}; margin-bottom: 8px;">${formatPrice(property.price)}</div>
            ${property.bedrooms || property.bathrooms ? `
              <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                ${property.bedrooms ? `${property.bedrooms} BD` : ""}
                ${property.bedrooms && property.bathrooms ? " · " : ""}
                ${property.bathrooms ? `${property.bathrooms} BA` : ""}
              </div>
            ` : ""}
            ${property.slug ? `<a href="/listings/${property.slug}" style="display: inline-block; background: ${color}; color: #fff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 6px; margin-top: 4px;">View Property →</a>` : ""}
          </div>
        `);

        L.marker(coords, { icon }).addTo(map).bindPopup(popup);
      });

      // Fit map to markers
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 13);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties]);

  return (
    <div className={`relative ${className}`}>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={mapRef} className="w-full h-full rounded-xl" />
    </div>
  );
};
