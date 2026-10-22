'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  animation?: 'fade-up' | 'fade-in' | 'zoom-in' | string;
  id?: string;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  animation,
  id,
}: AnimatedSectionProps) {
  const effectiveDirection = animation === 'fade-in' ? 'none' : direction;

  const getInitialOffset = () => {
    switch (effectiveDirection) {
      case 'up':
        return { y: 24, x: 0 };
      case 'down':
        return { y: -24, x: 0 };
      case 'left':
        return { x: 24, y: 0 };
      case 'right':
        return { x: -24, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}
