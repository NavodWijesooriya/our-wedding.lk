'use client';

import React from 'react';
import { WeddingProject, WeddingDetails } from '@/types/wedding';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface TabProps {
  wedding: WeddingProject;
  onChangeDetails: (details: Partial<WeddingDetails>) => void;
}

export function GeneralTab({ wedding, onChangeDetails }: TabProps) {
  const { details } = wedding;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Couple & Wedding Overview</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Basic information about the bride, groom, and wedding date.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bride's First Name"
          value={details.brideName}
          onChange={(e) => onChangeDetails({ brideName: e.target.value })}
          placeholder="e.g. Sophia"
          required
        />
        <Input
          label="Groom's First Name"
          value={details.groomName}
          onChange={(e) => onChangeDetails({ groomName: e.target.value })}
          placeholder="e.g. Julian"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bride's Full Name (Optional)"
          value={details.brideFullName || ''}
          onChange={(e) => onChangeDetails({ brideFullName: e.target.value })}
          placeholder="e.g. Sophia Marie Montgomery"
        />
        <Input
          label="Groom's Full Name (Optional)"
          value={details.groomFullName || ''}
          onChange={(e) => onChangeDetails({ groomFullName: e.target.value })}
          placeholder="e.g. Julian Alexander Vance"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Wedding Date"
          type="date"
          value={details.weddingDate}
          onChange={(e) => onChangeDetails({ weddingDate: e.target.value })}
          required
        />
        <Input
          label="Ceremony Start Time"
          value={details.weddingTime}
          onChange={(e) => onChangeDetails({ weddingTime: e.target.value })}
          placeholder="e.g. 4:00 PM"
        />
      </div>

      <div className="border-t border-stone-100 pt-5 space-y-4">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-700">
          Family Details (Optional)
        </h4>
        <Input
          label="Parents of the Bride"
          value={details.brideParents || ''}
          onChange={(e) => onChangeDetails({ brideParents: e.target.value })}
          placeholder="e.g. Mr. & Mrs. David Montgomery"
        />
        <Input
          label="Parents of the Groom"
          value={details.groomParents || ''}
          onChange={(e) => onChangeDetails({ groomParents: e.target.value })}
          placeholder="e.g. Dr. & Mrs. Edward Vance"
        />
        <Input
          label="Traditional / Cultural Blessing Heading (Optional)"
          value={details.culturalBlessing || ''}
          onChange={(e) => onChangeDetails({ culturalBlessing: e.target.value })}
          placeholder="e.g. දෙමාපියන්ගේ ආශිර්වාදය මැද • සාදර ඇරයුමයි!"
        />
      </div>

      <div className="border-t border-stone-100 pt-5 space-y-4">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-700">
          Contact Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Inquiries Email"
            type="email"
            value={details.contactEmail || ''}
            onChange={(e) => onChangeDetails({ contactEmail: e.target.value })}
            placeholder="e.g. wedding@example.com"
          />
          <Input
            label="Inquiries Phone"
            type="tel"
            value={details.contactPhone || ''}
            onChange={(e) => onChangeDetails({ contactPhone: e.target.value })}
            placeholder="e.g. +1 (555) 000-0000"
          />
        </div>
      </div>
    </div>
  );
}
