"use client";

import { Loader2, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type FormState = "idle" | "submitting" | "success" | "error";

const INQUIRY_TYPES = [
  "Buying a Home",
  "Selling a Home",
  "Property Management",
  "Investment / 1031 Exchange",
  "Mortgage",
  "General Question",
];

export const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setState("submitting");
      setErrorMessage("");

      try {
        let recaptchaToken = "";
        if (executeRecaptcha) {
          recaptchaToken = await executeRecaptcha("contact_form");
        }

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message: `${inquiryType ? `[${inquiryType}] ` : ""}${message}${phone ? `\n\nPhone: ${phone}` : ""}`, recaptchaToken }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to send message");

        setState("success");
      } catch (err) {
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [name, email, phone, inquiryType, message, executeRecaptcha],
  );

  if (state === "success") {
    return (
      <div className="text-center py-14 bg-warm-gray rounded-2xl border border-border">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-brand/10 border-2 border-brand/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl font-medium text-foreground mb-3">Message Sent!</h3>
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
          We&rsquo;ll get back to you within one business day.
        </p>
        <button
          onClick={() => setState("idle")}
          className="px-8 py-3 bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide text-sm rounded-lg transition-colors"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Phone row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-2">
            Your Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              required
              disabled={state === "submitting"}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm disabled:opacity-50"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-2">
            Phone (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(714) 555-0100"
              disabled={state === "submitting"}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={state === "submitting"}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm disabled:opacity-50"
          />
        </div>
      </div>

      {/* Inquiry type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-2">
          What Can We Help With?
        </label>
        <div className="relative">
          <select
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            disabled={state === "submitting"}
            className="w-full px-4 py-3 border border-border rounded-lg bg-white text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm appearance-none disabled:opacity-50"
          >
            <option value="">Select inquiry type…</option>
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">▾</div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display mb-2">
          Message *
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground/50" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you're looking for or what questions you have…"
            rows={5}
            required
            disabled={state === "submitting"}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm resize-none disabled:opacity-50"
          />
        </div>
      </div>

      {state === "error" && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full py-4 bg-cta hover:bg-cta-light text-white font-display font-semibold uppercase tracking-wide text-sm rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        We respond within one business day. Or call us directly at{" "}
        <a href="tel:7143363375" className="text-brand hover:underline font-medium">
          (714) 336-3375
        </a>
      </p>
    </form>
  );
};
