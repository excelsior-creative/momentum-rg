"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface AnimateOnViewProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const AnimateOnView: React.FC<AnimateOnViewProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  once = true,
  initial = { opacity: 0, y: 20 },
  whileInView = { opacity: 1, y: 0 },
  ...props
}) => {
  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      transition={{ duration, delay }}
      viewport={{ once }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnView;

