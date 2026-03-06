"use client";

import React from "react";

type SectionTheme = "dark" | "light" | "light-alt";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  theme?: SectionTheme;
  id?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
};

const themeStyles: Record<SectionTheme, string> = {
  dark: "bg-zinc-900 text-zinc-100",
  light: "bg-white text-zinc-900",
  "light-alt": "bg-zinc-50 text-zinc-900",
};

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  theme = "dark",
  id,
  fullWidth = false,
  noPadding = false,
}) => {
  return (
    <section
      id={id}
      className={`relative ${noPadding ? "" : "py-24 px-6"} ${themeStyles[theme]} ${className}`}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="max-w-7xl mx-auto">{children}</div>
      )}
    </section>
  );
};

export default Section;

