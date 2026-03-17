import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AREA_LINKS } from "@/lib/areas";

const footerLinks = {
  Services: [
    { name: "Real Estate", path: "/real-estate-solutions" },
    { name: "Foreclosure", path: "/foreclosure" },
    { name: "Property Management", path: "/property-management" },
    { name: "Investments", path: "/investments" },
  ],
  Company: [
    { name: "About / Team", path: "/about" },
    { name: "Listings", path: "/listings" },
    { name: "FAQs", path: "/faqs" },
    { name: "Articles", path: "/articles" },
  ],
  Areas: [
    ...AREA_LINKS.map((area) => ({ name: area.name, path: area.href })),
  ],
};

export const Footer = async () => {
  return (
    <footer className="relative overflow-hidden border-t border-gold/25 bg-charcoal text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/[0.06] via-white/[0.025] to-transparent" />
        <div className="absolute left-1/2 top-0 h-20 w-2/3 -translate-x-1/2 bg-gold/10 blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
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
                <span>
                  Orange County, Los Angeles County &amp; Riverside County, CA
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-gold mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-sm text-white/60 transition-colors hover:text-gold"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gold/15 pt-8 md:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Momentum Realty Group. All rights
            reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>NMLS #313044</span>
            <span className="text-gold/60">·</span>
            <span>CBRE #01364278</span>
            <span className="text-gold/60">·</span>
            <Link
              href="/privacy"
              className="transition-colors hover:text-gold"
            >
              Privacy Policy
            </Link>
            <span className="text-gold/60">·</span>
            <Link href="/terms" className="transition-colors hover:text-gold">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
