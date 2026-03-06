"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface PerspectiveGridProps {
  scrollProgress: MotionValue<number>;
}

const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({ scrollProgress }) => {
  // Translate the grid based on scroll
  const z = useTransform(scrollProgress, [0, 1], ["0px", "500px"]);
  const opacity = useTransform(scrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-950 pointer-events-none">
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="perspective-container">
          <motion.div 
            style={{ translateZ: z }}
            className="grid-tunnel"
          >
            {/* Create multiple rings of the tunnel */}
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="tunnel-ring"
                style={{
                  transform: `translateZ(${i * -100}px)`,
                  opacity: 1 - i * 0.1
                }}
              />
            ))}
            
            {/* Horizontal lines */}
            <div className="tunnel-lines horizontal top" />
            <div className="tunnel-lines horizontal bottom" />
            {/* Vertical lines */}
            <div className="tunnel-lines vertical left" />
            <div className="tunnel-lines vertical right" />
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        .perspective-container {
          perspective: 1000px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grid-tunnel {
          position: relative;
          width: 800px;
          height: 800px;
          transform-style: preserve-3d;
        }

        .tunnel-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 87, 34, 0.3);
        }

        .tunnel-lines {
          position: absolute;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 87, 34, 0.2) 50%,
            transparent
          );
        }

        .horizontal {
          width: 100%;
          height: 1px;
          left: 0;
        }

        .vertical {
          width: 1px;
          height: 100%;
          top: 0;
        }

        .top { top: 0; transform: rotateX(90deg) translateY(-400px); }
        .bottom { bottom: 0; transform: rotateX(90deg) translateY(400px); }
        .left { left: 0; transform: rotateY(90deg) translateX(-400px); }
        .right { right: 0; transform: rotateY(90deg) translateX(400px); }

        /* Add more detailed grid pattern */
        .horizontal::after, .vertical::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(255, 87, 34, 0.1) 1px, transparent 1px);
          background-size: 40px 100%;
        }
        .vertical::after {
          background-image: linear-gradient(to bottom, rgba(255, 87, 34, 0.1) 1px, transparent 1px);
          background-size: 100% 40px;
        }
      `}</style>
    </div>
  );
};

export default PerspectiveGrid;

