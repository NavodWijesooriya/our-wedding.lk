'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
      const target = new Date(`${weddingDate}T${weddingTime.includes(':') ? weddingTime : '16:00'}`).getTime();
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
      <div className={cn('text-center py-4 font-serif text-lg tracking-wider text-rose-600', className)}>
        ✨ Celebrating Our Happily Ever After ✨
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
    <div className={cn('flex items-center justify-center gap-2 sm:gap-4 select-none', className)}>
      {items.map((item, idx) => (
        <div
          key={item.label}
          className={cn(
            'flex flex-col items-center justify-center min-w-16 sm:min-w-20 p-2 sm:p-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-xs border border-stone-200/50',
            cardClassName
          )}
        >
          <span
            className={cn(
              'text-2xl sm:text-3xl font-bold font-serif tabular-nums text-stone-900',
              numberClassName
            )}
          >
            {String(item.value).padStart(2, '0')}
          </span>
          <span
            className={cn(
              'text-[10px] sm:text-xs font-medium uppercase tracking-widest text-stone-500 mt-0.5',
              labelClassName
            )}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
