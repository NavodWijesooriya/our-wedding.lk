'use client';

import React from 'react';
import { WeddingProject, WeddingThemeConfig, WeddingTemplateId, WeddingFontFamily } from '@/types/wedding';
import { WEDDING_TEMPLATES } from '@/lib/mockData';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Check, Palette, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabProps {
  wedding: WeddingProject;
  onChangeTemplate: (id: WeddingTemplateId) => void;
  onChangeTheme: (theme: Partial<WeddingThemeConfig>) => void;
}

const COLOR_PALETTES = [
  { name: 'Romantic Blush', primary: '#e07a7e', secondary: '#f7dcd8', accent: '#b45309' },
  { name: 'Sage Garden', primary: '#4d7c0f', secondary: '#ecfccb', accent: '#2d6a4f' },
  { name: 'Royal Gold', primary: '#d4af37', secondary: '#fef3c7', accent: '#b45309' },
  { name: 'Mandala Ivory & Gold', primary: '#b98a2f', secondary: '#f5eedf', accent: '#7a5214' },
  { name: 'Ceylon Royal Crimson', primary: '#991b1b', secondary: '#fef3c7', accent: '#450a0a' },
  { name: 'Serene Lotus & Emerald', primary: '#047857', secondary: '#ecfdf5', accent: '#064e3b' },
  { name: 'Velvet Crimson', primary: '#881337', secondary: '#ffe4e6', accent: '#4c0519' },
  { name: 'Midnight Obsidian', primary: '#fbbf24', secondary: '#1e1b4b', accent: '#d97706' },
  { name: 'Modern Slate', primary: '#18181b', secondary: '#f4f4f5', accent: '#71717a' },
];

export function DesignTab({ wedding, onChangeTemplate, onChangeTheme }: TabProps) {
  const { templateId, themeConfig } = wedding;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Design & Typography</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Choose a wedding template theme, color palette, and font styling.
        </p>
      </div>

      {/* Template Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          Selected Template
        </label>
        <div className="grid grid-cols-2 gap-3">
          {WEDDING_TEMPLATES.map((tpl) => {
            const isSelected = templateId === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => onChangeTemplate(tpl.id)}
                className={cn(
                  'relative rounded-2xl border p-3 cursor-pointer transition-all text-left group overflow-hidden bg-white',
                  isSelected
                    ? 'border-rose-600 ring-2 ring-rose-600/20 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                )}
              >
                <div className="aspect-16/10 rounded-xl overflow-hidden mb-2.5 bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tpl.previewImage} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900">{tpl.name}</h4>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-stone-500 truncate mt-0.5">{tpl.tagline}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Palettes */}
      <div className="border-t border-stone-100 pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-rose-500" />
            Curated Color Palettes
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {COLOR_PALETTES.map((pal) => {
            const isSelected = themeConfig.primaryColor === pal.primary;
            return (
              <button
                key={pal.name}
                type="button"
                onClick={() =>
                  onChangeTheme({
                    primaryColor: pal.primary,
                    secondaryColor: pal.secondary,
                    accentColor: pal.accent,
                  })
                }
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer',
                  isSelected
                    ? 'border-stone-900 bg-stone-50 font-bold shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-50'
                )}
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 border border-black/10 shadow-2xs"
                  style={{ backgroundColor: pal.primary }}
                />
                <span className="truncate">{pal.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Hex Color */}
        <div className="pt-2">
          <Input
            label="Custom Primary Accent Color"
            value={themeConfig.primaryColor}
            onChange={(e) => onChangeTheme({ primaryColor: e.target.value })}
            placeholder="#e07a7e"
            leftElement={
              <span
                className="w-4 h-4 rounded-full border border-stone-300"
                style={{ backgroundColor: themeConfig.primaryColor }}
              />
            }
          />
        </div>
      </div>

      {/* Typography Selector */}
      <div className="border-t border-stone-100 pt-6 space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-rose-500" />
          Primary Font Family
        </label>
        <Select
          value={themeConfig.fontFamily}
          onChange={(e) => onChangeTheme({ fontFamily: e.target.value as WeddingFontFamily })}
          options={[
            { value: 'playfair', label: 'Playfair Display (Romantic Classic)' },
            { value: 'cormorant', label: 'Cormorant Garamond (Ethereal Editorial)' },
            { value: 'cinzel', label: 'Cinzel (Royal Grandeur)' },
            { value: 'montserrat', label: 'Montserrat (Clean Contemporary)' },
            { value: 'inter', label: 'Inter Sans (Minimalist Modern)' },
          ]}
        />
      </div>
    </div>
  );
}
