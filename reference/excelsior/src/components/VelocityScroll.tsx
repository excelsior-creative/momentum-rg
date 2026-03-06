"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import React, { ReactNode } from "react";

interface VelocityScrollProps {
  children: ReactNode;
  baseVelocity?: number;
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const VelocityScroll: React.FC<VelocityScrollProps> = ({
  children,
  baseVelocity = -0.3,
}) => {
  const baseX = useMotionValue(0);

  /**
   * This is a magic number for how much of the screen the text should span.
   * We repeat the children multiple times to ensure the loop is seamless.
   */
  const x = useTransform(baseX, (v) => `${wrap(-25, -75, v)}%`);

  useAnimationFrame((t, delta) => {
    const moveBy = baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border-y border-white/5 py-8 overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div className="flex whitespace-nowrap flex-nowrap" style={{ x }}>
        <div className="flex gap-12 px-6 items-center shrink-0 min-w-max">
          {children}
        </div>
        <div className="flex gap-12 px-6 items-center shrink-0 min-w-max">
          {children}
        </div>
        <div className="flex gap-12 px-6 items-center shrink-0 min-w-max">
          {children}
        </div>
        <div className="flex gap-12 px-6 items-center shrink-0 min-w-max">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default VelocityScroll;
