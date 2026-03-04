import React from "react";

const stats = [
  { value: "25+", label: "Years of Experience" },
  { value: "500+", label: "Transactions Closed" },
  { value: "3", label: "Counties Served" },
  { value: "5★", label: "Google Reviews" },
];

export const TrustBar = () => {
  return (
    <div className="bg-gold">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand/20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-5 md:py-6 px-4 text-center"
            >
              <span className="font-heading text-2xl md:text-3xl font-semibold text-charcoal">
                {stat.value}
              </span>
              <span className="text-xs font-display uppercase tracking-widest text-charcoal/70 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
