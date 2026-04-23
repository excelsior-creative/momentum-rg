import { defaultMetadata } from "@/lib/metadata";
import { generateGlobalSchema } from "@/lib/structured-data";
import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Montserrat, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = generateGlobalSchema();
  const shouldShowToolbar = process.env.NODE_ENV !== "production";

  const mediaBase = process.env.NEXT_PUBLIC_WP_MEDIA_BASE?.trim();
  let mediaOrigin: string | null = null;
  if (mediaBase) {
    try {
      mediaOrigin = new URL(mediaBase).origin;
    } catch {
      mediaOrigin = null;
    }
  }

  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable} ${inter.variable}`}>
      <head>
        {mediaOrigin ? (
          <>
            <link rel="preconnect" href={mediaOrigin} />
            <link rel="dns-prefetch" href={mediaOrigin} />
          </>
        ) : (
          <>
            <link rel="preconnect" href="https://momentumrg.com" />
            <link rel="dns-prefetch" href="https://momentumrg.com" />
          </>
        )}
      </head>
      <body className="font-sans antialiased">
        {children}
        {shouldShowToolbar && <VercelToolbar />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
    </html>
  );
}
