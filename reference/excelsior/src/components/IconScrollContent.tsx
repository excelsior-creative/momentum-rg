"use client";

import {
  OpenAI,
  Gemini,
  Claude,
  LangChain,
  Vercel,
  Cloudflare,
  Grok,
  Perplexity,
} from "@lobehub/icons";
import React from "react";

const IconWithText = ({
  icon: Icon,
  size = 40,
}: {
  icon: any; // The library types are complex, using any for the component passed
  size?: number;
}) => (
  <div
    className="flex items-center gap-3 shrink-0"
    style={{ whiteSpace: "nowrap" }}
  >
    <Icon size={size} />
    {Icon.Text && <Icon.Text size={size * 0.8} />}
  </div>
);

const IconScrollContent = () => {
  const icons = [
    OpenAI,
    Gemini,
    Claude,
    Grok,
    Perplexity,
    Vercel,
    Cloudflare,
    LangChain,
  ];

  return (
    <div className="flex items-center gap-16">
      {icons.map((Icon, i) => (
        <div
          key={i}
          className="opacity-20 transition-opacity hover:opacity-100 shrink-0"
        >
          <IconWithText icon={Icon} size={40} />
        </div>
      ))}
    </div>
  );
};

export default IconScrollContent;
