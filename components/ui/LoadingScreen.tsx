'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  message = 'Preparing your wedding experience...',
  submessage = 'EternalTie Wedding Studio',
  className,
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-[#fdfbf7] text-stone-800 selection:bg-rose-100 p-6 z-50 select-none',
        fullScreen ? 'fixed inset-0 min-h-screen w-screen' : 'w-full py-24 min-h-[400px]',
        className
      )}
    >
      <div className="relative flex flex-col items-center max-w-sm text-center">
        {/* Animated circular emblem */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Subtle outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-rose-300/80"
          />

          {/* Inner pulsing glow ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-2 rounded-full bg-gradient-to-tr from-rose-200/40 via-amber-100/50 to-rose-100/40 blur-md"
          />

          {/* Central gold-rose heart emblem */}
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 relative z-10"
          >
            <Heart className="w-6 h-6 fill-white" />
          </motion.div>

          {/* Little sparkling star */}
          <motion.div
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 -right-1 text-amber-500"
          >
            <Sparkles className="w-4 h-4 fill-amber-400" />
          </motion.div>
        </div>

        {/* Message */}
        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-lg sm:text-xl font-bold text-stone-900 tracking-tight"
        >
          {message}
        </motion.h3>

        {submessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[11px] uppercase tracking-widest text-stone-400 mt-1 font-medium"
          >
            {submessage}
          </motion.p>
        )}
      </div>
    </div>
  );
}
