import { createIconImage } from "@/lib/seo-images";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return createIconImage(size.width, size.height);
}
