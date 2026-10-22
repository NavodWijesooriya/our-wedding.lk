'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Globe,
  ExternalLink,
  Check,
  AlertCircle,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { WeddingProject } from '@/types/wedding';
import { motion } from 'motion/react';

interface EditorHeaderProps {
  wedding: WeddingProject;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onSave: () => Promise<void>;
  onTogglePublish: () => Promise<void>;
  device: 'desktop' | 'tablet' | 'mobile';
  setDevice: (d: 'desktop' | 'tablet' | 'mobile') => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function EditorHeader({
  wedding,
  hasUnsavedChanges,
  isSaving,
  saveStatus = 'idle',
  onSave,
  onTogglePublish,
  device,
  setDevice,
  isSidebarOpen = true,
  onToggleSidebar,
}: EditorHeaderProps) {
  const isPublished = wedding.status === 'published';

  return (
    <header className="h-16 border-b border-stone-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
      {/* Left: Back & Project Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/dashboard/weddings"
          className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
          title="Back to Weddings"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            title={isSidebarOpen ? 'Hide Editor Panel' : 'Show Editor Panel'}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-stone-600" />
            ) : (
              <PanelLeftOpen className="w-5 h-5 text-rose-600" />
            )}
          </button>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-stone-900 truncate max-w-36 sm:max-w-xs font-serif">
              {wedding.title}
            </h1>
            <Badge variant={isPublished ? 'emerald' : 'stone'} size="sm">
              {isPublished ? 'Live' : 'Draft'}
            </Badge>
          </div>

          {/* Animated Save Status Indicator */}
          <div className="text-[11px] flex items-center gap-1.5 h-4">
            {isSaving || saveStatus === 'saving' ? (
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving changes...
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            ) : saveStatus === 'error' ? (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Save failed
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-500" /> All changes saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Device preview switch */}
      <div className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200">
        <button
          onClick={() => setDevice('desktop')}
          className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
            device === 'desktop'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
          title="Desktop View"
        >
          <Monitor className="w-4 h-4" />
          <span className="hidden lg:inline">Desktop</span>
        </button>
        <button
          onClick={() => setDevice('tablet')}
          className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
            device === 'tablet'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
          title="Tablet View"
        >
          <Tablet className="w-4 h-4" />
          <span className="hidden lg:inline">Tablet</span>
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
            device === 'mobile'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
          title="Mobile View"
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden lg:inline">Mobile</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {isPublished && (
          <a
            href={`/wedding/${wedding.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              Live Site
            </Button>
          </a>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save
        </Button>

        <Button
          variant={isPublished ? 'outline' : 'primary'}
          size="sm"
          onClick={onTogglePublish}
          leftIcon={<Globe className="w-4 h-4" />}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </Button>
      </div>
    </header>
  );
}
