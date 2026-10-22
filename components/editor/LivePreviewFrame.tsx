'use client';

import React from 'react';
import { WeddingProject } from '@/types/wedding';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface PreviewFrameProps {
  wedding: WeddingProject;
  device: 'desktop' | 'tablet' | 'mobile';
}

export function LivePreviewFrame({ wedding, device }: PreviewFrameProps) {
  return (
    <div className="w-full h-full flex flex-col items-center bg-stone-100 overflow-y-auto p-4 sm:p-6 select-text">
      {/* Device wrapper */}
      <div
        className={cn(
          'w-full transition-all duration-300 origin-top shadow-2xl bg-white overflow-hidden',
          device === 'desktop' && 'max-w-full rounded-2xl border border-stone-200/80 min-h-screen',
          device === 'tablet' && 'max-w-[768px] rounded-3xl border-8 border-stone-800 shadow-2xl min-h-[900px]',
          device === 'mobile' && 'max-w-[390px] rounded-[44px] border-[10px] border-stone-900 shadow-2xl min-h-[800px] relative'
        )}
      >
        {/* Mobile top notch simulation */}
        {device === 'mobile' && (
          <div className="sticky top-0 z-50 h-6 bg-stone-900 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-4 bg-black rounded-b-xl" />
          </div>
        )}

        {/* Live Template Content */}
        <div className="w-full min-h-full">
          <TemplateRenderer wedding={wedding} isLivePreview={true} />
        </div>
      </div>
    </div>
  );
}
