import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" data-theme="frontend">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-charcoal focus:text-gold focus:font-display focus:text-sm focus:rounded"
      >
        Skip to main content
      </a>
      <Providers>
        <Navbar />
        <main id="main-content" className="flex-grow">{children}</main>
        <Footer />
      </Providers>
    </div>
  );
}
