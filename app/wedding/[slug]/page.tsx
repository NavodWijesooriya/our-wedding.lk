'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getWeddingBySlug } from '@/services/weddingService';
import { getGuestByCode } from '@/services/guestService';
import { WeddingProject } from '@/types/wedding';
import { WeddingGuest } from '@/types/rsvp';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { Heart, Lock, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function PublicWeddingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const guestCode = searchParams?.get('guest') || null;

  const [wedding, setWedding] = useState<WeddingProject | null>(null);
  const [guest, setGuest] = useState<WeddingGuest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWedding() {
      if (!slug) return;
      try {
        const item = await getWeddingBySlug(slug);
        setWedding(item);

        if (item && guestCode) {
          try {
            const identifiedGuest = await getGuestByCode(item.id, guestCode);
            setGuest(identifiedGuest);
          } catch {
            // Non-fatal if guest code not found
          }
        }
      } catch (err) {
        console.error('Failed to load wedding invitation:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWedding();
  }, [slug, guestCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] text-stone-600 gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
          <Heart className="w-6 h-6 animate-pulse" />
        </div>
        <p className="font-serif text-lg tracking-wide text-stone-800">
          Unfolding Your Invitation...
        </p>
      </div>
    );
  }

  // Not found or unpublished
  if (!wedding || wedding.status !== 'published') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfbf9] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
          Private or Unavailable
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4 max-w-md">
          This Wedding Invitation Is Not Yet Published
        </h1>
        <p className="text-sm text-stone-500 max-w-md mb-8 leading-relaxed">
          The hosts are currently putting the final touches on their celebration details. Please
          check back once the invitation link has been officially shared.
        </p>
        <Link href="/">
          <Button variant="outline" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Return to EternalTie Homepage
          </Button>
        </Link>
      </div>
    );
  }

  return <TemplateRenderer wedding={wedding} isLivePreview={false} guest={guest} />;
}

export default function PublicWeddingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] text-stone-600 gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <p className="font-serif text-lg tracking-wide text-stone-800">
            Unfolding Your Invitation...
          </p>
        </div>
      }
    >
      <PublicWeddingContent />
    </React.Suspense>
  );
}
