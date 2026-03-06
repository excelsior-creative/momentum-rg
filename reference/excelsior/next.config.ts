import withBundleAnalyzer from "@next/bundle-analyzer";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: false,
  experimental: {
    optimizePackageImports: ['framer-motion', '@lobehub/icons', '@lobehub/ui'],
  },
  // SEO: Consistent URL structure
  trailingSlash: false,
  // Image optimization for Core Web Vitals
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "excelsiorcreative.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "3huuq4ro9ng8siwd.public.blob.vercel-storage.com",
      },
    ],
    // Optimize image quality for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withPayload(withAnalyzer(nextConfig));
