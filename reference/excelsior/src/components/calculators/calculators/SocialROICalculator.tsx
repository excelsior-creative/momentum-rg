"use client";

import React, { useState, useMemo } from "react";
import CalculatorBase from "../CalculatorBase";
import { NumberInput, SliderInput } from "../CalculatorInputs";
import CalculatorResults from "../CalculatorResults";

const SocialROICalculator = () => {
  const [adSpend, setAdSpend] = useState(1000);
  const [currentFollowers, setCurrentFollowers] = useState(5000);
  const [cpc, setCpc] = useState(1.50);

  const results = useMemo(() => {
    const clicks = adSpend / cpc;
    const conversionRate = 0.03; // 3% benchmark
    const conversions = clicks * conversionRate;
    const avgOrderValue = 100;
    const revenue = conversions * avgOrderValue;
    const roas = revenue / adSpend;
    
    // Calculate ROAS score for progress bar (cap at 5x = 100%)
    const roasScore = Math.min(100, (roas / 5) * 100);

    return {
      projectedRevenue: `$${Math.round(revenue).toLocaleString()}`,
      newCustomers: Math.round(conversions).toString(),
      roas: `${roas.toFixed(1)}x ROAS`,
      roasScore: roasScore
    };
  }, [adSpend, currentFollowers, cpc]);

  return (
    <CalculatorBase
      title="Social ROI Calculator"
      description="Estimate the impact of your social media ad spend and see how strategic community management drives real conversions."
      badge="Social_Momentum"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
        <div className="space-y-8 py-4">
          <NumberInput
            label="Monthly Ad Spend"
            value={adSpend}
            onChange={setAdSpend}
            prefix="$"
            helpText="Your total budget for Meta, LinkedIn, or TikTok ads."
          />
          <SliderInput
            label="Target Cost Per Click (CPC)"
            value={cpc}
            onChange={setCpc}
            min={0.10}
            max={10.00}
            step={0.10}
            prefix="$"
            helpText="Average cost for each visitor to your site."
          />
          <NumberInput
            label="Current Total Followers"
            value={currentFollowers}
            onChange={setCurrentFollowers}
            helpText="Sum of followers across all platforms."
          />
        </div>

        <CalculatorResults
          metrics={[
            { label: "Projected Sales Revenue", value: results.projectedRevenue, isPositive: true },
            { label: "Estimated New Customers", value: results.newCustomers },
            { 
              label: "Return on Ad Spend", 
              value: results.roas, 
              isPositive: true,
              progress: results.roasScore
            },
          ]}
          ctaText="Build Your Community"
        />
      </div>
    </CalculatorBase>
  );
};

export default SocialROICalculator;
