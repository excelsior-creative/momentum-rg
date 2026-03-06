import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post, Media } from "@/payload-types";
import { ArrowRight } from "lucide-react";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export const PostCard = ({ post, priority = false }: PostCardProps) => {
  const featuredImage = post.featuredImage as Media | null;
  const dateStr = formatDate(post.publishedDate);

  return (
    <Link
      href={`/articles/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-warm-gray">
        {featuredImage?.url ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={75}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/5">
            <span className="font-heading text-3xl text-charcoal/10">MRG</span>
          </div>
        )}
        {/* Gold top accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Date */}
        {dateStr && (
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-3">
            {dateStr}
          </p>
        )}

        <h3 className="font-heading text-lg font-medium text-foreground leading-snug mb-3 group-hover:text-brand transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center gap-1.5 mt-5 text-brand text-sm font-semibold font-display group-hover:gap-3 transition-all">
          Read Article
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};
