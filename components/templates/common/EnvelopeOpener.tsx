'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MailOpen } from 'lucide-react';

interface EnvelopeOpenerProps {
  coupleNames: string;
  weddingDate: string;
  onOpen?: () => void;
}

export function EnvelopeOpener({ coupleNames, weddingDate, onOpen }: EnvelopeOpenerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Derive couple initials for the wax seal monogram (e.g. "K & N" -> "K & N")
  const parts = coupleNames.split('&').map((s) => s.trim());
  const monogram = parts.length === 2
    ? `${parts[0][0] || 'W'}&${parts[1][0] || 'M'}`
    : 'W';

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Dispatch global event so MusicPlayer can start audio on user gesture
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wedding-invitation-opened'));
    }

    if (onOpen) onOpen();

    setTimeout(() => {
      setIsOpen(true);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13110f]/92 backdrop-blur-xl p-4 sm:p-6 select-none overflow-hidden"
        >
          {/* Ambient Floating Gold Dust Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-300/40"
                style={{
                  top: `${10 + (i * 7.5)}%`,
                  left: `${5 + (i * 8)}%`,
                }}
                animate={{
                  y: [-15, 15, -15],
                  x: [-10, 10, -10],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 4 + (i % 3) * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          {/* Envelope Card Container */}
          <motion.div
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md sm:max-w-lg"
          >
            {/* The Envelope Body */}
            <div className="relative bg-[#fffdf8] rounded-3xl p-8 sm:p-12 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-2 border-[#d4af37]/50 ring-1 ring-amber-300/20 overflow-hidden">
              {/* Luxury Gold Corner Filigree Accents */}
              <div className="absolute top-3.5 left-3.5 w-7 h-7 border-t-2 border-l-2 border-[#d4af37]/70 rounded-tl-sm" />
              <div className="absolute top-3.5 right-3.5 w-7 h-7 border-t-2 border-r-2 border-[#d4af37]/70 rounded-tr-sm" />
              <div className="absolute bottom-3.5 left-3.5 w-7 h-7 border-b-2 border-l-2 border-[#d4af37]/70 rounded-bl-sm" />
              <div className="absolute bottom-3.5 right-3.5 w-7 h-7 border-b-2 border-r-2 border-[#d4af37]/70 rounded-br-sm" />

              {/* Sub-header Monogram Ribbon */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/60 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#9a7322] font-semibold">
                  You Are Cordially Invited
                </span>
                <Sparkles className="w-3 h-3 text-amber-600" />
              </div>

              {/* 3D Wax Seal with Monogram & Interactive Pulse */}
              <div className="relative my-4 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpen}
                  className="relative group cursor-pointer"
                >
                  {/* Outer pulsing glow */}
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-500/20 to-amber-500/30 blur-md group-hover:opacity-100 opacity-60 transition duration-500 animate-pulse" />

                  {/* Wax Seal Base */}
                  <motion.div
                    animate={isOpening ? { scale: [1, 1.25, 0], opacity: [1, 0.8, 0] } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-[#881337] via-[#be123c] to-[#e11d48] text-white flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(190,18,60,0.45)] border-3 border-amber-200/90 ring-4 ring-rose-900/30"
                  >
                    {/* Concentric seal rim */}
                    <div className="absolute inset-1.5 rounded-full border border-dashed border-amber-200/50" />
                    <Heart className="w-4 h-4 fill-amber-200 text-amber-200 mb-0.5" />
                    <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-amber-100 uppercase">
                      {monogram}
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Couple Names */}
              <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-bold tracking-tight mt-6 mb-2">
                {coupleNames}
              </h1>

              {/* Wedding Date */}
              <p className="text-xs sm:text-sm text-stone-500 font-sans tracking-widest uppercase mb-6">
                {weddingDate}
              </p>

              {/* Gold Divider Ribbon */}
              <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-7" />

              {/* Opening CTA Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpen}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-serif font-semibold text-sm tracking-wide shadow-xl shadow-amber-900/20 transition-all duration-300 inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MailOpen className="w-4 h-4" />
                <span>Break Seal &amp; Open Invitation</span>
              </motion.button>

              <p className="text-[11px] text-stone-400 mt-4 font-sans flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500/70" />
                <span>Tap seal to unlock romantic music &amp; celebration details</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
