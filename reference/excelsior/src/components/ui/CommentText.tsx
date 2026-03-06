"use client";

import React from "react";

type CommentTextProps = {
  lines: string[];
  className?: string;
  variant?: "light" | "dark";
};

const CommentText: React.FC<CommentTextProps> = ({
  lines,
  className = "",
  variant = "light",
}) => {
  const textColor = variant === "dark" ? "text-[#FF5722]" : "text-zinc-500";

  return (
    <p
      className={`font-mono text-xs ${textColor} border-l border-white/20 pl-4 ${className}`}
    >
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          // {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );
};

export default CommentText;

