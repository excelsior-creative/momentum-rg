import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const result = await payload.find({
      collection: "properties",
      limit: 500,
      depth: 0,
      where: {
        status: {
          not_in: ["cancelled"],
        },
      },
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

    const properties = result.docs.map((p) => ({
      id: String(p.id),
      title: p.title || "",
      slug: p.slug || null,
      status: p.status || null,
      price: p.price || null,
      address: p.address || null,
      city: p.city || null,
      zipCode: p.zipCode || null,
      latitude: p.latitude || null,
      longitude: p.longitude || null,
      bedrooms: p.bedrooms || null,
      bathrooms: p.bathrooms || null,
      propertyType: p.propertyType || null,
    }));

    return NextResponse.json({ properties }, { status: 200 });
  } catch (err) {
    console.error("properties-map-data API error:", err);
    return NextResponse.json({ properties: [] }, { status: 200 });
  }
}
