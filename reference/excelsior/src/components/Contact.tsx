"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { useContactDialog } from "./ContactDialogProvider";
import PerspectiveGrid from "./PerspectiveGrid";
import Button from "./ui/Button";

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { openContactDialog } = useContactDialog();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="min-h-screen bg-zinc-900 relative flex items-center justify-center overflow-hidden py-20 text-white"
    >
      {/* CSS Perspective Grid Tunnel */}
      <PerspectiveGrid scrollProgress={scrollYProgress} />

      <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-900 pointer-events-none z-10"></div>

      {/* Floating Geometry */}
      <motion.div
        style={{ y, rotate }}
        className="absolute right-[10%] top-[20%] w-64 h-64 border border-[#FF5722]/20 rounded-full blur-sm z-0"
      ></motion.div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <div className="text-[#FF5722] text-sm tracking-widest font-mono uppercase">
            JOIN_THE_PRIDE
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-7xl md:text-[9rem] font-bold uppercase mb-8 leading-[0.95] text-white tracking-tighter overflow-visible"
        >
          Ready To
          <br />
          <span className="relative inline-block pb-4">
            <span className="absolute inset-0 text-gradient filter blur-lg opacity-20">
              Start?
            </span>
            <span className="text-gradient relative z-10">Start?</span>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-zinc-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Ready to lead your market? Let's talk about how we can bring your
          vision to life and help your brand roar online.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Button onClick={openContactDialog} showFlame>
            Let's Cook
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-mono text-zinc-500 border-t border-white/10 pt-8"
        >
          <div className="hover:text-[#FF5722] transition-colors cursor-help">
            <span className="block text-xs uppercase tracking-widest text-white/20 mb-1">
              Location
            </span>
            Orange County, CA
          </div>
          <a
            href="mailto:support@excelsiorcreative.com"
            className="hover:text-[#FF5722] transition-colors cursor-pointer block"
          >
            <span className="block text-xs uppercase tracking-widest text-white/20 mb-1">
              Support
            </span>
            support@excelsiorcreative.com
          </a>
          <a
            href="mailto:hello@excelsiorcreative.com"
            className="hover:text-[#FF5722] transition-colors cursor-pointer block"
          >
            <span className="block text-xs uppercase tracking-widest text-white/20 mb-1">
              Email
            </span>
            hello@excelsiorcreative.com
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
