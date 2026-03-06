'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Sparkles, Mail, MessageSquare, Loader2, Send, AlertTriangle, X, ArrowRight, RotateCcw, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useContactDialog } from './ContactDialogProvider';
import Button from './ui/Button';

type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error' | 'rate_limited';

const TOTAL_GENERATIONS = 5;

// Inner component that uses the reCAPTCHA hook
const AILabFormContent = ({ 
  email, 
  setEmail, 
  brandDescription, 
  setBrandDescription,
  status,
  handleGenerate,
  error,
}: {
  email: string;
  setEmail: (val: string) => void;
  brandDescription: string;
  setBrandDescription: (val: string) => void;
  status: GenerationStatus;
  handleGenerate: (e: React.FormEvent) => Promise<void>;
  error: string;
}) => {
  return (
    <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-900 mb-2 font-mono flex items-center gap-2">
          <Mail className="w-3 h-3 text-[#FF5722]" />
          Email Address *
        </label>
        <input 
           type="email" 
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="you@example.com"
           required
           className="w-full bg-zinc-50 border border-black/10 p-4 text-black focus:border-[#FF5722] focus:bg-white outline-none transition-all rounded-none font-mono text-sm shadow-inner"
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-900 mb-2 font-mono flex items-center gap-2">
          <MessageSquare className="w-3 h-3 text-[#FF5722]" />
          Tell me about your brand
        </label>
        <textarea 
           value={brandDescription}
           onChange={(e) => setBrandDescription(e.target.value)}
           placeholder="Describe your brand, industry, target audience, and the vibe you're going for. The more detail, the better the result!"
           rows={4}
           className="w-full bg-zinc-50 border border-black/10 p-4 text-black focus:border-[#FF5722] focus:bg-white outline-none transition-all rounded-none font-mono text-sm shadow-inner resize-none"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm font-mono bg-red-50 p-3 border border-red-200">
          {error}
        </div>
      )}

      <button 
         type="submit"
         disabled={status === 'generating' || status === 'complete'}
         className={`w-full py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${
           status === 'generating' || status === 'complete'
             ? 'bg-zinc-200 cursor-not-allowed text-zinc-500' 
             : 'bg-black text-white hover:bg-black/80 hover:scale-[1.02]'
         }`}
      >
        {status === 'generating' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Site Concept'
        )}
      </button>
    </form>
  );
};

// Component that handles the reCAPTCHA token execution
const AILabWithRecaptcha = (props: any) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const wrappedHandleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let token = '';
    if (executeRecaptcha) {
      try {
        token = await executeRecaptcha('generate_concept');
      } catch (err) {
        console.warn('reCAPTCHA execution failed:', err);
      }
    }
    
    props.onGenerate(token);
  };

  return <AILabFormContent {...props} handleGenerate={wrappedHandleGenerate} />;
};

