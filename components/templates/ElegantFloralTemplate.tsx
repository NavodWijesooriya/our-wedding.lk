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
import { Heart, MapPin, Calendar, Clock, Sparkles, Navigation, Mail, Phone, Shirt } from 'lucide-react';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
}

export function ElegantFloralTemplate({ wedding, isLivePreview = false }: TemplateProps) {
  const { details, themeConfig } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  return (
    <div className="min-h-screen bg-[#fffdfa] text-stone-800 font-playfair selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      {/* Background Floral Accents */}
      <div className="fixed inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-[radial-gradient(#fecdd3_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center px-6 sm:px-12 py-16 sm:py-24 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-100/40 blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className={`space-y-6 ${details.heroImage ? 'lg:col-span-7 text-center lg:text-left' : 'lg:col-span-12 text-center max-w-3xl mx-auto'}`}>
              {/* Invitation Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-rose-50/90 border border-rose-200/80 text-rose-800 text-xs tracking-widest uppercase shadow-2xs backdrop-blur-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Save The Date • Wedding Celebration</span>
              </motion.div>

              {/* Couple Names */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-stone-900 leading-[0.95]"
              >
                <span className="block font-serif italic text-stone-900">{details.brideName}</span>
                <span className="text-3xl sm:text-4xl lg:text-5xl text-rose-500 font-sans font-light my-2 inline-block">
                  &
                </span>
                <span className="block font-serif italic text-stone-900">{details.groomName}</span>
              </motion.h1>

              {/* Event Quick Info Capsule */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 bg-white/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-rose-100 shadow-xs text-xs sm:text-sm text-stone-700 font-sans"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span className="font-medium">{weddingFormattedDate}</span>
                </div>
                <span className="text-rose-200 hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <span>{details.weddingTime}</span>
                </div>
                <span className="text-rose-200 hidden sm:inline">|</span>
                <div className="flex items-center gap-2 truncate max-w-[240px]">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
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
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs tracking-wider uppercase font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>RSVP to Celebrate</span>
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </a>
                )}
                <div className="font-sans">
                  <AddToCalendar
                    title={`${coupleNames} Wedding`}
                    weddingDate={details.weddingDate}
                    weddingTime={details.weddingTime}
                    location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                    description={details.invitationMessage}
                  />
                </div>
              </motion.div>

              {/* Countdown Timer */}
              {details.showCountdown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.45 }}
                  className="pt-4"
                >
                  <p className="text-[11px] uppercase tracking-widest text-stone-400 font-sans mb-3 font-medium">
                    Counting down to our forever
                  </p>
                  <div className="inline-block">
                    <CountdownTimer
                      weddingDate={details.weddingDate}
                      weddingTime={details.weddingTime}
                      cardClassName="bg-white/95 border-rose-100/80 shadow-xs backdrop-blur-sm"
                      numberClassName="text-rose-700 font-serif"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Arched Luxury Editorial Portrait */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4 rounded-t-[180px] rounded-b-3xl overflow-hidden shadow-2xl border-8 border-white ring-1 ring-rose-200/60 group bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={details.heroImage}
                    alt={coupleNames}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating venue badge on portrait */}
                  <div className="absolute bottom-5 left-5 right-5 text-center text-white backdrop-blur-md bg-black/40 border border-white/20 p-3 rounded-2xl">
                    <p className="text-xs uppercase tracking-widest font-sans font-semibold text-rose-200">
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
            className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-[10px] tracking-widest uppercase text-stone-400 font-sans cursor-pointer hover:text-stone-700 transition"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-4 h-7 rounded-full border border-stone-300 flex items-start justify-center p-1"
            >
              <div className="w-1 h-1.5 rounded-full bg-rose-500" />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Invitation Letter */}
      {details.showInvitationMessage && (
        <AnimatedSection>
          <section className="py-20 px-4 max-w-3xl mx-auto text-center relative">
            <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6 fill-rose-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-6">
              {details.invitationHeadline || 'We Invite You To Share Our Joy'}
            </h2>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-sans font-light">
              {details.invitationMessage}
            </p>
            {(details.brideParents || details.groomParents) && (
              <div className="mt-8 pt-8 border-t border-rose-100 font-sans text-xs text-stone-500 space-y-2">
                {details.brideParents && <p>Proud Parents of the Bride: {details.brideParents}</p>}
                {details.groomParents && <p>Proud Parents of the Groom: {details.groomParents}</p>}
              </div>
            )}
          </section>
        </AnimatedSection>
      )}

      {/* Love Story Timeline */}
      {details.showStory && details.milestones && details.milestones.length > 0 && (
        <AnimatedSection>
          <section className="py-20 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold">
                Our Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2">
                {details.storyTitle || 'How We Met & Fell In Love'}
              </h2>
              {details.storyIntro && (
                <p className="text-stone-500 font-sans text-sm mt-3 max-w-xl mx-auto">
                  {details.storyIntro}
                </p>
              )}
            </div>

            <div className="relative border-l-2 border-rose-200 ml-4 sm:ml-32 space-y-12">
              {details.milestones.map((m, idx) => (
                <div key={m.id || idx} className="relative pl-8 sm:pl-10 group">
                  {/* Node icon */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-rose-500 border-4 border-white shadow-xs group-hover:scale-125 transition" />
                  <span className="sm:absolute sm:-left-32 sm:text-right sm:w-24 top-1 block text-xs font-semibold uppercase tracking-wider text-rose-600 font-sans mb-1">
                    {m.yearOrDate}
                  </span>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100/80">
                    <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">{m.title}</h3>
                    <p className="text-stone-600 font-sans text-sm leading-relaxed">{m.description}</p>
                    {m.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.image}
                        alt={m.title}
                        className="mt-4 rounded-xl max-h-56 w-full object-cover shadow-2xs"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Events / Venues */}
      {details.showVenue && (
        <AnimatedSection>
          <section className="py-20 px-4 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold">
                The Celebrations
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2">Where & When</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ceremony */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif text-stone-900 mb-2">The Ceremony</h3>
                  <p className="text-sm font-sans text-rose-600 font-medium mb-4">
                    {details.ceremonyTime || details.weddingTime}
                  </p>
                  <h4 className="font-sans font-semibold text-stone-800 text-base">{details.ceremonyVenue}</h4>
                  <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">
                    {details.ceremonyAddress}
                  </p>
                </div>

                {details.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 font-sans transition"
                  >
                    <Navigation className="w-4 h-4" />
                    View Location On Google Maps
                  </a>
                )}
              </div>

              {/* Reception */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif text-stone-900 mb-2">The Reception</h3>
                  <p className="text-sm font-sans text-rose-600 font-medium mb-4">
                    {details.receptionTime || 'Following the Ceremony'}
                  </p>
                  <h4 className="font-sans font-semibold text-stone-800 text-base">{details.receptionVenue}</h4>
                  <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">
                    {details.receptionAddress}
                  </p>
                </div>

                {details.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 font-sans transition"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Driving Directions
                  </a>
                )}
              </div>
            </div>

            {/* Calendar button */}
            <div className="text-center mt-10">
              <AddToCalendar
                title={coupleNames + ' Wedding'}
                weddingDate={details.weddingDate}
                weddingTime={details.weddingTime}
                location={details.ceremonyVenue + ', ' + details.ceremonyAddress}
                description={details.invitationMessage}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Gallery Section */}
      {details.showGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <AnimatedSection>
          <section className="py-20 px-4 max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold">
                Moments
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2">Captured Memories</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {details.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="relative aspect-4/5 rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-stone-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Memory ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-sans font-medium">
                    Click to Expand
                  </div>
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

      {/* Dress Code & Notes */}
      
      

      {/* RSVP Section */}
      {details.showRsvp && (
        <AnimatedSection>
          <section className="py-20 px-4 bg-gradient-to-b from-transparent to-rose-50/50" id="rsvp">
            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor={themeConfig.primaryColor || '#e11d48'}
              themeStyle="floral"
            />
          </section>
        </AnimatedSection>
      )}

      {/* Contact & Share */}
      <footer className="py-16 px-4 text-center border-t border-rose-100 font-sans">
        <h3 className="font-serif text-2xl text-stone-900 mb-2">{coupleNames}</h3>
        <p className="text-xs text-stone-400 mb-6">{weddingFormattedDate}</p>

        {/* Social Share */}
        <div className="mb-8">
          <SocialShare title={`${coupleNames}'s Wedding Invitation`} />
        </div>

        {details.showContact && (details.contactEmail || details.contactPhone) && (
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
            {details.contactEmail && (
              <a href={`mailto:${details.contactEmail}`} className="flex items-center gap-1.5 hover:text-rose-600">
                <Mail className="w-3.5 h-3.5" /> {details.contactEmail}
              </a>
            )}
            {details.contactPhone && (
              <a href={`tel:${details.contactPhone}`} className="flex items-center gap-1.5 hover:text-rose-600">
                <Phone className="w-3.5 h-3.5" /> {details.contactPhone}
              </a>
            )}
          </div>
        )}

        <div className="mt-12 text-[10px] uppercase tracking-widest text-stone-300">
          Created with EternalTie Wedding Studio
        </div>
      </footer>

      {/* Music Player */}
      {details.enableMusic && details.musicUrl && (
        <MusicPlayer
          musicUrl={details.musicUrl}
          musicTitle={details.musicTitle || 'Wedding Melody'}
          autoPlay={false}
        />
      )}
    </div>
  );
}
