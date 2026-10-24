'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingTemplateId } from '@/types/wedding';
import { WEDDING_TEMPLATES } from '@/lib/mockData';
import { Sparkles, Palette, Check, X, ChevronRight, Wand2 } from 'lucide-react';

interface LiveTemplateSwitcherProps {
  currentTemplateId: WeddingTemplateId;
  onSelectTemplate: (templateId: WeddingTemplateId) => void;
}

export function LiveTemplateSwitcher({
  currentTemplateId,
  onSelectTemplate,
}: LiveTemplateSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Floating Switcher Pill */}
      <div className="fixed top-20 right-4 sm:right-6 z-40 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-900/90 hover:bg-black text-amber-300 hover:text-amber-200 text-xs font-serif font-medium shadow-2xl border border-amber-300/40 backdrop-blur-md cursor-pointer transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">Explore All 9 Creative Styles</span>
          <span className="sm:hidden">Styles</span>
          <span className="bg-amber-400/20 text-amber-200 text-[10px] px-1.5 py-0.5 rounded-full">
            9
          </span>
        </motion.button>
      </div>

      {/* Slide-out Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative w-full max-w-md h-full bg-[#1c1917] text-white p-6 overflow-y-auto shadow-2xl border-l border-amber-500/20 flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-white">Creative Templates</h3>
                    <p className="text-[11px] text-stone-400">Preview with Sophia &amp; Julian’s data</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Template List */}
              <div className="space-y-3 my-6 flex-1">
                {WEDDING_TEMPLATES.map((tmpl) => {
                  const isSelected = currentTemplateId === tmpl.id;
                  return (
                    <motion.div
                      key={tmpl.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelectTemplate(tmpl.id);
                        setIsOpen(false);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3.5 relative ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400/80 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                      }`}
                    >
                      {/* Image Preview Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tmpl.previewImage}
                          alt={tmpl.name}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{ backgroundColor: tmpl.primaryColor }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-stone-100 truncate">
                            {tmpl.name}
                          </h4>
                          {isSelected && (
                            <span className="bg-amber-400 text-stone-950 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 truncate mt-0.5">{tmpl.tagline}</p>
                        <span className="text-[10px] text-amber-300/80 font-mono inline-block mt-1">
                          {tmpl.mood}
                        </span>
                      </div>

                      {/* Selection indicator */}
                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-stone-600" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer Tip */}
              <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400 text-center font-sans">
                Each style retains the full wedding details, music, timeline, and personalized RSVP links.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
