'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 items-end">
      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-border flex items-center justify-center text-foreground/70 hover:text-blue-600 hover:border-blue-200 transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Phone */}
      <a
        href="tel:+919999999999"
        className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Call us"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919999999999?text=Hello%2C%20I%20am%20interested%20in%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-full shadow-lg shadow-green-500/40 px-4 py-3 font-medium text-sm transition-all hover:scale-105 animate-pulse-glow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 flex-shrink-0" />
        <span className="hidden sm:block">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
