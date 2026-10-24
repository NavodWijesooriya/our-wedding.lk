'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WeddingProject } from '@/types/wedding';
import { CountdownTimer } from './common/CountdownTimer';
import { MusicPlayer } from './common/MusicPlayer';
import { RsvpForm } from './common/RsvpForm';
import { PhotoLightbox } from './common/PhotoLightbox';
import { AddToCalendar } from './common/AddToCalendar';
import { SocialShare } from './common/SocialShare';
import { AnimatedSection } from './common/AnimatedSection';
import { GuestbookWall } from './common/GuestbookWall';
import { formatDate } from '@/lib/utils';
import { Sparkles, Calendar, Clock, MapPin, Navigation, Heart } from 'lucide-react';

import { WeddingGuest } from '@/types/rsvp';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
  guest?: WeddingGuest | null;
}

export function TraditionalWeddingTemplate({ wedding, isLivePreview = false, guest }: TemplateProps) {
  const { details, themeConfig } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#4a0e17] font-cormorant selection:bg-rose-900 selection:text-white text-lg">
      {/* Ornate Arch Header Motif */}
      <div className="h-3 bg-gradient-to-r from-[#881337] via-[#d4af37] to-[#881337]" />

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center px-6 sm:px-12 py-16 sm:py-24 overflow-hidden bg-[radial-gradient(#fecdd3_0.5px,transparent_0.5px)] [background-size:24px_24px]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className={`space-y-6 ${details.heroImage ? 'lg:col-span-7 text-center lg:text-left' : 'lg:col-span-12 text-center max-w-3xl mx-auto'}`}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#ffe4e6] border border-[#f43f5e]/30 text-[#881337] text-xs font-sans uppercase tracking-widest font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Ceremony of Holy Matrimony</span>
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#881337] leading-[0.95]"
              >
                <span>{details.brideName}</span>
                <span className="block text-3xl sm:text-4xl text-[#d4af37] font-serif my-2 italic font-normal">
                  weds
                </span>
                <span>{details.groomName}</span>
              </motion.h1>

              {/* Event Quick Info Capsule */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-[#fecdd3] text-xs sm:text-sm text-stone-800 font-sans shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#881337]" />
                  <span className="font-semibold text-[#881337]">{weddingFormattedDate}</span>
                </div>
                <span className="text-rose-200 hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#881337]" />
                  <span>{details.weddingTime}</span>
                </div>
                <span className="text-rose-200 hidden sm:inline">|</span>
                <div className="flex items-center gap-2 truncate max-w-[240px]">
                  <MapPin className="w-4 h-4 text-[#881337] shrink-0" />
                  <span className="truncate">{details.ceremonyVenue}</span>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 font-sans"
              >
                {details.showRsvp && (
                  <a
                    href="#rsvp"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#881337] hover:bg-[#70102e] text-white text-xs tracking-wider uppercase font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>RSVP to Celebrate</span>
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </a>
                )}
                <AddToCalendar
                  title={`${coupleNames} Wedding`}
                  weddingDate={details.weddingDate}
                  weddingTime={details.weddingTime}
                  location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                  description={details.invitationMessage}
                  className="rounded-full border-[#fecdd3] hover:bg-rose-50"
                />
              </motion.div>

              {/* Countdown Timer */}
              {details.showCountdown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.45 }}
                  className="pt-2 font-sans"
                >
                  <p className="text-[11px] uppercase tracking-widest text-[#881337]/80 mb-3 font-semibold">
                    Auspicious Day Approaches
                  </p>
                  <div className="inline-block">
                    <CountdownTimer
                      weddingDate={details.weddingDate}
                      weddingTime={details.weddingTime}
                      cardClassName="bg-white border-[#fecdd3] shadow-xs"
                      numberClassName="text-[#881337]"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Hero Portrait in Royal Gold Beveled Frame */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#d4af37] p-1.5 bg-white group">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={details.heroImage}
                      alt={coupleNames}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#881337]/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-5 left-5 right-5 text-center text-white backdrop-blur-md bg-black/40 border border-white/20 p-3 rounded-xl font-sans">
                      <p className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
                        {weddingFormattedDate}
                      </p>
                      <p className="font-serif text-sm truncate mt-0.5">{details.ceremonyVenue}</p>
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
            className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#881337]/70 font-sans cursor-pointer hover:text-[#881337] transition"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-4 h-7 rounded-full border border-[#881337]/40 flex items-start justify-center p-1"
            >
              <div className="w-1 h-1.5 rounded-full bg-[#881337]" />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Invitation */}
      {details.showInvitationMessage && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 max-w-3xl mx-auto text-center border-y border-[#fecdd3]">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#881337] mb-6">
              {details.invitationHeadline}
            </h2>
            <p className="text-stone-700 font-sans font-light text-base sm:text-lg leading-relaxed">
              {details.invitationMessage}
            </p>
          </section>
        </AnimatedSection>
      )}

      {/* Milestones */}
      {details.showStory && details.milestones && details.milestones.length > 0 && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl sm:text-5xl text-[#881337] font-bold">
                {details.storyTitle || 'Our Story'}
              </h2>
            </div>

            <div className="space-y-8 font-sans">
              {details.milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="bg-white p-8 rounded-2xl border border-[#fecdd3] shadow-sm flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow"
                >
                  {m.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.image}
                      alt={m.title}
                      className="w-full md:w-48 h-40 object-cover rounded-xl shrink-0"
                    />
                  )}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-[#881337] font-bold">
                      {m.yearOrDate}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-stone-900">{m.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Venues */}
      {details.showVenue && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl sm:text-5xl text-[#881337] font-bold">Auspicious Venues</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              <div className="bg-white p-8 rounded-2xl border border-[#fecdd3] shadow-sm">
                <span className="text-xs uppercase tracking-wider text-[#881337] font-bold">Ceremony</span>
                <h3 className="text-2xl font-serif text-stone-900 mt-2 mb-1">{details.ceremonyVenue}</h3>
                <p className="text-xs text-[#881337] font-medium mb-3">
                  {details.ceremonyTime || details.weddingTime}
                </p>
                <p className="text-sm text-stone-600 leading-relaxed">{details.ceremonyAddress}</p>
                {details.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#881337] hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    View On Maps
                  </a>
                )}
              </div>

              <div className="bg-white p-8 rounded-2xl border border-[#fecdd3] shadow-sm">
                <span className="text-xs uppercase tracking-wider text-[#881337] font-bold">Reception</span>
                <h3 className="text-2xl font-serif text-stone-900 mt-2 mb-1">{details.receptionVenue}</h3>
                <p className="text-xs text-[#881337] font-medium mb-3">
                  {details.receptionTime || 'Reception & Feast'}
                </p>
                <p className="text-sm text-stone-600 leading-relaxed">{details.receptionAddress}</p>
                {details.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#881337] hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    View Directions
                  </a>
                )}
              </div>
            </div>

            <div className="text-center mt-10 font-sans">
              <AddToCalendar
                title={`${coupleNames} Wedding`}
                weddingDate={details.weddingDate}
                weddingTime={details.weddingTime}
                location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                description={details.invitationMessage}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Gallery */}
      {details.showGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl text-[#881337] font-bold">Gallery</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {details.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-[#d4af37]/40 cursor-pointer group hover:scale-[1.02] transition-transform"
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
        </AnimatedSection>
      )}

      {/* Guestbook Wall */}
      <AnimatedSection animation="fade-up">
        <GuestbookWall
          coupleNames={coupleNames}
          primaryColor="#881337"
          accentColor="#fff1f2"
          isDark={false}
        />
      </AnimatedSection>

      {/* RSVP */}
      {details.showRsvp && (
        <AnimatedSection animation="fade-up" id="rsvp">
          <section className="py-24 px-6 bg-[#fff1f2] font-sans" id="rsvp">
            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor={themeConfig.primaryColor || '#881337'}
              themeStyle="traditional"
              guest={guest}
            />
          </section>
        </AnimatedSection>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 text-center border-t border-[#fecdd3] space-y-6 font-sans">
        <SocialShare title={`${coupleNames}'s Wedding`} />
        <p className="text-sm uppercase tracking-widest text-[#881337] font-serif">{coupleNames}</p>
        <p className="text-xs text-stone-400">Created with EternalTie Studio</p>
      </footer>

      {details.enableMusic && details.musicUrl && (
        <MusicPlayer musicUrl={details.musicUrl} musicTitle={details.musicTitle} />
      )}
    </div>
  );
}
