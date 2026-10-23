'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface PhotoLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (idx: number) => void;
}

export function PhotoLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}: PhotoLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelectIndex((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft')
        onSelectIndex((currentIndex - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, currentIndex, images.length, onClose, onSelectIndex]);

  if (!isOpen || !images.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6 select-none"
      >
        {/* Top Header Bar */}
        <div className="w-full max-w-6xl flex items-center justify-between text-white py-2 z-20">
          <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Wedding Moments • Photo {currentIndex + 1} of {images.length}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
            title="Close Lightbox (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Main Stage */}
        <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-auto min-h-0">
          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={() => onSelectIndex((currentIndex - 1 + images.length) % images.length)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer z-20"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main Image with Smooth Slide/Fade */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-full max-h-[72vh] sm:max-h-[78vh] flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex]}
              alt={`Wedding moment ${currentIndex + 1}`}
              className="max-h-[72vh] sm:max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
            />
          </motion.div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={() => onSelectIndex((currentIndex + 1) % images.length)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer z-20"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <div className="w-full max-w-4xl pt-3 pb-1 z-20 overflow-x-auto flex items-center justify-center gap-2 sm:gap-3 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onSelectIndex(idx)}
                className={`relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'border-amber-400 scale-105 ring-2 ring-amber-400/50 shadow-md'
                    : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/60'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
