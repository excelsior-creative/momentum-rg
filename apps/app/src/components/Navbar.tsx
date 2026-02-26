"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

type NavItem = {
  name: string;
  path: string;
  children?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  {
    name: "Listings",
    path: "/listings",
    children: [
      { name: "For Sale", path: "/listings/for-sale" },
      { name: "For Lease", path: "/listings/for-lease" },
      { name: "Sold", path: "/listings/sold" },
    ],
  },
  { name: "About", path: "/about" },
  { name: "FAQs", path: "/faqs" },
  {
    name: "Property Management",
    path: "/property-management",
    children: [
      { name: "Property Management", path: "/property-management" },
      { name: "Multi Unit Management", path: "/property-management/multi-unit" },
    ],
  },
  { name: "News", path: "/blog" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="w-full">
      {/* Contact bar */}
      <div className="bg-brand text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a
              href="tel:7143363375"
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              (714) 336-3375
            </a>
            <a
              href="mailto:karl@momentumrg.com"
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              karl@momentumrg.com
            </a>
          </div>
          <div className="flex items-center gap-4 text-white/70 text-xs">
            <span>NMLS #313044</span>
            <span>·</span>
            <span>CBRE #01364278</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-brand border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="relative flex justify-between items-center py-4">
            {/* Logo */}
            <Logo />

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.children ? (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        pathname.startsWith(item.path)
                          ? "text-gold"
                          : "text-white/80 hover:text-white"
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <m.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-52 bg-brand-light border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.path}
                              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === item.path
                        ? "text-gold"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* CTA */}
            <div className="hidden lg:block">
              <Button
                asChild
                className="bg-gold hover:bg-gold-light text-brand font-semibold transition-colors border-none"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block py-2 text-base font-medium",
                        pathname === item.path ? "text-gold" : "text-white/80"
                      )}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="pl-4 mt-1 flex flex-col gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.path}
                            onClick={() => setIsOpen(false)}
                            className="py-1 text-sm text-white/60 hover:text-white transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <hr className="border-white/10 my-2" />
                <Button
                  asChild
                  className="bg-gold hover:bg-gold-light text-brand font-semibold w-full"
                >
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
