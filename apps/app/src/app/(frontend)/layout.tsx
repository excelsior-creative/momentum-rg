import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { SearchProvider } from "@/components/SearchProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" data-theme="frontend">
      <Providers>
        <SearchProvider>
          <div className="max-w-7xl mx-auto w-full px-4 md:px-10">
            <Navbar />
          </div>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SearchProvider>
      </Providers>
    </div>
  );
}
