"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Loader2, Check, X, Sparkles } from "lucide-react";

type User = {
  id: number;
  email: string;
  name?: string;
  role: string;
};

type GenerationStatus = "idle" | "generating" | "success" | "error";

type AdminImageGeneratorProps = {
  articleId: number;
  hasExistingImage: boolean;
};

export default function AdminImageGenerator({
  articleId,
  hasExistingImage,
}: AdminImageGeneratorProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleGenerate = async () => {
    if (status === "generating") return;

    setStatus("generating");
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate-article-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setStatus("success");
      setShowToast(true);

      // Refresh the page after a short delay to show the new image
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Generation error:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to generate image"
      );
      setShowToast(true);

      // Reset to idle after showing error
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // Don't render anything if not authenticated or still loading
  if (isLoading || !user) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative group">
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-zinc-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {hasExistingImage ? "Regenerate" : "Generate"} Featured Image
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900" />
          </div>

          {/* Main Button */}
          <button
            onClick={handleGenerate}
            disabled={status === "generating"}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-full shadow-lg
              font-bold uppercase tracking-wider text-sm
              transition-all duration-300 ease-out
              ${
                status === "generating"
                  ? "bg-zinc-700 text-zinc-300 cursor-wait"
                  : status === "success"
                    ? "bg-green-500 text-white"
                    : status === "error"
                      ? "bg-red-500 text-white"
                      : "bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white hover:shadow-[0_0_30px_rgba(255,87,34,0.5)] hover:scale-105"
              }
            `}
          >
            {status === "generating" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : status === "success" ? (
              <>
                <Check className="w-5 h-5" />
                <span>Done!</span>
              </>
            ) : status === "error" ? (
              <>
                <X className="w-5 h-5" />
                <span>Error</span>
              </>
            ) : (
              <>
                {hasExistingImage ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <ImagePlus className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">
                  {hasExistingImage ? "Regenerate" : "Generate"} Image
                </span>
              </>
            )}
          </button>

          {/* Admin Badge */}
          <div className="absolute -top-1 -left-1 px-2 py-0.5 bg-zinc-800 text-[10px] font-mono text-zinc-400 rounded-full border border-zinc-700">
            Admin
          </div>
        </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={`
              fixed bottom-24 left-1/2 z-50 
              px-6 py-4 rounded-lg shadow-xl
              ${status === "success" ? "bg-green-500" : "bg-red-500"}
              text-white font-medium
            `}
          >
            <div className="flex items-center gap-3">
              {status === "success" ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Featured image generated! Refreshing...</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5" />
                  <span>{errorMessage}</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

