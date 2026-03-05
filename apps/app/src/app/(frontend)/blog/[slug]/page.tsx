import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { Media, Post } from "@/payload-types";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { ArrowLeft, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    const post = docs[0] as Post | undefined;
    if (!post) return {};

    return generatePageMetadata({
      title: post.title,
      description: post.excerpt || `${post.title} — Momentum Realty Group real estate insights.`,
      path: `/blog/${slug}`,
    });
  } catch {
    return {};
  }
}

// ─── Lexical → JSX renderer ──────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderNode(node: any, idx: number): React.ReactNode {
  if (!node) return null;

  switch (node.type) {
    case "root":
      return (
        <div key={idx}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </div>
      );

    case "heading": {
      const Tag = (node.tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6") || "h2";
      const cls =
        Tag === "h2"
          ? "font-heading text-2xl md:text-3xl font-medium text-foreground mt-10 mb-4"
          : "font-heading text-xl font-medium text-foreground mt-8 mb-3";
      return (
        <Tag key={idx} className={cls}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </Tag>
      );
    }

    case "paragraph":
      return (
        <p key={idx} className="text-muted-foreground leading-relaxed mb-5">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </p>
      );

    case "text": {
      let el: React.ReactNode = node.text;
      if (node.format & 1) el = <strong key={idx}>{el}</strong>;
      if (node.format & 2) el = <em key={idx}>{el}</em>;
      if (node.format & 8) el = <u key={idx}>{el}</u>;
      return el;
    }

    case "list":
      return node.listType === "bullet" ? (
        <ul key={idx} className="list-disc pl-6 mb-5 space-y-1.5">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </ul>
      ) : (
        <ol key={idx} className="list-decimal pl-6 mb-5 space-y-1.5">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </ol>
      );

    case "listitem":
      return (
        <li key={idx} className="text-muted-foreground leading-relaxed">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => {
            // List items often wrap children in paragraphs — unwrap them
            if (child.type === "paragraph") {
              return child.children?.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (grandChild: any, j: number) => renderNode(grandChild, j),
              );
            }
            return renderNode(child, i);
          })}
        </li>
      );

    case "link":
      return (
        <a
          key={idx}
          href={node.fields?.url || "#"}
          className="text-teal underline hover:text-teal-light"
          target={node.fields?.newTab ? "_blank" : undefined}
          rel={node.fields?.newTab ? "noopener noreferrer" : undefined}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </a>
      );

    case "quote":
      return (
        <blockquote
          key={idx}
          className="border-l-4 border-gold/60 pl-6 py-2 my-6 italic font-heading text-foreground text-lg bg-warm-gray rounded-r-xl"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </blockquote>
      );

    default:
      // Recurse into children for unknown node types
      if (node.children?.length) {
        return (
          <React.Fragment key={idx}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {node.children.map((child: any, i: number) => renderNode(child, i))}
          </React.Fragment>
        );
      }
      return null;
  }
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  let post: Post | undefined;

  try {
    const { docs } = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    post = docs[0] as Post;
  } catch (error) {
    console.error(`Failed to fetch blog post "${slug}".`, error);
  }

  if (!post) notFound();

  const featuredImage = post.featuredImage as Media | null;
  const dateStr = formatDate(post.publishedDate);

  return (
    <div>
      {/* Header */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {featuredImage?.url ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2D2D2D 100%)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

        <Container className="relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-gold text-sm font-display transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
          {dateStr && (
            <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider font-display mb-4">
              <Calendar className="w-3.5 h-3.5" />
              {dateStr}
            </div>
          )}
          <h1 className="font-heading text-3xl md:text-5xl font-medium text-white max-w-3xl leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-white/60 mt-4 text-lg max-w-2xl leading-relaxed">{post.excerpt}</p>
          )}
        </Container>
      </section>

      {/* Content */}
      <Container className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          {post.content ? (
            <div className="text-base leading-relaxed">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {renderNode((post.content as any)?.root || post.content, 0)}
            </div>
          ) : (
            <p className="text-muted-foreground">Content coming soon.</p>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 bg-charcoal rounded-2xl text-center">
            <p className="font-heading text-2xl text-white mb-2">
              Ready to explore Orange County real estate?
            </p>
            <p className="text-white/60 mb-6">
              Momentum Realty Group serves OC, LA, and Riverside Counties. Let&rsquo;s talk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide px-8 py-3 rounded-lg transition-colors"
              >
                Contact Karl
              </Link>
              <Link
                href="/listings"
                className="bg-white/10 hover:bg-white/20 text-white font-display font-semibold uppercase tracking-wide px-8 py-3 rounded-lg transition-colors border border-white/20"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
