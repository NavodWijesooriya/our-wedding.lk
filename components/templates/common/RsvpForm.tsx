'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { submitRsvp } from '@/services/rsvpService';
import { AttendanceStatus } from '@/types/rsvp';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CheckCircle2, Sparkles, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RsvpFormProps {
  weddingId: string;
  coupleNames: string;
  primaryColor?: string;
  themeStyle?: 'floral' | 'luxury' | 'garden' | 'traditional' | 'minimal' | 'dark';
}

export function RsvpForm({
  weddingId,
  coupleNames,
  primaryColor = '#e11d48',
  themeStyle = 'floral',
}: RsvpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<AttendanceStatus>('attending');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitRsvp(weddingId, {
        name,
        email,
        phone,
        attending,
        guestCount,
      });

      setSubmitted(true);

      if (attending === 'attending') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#d4af37', '#f43f5e', '#fbbf24', '#ffffff'],
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-white/95 backdrop-blur-md shadow-xl border border-stone-200/80">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          {attending === 'attending' ? 'We Can’t Wait to Celebrate!' : 'Thank You for Letting Us Know'}
        </h3>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          {attending === 'attending'
            ? `Your RSVP for ${name} (${guestCount} guest${guestCount > 1 ? 's' : ''}) has been received. ${coupleNames} look forward to sharing this magical day with you!`
            : `Your response has been noted. We will miss you dearly, but appreciate your response!`}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setPhone('');
          }}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline transition cursor-pointer"
        >
          Submit another response
        </button>
      </div>
    );
  }

  const isDark = themeStyle === 'dark';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'max-w-xl mx-auto p-6 sm:p-10 rounded-3xl shadow-xl transition-all',
        isDark
          ? 'bg-stone-900/95 border border-amber-500/30 text-stone-100'
          : 'bg-white/95 border border-stone-200/80 text-stone-900'
      )}
    >
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest font-semibold text-rose-500 flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5" /> RSVP Response
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold">Will You Be Joining Us?</h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Kindly respond by the specified date so we can plan accordingly.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* Attendance choice buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setAttending('attending')}
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer',
            attending === 'attending'
              ? 'border-rose-500 bg-rose-50/80 text-rose-700 shadow-xs ring-2 ring-rose-500/20'
              : isDark
              ? 'border-stone-800 bg-stone-800/50 text-stone-300 hover:bg-stone-800'
              : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-100'
          )}
        >
          <span className="text-base mb-1">Joyfully Accepts</span>
          <span className="text-[11px] font-normal text-stone-500">I will be there!</span>
        </button>

        <button
          type="button"
          onClick={() => setAttending('declined')}
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer',
            attending === 'declined'
              ? 'border-stone-500 bg-stone-100 text-stone-800 shadow-xs ring-2 ring-stone-400/20'
              : isDark
              ? 'border-stone-800 bg-stone-800/50 text-stone-300 hover:bg-stone-800'
              : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-100'
          )}
        >
          <span className="text-base mb-1">Regretfully Declines</span>
          <span className="text-[11px] font-normal text-stone-500">Celebrating from afar</span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-stone-600 dark:text-stone-300">
            Full Name *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lord & Lady Ashton"
            required
            className={isDark ? 'bg-stone-800 border-stone-700 text-white' : ''}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-stone-600 dark:text-stone-300">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={isDark ? 'bg-stone-800 border-stone-700 text-white' : ''}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-stone-600 dark:text-stone-300">
              Phone Number
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={isDark ? 'bg-stone-800 border-stone-700 text-white' : ''}
            />
          </div>
        </div>

        {attending === 'attending' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-stone-600 dark:text-stone-300">
              Number of Guests
            </label>
            <Select
              value={String(guestCount)}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              options={[
                { value: '1', label: '1 Guest (Just me)' },
                { value: '2', label: '2 Guests (Me & +1)' },
                { value: '3', label: '3 Guests' },
                { value: '4', label: '4 Guests' },
                { value: '5', label: '5 Guests' },
              ]}
              className={isDark ? 'bg-stone-800 border-stone-700 text-white' : ''}
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full shadow-lg"
          style={{
            backgroundColor: primaryColor,
          }}
          rightIcon={<Send className="w-4 h-4" />}
        >
          Confirm RSVP Response
        </Button>
      </div>
    </form>
  );
}
