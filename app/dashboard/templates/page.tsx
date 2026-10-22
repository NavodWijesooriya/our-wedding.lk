'use client';

import React from 'react';
import Link from 'next/link';
import { WEDDING_TEMPLATES } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, ArrowRight, Palette, Check } from 'lucide-react';

export default function TemplatesGalleryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-2">
          <Palette className="w-3.5 h-3.5" />
          <span>Curated Wedding Design Collection</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-stone-900">
          Professional Wedding Invitation Templates
        </h1>
        <p className="text-stone-500 text-sm mt-1 max-w-2xl">
          Each template is mobile-responsive, supports custom colors and fonts, interactive RSVPs,
          music, and real-time editing.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {WEDDING_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="group rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image Preview */}
              <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tpl.previewImage}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="rose">{tpl.badge}</Badge>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-stone-900">{tpl.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: tpl.primaryColor }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: tpl.accentColor }}
                    />
                  </div>
                </div>

                <p className="text-xs font-medium text-rose-600 uppercase tracking-wider">
                  {tpl.tagline}
                </p>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {tpl.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-stone-400">
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    Font: {tpl.font}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    Mood: {tpl.mood}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 pt-0 border-t border-stone-100 mt-4">
              <Link href={`/dashboard/create`}>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Create With This Template
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
