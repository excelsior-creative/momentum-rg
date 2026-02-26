import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import Image from "next/image";
import { Media, Post } from "@/payload-types";

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  let post: Post | undefined;

  try {
    const { docs: posts } = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: slug,
        },
      },
    });
    post = posts[0] as Post;
  } catch (error) {
    console.error(`Failed to fetch blog post "${slug}" during page render.`, error);
  }

  if (!post) {
    notFound();
  }

  const featuredImage = post.featuredImage as Media;

  return (
    <article className="py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}
          </div>

          {featuredImage?.url && (
            <div className="relative aspect-video mb-12 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt || post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Rich text rendering would go here. For now, we'll just show a placeholder 
                as we need a proper Lexical renderer for Payload 3.0. 
                In a real app, you'd use @payloadcms/richtext-lexical/client */}
            <p>Content would be rendered here using a Lexical rich text component.</p>
          </div>
        </div>
      </Container>
    </article>
  );
}

