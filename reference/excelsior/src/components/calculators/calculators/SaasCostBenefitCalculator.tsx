"use client";

import React, { useState, useMemo } from "react";
import CalculatorBase from "../CalculatorBase";
import { SliderInput, SelectInput } from "../CalculatorInputs";
import CalculatorResults from "../CalculatorResults";

const SaasCostBenefitCalculator = () => {
  const [userCount, setUserCount] = useState(100);
  const [complexity, setComplexity] = useState("medium");
  
  const results = useMemo(() => {
    // Subscription costs for off-the-shelf alternatives ($20-50/user/mo)
    const avgSubCost = 35;
    const annualSubCost = userCount * avgSubCost * 12;
    
    // Custom build costs
    const baseBuildCosts: Record<string, number> = {
      low: 15000,
      medium: 45000,
      high: 120000
    };
    
    const buildCost = baseBuildCosts[complexity];
    const maintenanceRate = 0.15; // 15% of build cost per year
    const threeYearBuildCost = buildCost + (buildCost * maintenanceRate * 3);
    const threeYearSubCost = annualSubCost * 3;
    
    const savings = threeYearSubCost - threeYearBuildCost;
    
    // Simple ratio for progress bar (0-100 scale)
    const ratio = Math.min(100, Math.max(0, (savings / threeYearSubCost) * 100));

    return {
      subCost: `$${Math.round(annualSubCost).toLocaleString()}/yr`,
      buildCost: `$${Math.round(buildCost).toLocaleString()}`,
      savings: savings > 0 
        ? `$${Math.round(savings).toLocaleString()} saved over 3yrs` 
        : `Breakeven in ${Math.ceil(buildCost / annualSubCost)} years`,
      ratio: ratio
    };
  }, [userCount, complexity]);

  return (
    <CalculatorBase
      title="SaaS Cost-Benefit Analyzer"
      description="Compare the long-term costs of off-the-shelf subscriptions vs. building your own scalable custom solution."
      badge="Strategic_Software"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
        <div className="space-y-8 py-4">
          <SliderInput
            label="Projected Active Users"
            value={userCount}
            onChange={setUserCount}
            min={10}
            max={5000}
            step={10}
            helpText="How many users will be on the platform?"
          />
          <SelectInput
            label="System Complexity"
            value={complexity}
            onChange={setComplexity}
            options={[
              { label: "Minimum Viable Product (MVP)", value: "low" },
              { label: "Full Enterprise Application", value: "medium" },
              { label: "Complex Multi-tenant Platform", value: "high" },
            ]}
          />
        </div>

        <CalculatorResults
          metrics={[
            { label: "Subscription Drain", value: results.subCost },
            { label: "Custom Build Investment", value: results.buildCost },
            { 
              label: "3-Year Value", 
              value: results.savings, 
              isPositive: results.ratio > 0,
              progress: results.ratio
            },
          ]}
          ctaText="Architect Your Solution"
        />
      </div>
    </CalculatorBase>
  );
};

export default SaasCostBenefitCalculator;
