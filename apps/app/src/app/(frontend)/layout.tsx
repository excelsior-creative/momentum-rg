import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" data-theme="frontend">
      <Providers>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </Providers>
    </div>
  );
}
