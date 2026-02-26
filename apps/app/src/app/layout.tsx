import { defaultMetadata } from "@/lib/metadata";
import { generateGlobalSchema } from "@/lib/structured-data";
import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = generateGlobalSchema();
  const shouldShowToolbar = process.env.NODE_ENV !== "production";

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {shouldShowToolbar && <VercelToolbar />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </body>
    </html>
  );
}
