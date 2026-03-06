import React from "react";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "./Container";
import { ArrowRight, Calendar } from "lucide-react";
import type { Post } from "@/payload-types";

export const BlogTeaserSection = async () => {
  let posts: { title: string; excerpt: string | null; slug: string | null; href: string; date: string | null; category: string }[] = [];

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "posts",
      sort: "-publishedDate",
      limit: 3,
      depth: 0,
      where: {
        _status: { equals: "published" },
      },
    });

    if (result.docs.length > 0) {
      posts = result.docs.map((post: Post) => ({
        title: post.title,
        excerpt: post.excerpt || null,
        slug: post.slug,
        href: `/articles/${post.slug}`,
        date: post.publishedDate || null,
        category: "Real Estate",
      }));
    }
  } catch {
    // fall through to static
  }

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Real Estate Tips
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 text-foreground">
              Latest Articles
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Insights, market updates, and advice from our team to help you
              make confident real estate decisions.
            </p>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-teal font-semibold hover:gap-3 transition-all shrink-0"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <article
                key={i}
                className="group flex flex-col bg-white rounded-2xl border border-border overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-2 bg-gold" />

                <div className="p-7 flex flex-col flex-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">
                    {post.category}
                  </span>

                  <Link href={post.href}>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-gold transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between pt-5 border-t border-border">
                    {post.date ? (
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={post.href}
                      className="text-sm font-semibold text-teal flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-warm-gray px-8 py-10 text-center">
            <p className="font-heading text-2xl text-foreground">Articles Coming Soon</p>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
              We publish articles when there is something useful to say about the market, buying,
              selling, investing, and property ownership. In the meantime, reach out directly if
              you want help with a specific question.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-light"
              >
                Ask a Question
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold/40"
              >
                Visit Article Hub
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
