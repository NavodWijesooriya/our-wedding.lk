'use client';

import React, { useState } from 'react';
import { WeddingProject } from '@/types/wedding';
import { CountdownTimer } from './common/CountdownTimer';
import { MusicPlayer } from './common/MusicPlayer';
import { RsvpForm } from './common/RsvpForm';
import { PhotoLightbox } from './common/PhotoLightbox';
import { AddToCalendar } from './common/AddToCalendar';
import { SocialShare } from './common/SocialShare';
import { AnimatedSection } from './common/AnimatedSection';
import { motion } from 'motion/react';
import { formatDate } from '@/lib/utils';
import { Crown, Sparkles, MapPin, Calendar, Clock, Navigation, Heart } from 'lucide-react';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
}

export function LuxuryGoldTemplate({ wedding }: TemplateProps) {
  const { details, themeConfig } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#f4ecd8] font-cinzel selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Gold particle dust overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center px-6 sm:px-12 py-20 sm:py-28 overflow-hidden">
          {/* Ornate Gold Border Frame */}
          <div className="absolute inset-3 sm:inset-8 border border-[#d4af37]/25 pointer-events-none rounded-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0e0d0b] px-4 text-[#d4af37] text-[10px] sm:text-xs uppercase tracking-[0.25em] flex items-center gap-2">
              <Crown className="w-3.5 h-3.5" />
              <span>Royal Union</span>
              <Crown className="w-3.5 h-3.5" />
            </div>
            {/* Corner flourishes */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]" />
          </div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content Column */}
            <div className={`space-y-6 ${details.heroImage ? 'lg:col-span-7 text-center lg:text-left' : 'lg:col-span-12 text-center max-w-3xl mx-auto'}`}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1710] border border-[#d4af37]/40 text-[#d4af37] text-[11px] uppercase tracking-[0.25em]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Together In Holy Matrimony</span>
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#f8f1de] leading-tight"
              >
                <span className="gold-shimmer block">{details.brideName}</span>
                <span className="block text-2xl sm:text-3xl text-[#d4af37] my-2 font-serif italic lowercase font-light">
                  and
                </span>
                <span className="gold-shimmer block">{details.groomName}</span>
              </motion.h1>

              {/* Event Quick Info Capsule */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 bg-[#16130d]/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-[#d4af37]/30 text-xs sm:text-sm text-[#e6dcbf] font-sans"
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
                <div className="flex items-center gap-2 truncate max-w-[240px]">
                  <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span className="truncate">{details.ceremonyVenue}</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
              >
                {details.showRsvp && (
                  <a
                    href="#rsvp"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38f2a] hover:from-[#e5c04b] hover:to-[#c69f33] text-black font-sans text-xs tracking-wider uppercase font-bold transition-all shadow-lg hover:shadow-[#d4af37]/20 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>RSVP to Celebrate</span>
                    <Heart className="w-3.5 h-3.5 fill-black" />
                  </a>
                )}
                <div className="font-sans">
                  <AddToCalendar
                    title={`${coupleNames} Wedding`}
                    weddingDate={details.weddingDate}
                    weddingTime={details.weddingTime}
                    location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                    description={details.invitationMessage}
                    className="border-[#d4af37]/40 text-[#f4ecd8] hover:bg-[#d4af37]/10"
                  />
                </div>
              </motion.div>

              {/* Countdown */}
              {details.showCountdown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.45 }}
                  className="pt-2"
                >
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37]/80 font-sans mb-3">
                    Counting down the days
                  </p>
                  <div className="inline-block">
                    <CountdownTimer
                      weddingDate={details.weddingDate}
                      weddingTime={details.weddingTime}
                      cardClassName="bg-[#171511]/90 border border-[#d4af37]/40 text-[#f4ecd8]"
                      numberClassName="text-[#d4af37]"
                      labelClassName="text-[#a89f8c]"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Hero Portrait in Royal Arched Frame */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4 rounded-t-full border-2 border-[#d4af37]/80 p-2 bg-[#171511] shadow-2xl overflow-hidden group">
                  <div className="w-full h-full rounded-t-full overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={details.heroImage}
                      alt={coupleNames}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b]/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-5 left-5 right-5 text-center text-[#f4ecd8] backdrop-blur-md bg-black/60 border border-[#d4af37]/30 p-3 rounded-2xl font-sans">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold">
                        {weddingFormattedDate}
                      </p>
                      <p className="text-xs truncate text-[#e6dcbf] mt-0.5">{details.ceremonyVenue}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Animated Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#d4af37]/70 font-sans cursor-pointer hover:text-[#d4af37] transition"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-4 h-7 rounded-full border border-[#d4af37]/40 flex items-start justify-center p-1"
            >
              <div className="w-1 h-1.5 rounded-full bg-[#d4af37]" />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Invitation Proclamation */}
      {details.showInvitationMessage && (
        <AnimatedSection>
          <section className="py-20 px-6 max-w-3xl mx-auto text-center border-t border-[#d4af37]/20">
            <Crown className="w-8 h-8 text-[#d4af37] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-4xl font-normal uppercase tracking-wider text-[#d4af37] mb-6">
              {details.invitationHeadline}
            </h2>
            <p className="text-[#c7bea8] font-sans font-light text-base sm:text-lg leading-relaxed">
              {details.invitationMessage}
            </p>
          </section>
        </AnimatedSection>
      )}

      {/* Love Story */}
      {details.showStory && details.milestones && details.milestones.length > 0 && (
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37]">Our Chronicle</span>
            <h2 className="text-3xl sm:text-4xl uppercase tracking-wider text-[#f4ecd8] mt-2">
              {details.storyTitle || 'The Tale Of Our Love'}
            </h2>
          </div>

          <div className="space-y-8">
            {details.milestones.map((m, idx) => (
              <div
                key={m.id || idx}
                className="bg-[#151410] border border-[#d4af37]/30 p-8 rounded-xl shadow-lg relative"
              >
                <span className="text-xs tracking-widest uppercase text-[#d4af37] block mb-2 font-semibold">
                  {m.yearOrDate}
                </span>
                <h3 className="text-xl uppercase tracking-wider text-[#f8f1de] mb-3">{m.title}</h3>
                <p className="text-[#a89f8c] font-sans text-sm leading-relaxed">{m.description}</p>
                {m.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.image}
                    alt={m.title}
                    className="mt-6 rounded-lg w-full max-h-64 object-cover border border-[#d4af37]/20"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Venues */}
      {details.showVenue && (
        <section className="py-20 px-6 max-w-5xl mx-auto border-t border-[#d4af37]/20">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37]">Grand Locations</span>
            <h2 className="text-3xl sm:text-4xl uppercase tracking-wider text-[#f4ecd8] mt-2">
              Ceremony & Reception
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#151410] border border-[#d4af37]/40 p-8 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37]">Ceremony</span>
                <h3 className="text-2xl text-[#f4ecd8] uppercase tracking-wide mt-2 mb-2">
                  {details.ceremonyVenue}
                </h3>
                <p className="text-xs text-[#d4af37] font-sans mb-3">
                  {details.ceremonyTime || details.weddingTime}
                </p>
                <p className="text-sm font-sans text-[#a89f8c] leading-relaxed">
                  {details.ceremonyAddress}
                </p>
              </div>
              {details.mapsUrl && (
                <a
                  href={details.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  View Map
                </a>
              )}
            </div>

            <div className="bg-[#151410] border border-[#d4af37]/40 p-8 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37]">Reception</span>
                <h3 className="text-2xl text-[#f4ecd8] uppercase tracking-wide mt-2 mb-2">
                  {details.receptionVenue}
                </h3>
                <p className="text-xs text-[#d4af37] font-sans mb-3">
                  {details.receptionTime || 'Evening Reception'}
                </p>
                <p className="text-sm font-sans text-[#a89f8c] leading-relaxed">
                  {details.receptionAddress}
                </p>
              </div>
              {details.mapsUrl && (
                <a
                  href={details.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  View Directions
                </a>
              )}
            </div>
          </div>

          <div className="text-center mt-10">
            <AddToCalendar
              title={`${coupleNames} Wedding`}
              weddingDate={details.weddingDate}
              weddingTime={details.weddingTime}
              location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
              description={details.invitationMessage}
            />
          </div>
        </section>
      )}

      {/* Gallery */}
      {details.showGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37]">Treasured Memories</span>
            <h2 className="text-3xl uppercase tracking-wider text-[#f4ecd8] mt-2">Gallery</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {details.galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-square border border-[#d4af37]/30 overflow-hidden cursor-pointer group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          {lightboxIndex !== null && (
            <PhotoLightbox
              images={details.galleryImages}
              currentIndex={lightboxIndex}
              isOpen={lightboxIndex !== null}
              onClose={() => setLightboxIndex(null)}
              onSelectIndex={(idx) => setLightboxIndex(idx)}
            />
          )}
        </section>
      )}

      {/* RSVP */}
      {details.showRsvp && (
        <section id="rsvp" className="py-24 px-6 border-t border-[#d4af37]/20">
          <RsvpForm
            weddingId={wedding.id}
            coupleNames={coupleNames}
            primaryColor={themeConfig.primaryColor || '#d4af37'}
            themeStyle="luxury"
          />
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 text-center border-t border-[#d4af37]/20 space-y-6">
        <SocialShare title={`${coupleNames}'s Wedding`} />
        <p className="text-xs uppercase tracking-widest text-[#d4af37]">{coupleNames}</p>
        <p className="text-[10px] uppercase tracking-widest text-stone-500">
          Powered by EternalTie Luxury Studio
        </p>
      </footer>

      {details.enableMusic && details.musicUrl && (
        <MusicPlayer musicUrl={details.musicUrl} musicTitle={details.musicTitle} />
      )}
    </div>
  );
}
