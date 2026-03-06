"use client";

import React, { useState, useMemo } from "react";
import CalculatorBase from "../CalculatorBase";
import { SliderInput, NumberInput } from "../CalculatorInputs";
import CalculatorResults from "../CalculatorResults";

const AutomationROICalculator = () => {
  const [manualHours, setManualHours] = useState(20);
  const [laborCost, setLaborCost] = useState(45);
  const [automationEfficiency, setAutomationEfficiency] = useState(85);

  const results = useMemo(() => {
    const weeklySavings = manualHours * laborCost * (automationEfficiency / 100);
    const annualSavings = weeklySavings * 52;
    const hoursFreed = (manualHours * (automationEfficiency / 100)) * 52;
    const monthlyROI = (annualSavings / 12) / 5000; // Assuming $5k avg project cost for simple automation

    return {
      annualSavings: `$${Math.round(annualSavings).toLocaleString()}`,
      hoursFreed: `${Math.round(hoursFreed).toLocaleString()} Hours`,
      roi: `${Math.round(annualSavings / 5000 * 100)}% 1st Year ROI`,
    };
  }, [manualHours, laborCost, automationEfficiency]);

  return (
    <CalculatorBase
      title="Automation ROI Calculator"
      description="Quantify how much manual labor costs your business and how custom AI agents can boost your bottom line."
      badge="Agentic_Efficiency"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
        <div className="space-y-8 py-4">
          <SliderInput
            label="Manual Task Hours (Per Week)"
            value={manualHours}
            onChange={setManualHours}
            min={1}
            max={160}
            helpText="Total hours your team spends on repetitive tasks."
          />
          <NumberInput
            label="Avg. Employee Cost ($/hr)"
            value={laborCost}
            onChange={setLaborCost}
            prefix="$"
            helpText="Include salary, benefits, and overhead."
          />
          <SliderInput
            label="Automation Efficiency"
            value={automationEfficiency}
            onChange={setAutomationEfficiency}
            min={50}
            max={100}
            suffix="%"
            helpText="Percentage of tasks that can be handled by AI."
          />
        </div>

        <CalculatorResults
          metrics={[
            { label: "Annual Labor Savings", value: results.annualSavings, isPositive: true },
            { 
              label: "Capacity Regained", 
              value: results.hoursFreed,
              progress: automationEfficiency
            },
            { label: "Efficiency Impact", value: results.roi, isPositive: true },
          ]}
          ctaText="Deploy Your AI Agent"
        />
      </div>
    </CalculatorBase>
  );
};

export default AutomationROICalculator;
