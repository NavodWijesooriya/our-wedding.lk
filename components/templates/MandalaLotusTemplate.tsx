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
import { motion, AnimatePresence } from 'motion/react';
import { formatDate } from '@/lib/utils';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  Heart,
  Globe,
  Users,
  Compass,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface TemplateProps {
  wedding: WeddingProject;
  isLivePreview?: boolean;
}

// Sacred Sri Lankan Mandala SVG Motif
function SacredMandala({ className = '', spin = true }: { className?: string; spin?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={spin ? { rotate: 360 } : undefined}
      transition={spin ? { repeat: Infinity, duration: 80, ease: 'linear' } : undefined}
    >
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d8b45f" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#b98a2f" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8c6420" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8c872" />
          <stop offset="50%" stopColor="#c59933" />
          <stop offset="100%" stopColor="#92691e" />
        </linearGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="200" cy="200" r="190" fill="url(#goldGlow)" />

      {/* Outer intricate rings */}
      <circle cx="200" cy="200" r="185" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
      <circle cx="200" cy="200" r="172" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.8" />
      <circle cx="200" cy="200" r="162" stroke="url(#goldGradient)" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.7" />

      {/* 16 Radial Rays / Lotus Points */}
      {[...Array(16)].map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <g key={i} transform={`rotate(${angle} 200 200)`}>
            {/* Outer petal cusp */}
            <path
              d="M 200 35 C 193 70 180 110 200 130 C 220 110 207 70 200 35 Z"
              stroke="url(#goldGradient)"
              strokeWidth="1.2"
              fill="rgba(216, 180, 95, 0.05)"
            />
            {/* Fine decorative ray */}
            <circle cx="200" cy="30" r="2.5" fill="url(#goldGradient)" />
            <line x1="200" y1="36" x2="200" y2="48" stroke="url(#goldGradient)" strokeWidth="1.2" />
          </g>
        );
      })}

      {/* Inner Ring with 8 Broad Lotus Petals */}
      <circle cx="200" cy="200" r="120" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.9" />
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <g key={`inner-${i}`} transform={`rotate(${angle} 200 200)`}>
            <path
              d="M 200 80 C 185 110 175 145 200 160 C 225 145 215 110 200 80 Z"
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
              fill="rgba(197, 153, 51, 0.1)"
            />
            <circle cx="200" cy="115" r="3" fill="url(#goldGradient)" opacity="0.8" />
          </g>
        );
      })}

      {/* Central Sacred Sun / Core */}
      <circle cx="200" cy="200" r="65" stroke="url(#goldGradient)" strokeWidth="1.5" fill="rgba(247, 239, 225, 0.6)" />
      <circle cx="200" cy="200" r="50" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="200" cy="200" r="32" stroke="url(#goldGradient)" strokeWidth="1.8" fill="rgba(185, 138, 47, 0.15)" />
      <circle cx="200" cy="200" r="12" fill="url(#goldGradient)" />
    </motion.svg>
  );
}

