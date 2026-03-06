"use client";

import React from "react";

const GradientMesh: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
      {/* Base layer */}
      <div className="absolute inset-0 bg-zinc-950" />
      
      {/* Animated blobs */}
      <div className="absolute inset-0 opacity-40">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')]" />

      <style jsx>{`
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          mix-blend-mode: screen;
          animation: move 20s infinite alternate;
        }

        .blob-1 {
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(255, 87, 34, 0.3) 0%, transparent 70%);
          top: -10%;
          left: -10%;
          animation-duration: 25s;
        }

        .blob-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(242, 41, 91, 0.2) 0%, transparent 70%);
          bottom: 10%;
          right: -5%;
          animation-duration: 30s;
          animation-delay: -5s;
        }

        .blob-3 {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(246, 137, 31, 0.15) 0%, transparent 70%);
          top: 40%;
          left: 30%;
          animation-duration: 35s;
          animation-delay: -10s;
        }

        @keyframes move {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(10%, 15%) scale(1.1);
          }
          66% {
            transform: translate(-15%, 5%) scale(0.9);
          }
          100% {
            transform: translate(5%, -10%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default GradientMesh;

