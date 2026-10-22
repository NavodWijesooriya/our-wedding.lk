'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

export interface ToastFn {
  (message: Omit<ToastMessage, 'id'>): void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

interface ToastContextType {
  toast: ToastFn;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const baseToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = 'toast_' + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description }]);
      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      baseToast({ type: 'success', title, description });
    },
    [baseToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      baseToast({ type: 'error', title, description });
    },
    [baseToast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      baseToast({ type: 'info', title, description });
    },
    [baseToast]
  );

  const toast = Object.assign(baseToast, {
    success,
    error,
    info,
  });

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast notifications container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl backdrop-blur-md border text-xs sm:text-sm',
                t.type === 'success' && 'bg-white/95 text-stone-900 border-emerald-200/80 shadow-emerald-950/5',
                t.type === 'error' && 'bg-white/95 text-stone-900 border-red-200/80 shadow-red-950/5',
                t.type === 'info' && 'bg-white/95 text-stone-900 border-rose-200/80 shadow-rose-950/5'
              )}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-rose-600" />}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-stone-900 leading-snug">{t.title}</h4>
                {t.description && <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{t.description}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