// Ornate Lotus Flourish Divider SVG
function LotusDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-8 ${className}`}>
      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#b98a2f]/50 to-[#b98a2f]" />
      <svg
        viewBox="0 0 100 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-8 text-[#b98a2f] shrink-0"
      >
        <path
          d="M50 4 C48 14 38 24 22 26 C36 29 44 24 50 36 C56 24 64 29 78 26 C62 24 52 14 50 4 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <circle cx="50" cy="18" r="3" fill="#8c6420" />
        <circle cx="34" cy="27" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="66" cy="27" r="2" fill="currentColor" opacity="0.6" />
      </svg>
      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-[#b98a2f]/50 to-[#b98a2f]" />
    </div>
  );
}

// Golden Dust Particles Floating Effect
function FloatingGoldenDust() {
  const particles = [
    { id: 1, left: '10%', top: '15%', size: 3, duration: 12, delay: 0 },
    { id: 2, left: '25%', top: '45%', size: 4, duration: 16, delay: 2 },
    { id: 3, left: '40%', top: '25%', size: 2.5, duration: 14, delay: 4 },
    { id: 4, left: '60%', top: '70%', size: 4.5, duration: 18, delay: 1 },
    { id: 5, left: '75%', top: '35%', size: 3, duration: 15, delay: 3 },
    { id: 6, left: '88%', top: '80%', size: 3.5, duration: 13, delay: 5 },
    { id: 7, left: '15%', top: '85%', size: 2, duration: 17, delay: 2 },
    { id: 8, left: '92%', top: '20%', size: 4, duration: 19, delay: 0.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-[#ffd978] via-[#e4ba51] to-[#b98a2f] blur-[0.5px] shadow-[0_0_8px_#ffd978]"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [-25, 25, -25],
            x: [-15, 15, -15],
            opacity: [0.2, 0.85, 0.2],
            scale: [0.8, 1.25, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function MandalaLotusTemplate({ wedding }: TemplateProps) {
  const { details, themeConfig } = wedding;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lang, setLang] = useState<'si' | 'en'>('en');

  const coupleNames = `${details.brideName} & ${details.groomName}`;
  const weddingFormattedDate = formatDate(details.weddingDate);

  // Sri Lankan Traditional Schedule items with smart fallbacks
  const scheduleItems = [
    {
      time: details.auspiciousTime || '09:42 AM',
      titleEn: 'Auspicious Nakatha & Arrival',
      titleSi: 'සුබ නැකත හා ආගමනය',
      descEn: 'Traditional welcome of bride, groom, and revered families to the ceremonial pavilion.',
      descSi: 'මනාලිය, මනාලයා සහ දෙපාර්ශ්වයේ ඥාතීන් මංගල මණ්ඩපයට පිවිසීම.',
      icon: Clock,
    },
    {
      time: details.poruwaCeremonyTime || '10:15 AM',
      titleEn: 'Sacred Poruwa Ceremony',
      titleSi: 'චාරිත්‍රානුකූල පෝරුවේ චාරිත්‍ර',
      descEn: 'Chanting of Jayamangala Gatha, exchange of rings, tying of the sacred Nuul, and blessings.',
      descSi: 'ජයමංගල ගාථා, මුදු මාරු කිරීම, පිරිත් නූල් බැඳීම සහ මවුපිය උපහාරය.',
      icon: Heart,
    },
    {
      time: details.ceremonyTime?.split('-')?.[1]?.trim() || '11:30 AM',
      titleEn: 'Registration of Marriage',
      titleSi: 'විවාහ ලියාපදිංචිය',
      descEn: 'Signing of the official civil marriage registry witnessed by loved ones.',
      descSi: 'ආදරණීය සාක්ෂිකරුවන් ඉදිරියේ නිල විවාහ ලියාපදිංචිය.',
      icon: CheckCircle2,
    },
    {
      time: details.receptionTime?.split('-')?.[0]?.trim() || '12:30 PM',
      titleEn: 'Traditional Feast & Toast',
      titleSi: 'මංගල භෝජන සංග්‍රහය හා ප්‍රීති සාදය',
      descEn: 'Traditional Sri Lankan hospitality, lavish buffet, music, and celebration with the couple.',
      descSi: 'සම්ප්‍රදායික සංග්‍රහ, සුබපැතුම් හා ප්‍රීතිමත් සංගීතමය හෝරා.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf5ec] text-[#423118] font-cormorant selection:bg-[#d8b45f] selection:text-[#1e1302] relative overflow-x-hidden">
      {/* Textured Sandalwood Parchment Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#b98a2f 0.75px, transparent 0.75px), radial-gradient(#8c6420 0.75px, #faf5ec 0.75px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />

      {/* Floating Golden Dust Particles */}
      <FloatingGoldenDust />

      {/* Language & Cultural Blessing Pill */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2 bg-[#f4ebd9]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#b98a2f]/40 shadow-md">
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`text-[11px] font-sans font-semibold tracking-wider px-2 py-0.5 rounded-full transition ${
            lang === 'en'
              ? 'bg-[#b98a2f] text-white shadow-xs'
              : 'text-[#6d5022] hover:text-[#423118]'
          }`}
        >
          EN
        </button>
        <span className="text-[#b98a2f]/40 text-xs">|</span>
        <button
          type="button"
          onClick={() => setLang('si')}
          className={`text-[11px] font-sans font-semibold tracking-wider px-2 py-0.5 rounded-full transition ${
            lang === 'si'
              ? 'bg-[#b98a2f] text-white shadow-xs'
              : 'text-[#6d5022] hover:text-[#423118]'
          }`}
        >
          සිං
        </button>
      </div>

      {/* Hero Section */}
      {details.showHero && (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-20 sm:py-28 overflow-hidden text-center">
          {/* Overhead Rotating Sacred Mandala */}
          <div className="absolute -top-32 sm:-top-44 left-1/2 -translate-x-1/2 w-[340px] sm:w-[540px] md:w-[680px] pointer-events-none opacity-45">
            <SacredMandala spin={true} />
          </div>

          {/* Traditional Ornate Border Frame */}
          <div className="absolute inset-3 sm:inset-6 border border-[#b98a2f]/35 pointer-events-none rounded-2xl">
            <div className="absolute inset-1.5 border border-[#b98a2f]/20 rounded-xl" />
            {/* Corner traditional filigrees */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#b98a2f]" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#b98a2f]" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#b98a2f]" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#b98a2f]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-20 space-y-6 pt-16 sm:pt-24">
            {/* Cultural Blessing Capsule */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#f3e7d0]/90 border border-[#b98a2f]/50 text-[#7a5518] text-xs sm:text-sm font-sans tracking-[0.2em] shadow-sm uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b98a2f]" />
              <span>
                {lang === 'si'
                  ? details.culturalBlessing || 'සාදර ඇරයුමයි! • දෙමාපිය ආශිර්වාදය මැද'
                  : 'Together With Their Families'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#b98a2f]" />
            </motion.div>

            {/* Couple Photo in Kandyan Arched Gold Frame */}
            {details.heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative mx-auto w-44 sm:w-56 md:w-64 aspect-[4/5] p-2 rounded-t-full rounded-b-2xl bg-gradient-to-b from-[#e7cd88] via-[#b98a2f] to-[#7a5214] shadow-2xl"
              >
                <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#faf5ec] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={details.heroImage}
                    alt={coupleNames}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#423118]/40 via-transparent to-transparent pointer-events-none" />
                </div>
                {/* Gold finial pin */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#423118] text-[#f4ebd9] text-[10px] font-sans tracking-widest uppercase rounded-full border border-[#b98a2f]">
                  Poruwa Matrimony
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
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-cormorant font-bold tracking-wide text-[#342410]">
                <span className="bg-gradient-to-r from-[#94681a] via-[#cfa547] to-[#805510] bg-clip-text text-transparent">
                  {details.brideName}
                </span>
                <span className="block text-2xl sm:text-3xl font-normal italic text-[#a3792c] my-1 font-serif">
                  {lang === 'si' ? 'සහ' : '&'}
                </span>
                <span className="bg-gradient-to-r from-[#805510] via-[#cfa547] to-[#94681a] bg-clip-text text-transparent">
                  {details.groomName}
                </span>
              </h1>
              {details.brideFullName && details.groomFullName && (
                <p className="text-xs sm:text-sm text-[#70542c] font-sans tracking-widest uppercase">
                  {details.brideFullName} & {details.groomFullName}
                </p>
              )}
            </motion.div>

            <LotusDivider />

            {/* Quick Info Capsule */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-[#f2e5cc]/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-[#b98a2f]/40 text-xs sm:text-sm text-[#4d391c] font-sans shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#b98a2f]" />
                <span className="tracking-wider uppercase font-semibold">{weddingFormattedDate}</span>
              </div>
              <span className="text-[#b98a2f]/40 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#b98a2f]" />
                <span>{details.weddingTime}</span>
              </div>
              <span className="text-[#b98a2f]/40 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#b98a2f]" />
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
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b98a2f] via-[#cfa547] to-[#8c6420] hover:brightness-110 text-white font-sans text-xs tracking-widest uppercase font-bold transition-all shadow-lg hover:shadow-[#b98a2f]/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{lang === 'si' ? 'පැමිණීම තහවුරු කරන්න (RSVP)' : 'RSVP to Celebrate'}</span>
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </a>
              )}
              <div className="font-sans">
                <AddToCalendar
                  title={`${coupleNames} Poruwa Wedding`}
                  weddingDate={details.weddingDate}
                  weddingTime={details.weddingTime}
                  location={`${details.ceremonyVenue}, ${details.ceremonyAddress}`}
                  description={details.invitationMessage}
                />
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <div className="pt-8 flex flex-col items-center text-[#9c783c] animate-bounce">
              <span className="text-[10px] uppercase font-sans tracking-widest mb-1">
                {lang === 'si' ? 'පහළට යන්න' : 'Scroll to explore'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </section>
      )}

      {/* Parents Blessing & Introduction Section */}
      {(details.brideParents || details.groomParents) && (
        <AnimatedSection className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#9c783c] font-semibold">
              {lang === 'si' ? 'දෙමාපිය ආශිර්වාදය' : 'With Parental Blessings'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#342410]">
              {lang === 'si' ? 'පවුල් දෙපාර්ශ්වයේ සාදර ඇරයුම' : 'Together With Our Beloved Families'}
            </h2>
            <LotusDivider />
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#654d2a] italic">
              {lang === 'si'
                ? 'අප දෙමව්පියන්ගේ ආදරය හා ආශිර්වාදය මධ්‍යයේ, එක්වන අපගේ නව දිවියේ ආරම්භය දැකබලා ගැනීමට ඔබ සැමට ආදරයෙන් ආරාධනා කරමු.'
                : 'With the gracious guidance and heartfelt love of our parents, we invite you to stand beside us as we step forward in sacred union.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Bride's Family Card */}
            <div className="relative p-8 rounded-2xl bg-[#f5ecdc]/90 border border-[#b98a2f]/40 shadow-md text-center space-y-3 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 opacity-15 pointer-events-none">
                <SacredMandala spin={false} />
              </div>
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ebdcc2] border border-[#b98a2f]/50 flex items-center justify-center text-[#8c6420]">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-sans uppercase tracking-widest text-[#9c783c] font-bold">
                {lang === 'si' ? 'මනාලියගේ පාර්ශ්වය' : "Bride's Family"}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#342410]">
                {details.brideParents || 'The Montgomery Family'}
              </h3>
              <p className="text-sm text-[#7a5e35] font-sans">
                {lang === 'si'
                  ? `${details.brideName} දියණියගේ ආදරණීය දෙමව්පියන්`
                  : `Proud parents of ${details.brideName}`}
              </p>
            </div>

            {/* Groom's Family Card */}
            <div className="relative p-8 rounded-2xl bg-[#f5ecdc]/90 border border-[#b98a2f]/40 shadow-md text-center space-y-3 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 opacity-15 pointer-events-none">
                <SacredMandala spin={false} />
              </div>
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ebdcc2] border border-[#b98a2f]/50 flex items-center justify-center text-[#8c6420]">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-sans uppercase tracking-widest text-[#9c783c] font-bold">
                {lang === 'si' ? 'මනාලයාගේ පාර්ශ්වය' : "Groom's Family"}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#342410]">
                {details.groomParents || 'The Vance Family'}
              </h3>
              <p className="text-sm text-[#7a5e35] font-sans">
                {lang === 'si'
                  ? `${details.groomName} පුතණුවන්ගේ ආදරණීය දෙමව්පියන්`
                  : `Proud parents of ${details.groomName}`}
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Countdown Section */}
      {details.showCountdown && (
        <AnimatedSection className="py-14 sm:py-20 px-4 bg-[#f2e6cf]/70 border-y border-[#b98a2f]/25">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#9c783c] font-semibold">
              {lang === 'si' ? 'නැකතට පෙර හෝරාවන්' : 'Anticipating The Auspicious Moment'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#342410]">
              {lang === 'si' ? 'මංගල හෝරාවට ගණන් බලමු' : 'Counting Down To Forever'}
            </h2>
            <div className="pt-4 inline-block">
              <CountdownTimer
                weddingDate={details.weddingDate}
                weddingTime={details.weddingTime}
                cardClassName="bg-[#f7eedc] border border-[#b98a2f]/40 text-[#342410]"
                numberClassName="text-[#8c6420]"
                labelClassName="text-[#735933]"
              />
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Auspicious Poruwa & Ceremonial Schedule Section */}
      {details.showSchedule && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#9c783c] font-semibold">
              {lang === 'si' ? 'නැකැත් චාරිත්‍ර කාලසටහන' : 'Sacred Ceremony Itinerary'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#342410]">
              {lang === 'si' ? 'චාරිත්‍රානුකූල මංගල හෝරාවන්' : 'The Wedding Ceremony Program'}
            </h2>
            <LotusDivider />
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#654d2a]">
              {lang === 'si'
                ? 'සම්ප්‍රදායානුකූල පෝරුවේ චාරිත්‍ර හා ප්‍රීතිමත් උත්සව කාලසටහන මෙසේ දිගහැරේ.'
                : 'Follow each auspicious step of our sacred union, from traditional arrival to joyous reception.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {scheduleItems.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="relative p-6 rounded-2xl bg-[#f7eedc] border border-[#b98a2f]/40 hover:border-[#b98a2f] transition shadow-md hover:shadow-lg flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-[#ede0c7] border border-[#b98a2f]/50 flex items-center justify-center text-[#8c6420] group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-sans font-bold text-[#8c6420] px-3 py-1 bg-[#ede0c7] rounded-full border border-[#b98a2f]/30">
                        {item.time}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#342410]">
                        {lang === 'si' ? item.titleSi : item.titleEn}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#735933] font-sans mt-2 leading-relaxed">
                        {lang === 'si' ? item.descSi : item.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#b98a2f]/20 flex items-center gap-1.5 text-[11px] font-sans text-[#9c783c] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#b98a2f]" />
                    <span>Step 0{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      )}

      {/* Love Story / Journey Section */}
      {details.showStory && details.milestones && details.milestones.length > 0 && (
        <AnimatedSection className="py-18 sm:py-24 px-4 sm:px-8 bg-[#f4ebd8]/70 border-t border-[#b98a2f]/25">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#9c783c] font-semibold">
                {lang === 'si' ? 'අපේ ආදර කතාව' : 'Sacred Bond'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#342410]">
                {details.storyTitle || 'How Our Destiny Unfolded'}
              </h2>
              <LotusDivider />
              {details.storyIntro && (
                <p className="text-base sm:text-lg text-[#654d2a] italic max-w-2xl mx-auto">
                  {details.storyIntro}
                </p>
              )}
            </div>

            <div className="space-y-8">
              {details.milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-6 sm:p-8 rounded-2xl bg-[#faf5ec] border border-[#b98a2f]/30 shadow-sm flex flex-col sm:flex-row gap-6 items-center"
                >
                  {m.image && (
                    <div className="w-full sm:w-44 h-44 rounded-xl overflow-hidden shrink-0 bg-[#ebdcc2] border border-[#b98a2f]/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <span className="text-xs font-sans uppercase tracking-widest text-[#9c783c] font-bold">
                      {m.yearOrDate}
                    </span>
                    <h3 className="text-2xl font-bold text-[#342410]">{m.title}</h3>
                    <p className="text-sm sm:text-base text-[#6d532b] font-sans leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Venues & Locations Section */}
      {details.showVenue && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#9c783c] font-semibold">
              {lang === 'si' ? 'මංගල භූමිය' : 'Sacred Ground & Celebrations'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#342410]">
              {lang === 'si' ? 'උත්සව පැවැත්වෙන ස්ථාන' : 'Ceremony & Reception Venues'}
            </h2>
            <LotusDivider />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ceremony Venue */}
            <div className="p-8 rounded-2xl bg-[#f7eedc] border border-[#b98a2f]/40 shadow-md space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcc2] text-[#8c6420] text-xs font-sans tracking-wider uppercase font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lang === 'si' ? 'පෝරුවේ චාරිත්‍ර හා විවාහය' : 'Ceremony Venue'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#342410]">
                  {details.ceremonyVenue}
                </h3>
                <p className="text-sm text-[#735933] font-sans leading-relaxed">
                  {details.ceremonyAddress}
                </p>
                {details.ceremonyTime && (
                  <p className="text-xs font-sans text-[#8c6420] font-semibold">
                    Time: {details.ceremonyTime}
                  </p>
                )}
              </div>

              {details.mapsUrl && (
                <a
                  href={details.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#423118] text-[#f4ebd9] hover:bg-[#5a4321] transition text-xs font-sans tracking-wider uppercase font-semibold shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{lang === 'si' ? 'සිතියමෙන් බලන්න' : 'View on Google Maps'}</span>
                </a>
              )}
            </div>

            {/* Reception Venue */}
            <div className="p-8 rounded-2xl bg-[#f7eedc] border border-[#b98a2f]/40 shadow-md space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcc2] text-[#8c6420] text-xs font-sans tracking-wider uppercase font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'si' ? 'මංගල භෝජන සංග්‍රහය' : 'Reception Celebration'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#342410]">
                  {details.receptionVenue}
                </h3>
                <p className="text-sm text-[#735933] font-sans leading-relaxed">
                  {details.receptionAddress}
                </p>
                {details.receptionTime && (
                  <p className="text-xs font-sans text-[#8c6420] font-semibold">
                    Time: {details.receptionTime}
                  </p>
                )}
              </div>

              {details.mapsUrl && (
                <a
                  href={details.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#423118] text-[#f4ebd9] hover:bg-[#5a4321] transition text-xs font-sans tracking-wider uppercase font-semibold shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{lang === 'si' ? 'දිශාවන් ලබාගන්න' : 'Get Directions'}</span>
                </a>
              )}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Photo Gallery Section */}
      {details.showGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <AnimatedSection className="py-20 sm:py-28 px-4 sm:px-8 bg-[#f4ebd8]/70 border-t border-[#b98a2f]/25">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-3 mb-14">
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#9c783c] font-semibold">
                {lang === 'si' ? 'මතක සටහන්' : 'Cherished Moments'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#342410]">
                {lang === 'si' ? 'අපගේ ඡායාරූප ගැලරිය' : 'Our Visual Journey'}
              </h2>
              <LotusDivider />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {details.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer relative group border-2 border-[#b98a2f]/40 shadow-md bg-[#ebdcc2]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#342410]/0 group-hover:bg-[#342410]/30 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 rounded-full bg-[#faf5ec] text-[#423118] text-xs font-sans font-semibold shadow-lg">
                      View Photo
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
          <div className="p-8 sm:p-12 rounded-3xl bg-[#f7eedc] border-2 border-[#b98a2f]/50 shadow-2xl relative overflow-hidden">
            {/* Corner Mandala overlay */}
            <div className="absolute -bottom-16 -right-16 w-52 h-52 opacity-15 pointer-events-none">
              <SacredMandala spin={true} />
            </div>

            <div className="text-center space-y-3 mb-10">
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#9c783c] font-semibold">
                {lang === 'si' ? 'ඔබගේ පැමිණීම' : 'Your Gracious Presence'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#342410]">
                {lang === 'si' ? 'පැමිණීම ස්ථිර කරමු' : 'RSVP to Celebrate'}
              </h2>
              <LotusDivider />
              <p className="text-sm sm:text-base text-[#654d2a] font-sans">
                {lang === 'si'
                  ? 'අපගේ මංගල දිනය ආලෝකමත් කිරීමට ඔබගේ සහභාගීත්වය අප වෙත දන්වන්න.'
                  : 'Please let us know if you will join us in celebrating our sacred union.'}
              </p>
            </div>

            <RsvpForm
              weddingId={wedding.id}
              coupleNames={coupleNames}
              primaryColor="#b98a2f"
              themeStyle="luxury"
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-[#b98a2f]/30 bg-[#f2e5cc] text-xs sm:text-sm text-[#70542c] font-sans space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b98a2f]" />
          <span className="font-cormorant text-base sm:text-lg text-[#342410] font-bold">
            {coupleNames}
          </span>
          <Sparkles className="w-4 h-4 text-[#b98a2f]" />
        </div>
        <p className="text-[#8c6833]">
          {weddingFormattedDate} • {details.ceremonyVenue}
        </p>
        <p className="text-[11px] text-[#a6864d]">
          {lang === 'si' ? 'සාදරයෙන් සුබ පැතුම් සමඟින්!' : 'With blessings, love, and gratitude.'}
        </p>
      </footer>

      {/* Lightbox for gallery images */}
      {details.galleryImages && lightboxIndex !== null && (
        <PhotoLightbox
          images={details.galleryImages}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onSelectIndex={(idx: number) => setLightboxIndex(idx)}
        />
      )}

      {/* Background Music Player */}
      {details.enableMusic && details.musicUrl && (
        <MusicPlayer
          musicUrl={details.musicUrl}
          musicTitle={details.musicTitle || 'Sacred Traditional Serenade'}
        />
      )}
    </div>
  );
}
