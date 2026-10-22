'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MailOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EnvelopeOpenerProps {
  coupleNames: string;
  weddingDate: string;
  onOpen?: () => void;
}

export function EnvelopeOpener({ coupleNames, weddingDate, onOpen }: EnvelopeOpenerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    if (onOpen) onOpen();
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181614]/90 backdrop-blur-md p-4 sm:p-6 select-none"
        >
          {/* Subtle gold dust background */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Envelope Card Container */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#fffdf9] rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-[#d4af37]/40 ring-1 ring-black/5 overflow-hidden"
          >
            {/* Elegant Corner Filigree Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/60" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/60" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/60" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/60" />

            {/* Wax Seal / Emblem */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/30 border-2 border-white/80 ring-2 ring-rose-400/40 relative cursor-pointer"
              onClick={handleOpen}
            >
              <Heart className="w-8 h-8 fill-white" />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-300" />
            </motion.div>

            {/* Monogram / Header */}
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-2">
              Wedding Invitation
            </span>

            {/* Couple Names */}
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-3 tracking-tight">
              {coupleNames}
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 font-sans tracking-wide uppercase mb-8">
              {weddingDate}
            </p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-8" />

            {/* Opening CTA Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="gold"
                size="lg"
                onClick={handleOpen}
                leftIcon={<MailOpen className="w-5 h-5" />}
                className="w-full sm:w-auto px-8 shadow-xl"
              >
                Open Invitation
              </Button>
            </motion.div>

            <p className="text-[11px] text-stone-400 mt-4 font-sans">
              Click to reveal details, music, and RSVP
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
