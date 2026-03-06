"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bug,
  Clock,
  Eye,
  Gauge,
  Lightbulb,
  Play,
  RotateCcw,
  Shield,
  TrendingUp,
  Users,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useContactDialog } from "./ContactDialogProvider";
import Button from "./ui/Button";

type GameState = "idle" | "playing" | "gameover";

// Web dev themed power-ups (good for websites)
type PowerUpType = "ssl" | "speed" | "seo" | "uptime" | "a11y";

type PowerUp = {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
};

// Web dev themed obstacles (bad for websites)
type ObstacleType = "bug" | "error404" | "slowLoad" | "downtime" | "cors";

type Obstacle = {
  id: number;
  x: number;
  y: number;
  type: ObstacleType;
};

// Small Rocket SVG for the game
const GameRocket = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="60"
    viewBox="0 0 40 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 2 L30 20 L30 45 L20 50 L10 45 L10 20 Z"
      fill="url(#miniRocketGrad)"
      stroke="#FF5722"
      strokeWidth="1.5"
    />
    <path d="M20 2 L27 15 L13 15 Z" fill="#FF5722" />
    <circle
      cx="20"
      cy="25"
      r="5"
      fill="#1a1a1a"
      stroke="#87CEEB"
      strokeWidth="1.5"
    />
    <circle cx="20" cy="25" r="2.5" fill="#87CEEB" opacity="0.5" />
    <path d="M10 35 L3 48 L10 43 Z" fill="#E91E63" />
    <path d="M30 35 L37 48 L30 43 Z" fill="#E91E63" />
    <rect x="14" y="47" width="12" height="4" fill="#2a2a2a" rx="1" />
    <g className="animate-exhaust-flicker origin-top">
      <path d="M16 51 L20 62 L24 51" fill="url(#miniFlameGrad)" opacity="0.9" />
      <path d="M17 51 L20 58 L23 51" fill="#FFD54F" opacity="0.8" />
    </g>
    <defs>
      <linearGradient
        id="miniRocketGrad"
        x1="10"
        y1="2"
        x2="30"
        y2="50"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#FF5722" />
        <stop offset="100%" stopColor="#E91E63" />
      </linearGradient>
      <linearGradient
        id="miniFlameGrad"
        x1="20"
        y1="51"
        x2="20"
        y2="62"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#FF5722" />
        <stop offset="100%" stopColor="#FFD54F" />
      </linearGradient>
    </defs>
  </svg>
);

// Earth SVG
const Earth = () => (
  <div className="relative">
    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.5)] relative overflow-hidden">
      {/* Continents */}
      <div className="absolute top-4 left-6 w-8 h-6 bg-green-500/70 rounded-full blur-[2px]" />
      <div className="absolute top-8 right-4 w-10 h-8 bg-green-500/70 rounded-full blur-[2px]" />
      <div className="absolute bottom-6 left-8 w-12 h-6 bg-green-500/70 rounded-full blur-[2px]" />
      <div className="absolute bottom-4 right-6 w-6 h-4 bg-green-500/70 rounded-full blur-[2px]" />
      {/* Atmosphere glow */}
      <div className="absolute inset-0 rounded-full border-4 border-blue-300/30" />
      <div className="absolute inset-[-4px] rounded-full border border-blue-200/20" />
    </div>
    {/* Shadow */}
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/30 rounded-full blur-md" />
  </div>
);

// Power-up component with gradient circle and Lucide icon (web dev benefits)
const PowerUpIcon = ({ type }: { type: PowerUpType }) => {
  const iconMap = {
    ssl: Shield, // SSL Certificate
    speed: Gauge, // Fast Load Time
    seo: TrendingUp, // SEO Boost
    uptime: Activity, // 99.9% Uptime
    a11y: Eye, // Accessibility
  };
  const Icon = iconMap[type];

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* Gradient circle background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF5722] to-[#E91E63] shadow-[0_0_12px_rgba(255,87,34,0.6)]" />
      {/* Glow effect */}
      <div className="absolute inset-[-2px] rounded-full bg-gradient-to-br from-[#FF5722]/30 to-[#E91E63]/30 blur-sm" />
      {/* Icon */}
      <Icon className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
    </div>
  );
};

// Harmful item component (web dev issues)
const HarmfulIcon = ({ type }: { type: ObstacleType }) => {
  const iconMap = {
    bug: Bug, // Code Bug
    error404: AlertTriangle, // 404 Error
    slowLoad: Clock, // Slow Loading
    downtime: WifiOff, // Server Downtime
    cors: XCircle, // CORS Error
  };
  const Icon = iconMap[type];

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* Red/warning gradient background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
      {/* Glow effect */}
      <div className="absolute inset-[-2px] rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 blur-sm" />
      {/* Icon */}
      <Icon className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
    </div>
  );
};

