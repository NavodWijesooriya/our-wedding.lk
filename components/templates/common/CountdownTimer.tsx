'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  weddingDate: string;
  weddingTime?: string;
  className?: string;
  cardClassName?: string;
  numberClassName?: string;
  labelClassName?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function CountdownTimer({
  weddingDate,
  weddingTime = '16:00',
  className,
  cardClassName,
  numberClassName,
  labelClassName,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const timePart = weddingTime.includes(':') ? weddingTime : '16:00';
      const target = new Date(`${weddingDate}T${timePart}`).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [weddingDate, weddingTime]);

  if (timeLeft.isPast) {
    return (
      <div className={cn('text-center py-5 font-serif text-lg tracking-wider text-rose-600 flex items-center justify-center gap-2', className)}>
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
        <span>Celebrating Our Happily Ever After</span>
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
      </div>
    );
  }

  const items = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={cn('flex items-center justify-center gap-2 sm:gap-3.5 select-none', className)}>
      {items.map((item, idx) => (
        <React.Fragment key={item.label}>
          <motion.div
            whileHover={{ y: -2 }}
            className={cn(
              'relative flex flex-col items-center justify-center min-w-16 sm:min-w-22 p-2.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-md shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] border border-stone-200/70 ring-1 ring-black/5 overflow-hidden group',
              cardClassName
            )}
          >
            {/* Soft subtle top highlight line */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

            {/* Digit with smooth scale keyframe */}
            <span
              key={item.value}
              className={cn(
                'text-2xl sm:text-4xl font-serif font-bold tabular-nums text-stone-900 tracking-tight transition-all duration-300',
                numberClassName
              )}
            >
              {String(item.value).padStart(2, '0')}
            </span>

            {/* Sub-label */}
            <span
              className={cn(
                'text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 mt-1',
                labelClassName
              )}
            >
              {item.label}
            </span>
          </motion.div>

          {/* Elegant separator colon between cards (except last) */}
          {idx < items.length - 1 && (
            <span className="text-stone-300 font-serif text-lg sm:text-2xl font-light -mt-2">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