const AILab: React.FC = () => {
  const [email, setEmail] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);
  
  // Contact form state for rate-limited users
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  const { openContactDialog } = useContactDialog();

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Check remaining generations on mount
  useEffect(() => {
    fetch('/api/generate-concept')
      .then(res => res.json())
      .then(data => {
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
          if (data.remaining === 0) {
            setStatus('rate_limited');
          }
        }
      })
      .catch(() => {
        // Silently fail - not critical
      });
  }, []);

  // Close lightbox on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    
    if (lightboxOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  const handleGenerate = useCallback(async (recaptchaToken: string) => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!brandDescription.trim()) {
      setError('Please tell us about your brand');
      return;
    }

    setStatus('generating');
    setError('');
    setImageUrl('');
    setProgress(0);

    // Simulate progress while waiting for API (target ~90% in 30 seconds)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        // 90% over 30s (300 steps of 100ms) = 0.3% per step
        const increment = 0.3 + (Math.random() * 0.2 - 0.1); 
        return Math.min(90, prev + increment);
      });
    }, 100);

    try {
      const response = await fetch('/api/generate-concept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, brandDescription, recaptchaToken }),
      });

      const data = await response.json();

      // Update remaining count from headers or response
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }

      if (response.status === 429) {
        // Rate limit exceeded
        setStatus('rate_limited');
        setError('');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate concept');
      }

      setProgress(100);
      setImageUrl(data.imageUrl);
      setStatus('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    } finally {
      clearInterval(progressInterval);
    }
  }, [email, brandDescription]);

  const resetForm = () => {
    setStatus('idle');
    setImageUrl('');
    setProgress(0);
    setError('');
  };

  const tryAgain = () => {
    // Keep the form data but reset status to allow regeneration
    setStatus('idle');
    setImageUrl('');
    setProgress(0);
    setError('');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  // Interaction handler to load reCAPTCHA
  const handleInteraction = () => {
    if (!isInteracted) {
      setIsInteracted(true);
    }
  };

  // Rate limited view - show contact form
  if (status === 'rate_limited') {
    return (
      <section id="ai-lab" className="py-32 relative bg-zinc-100 overflow-hidden">
        <div className="absolute inset-0 bg-white z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </div>
              <div className="text-zinc-900 text-sm tracking-widest font-mono uppercase">LIMIT_REACHED</div>
            </div>
            <h2 className="text-5xl font-bold uppercase mb-6 text-black">
              Want More <br/>
              <span className="text-gradient">Concepts?</span>
            </h2>
            <p className="text-zinc-600 mb-8 text-lg border-l-2 border-black/10 pl-4">
              You've used all your free generations. We'd love to learn more about your project and help bring your vision to life.
            </p>
            
            {!contactSubmitted ? (
              <div className="glass-panel p-8 rounded-none border border-black/10 bg-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E91E63] blur-[100px] opacity-10"></div>
                
                <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-900 mb-2 font-mono flex items-center gap-2">
                      <Mail className="w-3 h-3 text-[#FF5722]" />
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full bg-zinc-50 border border-black/10 p-4 text-black focus:border-[#FF5722] focus:bg-white outline-none transition-all rounded-none font-mono text-sm shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-900 mb-2 font-mono flex items-center gap-2">
                      <Mail className="w-3 h-3 text-[#FF5722]" />
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-zinc-50 border border-black/10 p-4 text-black focus:border-[#FF5722] focus:bg-white outline-none transition-all rounded-none font-mono text-sm shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-900 mb-2 font-mono flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-[#FF5722]" />
                      Tell us about your project
                    </label>
                    <textarea 
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="What are you looking to build? What's your timeline and budget?"
                      rows={4}
                      required
                      className="w-full bg-zinc-50 border border-black/10 p-4 text-black focus:border-[#FF5722] focus:bg-white outline-none transition-all rounded-none font-mono text-sm shadow-inner resize-none"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full"
                  >
                    <Send className="w-4 h-4" />
                    Let's Cook
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <button 
                    onClick={openContactDialog}
                    className="text-zinc-600 text-sm hover:text-[#FF5722] transition-colors"
                  >
                    Or use our quick contact form →
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-none border border-green-200 bg-green-50 shadow-xl text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Message Sent!</h3>
                <p className="text-zinc-600">We'll be in touch within 24 hours to discuss your project.</p>
              </div>
            )}
          </div>

          <div className="flex-1 w-full flex justify-center">
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              <div className="absolute inset-0 border border-amber-200 rounded-full"></div>
              <div className="absolute inset-4 border border-amber-100 rounded-full"></div>
              <div className="absolute inset-12 border border-dashed border-amber-200 rounded-full"></div>
              
              <div className="text-center p-8 backdrop-blur-sm bg-white/50 rounded-full border border-amber-200 shadow-lg">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <p className="text-lg font-bold text-black mb-2">Limit Reached</p>
                <p className="text-sm text-zinc-600">{TOTAL_GENERATIONS} of {TOTAL_GENERATIONS} generations used</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Lightbox Modal */}
      {lightboxOpen && imageUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <div 
            className="relative max-w-2xl w-full max-h-[90vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageUrl}
              alt="Generated website concept - Full size"
              width={1080}
              height={1920}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              unoptimized
            />
          </div>
        </div>
      )}

      <section id="ai-lab" className="py-32 relative bg-zinc-100 overflow-hidden" onFocus={handleInteraction} onMouseEnter={handleInteraction}>
        {/* Decorative background */}
        <div className="absolute inset-0 bg-white z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'generating' ? 'bg-[#FF5722]' : status === 'error' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'generating' ? 'bg-[#FF5722]' : status === 'error' ? 'bg-red-500' : 'bg-green-500'}`}></span>
              </div>
              <div className="text-zinc-900 text-sm tracking-widest font-mono uppercase">NEURAL_ENGINE_V1</div>
            </div>
            <h2 className="text-5xl font-bold uppercase mb-6 text-black">
              AI-Powered <br/>
              <span className="text-gradient">Brand Inspiration</span>
            </h2>
            <p className="text-zinc-600 mb-8 text-lg border-l-2 border-black/10 pl-4">
              See your brand vision come to life. Enter your email and describe your brand to generate a stunning website concept powered by AI.
            </p>
            
            <div className="glass-panel p-8 rounded-none border border-black/10 bg-white shadow-xl relative overflow-hidden group hover:border-[#FF5722]/50 transition-colors">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E91E63] blur-[100px] opacity-10"></div>
               
               {/* Remaining generations indicator */}
               {remaining !== null && remaining > 0 && (
                 <div className="mb-4 text-xs font-mono text-zinc-600 flex items-center gap-2">
                   <div className="flex gap-1">
                     {[...Array(TOTAL_GENERATIONS)].map((_, i) => (
                       <div 
                         key={i} 
                         className={`w-2 h-2 rounded-full ${i < (TOTAL_GENERATIONS - remaining) ? 'bg-zinc-300' : 'bg-[#FF5722]'}`}
                       />
                     ))}
                   </div>
                   <span>{remaining} free generation{remaining !== 1 ? 's' : ''} remaining</span>
                 </div>
               )}
               
               {isInteracted && recaptchaSiteKey ? (
                 <GoogleReCaptchaProvider 
                    reCaptchaKey={recaptchaSiteKey}
                    scriptProps={{
                      async: true,
                      defer: true,
                      appendTo: 'head',
                    }}
                 >
                   <AILabWithRecaptcha 
                      email={email}
                      setEmail={setEmail}
                      brandDescription={brandDescription}
                      setBrandDescription={setBrandDescription}
                      status={status}
                      onGenerate={handleGenerate}
                      error={error}
                   />
                 </GoogleReCaptchaProvider>
               ) : (
                 <AILabFormContent 
                    email={email}
                    setEmail={setEmail}
                    brandDescription={brandDescription}
                    setBrandDescription={setBrandDescription}
                    status={status}
                    handleGenerate={async (e) => {
                      e.preventDefault();
                      handleInteraction();
                      // Wait a bit for reCAPTCHA to load if they clicked fast
                      setTimeout(() => handleGenerate(''), 500);
                    }}
                    error={error}
                 />
               )}
               
               {/* reCAPTCHA notice */}
               <p className="mt-4 text-[10px] text-zinc-600 text-center">
                 Protected by reCAPTCHA
               </p>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center">
             <div className="relative w-full max-w-sm flex flex-col items-center justify-center">
                {/* Decorative elements for non-complete states */}
                {status !== 'complete' && (
                  <>
                    <div className={`absolute inset-0 border border-black/10 rounded-full transition-all duration-1000 ${status === 'generating' ? 'animate-[spin_2s_linear_infinite] border-[#FF5722]/50' : ''}`}></div>
                    <div className={`absolute inset-4 border border-black/5 rounded-full transition-all duration-1000 ${status === 'generating' ? 'animate-[spin_3s_linear_infinite_reverse]' : ''}`}></div>
                    <div className={`absolute inset-12 border border-dashed border-black/10 rounded-full transition-all duration-1000 ${status === 'generating' ? 'animate-[spin_5s_linear_infinite] border-[#E91E63]/30' : ''}`}></div>
                  </>
                )}
                
                <div className={`relative z-10 w-full flex flex-col items-center justify-center ${status !== 'complete' ? 'aspect-square' : ''}`}>
                  {status === 'generating' && (
                    <div className="text-center p-8 backdrop-blur-sm bg-white/50 rounded-2xl border border-black/5 shadow-lg w-[85%]">
                      <Loader2 className="w-12 h-12 text-[#FF5722] mx-auto mb-4 animate-spin" />
                      <p className="text-lg font-bold text-black mb-4">Creating Your Vision</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-zinc-200 rounded-full h-2 mb-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF5722] to-[#E91E63] rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-zinc-600 font-mono mb-2">{Math.round(progress)}% complete</p>
                      <p className="text-[10px] text-[#FF5722] animate-pulse">Neural engine at work... this can take a minute</p>
                    </div>
                  )}

                  {status === 'complete' && imageUrl && (
                    <div className="w-full">
                      {/* Image with hover effect */}
                      <div 
                        className="relative w-full aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border border-black/10 cursor-pointer group transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:scale-[1.02]"
                        onClick={() => setLightboxOpen(true)}
                      >
                        <Image
                          src={imageUrl}
                          alt="Generated website concept"
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                            <ZoomIn className="w-6 h-6 text-black" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Caption and action buttons */}
                      <div className="mt-6 text-center">
                        <Sparkles className="w-5 h-5 text-[#FF5722] mx-auto mb-2" />
                        <p className="text-sm text-zinc-600 mb-4">Your AI-generated concept</p>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={openContactDialog}
                            className="flex-1"
                          >
                            OK, Now Build It
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={tryAgain}
                            variant="secondary"
                            className="flex-1"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Try Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="text-center p-8 backdrop-blur-sm bg-white/50 rounded-full border border-red-200 shadow-lg">
                      <div className="w-16 h-16 mx-auto bg-red-100 rounded-full mb-4 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                      </div>
                      <p className="text-sm text-red-600 font-mono">Generation failed</p>
                      <p className="text-xs text-zinc-600 mt-2">Please try again</p>
                    </div>
                  )}

                  {status === 'idle' && (
                    <div className="text-center p-8 backdrop-blur-sm bg-black/5 rounded-full border border-black/10 shadow-lg">
                      <div className="w-20 h-20 mx-auto bg-black/10 rounded-full mb-4 flex items-center justify-center animate-pulse">
                        <span className="font-mono text-xs text-zinc-900 font-bold">AI_IDLE</span>
                      </div>
                      <p className="text-sm tracking-widest uppercase text-zinc-800 font-bold">Awaiting Input</p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AILab;
