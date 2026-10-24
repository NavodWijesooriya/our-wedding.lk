'use client';

import React, { useState } from 'react';
import { WeddingProject } from '@/types/wedding';
import { CountdownTimer } from './common/CountdownTimer';
import { MusicPlayer } from './common/MusicPlayer';
import { RsvpForm } from './common/RsvpForm';
import { PhotoLightbox } from './common/PhotoLightbox';
import { AddToCalendar } from './common/AddToCalendar';
import { AnimatedSection } from './common/AnimatedSection';
import { GuestbookWall } from './common/GuestbookWall';
import { motion } from 'motion/react';
import { formatDate } from '@/lib/utils';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  Heart,
  Crown,
  Flame,
  Users,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

import { WeddingGuest } from '@/types/rsvp';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
  guest?: WeddingGuest | null;
}

// Traditional Sri Lankan Brass Oil Lamp (පහන) SVG with flickering flame
function TraditionalOilLamp({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Animated Sacred Flame */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.9, 1, 0.85, 1, 0.9],
        }}
        transition={{
          repeat: Infinity,
          duration: 2.2,
          ease: 'easeInOut',
        }}
        className="relative flex items-center justify-center -mb-1"
      >
        <div className="w-5 h-7 rounded-full bg-gradient-to-t from-[#ea580c] via-[#f59e0b] to-[#fef08a] blur-[1px] shadow-[0_0_14px_#f59e0b]" />
        <div className="absolute w-2 h-4 rounded-full bg-white blur-[0.5px]" />
      </motion.div>

      {/* Brass Lamp Head & Stem SVG */}
      <svg
        viewBox="0 0 100 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-20 text-[#d4af37]"
      >
        <defs>
          <linearGradient id="brassGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d77f" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8c6d1d" />
          </linearGradient>
        </defs>

        {/* Lamp bowl / oil reservoir */}
        <path
          d="M 25 15 C 35 25 65 25 75 15 C 75 35 60 45 50 48 C 40 45 25 35 25 15 Z"
          fill="url(#brassGold)"
        />
        {/* Decorative bowl rim */}
        <ellipse cx="50" cy="15" rx="26" ry="6" fill="#f5d77f" stroke="#8c6d1d" strokeWidth="1" />

        {/* Traditional carved pillar column */}
        <rect x="46" y="48" width="8" height="42" rx="2" fill="url(#brassGold)" />
        <ellipse cx="50" cy="62" rx="9" ry="4" fill="#f5d77f" />
        <ellipse cx="50" cy="78" rx="10" ry="4" fill="#f5d77f" />

        {/* Tiered pedestal base */}
        <path
          d="M 32 90 C 40 90 60 90 68 90 L 76 115 L 24 115 Z"
          fill="url(#brassGold)"
        />
        <ellipse cx="50" cy="115" rx="30" ry="7" fill="url(#brassGold)" stroke="#8c6d1d" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

// Traditional Kandyan Carved Filigree Divider SVG
function KandyanLatticeDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-[1px] w-20 sm:w-36 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-[#d4af37]" />
      <div className="flex items-center gap-1.5 text-[#d4af37]">
        <Crown className="w-4 h-4" />
        <span className="text-xs font-cinzel tracking-[0.3em] uppercase">ශ්‍රී</span>
        <Crown className="w-4 h-4" />
      </div>
      <div className="h-[1px] w-20 sm:w-36 bg-gradient-to-l from-transparent via-[#d4af37]/60 to-[#d4af37]" />
    </div>
  );
}

