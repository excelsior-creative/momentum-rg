"use client";

import React from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = "",
  as: Component = "span",
}) => {
  const Tag = Component as any;
  return (
    <Tag className={`relative inline-block group hover-trigger ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-white/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-[2px] transition-all duration-75 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-white/20 opacity-0 group-hover:opacity-100 group-hover:-translate-x-[2px] transition-all duration-75 delay-75 select-none">
        {text}
      </span>
    </Tag>
  );
};

export default GlitchText;
