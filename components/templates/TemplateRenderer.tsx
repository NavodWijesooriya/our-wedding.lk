'use client';

import React, { useState } from 'react';
import { WeddingProject } from '@/types/wedding';
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
import { formatDate } from '@/lib/utils';

interface TemplateRendererProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
}

export function TemplateRenderer({ wedding, isLivePreview = false }: TemplateRendererProps) {
  const coupleNames = `${wedding.details.brideName} & ${wedding.details.groomName}`;
  const weddingFormattedDate = formatDate(wedding.details.weddingDate);

  const renderTemplate = () => {
    switch (wedding.templateId) {
      case 'elegant-floral':
        return <ElegantFloralTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      case 'minimalist-modern':
        return <MinimalistModernTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      case 'luxury-gold':
        return <LuxuryGoldTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      case 'romantic-garden':
        return <RomanticGardenTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      case 'traditional-wedding':
        return <TraditionalWeddingTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      case 'modern-dark':
        return <ModernDarkTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      case 'mandala-lotus':
        return <MandalaLotusTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      case 'ceylon-heritage':
        return <CeylonHeritageTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      case 'lotus-blossom':
        return <LotusBlossomTemplate wedding={wedding} isLivePreview={isLivePreview} />;
      default:
        return <ElegantFloralTemplate wedding={wedding} isLivePreview={isLivePreview} />;
    }
  };

  return (
    <>
      {!isLivePreview && (
        <EnvelopeOpener
          coupleNames={coupleNames}
          weddingDate={weddingFormattedDate}
        />
      )}
      {renderTemplate()}
    </>
  );
}
