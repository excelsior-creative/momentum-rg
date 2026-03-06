'use client'

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const defaultSteps = [
  { num: '01', title: 'Discovery', desc: 'We survey the landscape—learning your business, goals, and audience to chart the path forward.' },
  { num: '02', title: 'Design', desc: 'Bold wireframes and prototypes refined until every detail commands attention.' },
  { num: '03', title: 'Development', desc: 'Clean, powerful code built with modern frameworks. No shortcuts, no compromises.' },
  { num: '04', title: 'Testing', desc: 'Rigorous QA and performance testing to ensure everything runs flawlessly across all devices.' },
  { num: '05', title: 'Launch', desc: 'We lead you to launch and beyond—ongoing support to help you rise above the competition.' },
];

interface ProcessSettings {
  sectionBadge?: string;
  headline?: string;
  ctaText?: string;
  ctaLink?: string;
  steps?: Array<{ num: string; title: string; desc: string }>;
}

interface ProcessProps {
  settings?: ProcessSettings;
}

const Process: React.FC<ProcessProps> = ({ settings }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Use CMS settings with fallbacks
  const sectionBadge = settings?.sectionBadge || "FROM_VISION_TO_VICTORY";
  const headline = settings?.headline || "The Process";
  const ctaText = settings?.ctaText || "Learn More About Our Process";
  const ctaLink = settings?.ctaLink || "/process";
  const steps = settings?.steps || defaultSteps;

  return (
    <section ref={sectionRef} id="process" className="py-40 bg-zinc-50 relative overflow-hidden text-black">
      {/* Background Matrix-like rain subtle effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 87, 34, .3) 25%, rgba(255, 87, 34, .3) 26%, transparent 27%, transparent 74%, rgba(255, 87, 34, .3) 75%, rgba(255, 87, 34, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 87, 34, .3) 25%, rgba(255, 87, 34, .3) 26%, transparent 27%, transparent 74%, rgba(255, 87, 34, .3) 75%, rgba(255, 87, 34, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-[12rem] font-bold uppercase text-black/[0.02] absolute -top-20 left-0 select-none pointer-events-none leading-none">Process</div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative z-10 mb-24 flex items-end gap-4"
        >
          <div>
             <div className="flex items-center gap-2 mb-2">
               <div className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </div>
               <div className="text-[#FF5722] text-sm tracking-widest font-mono uppercase">
                 {sectionBadge}
               </div>
             </div>
             <h2 className="text-4xl font-bold uppercase text-black">{headline}</h2>
          </div>
          <div className="h-1 flex-grow bg-black/10 relative overflow-hidden rounded-full">
             <motion.div 
               className="h-full bg-[#FF5722] rounded-full origin-left"
               style={{ scaleX }}
             />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative pt-12 border-t border-black/10 hover:border-[#FF5722] transition-colors duration-500 p-6 hover:bg-black/5"
            >
               {/* Animated Connecting Line */}
               <div className="absolute top-[-1px] left-0 w-0 h-[1px] bg-[#FF5722] group-hover:w-full transition-all duration-500"></div>
               
               <span className="absolute -top-3 left-6 bg-zinc-50 px-2 text-[#FF5722] font-mono text-xs group-hover:text-black transition-colors border border-black/10 group-hover:border-[#FF5722]">{step.num}</span>
               
               {/* Orb Animation */}
               <div className="relative w-12 h-12 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 border border-[#FF5722]/30 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-[#FF5722]"></div>
                  <div className="absolute inset-2 border border-dashed border-[#FF5722]/50 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
                  <div className="w-2 h-2 bg-black rounded-full group-hover:bg-[#FF5722] group-hover:shadow-[0_0_10px_#FF5722] transition-colors"></div>
               </div>
               
               <h3 className="text-2xl font-bold uppercase mb-4 group-hover:translate-x-2 transition-transform duration-300 font-oswald text-black">{step.title}</h3>
               <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-black transition-colors border-l border-black/5 pl-4 group-hover:border-[#FF5722]/50">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button as="link" href={ctaLink} variant="secondary" className="bg-black hover:bg-[#FF5722] hover:scale-105 shadow-xl">
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
