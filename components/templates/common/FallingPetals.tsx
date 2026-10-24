'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flower2 } from 'lucide-react';

interface FallingPetalsProps {
  enabled?: boolean;
  theme?: 'rose' | 'gold' | 'green' | 'white';
}

export function FallingPetals({ enabled = true, theme = 'rose' }: FallingPetalsProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(enabled);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;

  // Curated petal configurations with varying delays, sizes, and paths
  const petals = [
    { left: '4%', size: 14, delay: 0, duration: 11, rotate: 20 },
    { left: '12%', size: 18, delay: 3, duration: 14, rotate: -45 },
    { left: '22%', size: 12, delay: 6, duration: 9, rotate: 90 },
    { left: '34%', size: 16, delay: 1.5, duration: 13, rotate: 15 },
    { left: '48%', size: 20, delay: 4.5, duration: 15, rotate: -30 },
    { left: '60%', size: 14, delay: 2, duration: 10, rotate: 60 },
    { left: '72%', size: 18, delay: 7, duration: 12, rotate: -15 },
    { left: '84%', size: 13, delay: 0.8, duration: 11, rotate: 45 },
    { left: '92%', size: 16, delay: 5, duration: 14, rotate: -75 },
    { left: '18%', size: 15, delay: 8.5, duration: 12.5, rotate: 30 },
    { left: '54%', size: 17, delay: 9.5, duration: 13.5, rotate: -60 },
    { left: '78%', size: 13, delay: 10.5, duration: 11.5, rotate: 70 },
  ];

  // Palette color styles
  const colorMap = {
    rose: {
      fill: '#f43f5e',
      stroke: '#fda4af',
      opacity: 0.28,
    },
    gold: {
      fill: '#d4af37',
      stroke: '#fef08a',
      opacity: 0.32,
    },
    green: {
      fill: '#10b981',
      stroke: '#a7f3d0',
      opacity: 0.25,
    },
    white: {
      fill: '#ffffff',
      stroke: '#e2e8f0',
      opacity: 0.4,
    },
  };

  const currentTheme = colorMap[theme] || colorMap.rose;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
    >
      {petals.map((petal, index) => (
        <div
          key={index}
          className="absolute petal-sway"
          style={{
            left: petal.left,
            top: '-30px',
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          {/* Organic Petal SVG Shape */}
          <svg
            width={petal.size}
            height={petal.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            style={{
              opacity: currentTheme.opacity,
              transform: `rotate(${petal.rotate}deg)`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))',
            }}
          >
            <path
              d="M12 0C18 6 24 16 22 26C20 31 15 32 12 32C9 32 4 31 2 26C0 16 6 6 12 0Z"
              fill={currentTheme.fill}
              stroke={currentTheme.stroke}
              strokeWidth="0.7"
            />
            {/* Subtle inner petal vein */}
            <path
              d="M12 6C12 14 12 24 12 28"
              stroke={currentTheme.stroke}
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
