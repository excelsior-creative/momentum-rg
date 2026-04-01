import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow flex items-center justify-center bg-background">
        <Container>
          <div className="text-center py-24 max-w-lg mx-auto">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-4">404</p>
            <h1 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
              Let&apos;s get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-cta hover:bg-cta-light text-white">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/listings">Browse Listings</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
