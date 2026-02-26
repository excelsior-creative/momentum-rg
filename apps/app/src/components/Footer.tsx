import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  Services: [
    { name: "Real Estate", path: "/real-estate-solutions" },
    { name: "Mortgages", path: "/contact" },
    { name: "Property Management", path: "/property-management" },
    { name: "Investments", path: "/contact" },
  ],
  Company: [
    { name: "About", path: "/about" },
    { name: "Listings", path: "/listings" },
    { name: "FAQs", path: "/faqs" },
    { name: "News", path: "/blog" },
  ],
};

export const Footer = async () => {
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logo.svg"
                alt="Momentum Realty Group"
                width={160}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              Momentum Realty Group was founded by Karl Parize in 2009 to help
              others achieve the dream of ownership and peace of mind.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="tel:7143363375"
                className="flex items-center gap-2.5 text-white/70 hover:text-gold transition-colors"
              >
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                (714) 336-3375
              </a>
              <a
                href="mailto:karl@momentumrg.com"
                className="flex items-center gap-2.5 text-white/70 hover:text-gold transition-colors"
              >
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                karl@momentumrg.com
              </a>
              <div className="flex items-start gap-2.5 text-white/70">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Orange County, Los Angeles County &amp; Riverside County, CA</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Momentum Realty Group. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>NMLS #313044</span>
            <span>·</span>
            <span>CBRE #01364278</span>
            <span>·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
