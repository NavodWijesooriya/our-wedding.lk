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
import { Trees, Leaf, MapPin, Calendar, Clock, Navigation, Heart } from 'lucide-react';

import { WeddingGuest } from '@/types/rsvp';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
  guest?: WeddingGuest | null;
}

export function RomanticGardenTemplate({ wedding, isLivePreview = false, guest }: TemplateProps) {
  const { details, themeConfig } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  return (
    <div className="min-h-screen bg-[#f7f9f6] text-[#2c3e2d] font-cormorant selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden text-lg">
      {/* Organic foliage background tint */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#84a98c_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center px-6 sm:px-12 py-16 sm:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className={`space-y-6 ${details.heroImage ? 'lg:col-span-7 text-center lg:text-left' : 'lg:col-span-12 text-center max-w-3xl mx-auto'}`}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e9f0e8] border border-[#cbd5c7] text-[#2d6a4f] text-xs tracking-widest uppercase font-sans font-medium"
              >
                <Leaf className="w-3.5 h-3.5 text-[#52796f]" />
                <span>Join Our Celebration In Nature</span>
                <Leaf className="w-3.5 h-3.5 text-[#52796f]" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[#1e2f1f] leading-[0.95]"
              >
                <span className="block italic">{details.brideName}</span>
                <span className="text-3xl sm:text-4xl lg:text-5xl text-[#658a67] font-serif block my-1 font-light">
                  &
                </span>
                <span className="block italic">{details.groomName}</span>
              </motion.h1>

              {/* Event Quick Info Capsule */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-[#cbd5c7] text-xs sm:text-sm text-[#2c3e2d] font-sans shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2d6a4f]" />
                  <span className="font-semibold">{weddingFormattedDate}</span>
                </div>
                <span className="text-[#cbd5c7] hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2d6a4f]" />
                  <span>{details.weddingTime}</span>
                </div>
                <span className="text-[#cbd5c7] hidden sm:inline">|</span>
                <div className="flex items-center gap-2 truncate max-w-[240px]">
                  <MapPin className="w-4 h-4 text-[#2d6a4f] shrink-0" />
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
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs tracking-wider uppercase font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
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
                  className="rounded-full border-[#cbd5c7] hover:bg-[#e9f0e8]"
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
                  <p className="text-[11px] uppercase tracking-widest text-[#52796f] mb-3 font-medium">
                    Counting down to our forever
                  </p>
                  <div className="inline-block">
                    <CountdownTimer
                      weddingDate={details.weddingDate}
                      weddingTime={details.weddingTime}
                      cardClassName="bg-[#ffffff]/95 border-[#cbd5c7] text-[#2c3e2d] rounded-2xl shadow-xs"
                      numberClassName="text-[#2d6a4f]"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Hero Portrait in Arched Botanical Frame */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4 rounded-t-[160px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-white/90 ring-1 ring-[#cbd5c7] group bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={details.heroImage}
                    alt={coupleNames}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2f1f]/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 text-center text-white backdrop-blur-md bg-black/40 border border-white/20 p-3 rounded-2xl font-sans">
                    <p className="text-[11px] uppercase tracking-widest text-[#84a98c] font-semibold">
                      {weddingFormattedDate}
                    </p>
                    <p className="font-serif text-sm truncate mt-0.5">{details.ceremonyVenue}</p>
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
            className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#52796f] font-sans cursor-pointer hover:text-[#1e2f1f] transition"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-4 h-7 rounded-full border border-[#cbd5c7] flex items-start justify-center p-1"
            >
              <div className="w-1 h-1.5 rounded-full bg-[#2d6a4f]" />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Invitation */}
      {details.showInvitationMessage && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 max-w-3xl mx-auto text-center">
            <Trees className="w-10 h-10 text-[#52796f] mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-normal text-[#1e2f1f] mb-6">
              {details.invitationHeadline}
            </h2>
            <p className="text-[#354f52] font-sans font-light text-base sm:text-lg leading-relaxed">
              {details.invitationMessage}
            </p>
          </section>
        </AnimatedSection>
      )}

      {/* Love Story */}
      {details.showStory && details.milestones && details.milestones.length > 0 && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-widest text-[#52796f] font-sans font-medium">
                Growing Together
              </span>
              <h2 className="text-4xl sm:text-5xl text-[#1e2f1f] mt-1">
                {details.storyTitle || 'How Our Love Bloomed'}
              </h2>
            </div>

            <div className="space-y-8 font-sans">
              {details.milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="bg-white p-8 rounded-3xl border border-[#cbd5c7]/60 shadow-xs flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow"
                >
                  {m.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.image}
                      alt={m.title}
                      className="w-full md:w-48 h-40 object-cover rounded-2xl shrink-0"
                    />
                  )}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-[#52796f] font-semibold">
                      {m.yearOrDate}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1e2f1f]">{m.title}</h3>
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
              <span className="text-sm uppercase tracking-widest text-[#52796f] font-sans">Locations</span>
              <h2 className="text-4xl sm:text-5xl text-[#1e2f1f] mt-1">The Setting</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              <div className="bg-white p-8 rounded-3xl border border-[#cbd5c7]/70 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#52796f] font-bold">The Ceremony</span>
                  <h3 className="text-2xl font-serif text-[#1e2f1f] mt-2 mb-1">{details.ceremonyVenue}</h3>
                  <p className="text-xs text-[#52796f] font-medium mb-3">
                    {details.ceremonyTime || details.weddingTime}
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed">{details.ceremonyAddress}</p>
                </div>
                {details.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#2d6a4f] hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    View On Google Maps
                  </a>
                )}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#cbd5c7]/70 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#52796f] font-bold">The Reception</span>
                  <h3 className="text-2xl font-serif text-[#1e2f1f] mt-2 mb-1">{details.receptionVenue}</h3>
                  <p className="text-xs text-[#52796f] font-medium mb-3">
                    {details.receptionTime || 'Dinner & Merriment'}
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed">{details.receptionAddress}</p>
                </div>
                {details.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#2d6a4f] hover:underline"
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
              <span className="text-sm uppercase tracking-widest text-[#52796f] font-sans">Memories</span>
              <h2 className="text-4xl text-[#1e2f1f] mt-1">Our Favorite Frames</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {details.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-square rounded-2xl overflow-hidden shadow-xs border border-[#cbd5c7]/60 cursor-pointer group hover:scale-[1.02] transition-transform"
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
          primaryColor="#2d6a4f"
          accentColor="#e9f0e8"
          isDark={false}
        />
      </AnimatedSection>

      {/* RSVP */}
      {details.showRsvp && (
        <AnimatedSection animation="fade-up" id="rsvp">
          <section className="py-24 px-6 bg-[#edf2eb] font-sans" id="rsvp">
            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor={themeConfig.primaryColor || '#2d6a4f'}
              themeStyle="garden"
              guest={guest}
            />
          </section>
        </AnimatedSection>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 text-center border-t border-[#cbd5c7] space-y-6 font-sans">
        <SocialShare title={`${coupleNames}'s Wedding`} />
        <p className="text-sm uppercase tracking-widest text-[#52796f] font-serif">{coupleNames}</p>
        <p className="text-xs text-stone-400">Created with EternalTie Studio</p>
      </footer>

      {details.enableMusic && details.musicUrl && (
        <MusicPlayer musicUrl={details.musicUrl} musicTitle={details.musicTitle} />
      )}
    </div>
  );
}
