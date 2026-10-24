'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Navigation,
  Mail,
  Phone,
  Shirt,
  Volume2,
  Compass,
  Check,
  Share2,
  Music,
  Camera,
  Gift,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { WeddingGuest } from '@/types/rsvp';
import confetti from 'canvas-confetti';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
  guest?: WeddingGuest | null;
}

export function ElegantFloralTemplate({ wedding, isLivePreview = false, guest }: TemplateProps) {
  const { details, themeConfig } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<number, number>>({
    0: 42,
    1: 38,
    2: 56,
    3: 29,
    4: 47,
    5: 33,
  });
  const [userLikedMap, setUserLikedMap] = useState<Record<number, boolean>>({});

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  const handlePhotoLike = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (userLikedMap[idx]) return;

    setUserLikedMap((prev) => ({ ...prev, [idx]: true }));
    setLikedPhotos((prev) => ({
      ...prev,
      [idx]: (prev[idx] || 0) + 1,
    }));

    // Little heart burst
    confetti({
      particleCount: 15,
      spread: 45,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#e11d48', '#fb7185', '#fda4af'],
    });
  };

  const colorPalette = [
    { name: 'Blush Peony', hex: '#E07A7E' },
    { name: 'Champagne Rose', hex: '#F7DCD8' },
    { name: 'Sage Botanical', hex: '#84A98C' },
    { name: 'Gilded Gold', hex: '#D4AF37' },
    { name: 'Midnight Velvet', hex: '#1E293B' },
  ];

  const orderOfEvents = [
    {
      time: '03:30 PM',
      title: 'Welcome Drinks & Acoustic Strings',
      desc: 'Guests arrive to handcrafted elderflower spritzers and live string quartet melodies in the botanical pavilion.',
      icon: '🥂',
    },
    {
      time: details.ceremonyTime || '04:00 PM',
      title: 'The Holy Vows & Ceremony',
      desc: `${details.ceremonyVenue} • Exchange of sacred vows, ring blessing, and our first kiss as husband and wife.`,
      icon: '💍',
    },
    {
      time: '05:30 PM',
      title: 'Sunset Cocktail Hour & Canapés',
      desc: 'Golden hour portraits on the terrace, signature cocktails, and live jazz under fairy-lit pergolas.',
      icon: '🍸',
    },
    {
      time: details.receptionTime || '06:30 PM',
      title: 'Grand Banquet Dinner & Speeches',
      desc: `${details.receptionVenue} • Three-course candlelit dinner, heartfelt toasts from family, and cutting of the wedding cake.`,
      icon: '🍽️',
    },
    {
      time: '09:00 PM',
      title: 'First Dance & Celebration Afterparty',
      desc: 'First dance under the glass dome, open dance floor, late night desserts, and starlight sparkler send-off.',
      icon: '✨',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffdfa] text-stone-800 font-sans selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden relative">
      {/* Background Subtle Floral Textures */}
      <div className="fixed inset-0 pointer-events-none opacity-25 mix-blend-multiply bg-[radial-gradient(#f43f5e_0.75px,transparent_0.75px)] [background-size:20px_20px] -z-10" />

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-16 sm:py-24 overflow-hidden">
          {/* Subtle Romantic Radial Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-rose-100/50 blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-amber-100/40 blur-3xl -z-10 pointer-events-none" />

          {/* Top Invitation Ribbon Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-2"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 border border-rose-200/80 shadow-xs backdrop-blur-md text-stone-700 text-xs font-sans tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Two Souls • One Heart • Forever Bound</span>
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            </div>

            {guest && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-rose-900 text-xs font-serif font-bold shadow-2xs">
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
                <span>Reserved For {guest.name}</span>
              </div>
            )}
          </motion.div>

          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className={`space-y-6 ${details.heroImage ? 'lg:col-span-7 text-center lg:text-left' : 'lg:col-span-12 text-center max-w-3xl mx-auto'}`}>
              {/* Monogram Seal Crest */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-amber-300/80 bg-gradient-to-tr from-amber-50 to-white text-[#b45309] shadow-sm mb-1"
              >
                <span className="font-serif font-bold text-base tracking-wider uppercase">
                  {details.brideName[0]}&amp;{details.groomName[0]}
                </span>
              </motion.div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-rose-600 font-sans font-semibold">
                  We Invite You To Celebrate
                </p>

                {/* Couple Names with Modern Romantic Calligraphy & Serif Pairing */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-stone-900 font-serif"
                >
                  <span className="block font-normal italic drop-shadow-2xs">
                    {details.brideName}
                  </span>
                  <span className="inline-flex items-center gap-3 my-1 font-sans text-rose-500 font-light text-3xl sm:text-4xl">
                    <span className="w-8 h-px bg-rose-300 inline-block" />
                    <span>&amp;</span>
                    <span className="w-8 h-px bg-rose-300 inline-block" />
                  </span>
                  <span className="block font-normal italic drop-shadow-2xs">
                    {details.groomName}
                  </span>
                </motion.h1>
              </div>

              {/* Romantic Couple Quote */}
              <p className="font-serif italic text-base sm:text-lg text-stone-600 max-w-lg leading-relaxed pt-1">
                &ldquo;In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.&rdquo;
              </p>

              {/* Event Quick Info Glass Capsule */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-rose-100/90 shadow-md text-xs sm:text-sm text-stone-700"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold text-stone-900">{weddingFormattedDate}</span>
                </div>
                <span className="text-rose-200 hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <span>{details.weddingTime}</span>
                </div>
                <span className="text-rose-200 hidden sm:inline">•</span>
                <div className="flex items-center gap-2 truncate max-w-[220px]">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate">{details.ceremonyVenue}</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2"
              >
                {details.showRsvp && (
                  <a
                    href="#rsvp"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-sans text-xs tracking-widest uppercase font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>RSVP to Celebrate</span>
                    <Heart className="w-4 h-4 fill-white" />
                  </a>
                )}

                <AddToCalendar
                  title={`${coupleNames} Wedding`}
                  weddingDate={details.weddingDate}
                  weddingTime={details.weddingTime}
                  location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                  description={details.invitationMessage}
                />

                <a
                  href="#story"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-widest transition shadow-xs"
                >
                  <span>Our Story</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </motion.div>

              {/* Countdown Timer with Frosted Glass Cards */}
              {details.showCountdown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="pt-6"
                >
                  <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-sans mb-3 font-semibold flex items-center justify-center lg:justify-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Counting Down To Forever</span>
                  </p>
                  <CountdownTimer
                    weddingDate={details.weddingDate}
                    weddingTime={details.weddingTime}
                    cardClassName="bg-white/95 border-rose-200/70 shadow-md backdrop-blur-md"
                    numberClassName="text-rose-700 font-serif font-normal"
                  />
                </motion.div>
              )}
            </div>

            {/* Right Column: Arched Luxury Editorial Portrait */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4">
                  {/* Outer Luxury Gilded Border Frame */}
                  <div className="absolute -inset-2.5 rounded-t-[190px] rounded-b-[40px] border-2 border-amber-300/60 bg-gradient-to-b from-amber-100/40 via-rose-100/20 to-transparent -z-10" />

                  <div className="relative w-full h-full rounded-t-[180px] rounded-b-3xl overflow-hidden shadow-2xl border-6 border-white bg-stone-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={details.heroImage}
                      alt={coupleNames}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Venue & Date Stamp Overlay */}
                    <div className="absolute bottom-5 left-5 right-5 text-center text-white backdrop-blur-md bg-black/45 border border-white/20 p-4 rounded-2xl shadow-xl">
                      <p className="text-[11px] uppercase tracking-widest font-sans font-semibold text-rose-200">
                        {weddingFormattedDate}
                      </p>
                      <p className="font-serif text-base font-semibold truncate mt-0.5">
                        {details.ceremonyVenue}
                      </p>
                      <p className="text-[11px] text-stone-300 font-sans mt-0.5">
                        New York City
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Invitation Letter Section */}
      {details.showInvitationMessage && (
        <AnimatedSection>
          <section className="py-24 px-4 max-w-3xl mx-auto text-center relative">
            {/* Elegant Floral Wreath Divider */}
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
              <Heart className="w-6 h-6 fill-rose-600" />
            </div>

            <span className="text-xs uppercase tracking-[0.28em] text-rose-600 font-sans font-semibold block mb-2">
              Formal Invitation
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 mb-6 leading-tight">
              {details.invitationHeadline || 'Together With Our Families'}
            </h2>

            <p className="text-stone-600 text-base sm:text-xl leading-relaxed font-serif italic max-w-2xl mx-auto">
              &ldquo;{details.invitationMessage}&rdquo;
            </p>

            {(details.brideParents || details.groomParents) && (
              <div className="mt-10 pt-8 border-t border-rose-100 font-sans text-xs text-stone-500 space-y-2 max-w-md mx-auto">
                {details.brideParents && (
                  <p className="tracking-wide">
                    Parents of the Bride: <strong className="text-stone-700">{details.brideParents}</strong>
                  </p>
                )}
                {details.groomParents && (
                  <p className="tracking-wide">
                    Parents of the Groom: <strong className="text-stone-700">{details.groomParents}</strong>
                  </p>
                )}
              </div>
            )}
          </section>
        </AnimatedSection>
      )}

      {/* Order of the Day / Celebration Timeline */}
      <AnimatedSection>
        <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.28em] text-rose-600 font-sans font-semibold">
              The Celebration Itinerary
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 mt-2">
              Order of the Day
            </h2>
            <p className="text-stone-500 font-sans text-sm mt-3 max-w-md mx-auto">
              A guided journey through our wedding day, from our sacred ceremony to dancing under the stars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderOfEvents.map((evt, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{evt.icon}</span>
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-sans font-semibold text-xs tracking-wider">
                      {evt.time}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                    {evt.title}
                  </h3>
                  <p className="font-sans text-sm text-stone-600 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Love Story Timeline with Polaroid Cards */}
      {details.showStory && details.milestones && details.milestones.length > 0 && (
        <AnimatedSection>
          <section id="story" className="py-24 px-4 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.28em] text-rose-600 font-sans font-semibold">
                How It All Began
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 mt-2">
                {details.storyTitle || 'Our Journey to Forever'}
              </h2>
              {details.storyIntro && (
                <p className="text-stone-500 font-sans text-sm mt-3 max-w-xl mx-auto">
                  {details.storyIntro}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {details.milestones.map((m, idx) => (
                <motion.div
                  key={m.id || idx}
                  whileHover={{ y: -8, rotate: idx % 2 === 0 ? -1 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5 rounded-2xl shadow-md border border-stone-100 flex flex-col group relative"
                >
                  {/* Decorative Washi Tape Graphic */}
                  <div className="w-16 h-4 bg-rose-200/70 absolute -top-2 left-1/2 -translate-x-1/2 rotate-1 shadow-2xs rounded-xs" />

                  {m.image && (
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.image}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}

                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 font-sans mb-1">
                    {m.yearOrDate}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
                    {m.title}
                  </h3>
                  <p className="text-stone-600 font-sans text-sm leading-relaxed flex-1">
                    {m.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Events / Venues Section */}
      {details.showVenue && (
        <AnimatedSection>
          <section className="py-24 px-4 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs uppercase tracking-[0.28em] text-rose-600 font-sans font-semibold">
                Locations &amp; Logistics
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 mt-2">
                Celebration Venues
              </h2>
              <p className="text-stone-500 font-sans text-sm mt-3 max-w-md mx-auto">
                Join us in New York City for an unforgettable celebration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ceremony Card */}
              <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-md border border-rose-100 flex flex-col justify-between hover:border-rose-200 transition">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-2xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-rose-500 font-sans font-semibold">
                    The Sacred Union
                  </span>
                  <h3 className="text-3xl font-serif text-stone-900 mb-2 mt-1">The Ceremony</h3>
                  <p className="text-sm font-sans text-rose-600 font-semibold mb-4">
                    {details.ceremonyTime || details.weddingTime}
                  </p>
                  <h4 className="font-sans font-bold text-stone-800 text-base">{details.ceremonyVenue}</h4>
                  <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">
                    {details.ceremonyAddress}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-rose-100 flex flex-wrap gap-4 items-center justify-between">
                  {details.mapsUrl && (
                    <a
                      href={details.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 font-sans transition"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open in Google Maps</span>
                    </a>
                  )}

                  <span className="text-xs text-stone-400 font-sans">Valet Parking Available</span>
                </div>
              </div>

              {/* Reception Card */}
              <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-md border border-rose-100 flex flex-col justify-between hover:border-rose-200 transition">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-2xs">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-rose-500 font-sans font-semibold">
                    Evening Gala
                  </span>
                  <h3 className="text-3xl font-serif text-stone-900 mb-2 mt-1">The Reception</h3>
                  <p className="text-sm font-sans text-rose-600 font-semibold mb-4">
                    {details.receptionTime || 'Following the Ceremony'}
                  </p>
                  <h4 className="font-sans font-bold text-stone-800 text-base">{details.receptionVenue}</h4>
                  <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">
                    {details.receptionAddress}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-rose-100 flex flex-wrap gap-4 items-center justify-between">
                  {details.mapsUrl && (
                    <a
                      href={details.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 font-sans transition"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Driving Directions</span>
                    </a>
                  )}

                  <span className="text-xs text-stone-400 font-sans">Cocktails &amp; Dinner</span>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Dress Code & Curated Color Swatches */}
      {details.showDressCode && (
        <AnimatedSection>
          <section className="py-20 px-4 max-w-4xl mx-auto">
            <div className="bg-white/95 rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-md text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Shirt className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-sans font-semibold">
                Guest Attire &amp; Mood
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1 mb-4">
                Dress Code &amp; Palette
              </h2>
              <p className="text-stone-600 font-sans text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
                {details.dressCode || 'Black Tie Optional • Pastel florals, formal suits, and elegant evening wear.'}
              </p>

              {/* Color Swatch Circles */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-rose-100">
                {colorPalette.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-full shadow-md border-2 border-white ring-1 ring-stone-200 transition hover:scale-115"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[11px] font-sans font-medium text-stone-600">
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Captured Moments / Photo Gallery with Heart Reactions */}
      {details.showGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <AnimatedSection>
          <section className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.28em] text-rose-600 font-sans font-semibold">
                Photo Memories
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 mt-2">
                Captured Moments
              </h2>
              <p className="text-stone-500 font-sans text-sm mt-3 max-w-md mx-auto">
                Tap on any photo to open full-screen, or click the heart to share your love!
              </p>
            </div>

            {/* Gallery Grid with Heart Reaction Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {details.galleryImages.map((imgUrl, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  onClick={() => setLightboxIndex(idx)}
                  className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-md group cursor-pointer border border-stone-100 bg-stone-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Memory ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-5 text-white">
                    <span className="self-end px-3 py-1 rounded-full bg-black/40 text-xs backdrop-blur-md">
                      Expand Photo ↗
                    </span>

                    <div className="flex items-center justify-between">
                      <p className="font-serif text-sm">Moment #{idx + 1}</p>

                      {/* Heart Like Button */}
                      <button
                        type="button"
                        onClick={(e) => handlePhotoLike(e, idx)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition ${
                          userLikedMap[idx]
                            ? 'bg-rose-600 text-white'
                            : 'bg-white/30 hover:bg-rose-600 text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${userLikedMap[idx] ? 'fill-white' : ''}`} />
                        <span>{likedPhotos[idx] || 0}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
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

      {/* Interactive Guestbook Wall: Words of Love & Well Wishes */}
      <AnimatedSection>
        <GuestbookWall
          coupleNames={coupleNames}
          primaryColor="#e11d48"
          accentColor="#ffe4e6"
          isDark={false}
        />
      </AnimatedSection>

      {/* RSVP Section */}
      {details.showRsvp && (
        <AnimatedSection>
          <section className="py-24 px-4 bg-gradient-to-b from-transparent via-rose-50/40 to-rose-100/30" id="rsvp">
            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor={themeConfig.primaryColor || '#e11d48'}
              themeStyle="floral"
              guest={guest}
            />
          </section>
        </AnimatedSection>
      )}

      {/* Footer */}
      <footer className="py-20 px-4 text-center border-t border-rose-100 font-sans bg-white">
        <div className="w-10 h-10 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <Heart className="w-5 h-5 fill-rose-600" />
        </div>
        <h3 className="font-serif text-3xl text-stone-900 mb-2">{coupleNames}</h3>
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-6 font-semibold">
          {weddingFormattedDate} • New York City
        </p>

        {/* Social Share */}
        <div className="mb-8">
          <SocialShare title={`${coupleNames}'s Wedding Invitation`} />
        </div>

        {details.showContact && (details.contactEmail || details.contactPhone) && (
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 mb-8">
            {details.contactEmail && (
              <a href={`mailto:${details.contactEmail}`} className="flex items-center gap-1.5 hover:text-rose-600 transition">
                <Mail className="w-3.5 h-3.5" /> {details.contactEmail}
              </a>
            )}
            {details.contactPhone && (
              <a href={`tel:${details.contactPhone}`} className="flex items-center gap-1.5 hover:text-rose-600 transition">
                <Phone className="w-3.5 h-3.5" /> {details.contactPhone}
              </a>
            )}
          </div>
        )}

        <div className="text-[11px] uppercase tracking-widest text-stone-400">
          Created with EternalTie Luxury Wedding Studio
        </div>
      </footer>

      {/* Floating Interactive Music Player */}
      {details.enableMusic && details.musicUrl && (
        <MusicPlayer
          musicUrl={details.musicUrl}
          musicTitle={details.musicTitle || 'Acoustic Wedding Serenade'}
          autoPlay={false}
        />
      )}
    </div>
  );
}
