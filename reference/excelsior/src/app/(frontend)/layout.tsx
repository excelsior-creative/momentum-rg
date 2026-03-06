import Providers from "@/components/Providers";
import SearchModal from "@/components/SearchModal";
import { defaultMetadata } from "@/lib/metadata";
import { generateGlobalSchema } from "@/lib/structured-data";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Oswald, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

// Export the default metadata for all frontend pages
export const metadata: Metadata = defaultMetadata;

// Generate the global structured data (Organization + WebSite)
const globalSchema = generateGlobalSchema();

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} scroll-smooth`}
    >
      <head>
        {/* Preload critical hero background image with high priority */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fhero-bg.jpg&w=1920&q=75"
          fetchPriority="high"
        />

        {/* Preconnect to Google for fonts and reCAPTCHA */}
        <link
          rel="preconnect"
          href="https://www.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for additional resources */}
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />

        {/* Global structured data for Organization and WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZZGS8R91V7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ZZGS8R91V7');
          `}
        </Script>
      </head>
      <body>
        <Providers>
          {children}
          <SearchModal />
        </Providers>
        <div className="noise-overlay" />
      </body>
    </html>
  );
}
