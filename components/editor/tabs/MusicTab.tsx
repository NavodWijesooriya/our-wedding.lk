'use client';

import React, { useState } from 'react';
import { WeddingProject, WeddingDetails } from '@/types/wedding';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input';
import { CURATED_MUSIC_TRACKS } from '@/lib/mockData';
import { Music, Play, Pause, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabProps {
  wedding: WeddingProject;
  onChangeDetails: (details: Partial<WeddingDetails>) => void;
}

export function MusicTab({ wedding, onChangeDetails }: TabProps) {
  const { details } = wedding;
  const [playingTrackUrl, setPlayingTrackUrl] = useState<string | null>(null);

  const toggleTestPlay = (url: string) => {
    if (playingTrackUrl === url) {
      setPlayingTrackUrl(null);
    } else {
      setPlayingTrackUrl(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Background Music</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Atmospheric wedding music plays automatically or on user click when guests view your site.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
        <Switch
          checked={details.enableMusic}
          onChange={(checked) => onChangeDetails({ enableMusic: checked })}
          label="Enable Background Music Player"
          description="Displays a romantic floating audio player with volume controls"
        />
      </div>

      {details.enableMusic && (
        <div className="space-y-6 pt-2">
          {/* Preset tracks */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Curated Royalty-Free Wedding Tracks
            </label>
            <div className="space-y-2">
              {CURATED_MUSIC_TRACKS.map((track) => {
                const isSelected = details.musicUrl === track.url;
                const isTesting = playingTrackUrl === track.url;
                return (
                  <div
                    key={track.title}
                    className={cn(
                      'p-3 rounded-xl border flex items-center justify-between transition cursor-pointer bg-white',
                      isSelected
                        ? 'border-rose-600 ring-1 ring-rose-600/30'
                        : 'border-stone-200 hover:border-stone-300'
                    )}
                    onClick={() =>
                      onChangeDetails({
                        musicUrl: track.url,
                        musicTitle: track.title,
                      })
                    }
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTestPlay(track.url);
                        }}
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-stone-700 transition cursor-pointer"
                        title={isTesting ? 'Pause preview' : 'Play preview'}
                      >
                        {isTesting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{track.title}</h4>
                        <p className="text-[11px] text-stone-500">{track.description}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {playingTrackUrl && (
              <audio src={playingTrackUrl} autoPlay onEnded={() => setPlayingTrackUrl(null)} />
            )}
          </div>

          {/* Custom audio track */}
          <div className="border-t border-stone-100 pt-4 space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-700">
              Custom Audio Track
            </h4>
            <Input
              label="Track Title"
              value={details.musicTitle || ''}
              onChange={(e) => onChangeDetails({ musicTitle: e.target.value })}
              placeholder="e.g. Can't Help Falling in Love"
            />
            <Input
              label="Audio Stream / MP3 URL"
              value={details.musicUrl || ''}
              onChange={(e) => onChangeDetails({ musicUrl: e.target.value })}
              placeholder="https://... (.mp3 or audio stream)"
            />
          </div>
        </div>
      )}
    </div>
  );
}
