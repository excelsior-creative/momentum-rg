import React from "react";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "./Container";
import { ArrowRight, Calendar } from "lucide-react";
import type { Post } from "@/payload-types";

// Static fallback posts from the original momentumrg.com blog
const STATIC_POSTS = [
  {
    title: "The Growing Trend of Tiny Houses",
    excerpt:
      "Tiny houses are gaining popularity as more people embrace minimalist living. Learn what you need to know before making the move.",
    slug: null,
    href: "/blog",
    date: null,
    category: "Real Estate Tips",
  },
  {
    title: "Real Estate Terms You Should Know",
    excerpt:
      "Buying or selling a home comes with a lot of jargon. We break down the most important real estate terms so you can navigate with confidence.",
    slug: null,
    href: "/blog",
    date: null,
    category: "Buyer Guide",
  },
  {
    title: "Thinking About Moving Into a Loft?",
    excerpt:
      "Loft living is a unique experience — open floor plans, high ceilings, and an urban vibe. Here's what to consider before you commit.",
    slug: null,
    href: "/blog",
    date: null,
    category: "Home Living",
  },
];

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
        href: `/blog/${post.slug}`,
        date: post.publishedDate || null,
        category: "Real Estate",
      }));
    }
  } catch {
    // fall through to static
  }

  // Use static fallback if no live posts
  if (posts.length === 0) {
    posts = STATIC_POSTS;
  }

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              Real Estate Tips
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 text-foreground">
              From the Momentum Blog
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Insights, market updates, and advice from our team to help you
              make confident real estate decisions.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand font-semibold hover:gap-3 transition-all shrink-0"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <article
              key={i}
              className="group flex flex-col bg-white rounded-2xl border border-border overflow-hidden hover:border-brand/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Color band at top */}
              <div className="h-2 bg-brand" />

              <div className="p-7 flex flex-col flex-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">
                  {post.category}
                </span>

                <Link href={post.href}>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-brand transition-colors leading-snug">
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
                    className="text-sm font-semibold text-brand flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
