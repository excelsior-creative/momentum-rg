import React from "react";
import { cn } from "@/lib/utils";

const Header = ({
  className,
  title,
  subtitle,
  badge,
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3 my-12 md:my-20 tracking-tight text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-brand font-display">
          {badge}
        </span>
      )}
      {title && (
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground text-center leading-tight">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-center max-w-2xl text-muted-foreground md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
