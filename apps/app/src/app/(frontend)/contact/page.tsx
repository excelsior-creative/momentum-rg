import React from "react";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { generatePageMetadata } from "@/lib/metadata";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Karl Parize | Momentum Realty Group",
  description:
    "Get in touch with Karl Parize and the Momentum Realty Group team. Serving Orange County, LA County, and Riverside County. Call (714) 336-3375.",
  path: "/contact",
  keywords: [
    "contact Momentum Realty Group",
    "Karl Parize phone",
    "Orange County realtor contact",
    "real estate agent Long Beach",
  ],
});

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: "(714) 336-3375",
    href: "tel:7143363375",
  },
  {
    icon: Mail,
    label: "Email",
    value: "karl@momentumrg.com",
    href: "mailto:karl@momentumrg.com",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "1451 Quail Street, Suite 110B\nNewport Beach, CA 92660",
    href: "https://maps.google.com/?q=1451+Quail+Street+Suite+110B+Newport+Beach+CA",
  },
];

export default function ContactPage() {
  return (
    <div>
      {/* Premium dark hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://momentumrg.com/wp-content/uploads/2025/06/6daf30f51f90728aaf76113795821975d6fd2d41-scaled.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

        <Container className="relative z-10">
          <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-display">
            Reach Out
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-medium text-white mt-3 mb-4">
            Let&rsquo;s Talk Real Estate
          </h1>
          <p className="text-white/60 text-lg max-w-md leading-relaxed">
            Whether you&rsquo;re buying, selling, or just exploring your options — we respond
            within one business day.
          </p>
        </Container>
      </section>

      {/* Content */}
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: contact info */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Momentum Realty Group
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-medium mt-3 mb-8 text-foreground">
              Contact Information
            </h2>

            <div className="space-y-6">
              {contactDetails.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "Office" ? "_blank" : undefined}
                  rel={item.label === "Office" ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-5 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0 group-hover:bg-teal group-hover:border-teal transition-all">
                    <item.icon className="w-5 h-5 text-teal group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-1">
                      {item.label}
                    </p>
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-line group-hover:text-teal transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Karl card */}
            <div className="mt-10 p-6 bg-warm-gray rounded-2xl border border-border flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
                alt="Karl Parize"
                className="w-16 h-16 rounded-full object-cover border-2 border-gold/30 flex-shrink-0"
              />
              <div>
                <p className="font-heading font-medium text-foreground">Karl Parize</p>
                <p className="text-xs font-display uppercase tracking-wider text-gold mt-0.5">
                  Broker / Owner
                </p>
                <p className="text-xs text-muted-foreground mt-1">NMLS #313044 · CBRE #01364278</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Send a Message
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-medium mt-3 mb-8 text-foreground">
              How Can We Help?
            </h2>
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
