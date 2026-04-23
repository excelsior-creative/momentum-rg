import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { siteMediaPaths, wpMediaUrl } from "@/lib/wpMediaUrl";

const services = [
  {
    icon: wpMediaUrl(siteMediaPaths.serviceRealEstate),
    title: "Real Estate",
    tagline: "Problem Solved",
    description:
      "With over 25 years of experience, we offer creative solutions that other firms cannot. Contact us today to learn how we can save you time and money on your next real estate transaction.",
    href: "/real-estate-solutions",
  },
  {
    icon: wpMediaUrl(siteMediaPaths.servicePropMgmt),
    title: "Property Management",
    tagline: "Simple Approach",
    description:
      "We provide multi-unit management services with the highest standards of excellence. Make your next real estate transaction a success by working with our team.",
    href: "/property-management",
  },
  {
    icon: wpMediaUrl(siteMediaPaths.serviceInvestments),
    title: "Investments",
    tagline: "Grow With Us",
    description:
      "Keeping our finger on the pulse, our network of analysts helps you understand the market. We have a long history of clients who have found success with investment properties.",
    href: "/investments",
  },
  {
    icon: wpMediaUrl(siteMediaPaths.serviceMortgages),
    title: "Foreclosure",
    tagline: "We Have Your Back",
    description:
      "Facing foreclosure? Our certified Short Sale & Foreclosure Resource specialist helps homeowners understand their options, protect their equity, and move forward with a plan.",
    href: "/foreclosure",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <Container>
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
            What We Do
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-foreground">
            Full-Service Real Estate
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-base leading-relaxed">
            From buying your first home to managing your investment portfolio,
            Momentum Realty Group handles every aspect of your real estate
            journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative flex flex-col p-8 bg-white border border-border rounded-xl hover:border-gold/40 hover:shadow-lg transition-all duration-300"
            >
              {/* Gold top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold rounded-t-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* Icon */}
              <div className="w-14 h-14 mb-5 opacity-70 group-hover:opacity-100 transition-opacity relative">
                <Image
                  src={service.icon}
                  alt={service.title}
                  fill
                  className="object-contain"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(57%) sepia(38%) saturate(571%) hue-rotate(6deg) brightness(97%) contrast(87%)",
                  }}
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-2 font-display">
                {service.tagline}
              </span>
              <h3 className="font-heading text-xl font-medium text-foreground mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                {service.description}
              </p>

              <Link
                href={service.href}
                className="mt-6 inline-flex items-center text-sm font-semibold text-teal hover:text-charcoal transition-colors font-display uppercase tracking-wide"
              >
                Learn More
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
