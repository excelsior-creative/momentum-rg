import React from "react";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { PostCard } from "@/components/PostCard";
import { generatePageMetadata } from "@/lib/metadata";
import { Post } from "@/payload-types";
import type { Metadata } from "next";
import { siteMediaPaths, wpMediaUrl } from "@/lib/wpMediaUrl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = generatePageMetadata({
  title: "Real Estate News & Insights | Momentum Realty Group",
  description:
    "Market updates, home-buying tips, and real estate insights for Orange County, LA County, and Riverside County from Momentum Realty Group.",
  path: "/blog",
  keywords: [
    "Orange County real estate news",
    "Long Beach housing market",
    "home buying tips",
    "real estate market update",
    "Momentum Realty Group blog",
  ],
});

export default async function BlogPage() {
  const payload = await getPayload({ config });
  let posts: Post[] = [];

  try {
    const result = await payload.find({
      collection: "posts",
      sort: "-publishedDate",
      where: {
        _status: {
          equals: "published",
        },
      },
    });
    posts = result.docs as Post[];
  } catch (error) {
    console.error("Failed to fetch blog posts during page render.", error);
  }

  return (
    <div>
      {/* Premium dark header */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background photo */}
        <Image
          src={wpMediaUrl(siteMediaPaths.heroOrangeCounty)}
          alt=""
          aria-hidden="true"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

        <Container className="relative z-10">
          <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-display">
            Real Estate News
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-medium text-white mt-3 mb-4">
            Insights &amp; Market Updates
          </h1>
          <p className="text-white/60 text-lg max-w-xl leading-relaxed">
            Expert takes on the Orange County real estate market — buying, selling, investing,
            and property management.
          </p>
        </Container>
      </section>

      {/* Posts */}
      <Container className="py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-heading text-2xl text-foreground mb-3">Articles Coming Soon</p>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re working on in-depth guides for Orange County homebuyers and investors.
              Check back soon!
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
