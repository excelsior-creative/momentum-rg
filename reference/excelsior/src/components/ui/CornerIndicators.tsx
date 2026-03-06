"use client";

import React from "react";

type CornerIndicatorsProps = {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  size?: "sm" | "md" | "lg";
  showTopLeft?: boolean;
  showBottomRight?: boolean;
};

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
};

const CornerIndicators: React.FC<CornerIndicatorsProps> = ({
  children,
  className = "",
  borderColor = "border-white/20",
  hoverBorderColor = "group-hover:border-[#FF5722]",
  size = "md",
  showTopLeft = true,
  showBottomRight = true,
}) => {
  const sizeClass = sizeMap[size];

  return (
    <div className={`relative group ${className}`}>
      {showTopLeft && (
        <div
          className={`absolute top-0 left-0 ${sizeClass} border-t-2 border-l-2 ${borderColor} ${hoverBorderColor} transition-colors pointer-events-none z-10`}
        />
      )}
      {showBottomRight && (
        <div
          className={`absolute bottom-0 right-0 ${sizeClass} border-b-2 border-r-2 ${borderColor} ${hoverBorderColor} transition-colors pointer-events-none z-10`}
        />
      )}
      {children}
    </div>
  );
};

export default CornerIndicators;

