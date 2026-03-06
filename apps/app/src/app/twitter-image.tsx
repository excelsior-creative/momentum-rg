import { createSocialImage } from "@/lib/seo-images";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return createSocialImage(size.width, size.height);
}
