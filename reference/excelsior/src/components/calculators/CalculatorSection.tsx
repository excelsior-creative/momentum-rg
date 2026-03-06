"use client";

import React from "react";
import dynamic from "next/dynamic";
import SectionBadge from "../ui/SectionBadge";

// Dynamic imports for individual calculators to keep bundle size small
const WebDevCostCalculator = dynamic(() => import("./calculators/WebDevCostCalculator"));
const AutomationROICalculator = dynamic(() => import("./calculators/AutomationROICalculator"));
const SaasCostBenefitCalculator = dynamic(() => import("./calculators/SaasCostBenefitCalculator"));
const BrandImpactCalculator = dynamic(() => import("./calculators/BrandImpactCalculator"));
const UptimeCostCalculator = dynamic(() => import("./calculators/UptimeCostCalculator"));
const LaunchTimelineCalculator = dynamic(() => import("./calculators/LaunchTimelineCalculator"));
const SeoROICalculator = dynamic(() => import("./calculators/SeoROICalculator"));
const SocialROICalculator = dynamic(() => import("./calculators/SocialROICalculator"));

interface CalculatorSectionProps {
  serviceSlug: string;
}

const CalculatorSection: React.FC<CalculatorSectionProps> = ({ serviceSlug }) => {
  const renderCalculator = () => {
    switch (serviceSlug) {
      case "web-development":
        return <WebDevCostCalculator />;
      case "agentic-solutions":
        return <AutomationROICalculator />;
      case "software-development":
        return <SaasCostBenefitCalculator />;
      case "brand-development":
        return <BrandImpactCalculator />;
      case "web-hosting":
        return <UptimeCostCalculator />;
      case "launchpad":
        return <LaunchTimelineCalculator />;
      case "seo-services":
        return <SeoROICalculator />;
      case "social-media":
        return <SocialROICalculator />;
      default:
        return null;
    }
  };

  const calculator = renderCalculator();
  if (!calculator) return null;

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <SectionBadge className="mb-2">ROI_Analysis</SectionBadge>
          <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald text-zinc-900">
            Measure Your <span className="text-gradient">Potential</span>
          </h2>
        </div>

        {calculator}
      </div>
    </section>
  );
};

export default CalculatorSection;
