'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  musicUrl: string;
  musicTitle: string;
  autoPlay?: boolean;
  className?: string;
}

export function MusicPlayer({
  musicUrl,
  musicTitle,
  autoPlay = false,
  className,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && autoPlay) {
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay, musicUrl]);

  // Listen for envelope open event to start music seamlessly on user gesture
  useEffect(() => {
    const handleOpened = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    window.addEventListener('wedding-invitation-opened', handleOpened);
    return () => window.removeEventListener('wedding-invitation-opened', handleOpened);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback prevented:', err));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!musicUrl) return null;

  return (
    <div
      className={cn(
        'fixed top-5 right-5 z-40 flex items-center gap-3 bg-stone-900/90 hover:bg-stone-900 text-white px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-xl transition-all duration-300 border border-white/15 group cursor-pointer select-none',
        className
      )}
      onClick={togglePlay}
      title={isPlaying ? 'Pause Romantic Music' : 'Play Romantic Music'}
    >
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
      />

      {/* Rotating Disc / Soundwave Equalizer */}
      <div className="relative flex items-center justify-center">
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5 w-4 justify-center">
            <span className="w-0.5 bg-rose-400 rounded-full animate-[soundwave_1.1s_ease-in-out_infinite]" />
            <span className="w-0.5 bg-rose-400 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite_0.2s]" />
            <span className="w-0.5 bg-rose-400 rounded-full animate-[soundwave_1.3s_ease-in-out_infinite_0.4s]" />
            <span className="w-0.5 bg-rose-400 rounded-full animate-[soundwave_0.9s_ease-in-out_infinite_0.1s]" />
          </div>
        ) : (
          <Disc3 className="w-4 h-4 text-stone-400 group-hover:text-rose-400 transition" />
        )}
      </div>

      {/* Title & Status */}
      <div className="flex flex-col max-w-36 truncate">
        <span className="text-[11px] font-semibold text-stone-100 truncate">
          {musicTitle || 'Romantic Melody'}
        </span>
        <span className="text-[9px] text-stone-400">
          {isPlaying ? 'Playing' : 'Paused'}
        </span>
      </div>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="p-1 rounded-full text-stone-400 hover:text-white transition"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
