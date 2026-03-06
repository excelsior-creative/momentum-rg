"use client";

import { ServiceData, services, iconMap } from "@/data/services";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

interface ServiceCardProps {
  service: ServiceData;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 20 });

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * 32.5;
    const mouseY = (e.clientY - rect.top) * 32.5;

    const rX = (mouseY / height - 32.5 / 2) * -1;
    const rY = mouseX / width - 32.5 / 2;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = iconMap[service.icon];
  if (!Icon) return null;

  return (
    <Link href={`/services/${service.slug}`} className="block">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transform,
        }}
        className="group relative h-[400px] w-full bg-zinc-900 border border-white/10 p-6 flex flex-col overflow-visible transition-all duration-300 hover:z-20 shadow-lg hover:shadow-2xl"
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 group-hover:border-[#FF5722] transition-colors duration-300 z-30"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 group-hover:border-[#FF5722] transition-colors duration-300 z-30"></div>

        {/* Scanning Line Effect */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FF5722] shadow-[0_0_20px_#FF5722] opacity-0 group-hover:opacity-100 group-hover:animate-scan z-30 pointer-events-none"></div>

        {/* Holographic Background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(transparent 50%, rgba(255, 255, 255, 0.1) 50%),
              linear-gradient(90deg, rgba(255, 87, 34, 0.1), rgba(255, 255, 255, 0))
            `,
            backgroundSize: "100% 4px, 100% 100%",
          }}
        />

        <div
          style={{ transform: "translateZ(50px)" }}
          className="relative z-10"
        >
          <div className="p-3 w-fit rounded-none border border-white/10 mb-4 bg-zinc-800 group-hover:bg-[#FF5722] group-hover:text-white text-white transition-colors duration-300">
            <Icon className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold uppercase font-oswald mb-4 text-white group-hover:text-[#FF5722] transition-colors">
            {service.title}
          </h3>
        </div>

        <div
          style={{ transform: "translateZ(30px)" }}
          className="relative z-10 flex-1 flex flex-col"
        >
          <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-200 transition-colors">
            {service.shortDescription}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs font-mono text-[#FF5722] opacity-0 group-hover:opacity-100 transition-opacity">
              SYS.ID.{service.id.toUpperCase()}
            </span>
            <span className="group-hover:translate-x-2 transition-transform text-[#FF5722]">
              <ArrowRight className="w-6 h-6" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default function Services() {
  return (
    <section id="services" className="py-40 bg-brand-dark-gray relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#FF5722] rounded-full animate-pulse"></div>
            <div className="text-[#FF5722] text-sm tracking-widest font-mono uppercase">
              CORE_CAPABILITIES
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold uppercase text-white font-oswald leading-[0.9]">
            What <br />
            <span className="text-gradient">We Do</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
