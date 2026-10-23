'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Heart,
  MapPin,
  Share2,
  ChevronUp,
  Volume2,
  VolumeX,
  Check,
  Compass,
} from 'lucide-react';
import { WeddingProject } from '@/types/wedding';

interface GuestControlDockProps {
  wedding: WeddingProject;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
  primaryColor?: string;
}

export function GuestControlDock({
  wedding,
  isPlayingMusic = false,
  onToggleMusic,
  primaryColor = '#e11d48',
}: GuestControlDockProps) {
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${wedding.details.brideName} & ${wedding.details.groomName}'s Wedding`,
          text: `You're cordially invited to celebrate the wedding of ${wedding.details.brideName} & ${wedding.details.groomName}!`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build calendar links
  const weddingTitle = `${wedding.details.brideName} & ${wedding.details.groomName}'s Wedding Celebration`;
  const weddingDesc = `${wedding.details.invitationMessage || 'Wedding Ceremony & Reception'}\nVenue: ${wedding.details.ceremonyVenue}, ${wedding.details.ceremonyAddress}`;
  const weddingLoc = `${wedding.details.ceremonyVenue}, ${wedding.details.ceremonyAddress}`;
  const startDateStr = (wedding.details.weddingDate || '2026-12-31').replace(/-/g, '');
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(weddingTitle)}&dates=${startDateStr}T103000Z/${startDateStr}T173000Z&details=${encodeURIComponent(weddingDesc)}&location=${encodeURIComponent(weddingLoc)}`;

  const mapsUrl = wedding.details.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${wedding.details.ceremonyVenue} ${wedding.details.ceremonyAddress}`)}`;

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 flex justify-center items-center pointer-events-none px-4">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto relative"
      >
        {/* Calendar Quick Popup */}
        <AnimatePresence>
          {calendarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: -8, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl p-3 shadow-2xl border border-stone-200/80 text-left text-xs z-50 space-y-1.5"
            >
              <div className="px-2 py-1 font-semibold text-stone-900 border-b border-stone-100 flex items-center justify-between">
                <span>Save Date to:</span>
                <span className="text-[10px] text-stone-400 font-normal">Add Event</span>
              </div>
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCalendarOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-stone-700 font-medium transition"
              >
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                Google Calendar
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCalendarOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-stone-700 font-medium transition"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                View Location on Map
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Glass Dock */}
        <div className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/90 backdrop-blur-xl border border-white/70 shadow-2xl shadow-stone-900/15 ring-1 ring-black/5">
          {/* Music Equalizer / Player Toggle */}
          {wedding.details.enableMusic && wedding.details.musicUrl && (
            <button
              onClick={onToggleMusic}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                isPlayingMusic
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs'
                  : 'hover:bg-stone-100 text-stone-600'
              }`}
              title={isPlayingMusic ? 'Pause Romantic Music' : 'Play Romantic Music'}
            >
              {isPlayingMusic ? (
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-0.5 bg-rose-500 animate-[soundwave_1.2s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-rose-500 animate-[soundwave_0.9s_ease-in-out_infinite_0.2s]" />
                  <span className="w-0.5 bg-rose-500 animate-[soundwave_1.4s_ease-in-out_infinite_0.4s]" />
                  <span className="w-0.5 bg-rose-500 animate-[soundwave_1.1s_ease-in-out_infinite_0.1s]" />
                </div>
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
              )}
              <span className="text-[11px] font-semibold hidden md:inline">
                {isPlayingMusic ? 'Music Playing' : 'Play Music'}
              </span>
            </button>
          )}

          {/* Add to Calendar Dropdown Button */}
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            title="Save Wedding Date to Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-[11px] hidden sm:inline">Calendar</span>
          </button>

          {/* Quick RSVP Button */}
          {wedding.details.showRsvp && (
            <button
              onClick={() => scrollToSection('rsvp')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600"
              title="Jump to RSVP Form"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
              <span>RSVP</span>
            </button>
          )}

          {/* Venue Directions */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            title="Open Venue in Google Maps"
          >
            <Compass className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-[11px] hidden sm:inline">Directions</span>
          </a>

          {/* Share Invitation Link */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            title="Share or Copy Invitation Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                <span className="text-[11px] hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Scroll to Top */}
          {scrolled && (
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition cursor-pointer"
              title="Back to Top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
