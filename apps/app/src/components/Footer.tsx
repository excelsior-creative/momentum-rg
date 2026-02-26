import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { getPayload } from "payload";
import config from "@/payload.config";

const footerData = {
  Navigation: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ],
  Resources: [
    { name: "Documentation", path: "/" },
    { name: "Support", path: "/contact" },
  ],
};

export const Footer = async () => {
  const payload = await getPayload({ config });
  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  const siteTitle = siteSettings.siteTitle || "Your Company";

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-4 inline-block" />
            <p className="text-muted-foreground text-sm max-w-xs">
              Next.js + Payload CMS template for building modern, content-rich websites faster.
            </p>
          </div>
          {Object.entries(footerData).map(([category, links]) => (
            <div key={category}>
              <h2 className="text-base font-bold mb-4">{category}</h2>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-sm text-muted-foreground hover:text-brand transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-brand transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-brand transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
