'use client';

import React, { useState } from 'react';
import { WeddingProject } from '@/types/wedding';
import { CountdownTimer } from './common/CountdownTimer';
import { MusicPlayer } from './common/MusicPlayer';
import { RsvpForm } from './common/RsvpForm';
import { PhotoLightbox } from './common/PhotoLightbox';
import { AddToCalendar } from './common/AddToCalendar';
import { AnimatedSection } from './common/AnimatedSection';
import { motion } from 'motion/react';
import { formatDate } from '@/lib/utils';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  Heart,
  Users,
  Flower2,
  ChevronDown,
} from 'lucide-react';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
}

// Falling Lotus Petals Animated Background Effect
function FloatingLotusPetals() {
  const petals = [
    { id: 1, left: '8%', delay: 0, duration: 14, size: 24, rotate: 20 },
    { id: 2, left: '22%', delay: 3, duration: 18, size: 20, rotate: -35 },
    { id: 3, left: '42%', delay: 1, duration: 16, size: 28, rotate: 45 },
    { id: 4, left: '65%', delay: 4, duration: 15, size: 22, rotate: -25 },
    { id: 5, left: '82%', delay: 2, duration: 17, size: 26, rotate: 30 },
    { id: 6, left: '94%', delay: 5, duration: 19, size: 18, rotate: -15 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute -top-10"
          style={{ left: p.left }}
          animate={{
            y: ['0vh', '105vh'],
            x: [-20, 25, -20],
            rotate: [p.rotate, p.rotate + 180, p.rotate + 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {/* Lotus Petal SVG */}
          <svg
            width={p.size}
            height={p.size * 1.5}
            viewBox="0 0 30 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_2px_4px_rgba(4,120,87,0.15)]"
          >
            <path
              d="M15 0 C2 12 0 28 8 38 C14 44 20 44 24 38 C32 28 28 12 15 0 Z"
              fill="url(#petalGradient)"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#f472b6" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// Elegant Lotus Floral Botanical Divider
function BotanicalLotusDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-emerald-600/40 to-emerald-600" />
      <div className="flex items-center gap-1.5 text-emerald-700">
        <Flower2 className="w-5 h-5 text-emerald-600" />
      </div>
      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-emerald-600/40 to-emerald-600" />
    </div>
  );
}

export function LotusBlossomTemplate({ wedding }: TemplateProps) {
  const { details } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-stone-800 font-cormorant selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden">
      {/* Floating Animated Lotus Petals */}
      <FloatingLotusPetals />

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-20 sm:py-28 text-center overflow-hidden">
          {/* Soft botanical glow backdrop */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/50 via-rose-100/40 to-amber-100/30 blur-3xl pointer-events-none rounded-full" />

          {/* Elegant Arch Framing */}
          <div className="absolute inset-4 sm:inset-8 border border-emerald-900/15 pointer-events-none rounded-3xl">
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-emerald-700/40" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-emerald-700/40" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-emerald-700/40" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-emerald-700/40" />
          </div>

          <div className="max-w-4xl mx-auto relative z-20 space-y-6 pt-10">
            {/* Lotus Headline Capsule */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-sans tracking-[0.25em] uppercase shadow-xs"
            >
              <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{details.invitationHeadline || 'Pure Love In Bloom'}</span>
              <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
            </motion.div>

            {/* Couple Photo in Botanical Water-Lily Rounded Oval */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative mx-auto w-44 sm:w-56 md:w-64 aspect-[4/5] p-2.5 rounded-full bg-gradient-to-b from-emerald-600/40 via-amber-400/40 to-rose-300/40 shadow-xl"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={details.heroImage}
                    alt={coupleNames}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            )}

            {/* Couple Names */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="space-y-2 pt-2"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-cormorant font-normal text-stone-900 tracking-tight">
                <span className="text-emerald-950">{details.brideName}</span>
                <span className="block text-2xl sm:text-3xl font-light italic text-emerald-700/80 my-1 font-serif">
                  and
                </span>
                <span className="text-emerald-950">{details.groomName}</span>
              </h1>
              {details.brideFullName && details.groomFullName && (
                <p className="text-xs sm:text-sm text-stone-500 font-sans tracking-widest uppercase">
                  {details.brideFullName} & {details.groomFullName}
                </p>
              )}
            </motion.div>

            <BotanicalLotusDivider />

            {/* Quick Details Capsule */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-white/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-stone-200/80 text-xs sm:text-sm text-stone-700 font-sans shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="tracking-wider uppercase font-semibold">{weddingFormattedDate}</span>
              </div>
              <span className="text-stone-300 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{details.weddingTime}</span>
              </div>
              <span className="text-stone-300 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
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
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-xs tracking-widest uppercase font-bold transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
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

            <div className="pt-8 flex flex-col items-center text-emerald-700/60 animate-bounce">
              <span className="text-[10px] uppercase font-sans tracking-widest mb-1">Explore Invitation</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </section>
      )}

      {/* Parents Blessing Section */}
      {(details.brideParents || details.groomParents) && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-emerald-700 font-semibold">
              Family & Blessings
            </span>
            <h2 className="text-3xl sm:text-5xl font-cormorant font-normal text-stone-900">
              Together With Our Beloved Families
            </h2>
            <BotanicalLotusDivider />
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 italic">
              Surrounded by nature&apos;s peace and the heartfelt love of our parents, we invite you to join us on our joyous day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-sans uppercase tracking-widest text-emerald-700 font-semibold">
                Bride&apos;s Parents
              </div>
              <h3 className="text-2xl font-bold text-stone-900">
                {details.brideParents || 'The Montgomery Family'}
              </h3>
              <p className="text-sm text-stone-500 font-sans">
                Parents of {details.brideName}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-sans uppercase tracking-widest text-emerald-700 font-semibold">
                Groom&apos;s Parents
              </div>
              <h3 className="text-2xl font-bold text-stone-900">
                {details.groomParents || 'The Vance Family'}
              </h3>
              <p className="text-sm text-stone-500 font-sans">
                Parents of {details.groomName}
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Countdown Section */}
      {details.showCountdown && (
        <AnimatedSection className="py-16 sm:py-20 px-4 bg-emerald-50/50 border-y border-emerald-100">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-emerald-700 font-semibold">
              The Bloom Of Love
            </span>
            <h2 className="text-3xl sm:text-4xl font-cormorant text-stone-900">
              Counting Down To Our Forever
            </h2>
            <div className="pt-4 inline-block">
              <CountdownTimer
                weddingDate={details.weddingDate}
                weddingTime={details.weddingTime}
                cardClassName="bg-white border border-emerald-200 text-stone-800"
                numberClassName="text-emerald-800"
                labelClassName="text-stone-500"
              />
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Schedule / Order of Events */}
      {details.showSchedule && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-emerald-700 font-semibold">
              Celebration Program
            </span>
            <h2 className="text-3xl sm:text-5xl font-cormorant text-stone-900">
              The Order of Events
            </h2>
            <BotanicalLotusDivider />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                time: details.ceremonyTime?.split('-')?.[0]?.trim() || details.weddingTime,
                title: 'Welcome & Gathering',
                desc: 'Guests arrive for botanical herbal coolers and musical prelude.',
              },
              {
                time: details.poruwaCeremonyTime || details.ceremonyTime?.split('-')?.[1]?.trim() || '4:30 PM',
                title: 'Ceremony Vows',
                desc: 'Exchange of vows and blessings under the floral canopy.',
              },
              {
                time: '5:30 PM',
                title: 'Golden Hour Cocktails',
                desc: 'Canapes, refreshing drinks, and golden hour photographs.',
              },
              {
                time: details.receptionTime?.split('-')?.[0]?.trim() || '7:00 PM',
                title: 'Dinner & Merriment',
                desc: 'Farm-to-table banquet, heartfelt toasts, and dancing.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-stone-200/80 hover:border-emerald-300 transition shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {step.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
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
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-emerald-700 font-semibold">
              Destinations
            </span>
            <h2 className="text-3xl sm:text-5xl font-cormorant text-stone-900">
              Ceremony & Celebration Venues
            </h2>
            <BotanicalLotusDivider />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-sans uppercase font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Wedding Ceremony</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
                  {details.ceremonyVenue}
                </h3>
                <p className="text-sm text-stone-600 font-sans">{details.ceremonyAddress}</p>
              </div>
              {details.mapsUrl && (
                <a
                  href={details.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-800 text-white text-xs font-sans uppercase font-bold tracking-wider shadow-sm hover:bg-emerald-900 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Map</span>
                </a>
              )}
            </div>

            <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-sans uppercase font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reception Feast</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
                  {details.receptionVenue}
                </h3>
                <p className="text-sm text-stone-600 font-sans">{details.receptionAddress}</p>
              </div>
              {details.mapsUrl && (
                <a
                  href={details.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-800 text-white text-xs font-sans uppercase font-bold tracking-wider shadow-sm hover:bg-emerald-900 transition"
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
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 bg-emerald-50/40 border-t border-emerald-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-3 mb-14">
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-emerald-700 font-semibold">
                Captured In Bloom
              </span>
              <h2 className="text-3xl sm:text-5xl font-cormorant text-stone-900">
                Photo Gallery
              </h2>
              <BotanicalLotusDivider />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {details.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer relative group border border-stone-200 shadow-sm bg-stone-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 rounded-full bg-white text-stone-900 text-xs font-sans font-semibold shadow-md">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* RSVP Section */}
      {details.showRsvp && (
        <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-8 max-w-3xl mx-auto relative z-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-xl relative">
            <div className="text-center space-y-3 mb-10">
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-emerald-700 font-semibold">
                Your Response
              </span>
              <h2 className="text-3xl sm:text-5xl font-cormorant text-stone-900">
                RSVP to Celebrate
              </h2>
              <BotanicalLotusDivider />
              <p className="text-sm sm:text-base text-stone-600 font-sans">
                Kindly let us know if you can share this special day with us.
              </p>
            </div>

            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor="#047857"
              themeStyle="floral"
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-stone-200 bg-[#f4f2ec] text-xs sm:text-sm text-stone-500 font-sans space-y-2">
        <p className="font-cormorant text-stone-800 text-base">{coupleNames}</p>
        <p>{weddingFormattedDate} • Botanical Lotus Celebration</p>
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
          musicTitle={details.musicTitle || 'Serene Lotus Acoustic Melody'}
        />
      )}
    </div>
  );
}
