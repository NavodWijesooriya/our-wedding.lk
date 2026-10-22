'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={() => onSelectIndex((currentIndex - 1 + images.length) % images.length)}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image */}
      <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[currentIndex]}
          alt={`Wedding gallery photo ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-xs text-stone-300">
          {currentIndex + 1} of {images.length}
        </div>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={() => onSelectIndex((currentIndex + 1) % images.length)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
