'use client';

import React from 'react';
import { WeddingProject, WeddingDetails } from '@/types/wedding';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { MapPin, ExternalLink } from 'lucide-react';

interface TabProps {
  wedding: WeddingProject;
  onChangeDetails: (details: Partial<WeddingDetails>) => void;
}

export function VenuesTab({ wedding, onChangeDetails }: TabProps) {
  const { details } = wedding;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Venues & Locations</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Provide ceremony and reception venue information and map links for your guests.
        </p>
      </div>

      {/* Ceremony Section */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
            <MapPin className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">Wedding Ceremony</h4>
        </div>

        <Input
          label="Ceremony Venue Name"
          value={details.ceremonyVenue}
          onChange={(e) => onChangeDetails({ ceremonyVenue: e.target.value })}
          placeholder="e.g. St. Patrick's Cathedral"
          required
        />

        <Input
          label="Ceremony Address"
          value={details.ceremonyAddress}
          onChange={(e) => onChangeDetails({ ceremonyAddress: e.target.value })}
          placeholder="e.g. 5th Ave, New York, NY 10022"
          required
        />

        <Input
          label="Ceremony Time Range"
          value={details.ceremonyTime || ''}
          onChange={(e) => onChangeDetails({ ceremonyTime: e.target.value })}
          placeholder="e.g. 4:00 PM - 5:00 PM"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Input
            label="Auspicious Nakatha / Time (නැකත) (Optional)"
            value={details.auspiciousTime || ''}
            onChange={(e) => onChangeDetails({ auspiciousTime: e.target.value })}
            placeholder="e.g. 09:42 AM (නැකත)"
          />
          <Input
            label="Poruwa Ceremony Time (පෝරුව) (Optional)"
            value={details.poruwaCeremonyTime || ''}
            onChange={(e) => onChangeDetails({ poruwaCeremonyTime: e.target.value })}
            placeholder="e.g. 10:15 AM (පෝරුවේ චාරිත්‍ර)"
          />
        </div>
      </div>

      {/* Reception Section */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
            <MapPin className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">Wedding Reception</h4>
        </div>

        <Input
          label="Reception Venue Name"
          value={details.receptionVenue}
          onChange={(e) => onChangeDetails({ receptionVenue: e.target.value })}
          placeholder="e.g. The Grand Ballroom at Plaza Hotel"
          required
        />

        <Input
          label="Reception Address"
          value={details.receptionAddress}
          onChange={(e) => onChangeDetails({ receptionAddress: e.target.value })}
          placeholder="e.g. 768 5th Ave, New York, NY 10019"
          required
        />

        <Input
          label="Reception Time Range"
          value={details.receptionTime || ''}
          onChange={(e) => onChangeDetails({ receptionTime: e.target.value })}
          placeholder="e.g. 6:00 PM - 11:30 PM"
        />
      </div>

      {/* Google Maps Link */}
      <div className="space-y-2">
        <Input
          label="Google Maps URL"
          type="url"
          value={details.mapsUrl}
          onChange={(e) => onChangeDetails({ mapsUrl: e.target.value })}
          placeholder="https://maps.google.com/?q=..."
          helperText="Guests can click this link to open direct GPS navigation."
        />
      </div>

      {/* Dress Code & Notes */}
      <div className="border-t border-stone-100 pt-4 space-y-4">
        <Input
          label="Dress Code / Attire"
          value={details.dressCode || ''}
          onChange={(e) => onChangeDetails({ dressCode: e.target.value })}
          placeholder="e.g. Formal Black Tie • Pastel shades encouraged"
        />

        <Textarea
          label="Accommodations & Travel Notes"
          value={details.accommodationsNote || ''}
          onChange={(e) => onChangeDetails({ accommodationsNote: e.target.value })}
          placeholder="Information on hotel room blocks, shuttle buses, airport tips, parking..."
          rows={3}
        />
      </div>
    </div>
  );
}
