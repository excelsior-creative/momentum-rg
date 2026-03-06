"use client";

import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const ScrambleText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2; // Speed of decode
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

interface ManifestoSettings {
  headline?: string;
  headlineAccent?: string;
  location?: string;
  description?: string;
  promiseTitle?: string;
  promiseDescription?: string;
  stats?: {
    yearsExperience?: string;
    projectsDelivered?: string;
  };
}

interface ManifestoProps {
  settings?: ManifestoSettings;
}

const Manifesto: React.FC<ManifestoProps> = ({ settings }) => {
  // Use CMS settings with fallbacks
  const headline = settings?.headline || "We Don't Just Build Websites.";
  const headlineAccent = settings?.headlineAccent || "solutions.";
  const location = settings?.location || "BASED IN ORANGE COUNTY, CA";
  const description =
    settings?.description ||
    "In a crowded digital landscape, standing out isn't optional—it's survival. Like the lion, we lead from the front. Our philosophy is simple: Beautiful design. Bulletproof code. Real results. We combine strategic vision with technical excellence to build digital experiences that don't just look good—they dominate.";
  const promiseTitle = settings?.promiseTitle || "The Pride's Promise";
  const promiseDescription =
    settings?.promiseDescription ||
    "Every pixel intentional. Every line of code optimized. Every project delivered with the pride and precision you deserve.";
  const yearsExperience = settings?.stats?.yearsExperience || "10+";
  const projectsDelivered = settings?.stats?.projectsDelivered || "150+";

  return (
    <section
      id="about"
      className="py-32 bg-zinc-50 text-zinc-900 relative overflow-hidden border-y border-black/5"
    >
      {/* Scanline Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Horizontal Scanlines Background */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            backgroundSize: "100% 4px",
          }}
        />
        {/* Animated Scan Line - uses transform for GPU acceleration */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF5722]/40 to-transparent animate-scan-down will-change-transform" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <style>{`
        @keyframes scan-down {
          0% { transform: translateY(-2px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(calc(100vh)); opacity: 0; }
        }
        .animate-scan-down {
          animation: scan-down 4s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-10 top-0 w-1 h-full bg-gradient-to-b from-[#FF5722] to-transparent opacity-50 hidden lg:block"></div>

            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <div className="text-[#FF5722] text-sm tracking-widest font-mono uppercase">
                ABOUT_US
              </div>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold uppercase leading-[1.1] mb-8">
              {headline} <br />
              We provide
              <span className="text-gradient">{headlineAccent}</span>
            </h2>

            <div className="p-6 border border-black/10 bg-white/50 backdrop-blur-sm relative">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-black"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-black"></div>

              <p className="font-mono text-xs text-[#FF5722] mb-2">
                {location}
              </p>
              <p className="text-lg text-zinc-600 font-light leading-relaxed">
                {description.split("Beautiful design.")[0]}
                <strong className="text-black">
                  Beautiful design. Bulletproof code. Real results.
                </strong>{" "}
                {description.split("Real results.")[1] ||
                  "We combine strategic vision with technical excellence to build digital experiences that don't just look good—they dominate."}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 relative"
          >
            {/* Large background number */}
            <span className="absolute -top-20 -right-20 text-[20rem] font-bold text-black/[0.02] font-oswald select-none pointer-events-none">
              01
            </span>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="border border-black/10 p-8 hover:bg-black hover:text-white transition-all duration-300 group cursor-crosshair relative overflow-hidden bg-white"
              >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div className="text-5xl font-bold font-oswald mb-2">
                  {yearsExperience}
                </div>
                <div className="text-xs uppercase tracking-widest font-mono text-zinc-500 group-hover:text-zinc-400">
                  Years Experience
                </div>
                <div className="h-1 w-full bg-zinc-200 mt-4 overflow-hidden">
                  <div className="h-full bg-[#FF5722] w-full"></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="border border-black/10 p-8 hover:bg-[#FF5722] hover:text-white transition-all duration-300 group cursor-crosshair relative overflow-hidden bg-white"
              >
                <div className="text-5xl font-bold font-oswald mb-2">
                  {projectsDelivered}
                </div>
                <div className="text-xs uppercase tracking-widest font-mono text-zinc-500 group-hover:text-white/80">
                  Projects Delivered
                </div>
                <div className="h-1 w-full bg-zinc-200 mt-4 overflow-hidden">
                  <div className="h-full bg-black w-full"></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="col-span-2 border border-black/10 p-8 hover:border-pink-500 transition-colors relative bg-white"
              >
                <h3 className="font-bold uppercase mb-2 text-xl">
                  {promiseTitle}
                </h3>
                <p className="text-sm text-zinc-500">{promiseDescription}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
