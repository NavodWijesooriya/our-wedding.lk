'use client';

import React, { useState } from 'react';
import { WeddingProject } from '@/types/wedding';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { isSlugAvailable } from '@/services/weddingService';
import { slugify } from '@/lib/utils';
import { Globe, Copy, Check, ExternalLink, QrCode, AlertCircle, CheckCircle } from 'lucide-react';

interface TabProps {
  wedding: WeddingProject;
  onChangeSlug: (slug: string) => void;
  onTogglePublish: () => Promise<void>;
  isSaving: boolean;
}

export function PublishTab({ wedding, onChangeSlug, onTogglePublish, isSaving }: TabProps) {
  const [slugInput, setSlugInput] = useState(wedding.slug);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<'available' | 'taken' | 'invalid' | null>(null);
  const [copied, setCopied] = useState(false);

  const isPublished = wedding.status === 'published';
  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/wedding/${wedding.slug}`
    : `/wedding/${wedding.slug}`;

  const handleSlugInputChange = (val: string) => {
    const formatted = slugify(val);
    setSlugInput(formatted);
    setSlugStatus(null);
  };

  const handleCheckSlug = async () => {
    if (!slugInput || slugInput.length < 3) {
      setSlugStatus('invalid');
      return;
    }
    setCheckingSlug(true);
    try {
      const avail = await isSlugAvailable(slugInput, wedding.id);
      if (avail) {
        setSlugStatus('available');
        onChangeSlug(slugInput);
      } else {
        setSlugStatus('taken');
      }
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Publishing & Public Web Address</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure your unique web address slug and publish your website to the world.
        </p>
      </div>

      {/* Status Card */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-stone-900">Website Status:</h4>
            <Badge variant={isPublished ? 'emerald' : 'stone'}>
              {isPublished ? 'Published & Live' : 'Unpublished (Draft)'}
            </Badge>
          </div>
          <p className="text-xs text-stone-500">
            {isPublished
              ? 'Your wedding website is public and accessible to anyone with the link.'
              : 'Your website is currently private. Only you can view this page while editing.'}
          </p>
        </div>

        <Button
          variant={isPublished ? 'outline' : 'primary'}
          size="md"
          onClick={onTogglePublish}
          isLoading={isSaving}
          leftIcon={<Globe className="w-4 h-4" />}
        >
          {isPublished ? 'Unpublish Website' : 'Publish Website Now'}
        </Button>
      </div>

      {/* Slug Configuration */}
      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          Personalized URL Slug
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              value={slugInput}
              onChange={(e) => handleSlugInputChange(e.target.value)}
              placeholder="e.g. sophia-and-julian"
              leftElement={<span className="text-stone-400 text-xs">/wedding/</span>}
            />
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={handleCheckSlug}
            isLoading={checkingSlug}
          >
            Apply Slug
          </Button>
        </div>

        {slugStatus === 'available' && (
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> This custom slug is available and applied!
          </p>
        )}
        {slugStatus === 'taken' && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> This URL is already claimed by another wedding. Please pick another one.
          </p>
        )}
        {slugStatus === 'invalid' && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Slug must be at least 3 alphanumeric characters.
          </p>
        )}
      </div>

      {/* Live Public URL Card */}
      {isPublished && (
        <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-4">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-rose-600" />
            Your Live Invitation Address
          </h4>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-rose-200 text-xs font-mono text-stone-800 break-all select-all">
            <span>{publicUrl}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Invitation Link'}
            </Button>

            <a href={`/wedding/${wedding.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Open Live Page
              </Button>
            </a>
          </div>

          <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-stone-400" />
            <span>Tip: Print this link or generate a QR code for your paper invitations so guests can RSVP online!</span>
          </div>
        </div>
      )}
    </div>
  );
}
