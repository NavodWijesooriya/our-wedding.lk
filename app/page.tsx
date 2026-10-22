'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PublicNavbar } from '@/components/navbar/PublicNavbar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { WEDDING_TEMPLATES } from '@/lib/mockData';
import {
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Music,
  Users,
  Palette,
  Globe,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loginDemo } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleInstantDemo = async () => {
    setDemoLoading(true);
    try {
      await loginDemo();
      router.push('/dashboard');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 selection:bg-rose-100 selection:text-rose-900 flex flex-col">
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Soft decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-rose-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Next-Generation Wedding Website Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-stone-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Design Your Dream Wedding Invitation Website In <span className="text-rose-600 italic">Minutes</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
            Create an elegant, personalized digital wedding invitation with real-time visual editing,
            custom background music, RSVP tracking, photo galleries, and unique links. Zero coding required.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {user ? (
              <Link href={user.status === 'approved' || user.role === 'admin' ? '/dashboard' : '/pending-approval'}>
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  {user.status === 'approved' || user.role === 'admin' ? 'Go to Your Dashboard' : 'Check Approval Status'}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Start Creating Free
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleInstantDemo}
                  isLoading={demoLoading}
                  leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
                >
                  Explore Live Demo Account
                </Button>
              </>
            )}

            <a
              href="/wedding/sophia-and-julian"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 px-4 py-2 font-medium"
            >
              <span>View Sample Live Invitation</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>

          {/* Visual Showcase Device Preview */}
          <div className="pt-8 relative max-w-5xl mx-auto">
            <div className="rounded-3xl bg-white p-3 sm:p-4 shadow-2xl border border-stone-200/80 ring-1 ring-stone-900/5">
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
                  alt="Wedding Platform Live Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-6 sm:p-10 text-left text-white">
                  <span className="text-xs uppercase tracking-widest text-rose-300 font-semibold mb-1">
                    Featured Template: Elegant Floral
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold">Sophia & Julian</h3>
                  <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
                    November 28, 2026 • The Glasshouse Botanical Pavilion, New York
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                      ✓ Real-time Live Preview
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                      ✓ Background Music Player
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                      ✓ Guest RSVP Tracking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
              Everything You Need
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Thoughtfully Crafted For Couples & Guests
            </h2>
            <p className="text-stone-500 text-sm font-light">
              Built with Next.js App Router, Cloud Firestore, and modern design principles to make
              your wedding invitation unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Live Visual Customizer</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Tweak fonts, switch templates, customize colors, and replace photos with an instant
                split-screen desktop and mobile preview.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Seamless Guest RSVP</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Guests can confirm attendance, party size, meal preferences, and heartfelt wishes
                without needing an account.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Unique Custom URLs</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Claim your personal slug like <code className="text-rose-600">/wedding/john-and-jane</code>{' '}
                with automatic validation and duplicate prevention.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Background Audio Player</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Choose from romantic acoustic, piano, or classical tracks, or connect your own custom
                MP3 song with play/pause controls.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Interactive Love Story</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Share how you met, your first trip, and the proposal with dynamic milestone timeline
                cards and photos.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Export & Data Privacy</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Download your guest list to CSV with one click. Strict data isolation ensures only you
                can access your wedding&apos;s RSVPs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES PREVIEW SHOWCASE */}
      <section id="templates" className="py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
                Signature Collection
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
                6 Professionally Designed Templates
              </h2>
            </div>
            <Link href="/dashboard/create">
              <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse All Templates
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEDDING_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tpl.previewImage}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="rose">{tpl.badge}</Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900">{tpl.name}</h3>
                    <p className="text-xs font-medium text-rose-600 uppercase tracking-wider">
                      {tpl.tagline}
                    </p>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
                  <span className="text-stone-400">{tpl.mood}</span>
                  <Link href="/dashboard/create" className="font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                    Select <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
              Effortless Setup
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              How EternalTie Works
            </h2>
            <p className="text-stone-500 text-sm font-light">
              From registration to sharing your unique link in 3 easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-md shadow-rose-200">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Choose Your Template</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Select from floral, minimalist, luxury gold, garden, traditional, or dark mode styles
                tailored to your wedding theme.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Customize Everything</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Add photos, love milestones, venue Google Maps links, dress code, background music,
                and review changes instantly in live preview.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-md shadow-emerald-200">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Publish & Collect RSVPs</h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Publish your custom URL, share it with family and friends, and manage dietary
                requests and RSVPs right on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950 p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-stone-800">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto animate-pulse" />
            <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
              Ready to create your wedding invitation?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-light">
              Join couples celebrating their love stories with timeless digital invitations.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Now Free
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={handleInstantDemo}
                isLoading={demoLoading}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Try Instant Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-12 text-center text-xs text-stone-500 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span className="font-playfair text-base font-bold text-stone-900">
            Eternal<span className="text-rose-600">Tie</span>
          </span>
        </div>
        <p className="font-light">
  An elegant, customizable platform for couples to design and share their perfect digital wedding invitations seamlessly.
</p>
        <p className="text-[11px] text-stone-400">
          © 2026 EternalTie. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
