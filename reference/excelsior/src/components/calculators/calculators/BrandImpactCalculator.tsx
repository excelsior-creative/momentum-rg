"use client";

import React, { useState, useMemo } from "react";
import CalculatorBase from "../CalculatorBase";
import { NumberInput, SliderInput } from "../CalculatorInputs";
import CalculatorResults from "../CalculatorResults";

const BrandImpactCalculator = () => {
  const [currentDonors, setCurrentDonors] = useState(1000);
  const [avgDonation, setAvgDonation] = useState(75);
  const [rebrandingLevel, setRebrandingLevel] = useState(1);

  const results = useMemo(() => {
    // Rebranding impact (estimated 15-40% increase in conversion/trust)
    const liftFactors = [0.15, 0.25, 0.40];
    const lift = liftFactors[rebrandingLevel] || 0.2;
    
    const additionalDonors = Math.round(currentDonors * lift);
    const revenueImpact = additionalDonors * avgDonation;
    const totalImpact = currentDonors * avgDonation * (1 + lift);

    return {
      revenueImpact: `$${Math.round(revenueImpact).toLocaleString()}`,
      newDonors: `+${additionalDonors.toLocaleString()}`,
      growth: `${Math.round(lift * 100)}% Conversion Lift`,
      liftPercent: lift * 100 * 2.5 // Scale up for visual impact
    };
  }, [currentDonors, avgDonation, rebrandingLevel]);

  return (
    <CalculatorBase
      title="Brand Impact ROI Calculator"
      description="See how a strategic visual identity and clear messaging can accelerate funding and community trust for your mission."
      badge="Mission_Impact"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
        <div className="space-y-8 py-4">
          <NumberInput
            label="Current Active Donors"
            value={currentDonors}
            onChange={setCurrentDonors}
            helpText="Total number of recurring or annual donors."
          />
          <NumberInput
            label="Avg. Donation Amount"
            value={avgDonation}
            onChange={setAvgDonation}
            prefix="$"
            helpText="The average gift size per donor."
          />
          <SliderInput
            label="Branding Strategy Depth"
            value={rebrandingLevel}
            onChange={setRebrandingLevel}
            min={0}
            max={2}
            step={1}
            helpText="Light Refresh (0), Strategic Rebrand (1), Full Identity Overhaul (2)"
          />
        </div>

        <CalculatorResults
          metrics={[
            { label: "Projected Funding Lift", value: results.revenueImpact, isPositive: true },
            { label: "Additional Donor Reach", value: results.newDonors },
            { 
              label: "Trust Factor Increase", 
              value: results.growth, 
              isPositive: true,
              progress: results.liftPercent
            },
          ]}
          ctaText="Evolve Your Brand"
        />
      </div>
    </CalculatorBase>
  );
};

export default BrandImpactCalculator;
