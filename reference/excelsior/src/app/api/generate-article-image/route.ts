import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { cookies } from "next/headers";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient();

    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("payload-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in to Payload CMS" },
        { status: 401 }
      );
    }

    const { user } = await payload.auth({
      headers: new Headers({ Authorization: `JWT ${token}` }),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid session" },
        { status: 401 }
      );
    }

    // Get article ID from request
    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Fetch the article
    const article = await payload.findByID({
      collection: "articles",
      id: articleId,
      depth: 1,
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Build the image generation prompt
    const prompt = `Create a professional blog featured image for an article titled: "${article.title}"

Article summary: ${article.excerpt}

Style: Modern, clean editorial illustration with a tech/creative agency aesthetic. 
Use bold colors with orange (#FF5722) as an accent. Abstract or conceptual representation 
of the topic. No text overlays. Suitable for a blog hero image. High quality, professional photography or illustration style.`;

    console.log(`Generating image for article: ${article.title}`);

    // Call Replicate's Nano Banana Pro model
    const output = await replicate.run("google/nano-banana-pro", {
      input: {
        prompt,
        resolution: "2K",
        image_input: [],
        aspect_ratio: "16:9",
        output_format: "png",
        safety_filter_level: "block_only_high",
      },
    });

    // Get the image URL from the output
    const imageUrl =
      typeof output === "object" && output !== null && "url" in output
        ? (output as { url: () => string }).url()
        : String(output);

    console.log(`Generated image URL: ${imageUrl}`);

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download generated image: ${imageResponse.status}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Create a File-like object for Payload upload
    const fileName = `article-${article.slug}-${Date.now()}.png`;

    // Upload to Payload media collection
    const mediaDoc = await payload.create({
      collection: "media",
      data: {
        alt: `Featured image for: ${article.title}`,
        caption: `AI-generated featured image for article: ${article.title}`,
      },
      file: {
        data: imageBuffer,
        name: fileName,
        mimetype: "image/png",
        size: imageBuffer.length,
      },
    });

    console.log(`Uploaded media with ID: ${mediaDoc.id}`);

    // Update the article with the new featured image
    await payload.update({
      collection: "articles",
      id: articleId,
      data: {
        featuredImage: mediaDoc.id,
      },
    });

    console.log(`Updated article ${articleId} with new featured image`);

    return NextResponse.json({
      success: true,
      mediaId: mediaDoc.id,
      imageUrl: mediaDoc.url,
      message: "Featured image generated and saved successfully",
    });
  } catch (error) {
    console.error("Image generation error:", error);

    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        return NextResponse.json(
          { error: "Replicate API authentication failed" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}

