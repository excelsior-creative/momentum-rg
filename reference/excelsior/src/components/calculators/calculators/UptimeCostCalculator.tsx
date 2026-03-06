"use client";

import React, { useState, useMemo } from "react";
import CalculatorBase from "../CalculatorBase";
import { NumberInput, SliderInput } from "../CalculatorInputs";
import CalculatorResults from "../CalculatorResults";

const UptimeCostCalculator = () => {
  const [hourlyRevenue, setHourlyRevenue] = useState(500);
  const [currentUptime, setCurrentUptime] = useState(99.0);

  const results = useMemo(() => {
    const hoursInYear = 24 * 365;
    const currentDowntimeHours = hoursInYear * (1 - currentUptime / 100);
    const targetDowntimeHours = hoursInYear * (1 - 99.99 / 100);
    
    const annualLoss = currentDowntimeHours * hourlyRevenue;
    const savings = (currentDowntimeHours - targetDowntimeHours) * hourlyRevenue;
    
    // Recovery percentage
    const recoveryRate = Math.min(100, (savings / annualLoss) * 100) || 0;

    return {
      annualLoss: `$${Math.round(annualLoss).toLocaleString()}`,
      downtimeSaved: `${Math.round(currentDowntimeHours - targetDowntimeHours)} Hours Saved`,
      savings: `$${Math.round(savings).toLocaleString()} recovered`,
      recoveryRate: recoveryRate
    };
  }, [hourlyRevenue, currentUptime]);

  return (
    <CalculatorBase
      title="Uptime Downtime Cost Calculator"
      description="Calculate the true cost of website downtime and see how much revenue you recover with our 99.99% SLA guarantee."
      badge="Infrastructure_Security"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
        <div className="space-y-8 py-4">
          <NumberInput
            label="Avg. Hourly Revenue"
            value={hourlyRevenue}
            onChange={setHourlyRevenue}
            prefix="$"
            helpText="Total sales or lead value generated per hour."
          />
          <SliderInput
            label="Current Uptime %"
            value={currentUptime}
            onChange={setCurrentUptime}
            min={95}
            max={99.9}
            step={0.1}
            suffix="%"
            helpText="Standard hosting is often 99.0% - 99.5%."
          />
        </div>

        <CalculatorResults
          metrics={[
            { label: "Current Revenue Leak", value: results.annualLoss },
            { label: "Uptime Gained", value: results.downtimeSaved, isPositive: true },
            { 
              label: "Annual Recovery", 
              value: results.savings, 
              isPositive: true,
              progress: results.recoveryRate
            },
          ]}
          ctaText="Secure Your Site"
        />
      </div>
    </CalculatorBase>
  );
};

export default UptimeCostCalculator;
