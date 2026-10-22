import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'rose' | 'amber' | 'emerald' | 'stone' | 'purple' | 'blue';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'stone',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    stone: 'bg-stone-100 text-stone-700 border-stone-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    blue: 'bg-sky-50 text-sky-700 border-sky-200/60',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