export function CeylonHeritageTemplate({ wedding, isLivePreview = false, guest }: TemplateProps) {
  const { details } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  return (
    <div className="min-h-screen bg-[#2b0308] text-[#fbebd0] font-cormorant selection:bg-[#d4af37] selection:text-black relative overflow-x-hidden">
      {/* Traditional Kandyan Damask & Gilded Ambient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#d4af37 1px, transparent 1px), radial-gradient(#e5c158 1px, #2b0308 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-20 sm:py-28 text-center overflow-hidden">
          {/* Ornate Gold Border & Kandyan Arch Frame */}
          <div className="absolute inset-3 sm:inset-6 border border-[#d4af37]/40 pointer-events-none rounded-xl">
            <div className="absolute inset-1.5 border border-[#d4af37]/20 rounded-lg" />
            {/* Corner flourishes */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-20 space-y-6 pt-10">
            {/* Sacred Brass Oil Lamp Lighting the Union */}
            <TraditionalOilLamp className="mb-2" />

            {/* Jayamangala / Traditional Sri Lankan Blessing Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#42050e]/90 border border-[#d4af37]/50 text-[#f5d77f] text-xs font-cinzel tracking-[0.25em] uppercase shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>
                {details.culturalBlessing || 'ජය මංගලම් • Royal Matrimonial Blessing'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            </motion.div>

            {/* Couple Photo in Regal Kandyan Octagonal Gold Frame */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative mx-auto w-44 sm:w-56 md:w-64 aspect-[4/5] p-2.5 rounded-3xl bg-gradient-to-b from-[#f5d77f] via-[#d4af37] to-[#8c6d1d] shadow-2xl"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden bg-[#3b050d] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={details.heroImage}
                    alt={coupleNames}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b0308]/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            )}

            {/* Couple Names in Majestic Serif */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-normal uppercase tracking-wider text-[#fff4df]">
                <span className="bg-gradient-to-r from-[#fef08a] via-[#f5d77f] to-[#d4af37] bg-clip-text text-transparent">
                  {details.brideName}
                </span>
                <span className="block text-2xl sm:text-3xl text-[#d4af37] my-1 font-serif italic lowercase font-light">
                  and
                </span>
                <span className="bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#fef08a] bg-clip-text text-transparent">
                  {details.groomName}
                </span>
              </h1>
              {details.brideFullName && details.groomFullName && (
                <p className="text-xs sm:text-sm text-[#f5d77f]/90 font-sans tracking-[0.2em] uppercase">
                  {details.brideFullName} & {details.groomFullName}
                </p>
              )}
            </motion.div>

            <KandyanLatticeDivider />

            {/* Event Capsule */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-[#3d050f]/90 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-[#d4af37]/40 text-xs sm:text-sm text-[#fae5c3] font-sans shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <span className="tracking-wider uppercase font-medium">{weddingFormattedDate}</span>
              </div>
              <span className="text-[#d4af37]/40 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>{details.weddingTime}</span>
              </div>
              <span className="text-[#d4af37]/40 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span className="font-medium">{details.ceremonyVenue}</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-3"
            >
              {details.showRsvp && (
                <a
                  href="#rsvp"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#b89025] hover:brightness-110 text-black font-sans text-xs tracking-widest uppercase font-bold transition-all shadow-xl hover:shadow-[#d4af37]/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>RSVP to Celebrate</span>
                  <Heart className="w-3.5 h-3.5 fill-black" />
                </a>
              )}
              <div className="font-sans">
                <AddToCalendar
                  title={`${coupleNames} Ceylon Heritage Wedding`}
                  weddingDate={details.weddingDate}
                  weddingTime={details.weddingTime}
                  location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                  description={details.invitationMessage}
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Parents & Family Lineage Section */}
      {(details.brideParents || details.groomParents) && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37]">
              Sacred Heritage
            </span>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-normal text-[#fff4df]">
              With Parental Blessings
            </h2>
            <KandyanLatticeDivider />
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#ecd2ab] italic">
              Blessed with ancestral traditions and guided by the love of our families, we take our sacred vows upon the Poruwa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-[#39040d]/90 border border-[#d4af37]/40 shadow-xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#4f0612] border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37]">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-cinzel uppercase tracking-widest text-[#d4af37]">
                Bride&apos;s Revered Parents
              </div>
              <h3 className="text-2xl font-bold text-[#fff4df]">
                {details.brideParents || 'The Montgomery Family'}
              </h3>
              <p className="text-sm text-[#ecd2ab]/80 font-sans">
                Bestowing blessings upon {details.brideName}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#39040d]/90 border border-[#d4af37]/40 shadow-xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#4f0612] border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37]">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-cinzel uppercase tracking-widest text-[#d4af37]">
                Groom&apos;s Revered Parents
              </div>
              <h3 className="text-2xl font-bold text-[#fff4df]">
                {details.groomParents || 'The Vance Family'}
              </h3>
              <p className="text-sm text-[#ecd2ab]/80 font-sans">
                Bestowing blessings upon {details.groomName}
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Countdown Section */}
      {details.showCountdown && (
        <AnimatedSection className="py-16 sm:py-20 px-4 bg-[#230206] border-y border-[#d4af37]/30">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37]">
              The Auspicious Countdown
            </span>
            <h2 className="text-3xl sm:text-4xl font-cinzel text-[#fff4df]">
              Awaiting The Auspicious Nakatha
            </h2>
            <div className="pt-4 inline-block">
              <CountdownTimer
                weddingDate={details.weddingDate}
                weddingTime={details.weddingTime}
                cardClassName="bg-[#39040d]/90 border border-[#d4af37]/40 text-[#fff4df]"
                numberClassName="text-[#f5d77f]"
                labelClassName="text-[#ecd2ab]"
              />
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Poruwa Ceremonial Schedule */}
      {details.showSchedule && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37]">
              Poruwa Rituals
            </span>
            <h2 className="text-3xl sm:text-5xl font-cinzel text-[#fff4df]">
              Order of Ceremonial Rites
            </h2>
            <KandyanLatticeDivider />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                time: details.auspiciousTime || '09:42 AM',
                title: 'Auspicious Arrival',
                desc: 'Arrival to the sounds of traditional Magul Bera and greeting with betel leaves.',
              },
              {
                time: details.poruwaCeremonyTime || '10:15 AM',
                title: 'Poruwa Ceremony',
                desc: 'Ascending the sacred Poruwa, chanting of blessings, and uniting with sacred Pirith thread.',
              },
              {
                time: details.ceremonyTime?.split('-')?.[1]?.trim() || '11:30 AM',
                title: 'Marriage Registry',
                desc: 'Official signing and solemnization of the civil union before witnesses.',
              },
              {
                time: details.receptionTime?.split('-')?.[0]?.trim() || '12:30 PM',
                title: 'Royal Banquet',
                desc: 'Celebratory feast, lighting of the ceremonial oil lamp, and grand toasts.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#39040d]/80 border border-[#d4af37]/30 hover:border-[#d4af37] transition shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-cinzel text-[#d4af37] font-bold">
                    Phase 0{idx + 1}
                  </span>
                  <span className="text-xs font-sans text-[#f5d77f] px-2.5 py-0.5 rounded-full bg-[#4f0612] border border-[#d4af37]/40">
                    {step.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#fff4df]">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#ecd2ab]/80 font-sans leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* Venues Section */}
      {details.showVenue && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37]">
              Royal Destinations
            </span>
            <h2 className="text-3xl sm:text-5xl font-cinzel text-[#fff4df]">
              Ceremony & Banquet Venues
            </h2>
            <KandyanLatticeDivider />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-[#39040d]/90 border border-[#d4af37]/40 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4f0612] text-[#f5d77f] text-xs font-cinzel uppercase">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Poruwa Ceremony</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#fff4df]">
                  {details.ceremonyVenue}
                </h3>
                <p className="text-sm text-[#ecd2ab]/80 font-sans">
                  {details.ceremonyAddress}
                </p>
              </div>
              {details.mapsUrl && (
                <a
                  href={details.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89025] text-black text-xs font-sans uppercase font-bold tracking-wider shadow-md hover:brightness-110 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Location Map</span>
                </a>
              )}
            </div>

            <div className="p-8 rounded-2xl bg-[#39040d]/90 border border-[#d4af37]/40 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4f0612] text-[#f5d77f] text-xs font-cinzel uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Royal Banquet</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#fff4df]">
                  {details.receptionVenue}
                </h3>
                <p className="text-sm text-[#ecd2ab]/80 font-sans">
                  {details.receptionAddress}
                </p>
              </div>
              {details.mapsUrl && (
                <a
                  href={details.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89025] text-black text-xs font-sans uppercase font-bold tracking-wider shadow-md hover:brightness-110 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              )}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Gallery Section */}
      {details.showGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 bg-[#230206] border-t border-[#d4af37]/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-3 mb-14">
              <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37]">
                Memories in Gold
              </span>
              <h2 className="text-3xl sm:text-5xl font-cinzel text-[#fff4df]">
                The Royal Portrait Gallery
              </h2>
              <KandyanLatticeDivider />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {details.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer relative group border border-[#d4af37]/40 shadow-xl bg-[#39040d]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Portrait ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#2b0308]/0 group-hover:bg-[#2b0308]/40 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 rounded-full bg-[#f5d77f] text-black text-xs font-cinzel font-bold shadow-lg">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Guestbook Wall */}
      <GuestbookWall
        coupleNames={coupleNames}
        primaryColor="#d4af37"
        accentColor="#2a040b"
        isDark={true}
      />

      {/* RSVP Section */}
      {details.showRsvp && (
        <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-8 max-w-3xl mx-auto relative z-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#39040d] border-2 border-[#d4af37]/60 shadow-2xl relative">
            <div className="text-center space-y-3 mb-10">
              <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37]">
                Your Revered Presence
              </span>
              <h2 className="text-3xl sm:text-5xl font-cinzel text-[#fff4df]">
                RSVP to Celebrate
              </h2>
              <KandyanLatticeDivider />
              <p className="text-sm sm:text-base text-[#ecd2ab] font-sans">
                Please honor us with your response as we finalize the guest seats for our auspicious celebrations.
              </p>
            </div>

            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor="#d4af37"
              themeStyle="luxury"
              guest={guest}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-[#d4af37]/30 bg-[#1c0205] text-xs sm:text-sm text-[#ecd2ab]/70 font-sans space-y-2">
        <p className="font-cinzel text-[#fff4df] tracking-wider text-base">
          {coupleNames}
        </p>
        <p>{weddingFormattedDate} • Ceylon Heritage Matrimony</p>
      </footer>

      {/* Lightbox */}
      {details.galleryImages && lightboxIndex !== null && (
        <PhotoLightbox
          images={details.galleryImages}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onSelectIndex={(idx: number) => setLightboxIndex(idx)}
        />
      )}

      {/* Music Player */}
      {details.enableMusic && details.musicUrl && (
        <MusicPlayer
          musicUrl={details.musicUrl}
          musicTitle={details.musicTitle || 'Royal Kandyan Ceremony Melody'}
        />
      )}
    </div>
  );
}