// Feature Item Component
const FeatureItem = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex gap-4 items-start group"
  >
    <div className="w-12 h-12 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Game Area Component
const GameArea = ({
  onGameOver,
  onOpenContact,
}: {
  onGameOver: () => void;
  onOpenContact: () => void;
}) => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [rocketX, setRocketX] = useState(50);
  const [score, setScore] = useState(0);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastSpawnRef = useRef<number>(0);
  const touchStartRef = useRef<number | null>(null);

  const GAME_SIZE = 560; // Square canvas
  const ROCKET_WIDTH = 40; // Visual width
  const ROCKET_HEIGHT = 60; // Visual height
  const ROCKET_Y = 70; // Distance from bottom

  // Hitbox dimensions (smaller than visual for forgiving collisions)
  const HITBOX_WIDTH = 26; // Narrower than visual - ignores fins
  const HITBOX_HEIGHT = 35; // Just the body, not nose/flames
  const HITBOX_Y_OFFSET = 10; // Offset from bottom to skip exhaust

  // Spawn power-ups and obstacles
  const spawnItems = useCallback((timestamp: number) => {
    if (timestamp - lastSpawnRef.current > 1200) {
      lastSpawnRef.current = timestamp;

      // Spawn power-up (60% chance) - web dev benefits
      if (Math.random() < 0.6) {
        const types: PowerUpType[] = ["ssl", "speed", "seo", "uptime", "a11y"];
        setPowerUps((prev) => [
          ...prev,
          {
            id: timestamp,
            x: Math.random() * (GAME_SIZE - 60) + 30,
            y: -30,
            type: types[Math.floor(Math.random() * types.length)],
          },
        ]);
      }

      // Spawn obstacle (40% chance) - web dev issues
      if (Math.random() < 0.4) {
        const types: ObstacleType[] = [
          "bug",
          "error404",
          "slowLoad",
          "downtime",
          "cors",
        ];
        setObstacles((prev) => [
          ...prev,
          {
            id: timestamp + 1,
            x: Math.random() * (GAME_SIZE - 60) + 30,
            y: -30,
            type: types[Math.floor(Math.random() * types.length)],
          },
        ]);
      }
    }
  }, []);

  // Check collisions using smaller hitbox for forgiving gameplay
  const checkCollisions = useCallback(() => {
    // Use smaller hitbox dimensions for collision (more forgiving)
    const rocketCenterX = (rocketX / 100) * GAME_SIZE;
    const rocketLeft = rocketCenterX - HITBOX_WIDTH / 2;
    const rocketRight = rocketCenterX + HITBOX_WIDTH / 2;
    // Position hitbox in the body area (offset from bottom, shorter height)
    const rocketBottom = GAME_SIZE - ROCKET_Y - HITBOX_Y_OFFSET;
    const rocketTop = rocketBottom - HITBOX_HEIGHT;

    // Check power-up collisions (use larger hitbox for pickups - feels good)
    const pickupLeft = rocketCenterX - ROCKET_WIDTH / 2;
    const pickupRight = rocketCenterX + ROCKET_WIDTH / 2;
    const pickupTop = GAME_SIZE - ROCKET_Y - ROCKET_HEIGHT;
    const pickupBottom = GAME_SIZE - ROCKET_Y;

    setPowerUps((prev) => {
      const remaining: PowerUp[] = [];
      prev.forEach((p) => {
        const pLeft = p.x - 20;
        const pRight = p.x + 20;
        const pTop = p.y - 20;
        const pBottom = p.y + 20;

        if (
          pickupLeft < pRight &&
          pickupRight > pLeft &&
          pickupTop < pBottom &&
          pickupBottom > pTop
        ) {
          // Score based on web dev power-up type
          const scoreMap: Record<PowerUpType, number> = {
            ssl: 5,
            speed: 10,
            seo: 15,
            uptime: 10,
            a11y: 10,
          };
          setScore((s) => s + scoreMap[p.type]);
        } else if (p.y < GAME_SIZE + 30) {
          remaining.push(p);
        }
      });
      return remaining;
    });

    // Check obstacle collisions (use smaller hitbox - forgiving)
    for (const o of obstacles) {
      const oLeft = o.x - 20;
      const oRight = o.x + 20;
      const oTop = o.y - 20;
      const oBottom = o.y + 20;

      if (
        rocketLeft < oRight &&
        rocketRight > oLeft &&
        rocketTop < oBottom &&
        rocketBottom > oTop
      ) {
        return true; // Collision!
      }
    }
    return false;
  }, [rocketX, obstacles]);

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gameState !== "playing") return;

      // Move items down
      setPowerUps((prev) =>
        prev
          .map((p) => ({ ...p, y: p.y + 2.5 }))
          .filter((p) => p.y < GAME_SIZE + 30)
      );
      setObstacles((prev) =>
        prev
          .map((o) => ({ ...o, y: o.y + 3.5 }))
          .filter((o) => o.y < GAME_SIZE + 30)
      );

      // Spawn new items
      spawnItems(timestamp);

      // Check collisions
      if (checkCollisions()) {
        setGameState("gameover");
        onGameOver();
        return;
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState, spawnItems, checkCollisions, onGameOver]
  );

  // Start game loop
  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, gameLoop]);

  // Keyboard controls with held key support for smooth movement
  const keysPressed = useRef<Set<string>>(new Set());
  const velocityRef = useRef(0);

  // Movement physics constants
  const ACCELERATION = 0.35; // How fast we speed up
  const MAX_VELOCITY = 3.5; // Top speed
  const FRICTION = 0.92; // Deceleration when no keys pressed (0-1, lower = more friction)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      keysPressed.current.add(e.key.toLowerCase());
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Smooth movement with acceleration physics
  useEffect(() => {
    if (gameState !== "playing") {
      velocityRef.current = 0;
      return;
    }

    const moveInterval = setInterval(() => {
      const keys = keysPressed.current;
      const movingLeft = keys.has("arrowleft") || keys.has("a");
      const movingRight = keys.has("arrowright") || keys.has("d");

      // Apply acceleration based on input
      if (movingLeft && !movingRight) {
        velocityRef.current -= ACCELERATION;
      } else if (movingRight && !movingLeft) {
        velocityRef.current += ACCELERATION;
      } else {
        // Apply friction when no input
        velocityRef.current *= FRICTION;

        // Stop completely if velocity is very small
        if (Math.abs(velocityRef.current) < 0.05) {
          velocityRef.current = 0;
        }
      }

      // Clamp velocity to max speed
      velocityRef.current = Math.max(
        -MAX_VELOCITY,
        Math.min(MAX_VELOCITY, velocityRef.current)
      );

      // Apply velocity to position
      if (velocityRef.current !== 0) {
        setRocketX((prev) => {
          const newX = prev + velocityRef.current;
          // Bounce slightly off walls
          if (newX <= 12) {
            velocityRef.current *= -0.3;
            return 12;
          }
          if (newX >= 88) {
            velocityRef.current *= -0.3;
            return 88;
          }
          return newX;
        });
      }
    }, 16); // ~60fps

    return () => clearInterval(moveInterval);
  }, [gameState]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (
      gameState !== "playing" ||
      touchStartRef.current === null ||
      !gameRef.current
    )
      return;
    const touchX = e.touches[0].clientX;
    const rect = gameRef.current.getBoundingClientRect();
    const relativeX = ((touchX - rect.left) / rect.width) * 100;
    setRocketX(Math.max(12, Math.min(88, relativeX)));
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setRocketX(50);
    setPowerUps([]);
    setObstacles([]);
    lastSpawnRef.current = 0;
  };

  const resetGame = () => {
    setGameState("idle");
    setScore(0);
    setRocketX(50);
    setPowerUps([]);
    setObstacles([]);
  };

  const handleContactClick = () => {
    onOpenContact();
  };

  // Generate stable star positions
  const stars = useRef(
    [...Array(20)].map((_, i) => ({
      left: (i * 17 + 7) % 100,
      initialTop: (i * 23 + 11) % 100,
      opacity: 0.2 + (i % 5) * 0.15,
      size: i % 3 === 0 ? 2 : 1,
      speed: 4 + (i % 3) * 1.5, // seconds for animation
    }))
  );

  return (
    <div
      ref={gameRef}
      className="relative w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden border border-white/10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Starfield background - smoother, fewer stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.current.map((star, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white ${
              gameState === "playing" ? "animate-star-drift" : ""
            }`}
            style={{
              left: `${star.left}%`,
              top: `${star.initialTop}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDuration: `${star.speed}s`,
              animationDelay: `${(i * 0.3) % star.speed}s`,
            }}
          />
        ))}
      </div>

      {/* Score */}
      {gameState !== "idle" && (
        <div className="absolute top-4 left-4 z-30 font-mono text-white">
          <div className="text-xs text-[#FF5722] uppercase tracking-widest">
            Score
          </div>
          <div className="text-2xl font-bold">{score}</div>
        </div>
      )}

      {/* Power-ups */}
      {powerUps.map((p) => (
        <div
          key={p.id}
          className="absolute z-20"
          style={{ left: p.x - 20, top: p.y - 20 }}
        >
          <PowerUpIcon type={p.type} />
        </div>
      ))}

      {/* Obstacles - Web dev issues */}
      {obstacles.map((o) => (
        <div
          key={o.id}
          className="absolute z-20"
          style={{ left: o.x - 20, top: o.y - 20 }}
        >
          <HarmfulIcon type={o.type} />
        </div>
      ))}

      {/* Idle State */}
      {gameState === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 z-20">
          <div className="mb-4 animate-bounce">
            <GameRocket />
          </div>
          <Earth />
          <button
            onClick={startGame}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#FF5722] to-[#E91E63] rounded-full text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,87,34,0.5)] transition-all hover:scale-105"
          >
            <Play className="w-4 h-4" />
            Launch
          </button>
          <p className="mt-3 text-zinc-300 text-xs font-mono">
            Use ← → or A/D keys • Swipe on mobile
          </p>
        </div>
      )}

      {/* Playing State - Rocket */}
      {gameState === "playing" && (
        <div
          className="absolute z-20"
          style={{
            left: `${rocketX}%`,
            bottom: ROCKET_Y,
            transform: "translateX(-50%)",
          }}
        >
          <GameRocket />
        </div>
      )}

      {/* Game Over State */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6">
          <div className="text-4xl mb-2">💥</div>
          <h3 className="text-xl font-bold text-white mb-2">Mission Failed!</h3>
          <p className="text-zinc-400 text-sm text-center mb-2">
            Final Score:{" "}
            <span className="text-[#FF5722] font-bold">{score}</span>
          </p>
          <p className="text-zinc-300 text-sm text-center mb-6 leading-relaxed">
            Work with us and we'll help you go{" "}
            <span className="text-[#FF5722] font-bold">ever upward</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={resetGame}
              className="px-4 py-2 border border-white/20 rounded-full text-white text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </button>
            <button
              onClick={handleContactClick}
              className="px-4 py-2 bg-gradient-to-r from-[#FF5722] to-[#E91E63] rounded-full text-white text-sm font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(255,87,34,0.5)] transition-all flex items-center gap-2"
            >
              Let's Talk
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Game area border glow */}
      <div className="absolute inset-0 border border-[#FF5722]/20 rounded-xl pointer-events-none" />

      <style>{`
        @keyframes star-drift {
          0% { transform: translateY(0); opacity: var(--tw-opacity, 0.3); }
          100% { transform: translateY(560px); opacity: var(--tw-opacity, 0.3); }
        }
        .animate-star-drift {
          animation: star-drift linear infinite;
        }
        @keyframes exhaust-flicker {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.7; transform: scaleY(1.2); }
        }
        .animate-exhaust-flicker {
          animation: exhaust-flicker 0.1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Main Launchpad Component
const Launchpad: React.FC = () => {
  const [showGameOverEffect, setShowGameOverEffect] = useState(false);
  const { openContactDialog } = useContactDialog();

  const handleGameOver = () => {
    setShowGameOverEffect(true);
    setTimeout(() => setShowGameOverEffect(false), 500);
  };

  return (
    <section
      id="launchpad"
      className={`min-h-screen bg-zinc-900 relative overflow-hidden py-20 transition-all duration-200 ${
        showGameOverEffect ? "bg-red-900/20" : ""
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-900 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-900 to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center min-h-[80vh]">
          {/* Left Content Panel */}
          <div className="flex-1 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <h2 className="text-[#FF5722] text-sm tracking-widest font-mono uppercase">
                  LAUNCHPAD_PROGRAM
                </h2>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold uppercase mb-6 text-white leading-[0.95]">
                From Idea
                <br />
                <span className="text-gradient">To Orbit</span>
              </h2>

              <p className="text-zinc-400 text-lg mb-10 border-l-2 border-[#FF5722]/30 pl-4 leading-relaxed">
                We don't just build brands—we launch them. Our Launchpad program
                partners with visionary entrepreneurs to incubate, develop, and
                propel innovative business ideas into thriving market leaders.
              </p>
            </motion.div>

            {/* Features */}
            <div className="space-y-6 mb-10">
              <FeatureItem
                icon={Lightbulb}
                title="Incubate"
                description="We nurture raw ideas, providing strategic guidance and creative direction to shape your vision."
                delay={0.1}
              />
              <FeatureItem
                icon={Users}
                title="Partner"
                description="Collaborate with our team of experts who invest time, resources, and expertise into your success."
                delay={0.2}
              />
              <FeatureItem
                icon={Zap}
                title="Launch"
                description="Execute with precision—from brand identity to digital presence, we handle the complete liftoff."
                delay={0.3}
              />
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button as="link" href="/launchpad" aria-label="Learn more about our Launchpad program">
                <span>Launchpad Details</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>

          {/* Right Game Panel */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/10 to-[#E91E63]/10 rounded-full blur-3xl scale-75 -z-10" />

              {/* Game Container */}
              <GameArea
                onGameOver={handleGameOver}
                onOpenContact={openContactDialog}
              />

              {/* Corner Decorations */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#FF5722]" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#E91E63]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Launchpad;
