"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Twitter,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface InfographicLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  excerpt?: string;
}

export default function InfographicLightbox({
  isOpen,
  onClose,
  imageUrl,
  title,
  excerpt,
}: InfographicLightboxProps) {
  const [isSharing, setIsSharing] = useState(false);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title
        .toLowerCase()
        .replace(/\s+/g, "-")}-infographic.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : ""
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : ""
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : ""
    )}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex flex-col md:flex-row gap-8 max-w-7xl">
            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative flex-1 bg-zinc-900 rounded-lg overflow-hidden cursor-zoom-out"
              onClick={onClose}
            >
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Sidebar / Info */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="w-full md:w-80 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold font-oswald text-white uppercase mb-4 leading-tight">
                  {title}
                </h3>
                {excerpt && (
                  <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                    {excerpt}
                  </p>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/5"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">
                      Download Image
                    </span>
                  </button>

                  <div className="pt-8 border-t border-white/10">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-4 block">
                      Share with the world
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-white/5 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] text-zinc-400 rounded-lg transition-all"
                        title="Share on Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-white/5 hover:bg-[#0077B5]/20 hover:text-[#0077B5] text-zinc-400 rounded-lg transition-all"
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-white/5 hover:bg-[#4267B2]/20 hover:text-[#4267B2] text-zinc-400 rounded-lg transition-all"
                        title="Share on Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center justify-center p-3 bg-white/5 hover:bg-white/20 text-zinc-400 rounded-lg transition-all"
                        title="Copy Link"
                      >
                        <LinkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#FF5722]/10 border border-[#FF5722]/20 rounded-lg">
                <p className="text-[#FF5722] text-[10px] font-mono uppercase tracking-wider leading-relaxed">
                  High-resolution 4K infographic generated by Excelsior
                  Creative.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
