"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mail, MessageSquare, Send, User, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type DialogState = "idle" | "submitting" | "success" | "error";

type ContactDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ContactDialog: React.FC<ContactDialogProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<DialogState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setMessage("");
      setState("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setErrorMessage("");

    try {
      // Get reCAPTCHA token if available
      let recaptchaToken = "";
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("contact_form");
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setState("success");
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }, [name, email, message, executeRecaptcha]);

  const handleRetry = () => {
    setState("idle");
    setErrorMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF5722] pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF5722] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#E91E63] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E91E63] pointer-events-none" />

            {/* Gradient glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF5722] blur-[100px] opacity-20 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#E91E63] blur-[100px] opacity-20 pointer-events-none" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="relative z-10 p-8">
              {state === "success" ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF5722] to-[#E91E63] flex items-center justify-center">
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-10 h-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </div>
                  <h3 className="text-2xl font-bold uppercase text-white mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-zinc-400 mb-8">
                    We'll be in touch with you as soon as possible.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white font-bold uppercase tracking-widest text-sm rounded-full hover:shadow-[0_0_30px_rgba(255,87,34,0.5)] transition-all hover:scale-105"
                  >
                    Close
                  </button>
                </motion.div>
              ) : state === "error" ? (
                /* Error State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                    <X className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase text-white mb-3">
                    Oops!
                  </h3>
                  <p className="text-zinc-400 mb-2">
                    {errorMessage || "Something went wrong. Please try again."}
                  </p>
                  <p className="text-zinc-500 text-sm mb-8">
                    Don't worry, your message wasn't lost.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-8 py-3 bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white font-bold uppercase tracking-widest text-sm rounded-full hover:shadow-[0_0_30px_rgba(255,87,34,0.5)] transition-all hover:scale-105"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : (
                /* Form State */
                <>
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </div>
                      <span className="text-[#FF5722] text-xs tracking-widest font-mono uppercase">
                        START_TRANSMISSION
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold uppercase text-white">
                      Let's <span className="text-gradient">Connect</span>
                    </h2>
                    <p className="text-zinc-400 mt-2 text-sm">
                      Tell us about your project and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#FF5722] mb-2 font-mono flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        disabled={state === "submitting"}
                        className="w-full bg-black/50 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:border-[#FF5722] focus:bg-black/70 outline-none transition-all font-mono text-sm disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#FF5722] mb-2 font-mono flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={state === "submitting"}
                        className="w-full bg-black/50 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:border-[#FF5722] focus:bg-black/70 outline-none transition-all font-mono text-sm disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#FF5722] mb-2 font-mono flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        What can we help you with?
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your vision. What are you building? What's keeping you up at night? We're here to help..."
                        rows={4}
                        required
                        disabled={state === "submitting"}
                        className="w-full bg-black/50 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:border-[#FF5722] focus:bg-black/70 outline-none transition-all font-mono text-sm resize-none disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={state === "submitting"}
                      className="w-full py-4 bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white font-bold uppercase tracking-widest text-sm rounded-full hover:shadow-[0_0_30px_rgba(255,87,34,0.5)] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {state === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactDialog;

