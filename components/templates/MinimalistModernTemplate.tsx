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
import { ArrowUpRight, Calendar, Clock, MapPin, Mail, Phone, Shirt, Heart } from 'lucide-react';

import { WeddingGuest } from '@/types/rsvp';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
  guest?: WeddingGuest | null;
}

export function MinimalistModernTemplate({ wedding, isLivePreview = false, guest }: TemplateProps) {
  const { details, themeConfig } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      {/* Editorial Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-stone-200 px-6 sm:px-12 py-4 flex items-center justify-between text-xs tracking-widest uppercase text-stone-500"
      >
        <span className="font-medium text-stone-900">EternalTie Editorial</span>
        <span className="hidden sm:inline">The Marriage Of {coupleNames}</span>
        <span>{weddingFormattedDate}</span>
      </motion.div>

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative px-6 sm:px-12 py-16 sm:py-24 max-w-7xl mx-auto min-h-[88vh] flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Title & Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`space-y-8 ${details.heroImage ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'}`}
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-stone-400 block font-medium">
                  Together With Their Families
                </span>
                <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extralight tracking-tighter uppercase leading-[0.85] text-stone-950">
                  {details.brideName}
                  <span className="block text-stone-300 font-serif italic text-4xl sm:text-6xl my-2 lowercase">
                    and
                  </span>
                  {details.groomName}
                </h1>
              </div>

              {/* Event Metadata Bar */}
              <div className="pt-6 border-t border-stone-200 flex flex-wrap gap-8 text-xs tracking-wider uppercase text-stone-600">
                <div>
                  <span className="text-stone-400 block mb-1">Date</span>
                  <strong className="text-stone-900 font-medium">{weddingFormattedDate}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">Time</span>
                  <strong className="text-stone-900 font-medium">{details.weddingTime}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">Venue</span>
                  <strong className="text-stone-900 font-medium">{details.ceremonyVenue}</strong>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {details.showRsvp && (
                  <a
                    href="#rsvp"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-stone-950 hover:bg-stone-800 text-white text-xs tracking-widest uppercase font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>RSVP to Celebrate</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                <AddToCalendar
                  title={`${coupleNames} Wedding`}
                  weddingDate={details.weddingDate}
                  weddingTime={details.weddingTime}
                  location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                  description={details.invitationMessage}
                  className="rounded-none border-stone-300 hover:bg-stone-100"
                />
              </div>

              {details.showCountdown && (
                <div className="pt-6">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Countdown</p>
                  <CountdownTimer
                    weddingDate={details.weddingDate}
                    weddingTime={details.weddingTime}
                    cardClassName="bg-white border-stone-200 rounded-none shadow-none"
                    numberClassName="text-stone-900 font-sans"
                  />
                </div>
              )}
            </motion.div>

            {/* Editorial Portrait */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:col-span-5 relative aspect-3/4 bg-stone-100 overflow-hidden shadow-2xl group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={details.heroImage}
                  alt={coupleNames}
                  className="w-full h-full object-cover filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-left font-sans">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-300 font-medium">Official Invitation</p>
                  <p className="text-sm font-light mt-0.5">{details.ceremonyVenue}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Animated Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-[10px] tracking-widest uppercase text-stone-400 font-sans cursor-pointer hover:text-stone-900 transition"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
          >
            <span>Scroll Down</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-4 h-7 border border-stone-300 flex items-start justify-center p-1"
            >
              <div className="w-1 h-1.5 bg-stone-900" />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Invitation Text */}
      {details.showInvitationMessage && (
        <AnimatedSection animation="fade-up">
          <section className="border-y border-stone-200 py-20 px-6">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <span className="text-xs tracking-widest uppercase text-stone-400">The Vows</span>
              <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-stone-900">
                {details.invitationHeadline}
              </h2>
              <p className="text-stone-600 leading-relaxed font-light text-base sm:text-lg">
                {details.invitationMessage}
              </p>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Love Story / Milestones */}
      {details.showStory && details.milestones && details.milestones.length > 0 && (
        <AnimatedSection animation="fade-up">
          <section className="py-24 px-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-900 pb-4 mb-12">
              <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-tighter">
                {details.storyTitle || 'The Timeline'}
              </h2>
              <span className="text-xs uppercase tracking-widest text-stone-400 mt-2 sm:mt-0">
                Chapter by chapter
              </span>
            </div>

            <div className="space-y-12">
              {details.milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 border-b border-stone-200"
                >
                  <div className="md:col-span-3 text-xs tracking-widest uppercase text-stone-400">
                    {m.yearOrDate}
                  </div>
                  <div className="md:col-span-9 space-y-3">
                    <h3 className="text-2xl font-light tracking-tight text-stone-900">{m.title}</h3>
                    <p className="text-stone-600 font-light text-sm leading-relaxed">{m.description}</p>
                    {m.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.image}
                        alt={m.title}
                        className="mt-4 aspect-16/9 w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Locations */}
      {details.showVenue && (
        <AnimatedSection animation="fade-up">
          <section className="py-20 px-6 bg-stone-100">
            <div className="max-w-6xl mx-auto">
              <div className="border-b border-stone-300 pb-4 mb-12">
                <span className="text-xs tracking-widest uppercase text-stone-500">Destination</span>
                <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-tight mt-1">
                  Event Logistics
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 space-y-4">
                  <span className="text-xs uppercase tracking-widest text-stone-400">01 / Ceremony</span>
                  <h3 className="text-2xl font-light text-stone-900">{details.ceremonyVenue}</h3>
                  <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                    {details.ceremonyTime || details.weddingTime}
                  </p>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    {details.ceremonyAddress}
                  </p>
                  {details.mapsUrl && (
                    <a
                      href={details.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-stone-900 hover:text-rose-600 pt-2"
                    >
                      <span>View Map</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="bg-white p-8 space-y-4">
                  <span className="text-xs uppercase tracking-widest text-stone-400">02 / Reception</span>
                  <h3 className="text-2xl font-light text-stone-900">{details.receptionVenue}</h3>
                  <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                    {details.receptionTime || 'Cocktails & Dinner'}
                  </p>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    {details.receptionAddress}
                  </p>
                  {details.mapsUrl && (
                    <a
                      href={details.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-stone-900 hover:text-rose-600 pt-2"
                    >
                      <span>Directions</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-8 text-center">
                <AddToCalendar
                  title={`${coupleNames} Wedding`}
                  weddingDate={details.weddingDate}
                  weddingTime={details.weddingTime}
                  location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                  description={details.invitationMessage}
                />
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Gallery */}
      {details.showGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <AnimatedSection animation="fade-up">
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="border-b border-stone-200 pb-4 mb-8 flex justify-between items-end">
              <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-tight">Gallery</h2>
              <span className="text-xs uppercase tracking-widest text-stone-400">Selected Works</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {details.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-3/4 overflow-hidden bg-stone-200 cursor-pointer group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
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

      {/* Dress code */}
      {details.showDressCode && details.dressCode && (
        <AnimatedSection animation="fade-in">
          <div className="border-t border-stone-200 py-12 px-6 text-center">
            <span className="text-xs uppercase tracking-widest text-stone-400 block mb-1">
              Dress Code
            </span>
            <p className="text-stone-800 text-sm uppercase tracking-wider font-medium">
              {details.dressCode}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Guestbook Wall */}
      <AnimatedSection animation="fade-up">
        <GuestbookWall
          coupleNames={coupleNames}
          primaryColor="#09090b"
          accentColor="#f4f4f5"
          isDark={false}
        />
      </AnimatedSection>

      {/* RSVP */}
      {details.showRsvp && (
        <AnimatedSection animation="fade-up" id="rsvp">
          <section className="py-24 px-6 border-t border-stone-200 bg-white" id="rsvp">
            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor={themeConfig.primaryColor || '#18181b'}
              themeStyle="minimal"
              guest={guest}
            />
          </section>
        </AnimatedSection>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 py-16 px-6 text-center text-xs tracking-widest uppercase text-stone-500 space-y-6">
        <SocialShare title={`${coupleNames}'s Wedding`} />
        <p className="font-medium text-stone-900">{coupleNames}</p>
        <p className="text-[10px] text-stone-400">Created with EternalTie Studio</p>
      </footer>

      {/* Background Music */}
      {details.enableMusic && details.musicUrl && (
        <MusicPlayer musicUrl={details.musicUrl} musicTitle={details.musicTitle} />
      )}
    </div>
  );
}
