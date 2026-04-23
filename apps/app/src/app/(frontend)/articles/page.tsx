import React from "react";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";
import { Post } from "@/payload-types";
import type { Metadata } from "next";
import { siteMediaPaths, wpMediaUrl } from "@/lib/wpMediaUrl";

export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
};

const ARTICLES_PER_PAGE = 9;

function hasNonCanonicalArticlesState(params: SearchParams) {
  return Boolean(params.page && params.page !== "1");
}

function parsePageParam(page?: string) {
  const parsed = Number.parseInt(page || "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildHref(page: number) {
  return page > 1 ? `/articles?page=${page}` : "/articles";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  let noIndex = false;

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "posts",
      limit: 1,
      where: {
        _status: {
          equals: "published",
        },
      },
    });
    noIndex = result.totalDocs === 0 || hasNonCanonicalArticlesState(params);
  } catch {
    noIndex = true;
  }

  return generatePageMetadata({
    title: "Real Estate Articles & Insights | Momentum Realty Group",
    description:
      "Market updates, home-buying tips, and real estate insights for Orange County, LA County, and Riverside County from Momentum Realty Group.",
    path: "/articles",
    keywords: [
      "Orange County real estate articles",
      "Long Beach housing market",
      "home buying tips",
      "real estate market update",
      "Momentum Realty Group articles",
    ],
    noIndex,
  });
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const requestedPage = parsePageParam(params.page);
  const payload = await getPayload({ config });
  let posts: Post[] = [];
  let totalPages = 1;
  let currentPage = requestedPage;
  let error = false;

  try {
    const result = await payload.find({
      collection: "posts",
      page: requestedPage,
      limit: ARTICLES_PER_PAGE,
      sort: "-publishedDate",
      where: {
        _status: {
          equals: "published",
        },
      },
    });
    posts = result.docs as Post[];
    totalPages = result.totalPages;
    currentPage = result.page ?? requestedPage;
  } catch (err) {
    console.error("Failed to fetch articles during page render.", err);
    error = true;
  }

  return (
    <div>
      {/* Premium dark header */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wpMediaUrl(siteMediaPaths.heroOrangeCounty)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

        <Container className="relative z-10">
          <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-display">
            Real Estate Articles
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
        {!error && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : !error ? (
          <div className="text-center py-24">
            <p className="font-heading text-2xl text-foreground mb-3">Articles Coming Soon</p>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re working on in-depth guides for Orange County homebuyers and investors.
              Check back soon!
            </p>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-heading text-2xl text-foreground mb-3">
              Unable to load articles right now
            </p>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please try again shortly or contact Momentum Realty Group directly.
            </p>
          </div>
        )}

        {!error && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12 pb-4">
            {currentPage > 1 && (
              <Button asChild variant="outline">
                <Link href={buildHref(currentPage - 1)}>Previous</Link>
              </Button>
            )}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Button asChild variant="outline">
                <Link href={buildHref(currentPage + 1)}>Next</Link>
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
