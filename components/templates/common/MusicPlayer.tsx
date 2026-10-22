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
            // Autoplay with sound is often blocked by browsers until first user click
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay, musicUrl]);

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
        'fixed bottom-5 right-5 z-40 flex items-center gap-3 bg-stone-900/90 hover:bg-stone-900 text-white px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 border border-white/10 group cursor-pointer select-none',
        className
      )}
      onClick={togglePlay}
      title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
    >
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
      />

      {/* Rotating disc icon */}
      <div className="relative">
        <Disc3
          className={cn(
            'w-6 h-6 text-rose-400 transition-all',
            isPlaying && 'animate-spin [animation-duration:3s]'
          )}
        />
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        )}
      </div>

      {/* Title & Status */}
      <div className="flex flex-col max-w-44 truncate">
        <span className="text-xs font-semibold text-stone-100 truncate flex items-center gap-1.5">
          <Music className="w-3 h-3 text-rose-400 shrink-0" />
          {musicTitle || 'Wedding Melody'}
        </span>
        <span className="text-[10px] text-stone-400">
          {isPlaying ? 'Playing • Click to pause' : 'Music paused • Click to play'}
        </span>
      </div>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="p-1 rounded-full text-stone-400 hover:text-white transition"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
