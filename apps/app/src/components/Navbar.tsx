"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
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
  {
    name: "Solutions",
    path: "/real-estate-solutions",
    children: [
      { name: "Real Estate Solutions", path: "/real-estate-solutions" },
      { name: "Mortgages", path: "/mortgages" },
      { name: "Investments", path: "/investments" },
    ],
  },
  {
    name: "About",
    path: "/about",
    children: [
      { name: "Meet Our Team", path: "/about" },
      { name: "Karl Parize", path: "/team/karl" },
      { name: "Esmeralda Novikoff", path: "/team/esmeralda" },
    ],
  },
  {
    name: "Property Management",
    path: "/property-management",
    children: [
      { name: "Property Management", path: "/property-management" },
      { name: "Multi Unit Management", path: "/property-management/multi-unit" },
    ],
  },
  { name: "Articles", path: "/articles" },
  { name: "FAQs", path: "/faqs" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn("w-full sticky top-0 z-50 transition-all duration-300", scrolled && "shadow-lg")}>
      {/* Main nav */}
      <nav
        className={cn(
          "border-b border-transparent transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-brand/15"
            : "bg-white"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div
            className={cn(
              "relative flex justify-between items-center transition-all duration-300",
              scrolled ? "py-2" : "py-3.5"
            )}
          >
            {/* Logo */}
            <Logo variant="charcoal" />

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
                        "flex items-center gap-1 rounded-md border border-transparent px-3 py-2 text-[15px] font-semibold transition-colors",
                        pathname.startsWith(item.path)
                          ? "border-brand/20 bg-brand/5 text-brand"
                          : "text-foreground/70 hover:text-brand"
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <m.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 min-w-64 w-max bg-white border border-border rounded-lg shadow-xl overflow-hidden z-50"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.path}
                              className="block border-l-2 border-transparent px-4 py-2.5 text-[15px] font-medium text-foreground/70 transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
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
                      "rounded-md border border-transparent px-3 py-2 text-[15px] font-semibold transition-colors",
                      pathname === item.path
                        ? "border-brand/20 bg-brand/5 text-brand"
                        : "text-foreground/70 hover:text-brand"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:7143363375"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-brand"
              >
                <Phone className="h-3.5 w-3.5 text-brand" />
                (714) 336-3375
              </a>
              <Button
                asChild
                variant="cta"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-foreground transition-colors hover:bg-brand/5 hover:text-brand lg:hidden"
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
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block rounded-md border-l-2 py-2 pl-3 text-lg font-semibold transition-colors",
                        pathname === item.path
                          ? "border-brand text-brand"
                          : "border-transparent text-foreground/80 hover:border-brand/40 hover:text-brand"
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
                            className="rounded-md border-l-2 border-transparent py-1 pl-3 text-base font-medium text-foreground/60 transition-colors hover:border-brand/30 hover:text-brand"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <hr className="border-border my-2" />
                <Button
                  asChild
                  variant="cta"
                  size="marketing"
                  className="w-full"
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
