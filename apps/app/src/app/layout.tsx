import { defaultMetadata } from "@/lib/metadata";
import { generateGlobalSchema } from "@/lib/structured-data";
import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata } from "next";
import { Montserrat, Rubik } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = generateGlobalSchema();
  const shouldShowToolbar = process.env.NODE_ENV !== "production";

  return (
    <html lang="en" className={`${montserrat.variable} ${rubik.variable}`}>
      <body className="font-sans antialiased">
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
