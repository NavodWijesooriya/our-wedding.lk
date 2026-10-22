'use client';

import React from 'react';
import { WeddingProject, WeddingDetails } from '@/types/wedding';
import { Switch } from '@/components/ui/Switch';
import { Layers } from 'lucide-react';

interface TabProps {
  wedding: WeddingProject;
  onChangeDetails: (details: Partial<WeddingDetails>) => void;
}

export function SectionsTab({ wedding, onChangeDetails }: TabProps) {
  const { details } = wedding;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-500" />
          Section Visibility & Layout
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Toggle which sections appear on your live wedding website.
        </p>
      </div>

      <div className="divide-y divide-stone-100 bg-white rounded-2xl border border-stone-200 p-2 sm:p-4">
        <Switch
          checked={details.showHero}
          onChange={(checked) => onChangeDetails({ showHero: checked })}
          label="Hero & Couple Names Banner"
          description="Large header with couple's names, date, and main portrait"
        />

        <Switch
          checked={details.showCountdown}
          onChange={(checked) => onChangeDetails({ showCountdown: checked })}
          label="Live Wedding Countdown"
          description="Interactive countdown timer ticking down to the ceremony"
        />

        <Switch
          checked={details.showInvitationMessage}
          onChange={(checked) => onChangeDetails({ showInvitationMessage: checked })}
          label="Invitation Message & Parents"
          description="Personalized note welcoming your family and friends"
        />

        <Switch
          checked={details.showStory}
          onChange={(checked) => onChangeDetails({ showStory: checked })}
          label="Love Story Timeline"
          description="Chronological journey and milestone photos"
        />

        <Switch
          checked={details.showVenue}
          onChange={(checked) => onChangeDetails({ showVenue: checked })}
          label="Ceremony & Reception Venues"
          description="Venue names, addresses, schedule, and Google Maps directions"
        />

        <Switch
          checked={details.showGallery}
          onChange={(checked) => onChangeDetails({ showGallery: checked })}
          label="Photo Gallery & Lightbox"
          description="Grid of memories with full-screen viewer"
        />

        <Switch
          checked={details.showDressCode}
          onChange={(checked) => onChangeDetails({ showDressCode: checked })}
          label="Dress Code & Travel Accommodations"
          description="Attire guidelines, hotel block info, and logistics"
        />

        <Switch
          checked={details.showRsvp}
          onChange={(checked) => onChangeDetails({ showRsvp: checked })}
          label="Guest RSVP Form"
          description="Allow guests to confirm attendance and party size online"
        />

        <Switch
          checked={details.showContact}
          onChange={(checked) => onChangeDetails({ showContact: checked })}
          label="Contact & Social Sharing"
          description="Share via WhatsApp/Facebook and direct contact email/phone"
        />
      </div>
    </div>
  );
}
