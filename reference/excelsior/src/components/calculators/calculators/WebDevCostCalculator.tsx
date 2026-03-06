"use client";

import React, { useState, useMemo } from "react";
import CalculatorBase from "../CalculatorBase";
import { SliderInput, SelectInput } from "../CalculatorInputs";
import CalculatorResults from "../CalculatorResults";

const WebDevCostCalculator = () => {
  const [pages, setPages] = useState(5);
  const [complexity, setComplexity] = useState("standard");
  const [hourlyRate, setHourlyRate] = useState(150);

  const results = useMemo(() => {
    const basePageCost = 500;
    const complexityMultipliers: Record<string, number> = {
      standard: 1,
      ecommerce: 2.5,
      "ai-integrated": 4,
    };

    const multiplier = complexityMultipliers[complexity] || 1;
    const estimatedCost = pages * basePageCost * multiplier;
    const diyHours = pages * 15 * multiplier; // DIY takes much longer
    const proWeeks = Math.ceil((pages * 4 * multiplier) / 5); // Pro is faster
    const timeSavedWeeks = Math.ceil(diyHours / 40) - proWeeks;
    
    // Calculate efficiency score (0-100)
    const efficiency = Math.min(100, Math.round((diyHours / (proWeeks * 40)) * 100));

    return {
      estimatedCost: `$${estimatedCost.toLocaleString()}`,
      timeToMarket: `${proWeeks} Weeks`,
      timeSaved: `${Math.max(0, timeSavedWeeks)} Weeks Saved`,
      efficiency: efficiency
    };
  }, [pages, complexity]);

  return (
    <CalculatorBase
      title="Website Build Cost Estimator"
      description="Calculate the investment for your professional web project and see how much time you save compared to DIY."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
        <div className="space-y-8 py-4">
          <SliderInput
            label="Number of Pages"
            value={pages}
            onChange={setPages}
            min={1}
            max={50}
            helpText="Total unique page designs and content layouts."
          />
          <SelectInput
            label="Project Complexity"
            value={complexity}
            onChange={setComplexity}
            options={[
              { label: "Standard Marketing (WordPress/Elementor)", value: "standard" },
              { label: "E-commerce / Membership", value: "ecommerce" },
              { label: "Custom React + AI Integration", value: "ai-integrated" },
            ]}
          />
        </div>

        <CalculatorResults
          metrics={[
            { label: "Estimated Investment", value: results.estimatedCost },
            { label: "Time to Market", value: results.timeToMarket },
            { 
              label: "Professional Advantage", 
              value: results.timeSaved, 
              isPositive: true,
              progress: 85 // Static high score for pro advantage
            },
          ]}
          ctaText="Get a Precise Quote"
        />
      </div>
    </CalculatorBase>
  );
};

export default WebDevCostCalculator;
