'use client';

import React from 'react';
import { WeddingProject, WeddingDetails, StoryMilestone } from '@/types/wedding';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Heart } from 'lucide-react';

interface TabProps {
  wedding: WeddingProject;
  onChangeDetails: (details: Partial<WeddingDetails>) => void;
}

export function StoryTab({ wedding, onChangeDetails }: TabProps) {
  const { details } = wedding;

  const handleAddMilestone = () => {
    const newMilestone: StoryMilestone = {
      id: 'm_' + Date.now().toString(36),
      yearOrDate: '2026',
      title: 'Our Special Moment',
      description: 'Describe this meaningful chapter in your relationship...',
      image: '',
    };
    onChangeDetails({
      milestones: [...(details.milestones || []), newMilestone],
    });
  };

  const handleUpdateMilestone = (id: string, updates: Partial<StoryMilestone>) => {
    const updated = (details.milestones || []).map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    onChangeDetails({ milestones: updated });
  };

  const handleRemoveMilestone = (id: string) => {
    const filtered = (details.milestones || []).filter((m) => m.id !== id);
    onChangeDetails({ milestones: filtered });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Invitation & Love Story</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Write a personalized welcome message and share your journey together.
        </p>
      </div>

      {/* Main Invitation Note */}
      <div className="space-y-4">
        <Input
          label="Invitation Headline"
          value={details.invitationHeadline}
          onChange={(e) => onChangeDetails({ invitationHeadline: e.target.value })}
          placeholder="e.g. Together With Our Families"
        />

        <Textarea
          label="Personalized Invitation Message"
          value={details.invitationMessage}
          onChange={(e) => onChangeDetails({ invitationMessage: e.target.value })}
          rows={4}
          placeholder="Write the heartfelt message that your guests will read..."
        />
      </div>

      {/* Story Timeline */}
      <div className="border-t border-stone-100 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Love Story Milestones
            </h4>
            <p className="text-xs text-stone-500">
              Highlight key chapters (how you met, first date, engagement, etc.)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddMilestone}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Milestone
          </Button>
        </div>

        <Input
          label="Story Section Title"
          value={details.storyTitle}
          onChange={(e) => onChangeDetails({ storyTitle: e.target.value })}
          placeholder="e.g. Our Love Story"
        />

        <Input
          label="Story Subtitle / Intro"
          value={details.storyIntro}
          onChange={(e) => onChangeDetails({ storyIntro: e.target.value })}
          placeholder="e.g. From a coffee shop encounter to forever..."
        />

        {/* Milestones list */}
        <div className="space-y-4 mt-4">
          {(!details.milestones || details.milestones.length === 0) && (
            <p className="text-xs text-stone-400 italic text-center py-4 bg-stone-50 rounded-xl">
              No milestones added yet. Click &quot;Add Milestone&quot; above to create one.
            </p>
          )}

          {details.milestones?.map((m, idx) => (
            <div
              key={m.id || idx}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Chapter {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(m.id)}
                  className="text-stone-400 hover:text-red-600 p-1 rounded-md transition"
                  title="Delete milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Date / Period"
                  value={m.yearOrDate}
                  onChange={(e) => handleUpdateMilestone(m.id, { yearOrDate: e.target.value })}
                  placeholder="e.g. Summer 2022"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Milestone Title"
                    value={m.title}
                    onChange={(e) => handleUpdateMilestone(m.id, { title: e.target.value })}
                    placeholder="e.g. First Date in Central Park"
                  />
                </div>
              </div>

              <Textarea
                label="Story Description"
                value={m.description}
                onChange={(e) => handleUpdateMilestone(m.id, { description: e.target.value })}
                rows={2}
                placeholder="What happened during this moment?"
              />

              <Input
                label="Milestone Photo URL (Optional)"
                value={m.image || ''}
                onChange={(e) => handleUpdateMilestone(m.id, { image: e.target.value })}
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
