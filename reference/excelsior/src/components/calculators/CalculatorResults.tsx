"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import Button from "../ui/Button";
import { useContactDialog } from "../ContactDialogProvider";

// --- Animated Counter Component ---
const Counter = ({ value }: { value: string }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block text-3xl md:text-4xl font-bold font-oswald text-white tracking-tight"
    >
      {value}
    </motion.span>
  );
};

// --- Progress Bar Component ---
const ProgressBar = ({ value, isPositive }: { value: number, isPositive?: boolean }) => {
  return (
    <div className="mt-3 w-full bg-black/20 h-1 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${isPositive ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-[#FF5722] to-[#E91E63]'}`}
      />
    </div>
  );
};


interface MetricProps {
  label: string;
  value: string;
  subValue?: string;
  isPositive?: boolean;
  progress?: number; // 0-100
}

const Metric: React.FC<MetricProps> = ({ label, value, subValue, isPositive, progress }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 relative group overflow-hidden rounded-lg">
    {/* Gradient Glow Effect on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Tech Corners */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700 group-hover:border-[#FF5722] transition-colors" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700 group-hover:border-[#FF5722] transition-colors" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700 group-hover:border-[#FF5722] transition-colors" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700 group-hover:border-[#FF5722] transition-colors" />

    <div className="relative z-10">
      <span className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-2">
        {label}
      </span>
      
      <Counter value={value} />
      
      {progress !== undefined && (
        <ProgressBar value={progress} isPositive={isPositive} />
      )}

      {subValue && (
        <div className="flex items-center gap-2 mt-3">
           <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-600'}`} />
           <span className={`text-xs font-mono ${isPositive ? 'text-green-400' : 'text-zinc-400'}`}>
            {subValue}
          </span>
        </div>
      )}
    </div>
  </div>
);

interface CalculatorResultsProps {
  metrics: MetricProps[];
  ctaText?: string;
  serviceContext?: string;
  children?: React.ReactNode;
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({
  metrics,
  ctaText = "Get Your Custom Strategy",
  serviceContext = "",
  children,
}) => {
  const { openContactDialog } = useContactDialog();

  return (
    <div className="h-full flex flex-col justify-between pl-0 lg:pl-8 border-l-0 lg:border-l border-zinc-200/50">
      <div className="flex-1">
        {/* Dashboard Header */}
        <div className="mb-8 flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Analysis_Results
          </h4>
          <div className="h-px flex-1 bg-zinc-200 mx-4 opacity-50" />
          <div className="flex gap-1">
              <div className="w-1 h-1 bg-zinc-300 rounded-full" />
              <div className="w-1 h-1 bg-zinc-300 rounded-full" />
              <div className="w-1 h-1 bg-zinc-300 rounded-full" />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Metric {...metric} />
            </motion.div>
          ))}
        </div>

        {children && (
          <div className="py-4 border-t border-dashed border-zinc-200 mb-8">
            {children}
          </div>
        )}
      </div>

      {/* Integrated CTA Card */}
      <div className="bg-zinc-900 border border-zinc-800 p-8 relative overflow-hidden text-center group rounded-xl shadow-xl mt-8">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5722] to-[#E91E63]" />
        
        <div className="relative z-10">
          <h4 className="text-xl font-bold uppercase font-oswald text-white mb-2">
            Ready to scale?
          </h4>
          <p className="text-zinc-400 text-xs mb-6 max-w-xs mx-auto font-mono">
            Turn these projections into reality.
          </p>
          <Button 
            onClick={openContactDialog}
            className="w-full"
            showFlame
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorResults;
