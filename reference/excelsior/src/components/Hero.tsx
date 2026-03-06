"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useContactDialog } from "./ContactDialogProvider";
import GlitchText from "./GlitchText";
import Button from "./ui/Button";

interface HeroSettings {
  headlineTop?: string;
  headlineBottom?: string;
  subheadline?: string;
  videoUrl?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
}

interface HeroProps {
  settings?: HeroSettings;
}

const Hero: React.FC<HeroProps> = ({ settings }) => {
  const { openContactDialog } = useContactDialog();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video facade state
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Ensure video is muted for autoplay on all browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, [loadVideo]);

  // Use CMS settings with fallbacks
  const headlineTop = settings?.headlineTop || "Amplify";
  const headlineBottom = settings?.headlineBottom || "Your Impact";
  const subheadline =
    settings?.subheadline ||
    "We build the technology behind nonprofits changing the world. AI strategy. Custom software. Zero friction.";

  // Default to local self-hosted video
  const videoUrl = settings?.videoUrl || "/hero-video.mp4";
  const primaryCtaText = settings?.primaryCtaText || "Start Your Project";
  const secondaryCtaText = settings?.secondaryCtaText || "Explore Work";

  // Smart loading triggers
  useEffect(() => {
    if (shouldReduceMotion) return;

    // Trigger 1: Viewport Entry
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Trigger 2: Idle Timeout (3s)
    const idleTimeout = setTimeout(() => {
      setLoadVideo(true);
    }, 3000);

    // Trigger 3: requestIdleCallback (if supported)
    let idleId: number;
    if ("requestIdleCallback" in window) {
      idleId = (window as any).requestIdleCallback(() => {
        setLoadVideo(true);
      });
    }

    return () => {
      observer.disconnect();
      clearTimeout(idleTimeout);
      if (idleId) (window as any).cancelIdleCallback(idleId);
    };
  }, [shouldReduceMotion]);

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseEnter={() => !loadVideo && setLoadVideo(true)}
      onTouchStart={() => !loadVideo && setLoadVideo(true)}
      className="h-[calc(100vh-104px)] flex flex-col justify-center items-center relative overflow-hidden pt-20 perspective-1000 text-white"
    >
      {/* Video Background Layer - Optimized native video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Poster image - high priority LCP element */}
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          loading="eager"
          fetchPriority="high"
          quality={75}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        />

        {/* Native Video - only rendered/loaded on trigger */}
        {loadVideo && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              onCanPlayThrough={() => setVideoReady(true)}
              className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover scale-110 contrast-[1.1]"
            >
              {/* Mobile version - portrait optimized */}
              <source
                src="/hero-video-mobile.mp4"
                type="video/mp4"
                media="(max-width: 768px)"
              />

              {/* Desktop version - landscape */}
              <source src={videoUrl} type="video/mp4" />
            </video>
          </motion.div>
        )}
      </div>

      {/* Gradient Overlay Layer */}
      <div
        className="absolute inset-0 z-1"
        style={{
          backgroundColor: "transparent",
          backgroundImage: "linear-gradient(135deg, #F6891F 0%, #f2295b 100%)",
          opacity: 1,
          mixBlendMode: "color",
        }}
      />

      <div className="max-w-7xl w-full px-6 text-center relative z-10" style={{ contain: 'layout' }}>
        <h1 className="text-7xl md:text-[10rem] font-bold uppercase tracking-tighter leading-[0.95] mb-8 text-white relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="transition-transform duration-300 origin-bottom-left text-outline-glow"
            style={{ willChange: 'transform, opacity' }}
          >
            <GlitchText text={headlineTop} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-20 pb-4"
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.div
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ willChange: 'opacity' }}
            >
              <span className="text-gradient px-2">{headlineBottom}</span>
            </motion.div>
          </motion.div>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-xl mx-auto mb-12 text-zinc-100 text-lg font-light tracking-wide text-center drop-shadow-md bg-brand-dark-gray/80 backdrop-blur-md py-6 px-8 rounded-xl"
          style={{ willChange: 'transform, opacity' }}
        >
          {subheadline}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <Button
            variant="secondary"
            as="link"
            href="#work"
            className="hover-trigger"
            aria-label="View our portfolio work"
          >
            {secondaryCtaText}
          </Button>

          <Button
            variant="primary"
            onClick={openContactDialog}
            showFlame
            className="hover-trigger"
            aria-label="Start your project with us"
          >
            {primaryCtaText}
          </Button>
        </motion.div>
      </div>

      <style>{`
        .text-outline-glow {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.15),
                       0 0 20px rgba(255, 255, 255, 0.05);
          color: white;
          transition: text-shadow 0.3s ease;
        }
        .text-outline-glow:hover {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.3),
                       0 0 30px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
};

export default Hero;
