"use client";

import React, { useState, useMemo } from "react";
import CalculatorBase from "../CalculatorBase";
import { SelectInput, SliderInput } from "../CalculatorInputs";
import CalculatorResults from "../CalculatorResults";

const LaunchTimelineCalculator = () => {
  const [stage, setStage] = useState("concept");
  const [complexity, setComplexity] = useState(2);

  const results = useMemo(() => {
    const stageValues: Record<string, number> = {
      concept: 24,
      prototype: 16,
      validation: 12
    };
    
    const baseWeeks = stageValues[stage] || 20;
    const soloWeeks = baseWeeks * (complexity * 1.5);
    const partneredWeeks = (baseWeeks * complexity) * 0.4; // 60% faster with incubation
    
    const speedLift = ((soloWeeks - partneredWeeks) / soloWeeks) * 100;

    return {
      soloTime: `${Math.round(soloWeeks)} Weeks Solo`,
      partneredTime: `${Math.round(partneredWeeks)} Weeks Partnered`,
      speedLift: `${Math.round(speedLift)}% Faster Launch`,
      speedLiftVal: speedLift
    };
  }, [stage, complexity]);

  return (
    <CalculatorBase
      title="Startup Launch Timeline Calculator"
      description="Estimate your time-to-market and see how venture incubation accelerates your path from idea to acquisition."
      badge="Launch_Velocity"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
        <div className="space-y-8 py-4">
          <SelectInput
            label="Current Idea Stage"
            value={stage}
            onChange={setStage}
            options={[
              { label: "Back-of-napkin Concept", value: "concept" },
              { label: "Initial MVP / Prototype", value: "prototype" },
              { label: "Early Market Validation", value: "validation" },
            ]}
          />
          <SliderInput
            label="Product Complexity"
            value={complexity}
            onChange={setComplexity}
            min={1}
            max={5}
            helpText="1: Simple App, 5: Complex Platform with AI & Infrastructure"
          />
        </div>

        <CalculatorResults
          metrics={[
            { label: "Traditional Timeline", value: results.soloTime },
            { label: "Accelerated Launch", value: results.partneredTime, isPositive: true },
            { 
              label: "Market Advantage", 
              value: results.speedLift, 
              isPositive: true,
              progress: results.speedLiftVal
            },
          ]}
          ctaText="Apply for Launchpad"
        />
      </div>
    </CalculatorBase>
  );
};

export default LaunchTimelineCalculator;
