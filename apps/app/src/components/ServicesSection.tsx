import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { ArrowRight, Home, Banknote, Building2, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Real Estate",
    tagline: "Problem Solved",
    description:
      "With over 25 years of experience, we offer creative solutions that other firms cannot. Contact us today to learn how we can save you time and money on your next real estate transaction.",
    href: "/real-estate-solutions",
  },
  {
    icon: Banknote,
    title: "Mortgages",
    tagline: "Easier Than Ever",
    description:
      "We have a variety of mortgage instruments to help you get what you want. Let us help you understand your current mortgage, refinance, or how to best leverage home equity.",
    href: "/contact",
  },
  {
    icon: Building2,
    title: "Property Management",
    tagline: "Simple Approach",
    description:
      "We provide multi-unit management services with the highest standards of excellence. Make your next real estate transaction a success by working with our team.",
    href: "/property-management",
  },
  {
    icon: TrendingUp,
    title: "Investments",
    tagline: "Grow With Us",
    description:
      "Keeping our finger on the pulse, our network of analysts helps you understand the market. We have a long history of clients who have found success with investment properties.",
    href: "/contact",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="text-center mb-14">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-brand">
            Full-Service Real Estate
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            From buying your first home to managing your investment portfolio,
            Momentum Realty Group handles every aspect of your real estate journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative flex flex-col p-8 bg-white border border-border rounded-xl hover:border-gold/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Gold accent top border on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-xl" />

              <div className="w-12 h-12 rounded-lg bg-brand/5 flex items-center justify-center mb-5 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                <service.icon className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">
                {service.tagline}
              </span>
              <h3 className="text-xl font-bold text-brand mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                {service.description}
              </p>

              <Link
                href={service.href}
                className="mt-6 inline-flex items-center text-sm font-semibold text-brand hover:text-gold transition-colors"
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
