"use client";

import React, { useState, useMemo } from "react";
import CalculatorBase from "../CalculatorBase";
import { NumberInput, SliderInput } from "../CalculatorInputs";
import CalculatorResults from "../CalculatorResults";

const SeoROICalculator = () => {
  const [currentTraffic, setCurrentTraffic] = useState(2500);
  const [conversionRate, setConversionRate] = useState(2.0);
  const [avgOrderValue, setAvgOrderValue] = useState(150);

  const results = useMemo(() => {
    // Typical SEO growth (50% to 200% over 6-12 months)
    const trafficIncrease = 1.5; // 150% growth
    const newTraffic = currentTraffic * trafficIncrease;
    const currentRevenue = currentTraffic * (conversionRate / 100) * avgOrderValue;
    const projectedRevenue = newTraffic * (conversionRate / 100) * avgOrderValue;
    const annualLift = (projectedRevenue - currentRevenue) * 12;

    return {
      monthlyRevenue: `+$${Math.round(projectedRevenue - currentRevenue).toLocaleString()}/mo`,
      annualLift: `$${Math.round(annualLift).toLocaleString()}/yr`,
      trafficGrowth: `+${Math.round((trafficIncrease - 1) * 100)}% Visibility`,
      growthVal: (trafficIncrease - 1) * 100
    };
  }, [currentTraffic, conversionRate, avgOrderValue]);

  return (
    <CalculatorBase
      title="SEO ROI Calculator"
      description="Calculate the potential revenue growth from increasing your organic visibility and capturing high-intent search traffic."
      badge="Organic_Growth"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
        <div className="space-y-8 py-4">
          <NumberInput
            label="Current Monthly Organic Traffic"
            value={currentTraffic}
            onChange={setCurrentTraffic}
            helpText="Check your Google Search Console or Analytics."
          />
          <SliderInput
            label="Conversion Rate (%)"
            value={conversionRate}
            onChange={setConversionRate}
            min={0.1}
            max={10}
            step={0.1}
            suffix="%"
            helpText="Percentage of visitors who become customers."
          />
          <NumberInput
            label="Avg. Customer Value ($)"
            value={avgOrderValue}
            onChange={setAvgOrderValue}
            prefix="$"
            helpText="The average lifetime or initial order value."
          />
        </div>

        <CalculatorResults
          metrics={[
            { label: "Projected Monthly Lift", value: results.monthlyRevenue, isPositive: true },
            { label: "Annual Revenue Impact", value: results.annualLift, isPositive: true },
            { 
              label: "Organic Reach Potential", 
              value: results.trafficGrowth, 
              isPositive: true,
              progress: results.growthVal
            },
          ]}
          ctaText="Start Your Audit"
        />
      </div>
    </CalculatorBase>
  );
};

export default SeoROICalculator;
