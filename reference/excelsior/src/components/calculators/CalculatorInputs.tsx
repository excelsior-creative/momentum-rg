"use client";

import React from "react";
import { motion } from "framer-motion";

interface InputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  helpText?: string;
}

export const SliderInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "",
  prefix = "",
  helpText,
}) => {
  // Calculate percentage for gradient background of the slider track
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4 group">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono group-hover:text-[#FF5722] transition-colors">
          {label}
        </label>
        <div className="text-right">
          <span className="text-2xl font-bold font-oswald text-zinc-900 tabular-nums">
            {prefix}{value.toLocaleString()}{suffix}
          </span>
        </div>
      </div>
      
      <div className="relative h-6 flex items-center">
        {/* Custom Track Background */}
        <div className="absolute w-full h-2 bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden">
           <div 
             className="h-full bg-gradient-to-r from-[#FF5722] to-[#E91E63]" 
             style={{ width: `${percentage}%` }}
           />
        </div>

        {/* The actual input - invisible but interactive */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Custom Thumb (Visual only) */}
        <div 
          className="absolute h-5 w-5 bg-white border-2 border-[#FF5722] rounded-full shadow-lg pointer-events-none transition-transform group-hover:scale-125 z-0"
          style={{ 
            left: `calc(${percentage}% - 10px)` 
          }}
        >
          <div className="absolute inset-0 m-auto h-2 w-2 bg-[#FF5722] rounded-full" />
        </div>
      </div>

      {helpText && (
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1 border-l-2 border-zinc-200">
          {helpText}
        </p>
      )}
    </div>
  );
};

export const NumberInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix = "",
  prefix = "",
  helpText,
}) => {
  return (
    <div className="space-y-2 group">
      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono group-hover:text-[#FF5722] transition-colors">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono font-bold">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full bg-white border border-zinc-200 p-4 text-zinc-900 outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20 transition-all font-oswald font-bold text-lg ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono font-bold">
            {suffix}
          </span>
        )}
        
        {/* Decorative corner for input */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-300 group-hover:border-[#FF5722] pointer-events-none transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-300 group-hover:border-[#FF5722] pointer-events-none transition-colors" />
      </div>
      {helpText && (
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1 border-l-2 border-zinc-200">
          {helpText}
        </p>
      )}
    </div>
  );
};

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectInputProps {
  label: string;
  value: string | number;
  onChange: (val: any) => void;
  options: SelectOption[];
  helpText?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  helpText,
}) => {
  return (
    <div className="space-y-2 group">
      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono group-hover:text-[#FF5722] transition-colors">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-zinc-200 p-4 text-zinc-900 outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20 transition-all font-oswald font-bold text-lg appearance-none cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF5722]">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M6 9l6 6 6-6" />
           </svg>
        </div>

        {/* Decorative corner for input */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-300 group-hover:border-[#FF5722] pointer-events-none transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-300 group-hover:border-[#FF5722] pointer-events-none transition-colors" />
      </div>
      {helpText && (
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1 border-l-2 border-zinc-200">
          {helpText}
        </p>
      )}
    </div>
  );
};
