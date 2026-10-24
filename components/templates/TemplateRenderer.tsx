'use client';

import React, { useState } from 'react';
import { WeddingProject, WeddingTemplateId } from '@/types/wedding';
import { ElegantFloralTemplate } from './ElegantFloralTemplate';
import { MinimalistModernTemplate } from './MinimalistModernTemplate';
import { LuxuryGoldTemplate } from './LuxuryGoldTemplate';
import { RomanticGardenTemplate } from './RomanticGardenTemplate';
import { TraditionalWeddingTemplate } from './TraditionalWeddingTemplate';
import { ModernDarkTemplate } from './ModernDarkTemplate';
import { MandalaLotusTemplate } from './MandalaLotusTemplate';
import { CeylonHeritageTemplate } from './CeylonHeritageTemplate';
import { LotusBlossomTemplate } from './LotusBlossomTemplate';
import { EnvelopeOpener } from './common/EnvelopeOpener';
import { GuestControlDock } from './common/GuestControlDock';
import { FallingPetals } from './common/FallingPetals';
import { LiveTemplateSwitcher } from './common/LiveTemplateSwitcher';
import { formatDate } from '@/lib/utils';
import { WeddingGuest } from '@/types/rsvp';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface TemplateRendererProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
  guest?: WeddingGuest | null;
}

export function TemplateRenderer({ wedding, isLivePreview = false, guest }: TemplateRendererProps) {
  const [currentTemplateId, setCurrentTemplateId] = useState<WeddingTemplateId>(wedding.templateId);

  const activeWedding: WeddingProject = {
    ...wedding,
    templateId: currentTemplateId,
  };

  const coupleNames = `${wedding.details.brideName} & ${wedding.details.groomName}`;
  const weddingFormattedDate = formatDate(wedding.details.weddingDate);

  // Determine petal color theme based on selected template
  const getPetalTheme = (): 'rose' | 'gold' | 'green' | 'white' => {
    switch (currentTemplateId) {
      case 'luxury-gold':
      case 'ceylon-heritage':
      case 'mandala-lotus':
        return 'gold';
      case 'romantic-garden':
      case 'lotus-blossom':
        return 'green';
      case 'minimalist-modern':
      case 'modern-dark':
        return 'white';
      case 'elegant-floral':
      default:
        return 'rose';
    }
  };

  const renderTemplate = () => {
    switch (currentTemplateId) {
      case 'elegant-floral':
        return <ElegantFloralTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      case 'minimalist-modern':
        return <MinimalistModernTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      case 'luxury-gold':
        return <LuxuryGoldTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      case 'romantic-garden':
        return <RomanticGardenTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      case 'traditional-wedding':
        return <TraditionalWeddingTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      case 'modern-dark':
        return <ModernDarkTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      case 'mandala-lotus':
        return <MandalaLotusTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      case 'ceylon-heritage':
        return <CeylonHeritageTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      case 'lotus-blossom':
        return <LotusBlossomTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
      default:
        return <ElegantFloralTemplate wedding={activeWedding} isLivePreview={isLivePreview} guest={guest} />;
    }
  };

  return (
    <>
      {/* Floating Ambient Falling Petals */}
      <FallingPetals theme={getPetalTheme()} />

      {/* Instant Template Switcher Pill on public wedding page */}
      {!isLivePreview && (
        <LiveTemplateSwitcher
          currentTemplateId={currentTemplateId}
          onSelectTemplate={(t) => setCurrentTemplateId(t)}
        />
      )}

      {!isLivePreview && (
        <EnvelopeOpener
          coupleNames={coupleNames}
          weddingDate={weddingFormattedDate}
          guest={guest}
        />
      )}

      {/* Romantic Personalized Guest Welcome Ribbon */}
      {!isLivePreview && guest && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-30 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white text-xs py-2 px-4 text-center shadow-md flex items-center justify-center gap-2 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>
            Dearest <strong className="font-serif underline underline-offset-2">{guest.name}</strong>, you are warmly invited to celebrate with us!
          </span>
          {guest.seatsAllocated > 1 && (
            <span className="hidden sm:inline bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
              {guest.seatsAllocated} seats reserved
            </span>
          )}
        </motion.div>
      )}

      {renderTemplate()}

      {!isLivePreview && (
        <GuestControlDock
          wedding={activeWedding}
          primaryColor={activeWedding.themeConfig?.primaryColor}
        />
      )}
    </>
  );
}
