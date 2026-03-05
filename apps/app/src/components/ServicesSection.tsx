import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { ArrowRight } from "lucide-react";

const services = [
  {
    icon: "https://momentumrg.com/wp-content/uploads/2025/06/image.png",
    title: "Real Estate",
    tagline: "Problem Solved",
    description:
      "With over 25 years of experience, we offer creative solutions that other firms cannot. Contact us today to learn how we can save you time and money on your next real estate transaction.",
    href: "/real-estate-solutions",
  },
  {
    icon: "https://momentumrg.com/wp-content/uploads/2025/06/mortgages.png",
    title: "Mortgages",
    tagline: "Easier Than Ever",
    description:
      "We have a variety of mortgage instruments to help you get what you want. Let us help you understand your current mortgage, refinance, or how to best leverage home equity.",
    href: "/contact",
  },
  {
    icon: "https://momentumrg.com/wp-content/uploads/2025/06/prop_management.png",
    title: "Property Management",
    tagline: "Simple Approach",
    description:
      "We provide multi-unit management services with the highest standards of excellence. Make your next real estate transaction a success by working with our team.",
    href: "/property-management",
  },
  {
    icon: "https://momentumrg.com/wp-content/uploads/2025/06/investments.png",
    title: "Investments",
    tagline: "Grow With Us",
    description:
      "Keeping our finger on the pulse, our network of analysts helps you understand the market. We have a long history of clients who have found success with investment properties.",
    href: "/contact",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-charcoal">
      <Container>
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
            What We Do
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-white">
            Full-Service Real Estate
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto text-base leading-relaxed">
            From buying your first home to managing your investment portfolio,
            Momentum Realty Group handles every aspect of your real estate journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group relative flex flex-col p-8 bg-black/40 hover:bg-brand/10 transition-all duration-300 cursor-pointer"
            >
              {/* Gold top border on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* Icon */}
              <div className="w-16 h-16 mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-full h-full object-contain filter invert brightness-150"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-2 font-display">
                {service.tagline}
              </span>
              <h3 className="font-heading text-xl font-medium text-white mb-4">
                {service.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed flex-1">
                {service.description}
              </p>

              <Link
                href={service.href}
                className="mt-6 inline-flex items-center text-sm font-semibold text-gold hover:text-white transition-colors font-display uppercase tracking-wide"
              >
                Contact Us
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
