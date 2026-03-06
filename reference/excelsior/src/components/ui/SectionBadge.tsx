"use client";

import React from "react";

type SectionBadgeProps = {
  children: React.ReactNode;
  className?: string;
  showDot?: boolean;
};

const SectionBadge: React.FC<SectionBadgeProps> = ({
  children,
  className = "",
  showDot = true,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showDot && (
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </div>
      )}
      <span className="text-[#FF5722] text-sm tracking-widest font-mono uppercase">
        {children}
      </span>
    </div>
  );
};

export default SectionBadge;

