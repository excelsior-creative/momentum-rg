import { SITE_URL } from "@/lib/metadata";
import config from "@payload-config";
import { MetadataRoute } from "next";
import { getPayload } from "payload";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/listings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/property-management`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/property-management/multi-unit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/real-estate-solutions`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/faqs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // Area-filtered listing pages for SEO
    { url: `${SITE_URL}/listings?city=long-beach`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/listings?city=huntington-beach`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/listings?city=la-habra`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/listings?city=la-mirada`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/listings?city=anaheim`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/listings?city=riverside`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Blog posts
  const { docs: posts } = await payload.find({
    collection: "posts",
    limit: 1000,
    where: { _status: { equals: "published" } },
    select: { slug: true, updatedAt: true },
  });

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Property listings — all active properties
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const { docs: properties } = await payload.find({
      collection: "properties",
      limit: 2000,
      where: {
        status: {
          not_in: ["cancelled", "on-hold"],
        },
      },
      select: { slug: true, updatedAt: true, status: true },
    });

    propertyPages = properties
      .filter((p) => p.slug)
      .map((property) => ({
        url: `${SITE_URL}/listings/${property.slug}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: "weekly" as const,
        priority: property.status === "for-sale" || property.status === "for-lease" ? 0.8 : 0.5,
      }));
  } catch (err) {
    console.error("Sitemap: failed to fetch properties", err);
  }

  return [...staticPages, ...postPages, ...propertyPages];
}
