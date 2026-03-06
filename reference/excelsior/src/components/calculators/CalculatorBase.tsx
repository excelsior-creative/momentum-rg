"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionBadge from "../ui/SectionBadge";

interface CalculatorBaseProps {
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}

const CalculatorBase: React.FC<CalculatorBaseProps> = ({
  title,
  description,
  badge = "Interactive_Tool",
  children,
}) => {
  // We need to separate children into inputs and results if possible, 
  // but since they are passed as a single node in the current implementation,
  // we'll keep the 2-column grid layout within the children structure itself in the individual files,
  // OR we can enforce a structure. 
  
  // However, the plan suggests a split pane layout here. 
  // Given the current usage in individual calculators:
  // <CalculatorBase>
  //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">...</div>
  // </CalculatorBase>
  //
  // The individual calculators are ALREADY using a grid. 
  // We will enhance the WRAPPER to look like a high-tech dashboard container,
  // and the individual files will naturally fall into the columns if we style the container right.
  //
  // BUT, to strictly follow the plan's "Component Structure" example:
  // We should ideally change the API to accept `inputs` and `results` props, 
  // OR just style the container to be the "dashboard" and let the children handle the columns.
  //
  // Let's stick to the existing API to avoid breaking all 8 files immediately,
  // but style the outer container heavily to give that "Dashboard" feel.
  
  return (
    <div className="relative bg-zinc-50 border border-zinc-200 shadow-2xl overflow-hidden group">
      {/* Technical Background Texture - Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Glassmorphism overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-zinc-100/50 backdrop-blur-[2px] pointer-events-none" />

      {/* Decorative corner elements - Tech Style */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#FF5722] z-20" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#FF5722] z-20" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#E91E63] z-20" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#E91E63] z-20" />

      {/* Technical Status Indicators */}
      <div className="absolute top-6 right-8 flex gap-2 z-20">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">System_Active</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/10 rounded-full">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">v.2.0.4</span>
        </div>
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="mb-10 border-b border-zinc-200 pb-8 relative">
           {/* Section Header */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <SectionBadge className="mb-4">{badge}</SectionBadge>
                <h3 className="text-3xl md:text-5xl font-bold uppercase font-oswald text-zinc-900 mb-2">
                  {title}
                </h3>
                <p className="text-zinc-600 max-w-2xl leading-relaxed text-lg font-light">
                  {description}
                </p>
             </div>
             {/* Decor line */}
             <div className="hidden md:block h-px w-24 bg-gradient-to-r from-[#FF5722] to-[#E91E63]" />
           </div>
        </div>

        {/* 
           This children container is where the magic happens.
           The individual calculators (e.g. WebDevCostCalculator) return a 
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">...</div>
           
           We will style this wrapper to reinforce that grid.
        */}
        <div className="calculator-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CalculatorBase;
