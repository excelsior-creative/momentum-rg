"use client";

import { services } from "@/data/services";
import Link from "next/link";
import React from "react";
import { useContactDialog } from "./ContactDialogProvider";
import { Logo } from "./Logo";

const StatusLight = ({
  label,
  color = "green",
}: {
  label: string;
  color?: string;
}) => {
  const colorClass =
    color === "orange"
      ? "bg-[#FF5722]"
      : color === "red"
      ? "bg-red-500"
      : "bg-green-500";
  return (
    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 border border-white/10">
      <div
        className={`w-2 h-2 rounded-full ${colorClass} animate-pulse shadow-[0_0_8px_currentColor]`}
      ></div>
      <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
  );
};

interface FooterSettings {
  description?: string;
  copyright?: string;
  statusLights?: Array<{ label: string; color?: string }>;
  connectLinks?: Array<{
    label: string;
    href?: string;
    isContactButton?: boolean;
    isExternal?: boolean;
  }>;
  navigation?: Array<{
    label: string;
    href?: string;
    isContactButton?: boolean;
  }>;
}

interface FooterProps {
  settings?: FooterSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const { openContactDialog } = useContactDialog();

  // Use CMS settings with fallbacks
  const description =
    settings?.description ||
    "Excelsior Creative is a trusted technology partner for national nonprofits, specializing in AI-powered solutions, custom software engineering, and digital strategy to amplify world-changing missions.";
  const copyright =
    settings?.copyright || "© 2025 Excelsior Creative. All Rights Reserved.";

  const defaultNavItems: NonNullable<FooterSettings["navigation"]> = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/#services" },
    { label: "Process", href: "/process" },
    { label: "Work", href: "/work" },
    { label: "Articles", href: "/articles" },
  ];

  const defaultConnectLinks: NonNullable<FooterSettings["connectLinks"]> = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/excelsiorcreative/",
      isExternal: true,
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/exctio/",
      isExternal: true,
    },
    {
      label: "Support",
      href: "https://support.excelsiorcreative.com/support/home",
      isExternal: true,
    },
    { label: "Contact", isContactButton: true },
  ];

  const defaultStatusLights: NonNullable<FooterSettings["statusLights"]> = [
    { label: "Pride: Active", color: "green" },
    { label: "Vision: Forward", color: "green" },
    { label: "Leadership: On", color: "green" },
  ];

  const navItems = settings?.navigation || defaultNavItems;
  const connectLinks = settings?.connectLinks || defaultConnectLinks;
  const statusLights = settings?.statusLights || defaultStatusLights;

  return (
    <footer className="bg-brand-dark-gray pt-24 pb-12 border-t border-white/10 relative overflow-hidden text-white">
      {/* Decorative striped background */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.01)_0,rgba(255,255,255,0.01)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2">
            <Logo className="h-12 mb-8" />
            <p className="max-w-md text-gray-500 mb-8 font-light leading-relaxed">
              {description}
            </p>
            <div className="flex flex-wrap gap-4">
              {statusLights.map((light, index) => (
                <StatusLight
                  key={index}
                  label={light.label}
                  color={light.color}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#FF5722] font-mono text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              /// Navigation
            </p>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.isContactButton ? (
                    <button
                      onClick={openContactDialog}
                      className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest flex items-center group w-full text-left"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#FF5722] opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2">
                        {"//"}
                      </span>
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest flex items-center group"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#FF5722] opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2">
                        {"//"}
                      </span>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#FF5722] font-mono text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              /// Services
            </p>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#FF5722] opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2">
                      {"//"}
                    </span>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#FF5722] font-mono text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              /// Connect
            </p>
            <ul className="space-y-4">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  {link.isContactButton ? (
                    <button
                      onClick={openContactDialog}
                      className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest flex items-center group w-full text-left"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#FF5722] opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2">
                        {"//"}
                      </span>
                      {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest flex items-center group"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#FF5722] opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2">
                        {"//"}
                      </span>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-mono uppercase tracking-widest">
          <p>{copyright}</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-700">Orange County, CA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
