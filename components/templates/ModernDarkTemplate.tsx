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
import { Moon, Star, MapPin, Calendar, Clock, Navigation, Heart } from 'lucide-react';

import { WeddingGuest } from '@/types/rsvp';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
  guest?: WeddingGuest | null;
}

export function ModernDarkTemplate({ wedding, isLivePreview = false, guest }: TemplateProps) {
  const { details, themeConfig } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-playfair selection:bg-amber-400 selection:text-black overflow-x-hidden">
      {/* Starry subtle dots */}
      <div className="fixed inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:36px_36px]" />

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center px-6 sm:px-12 py-20 sm:py-28 overflow-hidden">
          {/* Subtle amber ambient glow in corner */}
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className={`space-y-6 ${details.heroImage ? 'lg:col-span-7 text-center lg:text-left' : 'lg:col-span-12 text-center max-w-3xl mx-auto'}`}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900/90 border border-stone-800 text-amber-300 text-xs tracking-widest uppercase shadow-inner backdrop-blur-xs font-sans"
              >
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>An Evening Under The Stars</span>
                <Star className="w-3.5 h-3.5 text-amber-400" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[0.95]"
              >
                <span className="block italic">{details.brideName}</span>
                <span className="text-3xl sm:text-4xl text-amber-400 font-sans block my-2 font-light">
                  &
                </span>
                <span className="block italic">{details.groomName}</span>
              </motion.h1>

              {/* Event Quick Info Capsule */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 bg-stone-900/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-stone-800 text-xs sm:text-sm text-stone-300 font-sans shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">{weddingFormattedDate}</span>
                </div>
                <span className="text-stone-700 hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{details.weddingTime}</span>
                </div>
                <span className="text-stone-700 hidden sm:inline">|</span>
                <div className="flex items-center gap-2 truncate max-w-[240px]">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
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
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs tracking-wider uppercase font-bold transition-all shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>RSVP to Celebrate</span>
                    <Heart className="w-3.5 h-3.5 fill-black" />
                  </a>
                )}
                <AddToCalendar
                  title={`${coupleNames} Wedding`}
                  weddingDate={details.weddingDate}
                  weddingTime={details.weddingTime}
                  location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                  description={details.invitationMessage}
                  className="rounded-full border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800 hover:text-white"
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
                  <p className="text-[11px] uppercase tracking-widest text-stone-500 mb-3 font-medium">
                    Counting down until nightfall
                  </p>
                  <div className="inline-block">
                    <CountdownTimer
                      weddingDate={details.weddingDate}
                      weddingTime={details.weddingTime}
                      cardClassName="bg-stone-900/90 border border-stone-800 text-white"
                      numberClassName="text-amber-300 font-serif"
                      labelClassName="text-stone-400"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Hero Portrait with Amber Rim Lighting */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 group bg-stone-900 ring-1 ring-amber-400/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={details.heroImage}
                    alt={coupleNames}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 text-center text-white backdrop-blur-md bg-black/60 border border-stone-800 p-3 rounded-2xl font-sans">
                    <p className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
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
            className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-[10px] tracking-widest uppercase text-stone-500 font-sans cursor-pointer hover:text-amber-300 transition"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-4 h-7 rounded-full border border-stone-700 flex items-start justify-center p-1"
            >
              <div className="w-1 h-1.5 rounded-full bg-amber-400" />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Invitation Letter */}
      {details.showInvitationMessage && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 max-w-3xl mx-auto text-center border-y border-stone-800/80">
            <Star className="w-6 h-6 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-normal text-white mb-6">
              {details.invitationHeadline}
            </h2>
            <p className="text-stone-300 font-sans font-light text-base sm:text-lg leading-relaxed">
              {details.invitationMessage}
            </p>
          </section>
        </AnimatedSection>
      )}

      {/* Story */}
      {details.showStory && details.milestones && details.milestones.length > 0 && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-sans">
                Our Journey
              </span>
              <h2 className="text-3xl sm:text-4xl text-white mt-2">
                {details.storyTitle || 'The Journey To Forever'}
              </h2>
            </div>

            <div className="space-y-8 font-sans">
              {details.milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="bg-stone-900 border border-stone-800 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center hover:border-amber-400/30 transition-colors"
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
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                      {m.yearOrDate}
                    </span>
                    <h3 className="text-xl font-serif text-white">{m.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">{m.description}</p>
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
              <span className="text-xs uppercase tracking-widest text-amber-400 font-sans">Location</span>
              <h2 className="text-3xl sm:text-4xl text-white mt-2">The Night Ahead</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              <div className="bg-stone-900 border border-stone-800 p-8 rounded-2xl flex flex-col justify-between hover:border-amber-400/30 transition-colors">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Ceremony</span>
                  <h3 className="text-2xl font-serif text-white mt-2 mb-1">{details.ceremonyVenue}</h3>
                  <p className="text-xs text-stone-400 mb-3">{details.ceremonyTime || details.weddingTime}</p>
                  <p className="text-sm text-stone-400 leading-relaxed">{details.ceremonyAddress}</p>
                </div>
                {details.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    View Map
                  </a>
                )}
              </div>

              <div className="bg-stone-900 border border-stone-800 p-8 rounded-2xl flex flex-col justify-between hover:border-amber-400/30 transition-colors">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Reception</span>
                  <h3 className="text-2xl font-serif text-white mt-2 mb-1">{details.receptionVenue}</h3>
                  <p className="text-xs text-stone-400 mb-3">{details.receptionTime || 'Evening Dinner & Dancing'}</p>
                  <p className="text-sm text-stone-400 leading-relaxed">{details.receptionAddress}</p>
                </div>
                {details.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Directions
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
              <h2 className="text-3xl text-white">Moments</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {details.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-square rounded-2xl overflow-hidden border border-stone-800 cursor-pointer group hover:scale-[1.02] transition-transform"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
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
          primaryColor="#d97706"
          accentColor="#292524"
          isDark={true}
        />
      </AnimatedSection>

      {/* RSVP */}
      {details.showRsvp && (
        <AnimatedSection animation="fade-up" id="rsvp">
          <section className="py-24 px-6 border-t border-stone-800 font-sans" id="rsvp">
            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor={themeConfig.primaryColor || '#d97706'}
              themeStyle="dark"
              guest={guest}
            />
          </section>
        </AnimatedSection>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 text-center border-t border-stone-800 space-y-6 font-sans">
        <SocialShare title={`${coupleNames}'s Wedding`} />
        <p className="text-xs uppercase tracking-widest text-amber-400 font-serif">{coupleNames}</p>
        <p className="text-[10px] text-stone-600">Created with EternalTie Studio</p>
      </footer>

      {details.enableMusic && details.musicUrl && (
        <MusicPlayer musicUrl={details.musicUrl} musicTitle={details.musicTitle} />
      )}
    </div>
  );
}
