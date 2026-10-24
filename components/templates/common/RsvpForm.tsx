'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { submitRsvp } from '@/services/rsvpService';
import { submitGuestPersonalizedRsvp } from '@/services/guestService';
import { AttendanceStatus, WeddingGuest } from '@/types/rsvp';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CheckCircle2, Sparkles, Send, Heart, UserCheck, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface RsvpFormProps {
  weddingId: string;
  coupleNames: string;
  primaryColor?: string;
  themeStyle?: 'floral' | 'luxury' | 'garden' | 'traditional' | 'minimal' | 'dark';
  guest?: WeddingGuest | null;
}

export function RsvpForm({
  weddingId,
  coupleNames,
  primaryColor = '#e11d48',
  themeStyle = 'floral',
  guest,
}: RsvpFormProps) {
  const [name, setName] = useState(guest?.name || '');
  const [email, setEmail] = useState(guest?.email || '');
  const [phone, setPhone] = useState(guest?.phone || '');
  const [attending, setAttending] = useState<AttendanceStatus>(
    guest?.status === 'declined' ? 'declined' : 'attending'
  );
  const [guestCount, setGuestCount] = useState<number>(
    guest?.guestCount || (guest ? Math.min(1, guest.seatsAllocated) : 1)
  );
  const [notes, setNotes] = useState(guest?.notes || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(guest?.status === 'pending' || !guest?.status);
  const [error, setError] = useState<string | null>(null);

  // Sync state if guest changes
  useEffect(() => {
    if (guest) {
      setName(guest.name);
      if (guest.email) setEmail(guest.email);
      if (guest.phone) setPhone(guest.phone);
      if (guest.guestCount) setGuestCount(guest.guestCount);
      if (guest.status && guest.status !== 'pending') {
        setAttending(guest.status);
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    }
  }, [guest]);

  const maxAllowedSeats = guest?.seatsAllocated || 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (guest?.code) {
        // Personalized Guest submission (identifies exact guest and allocated seats)
        await submitGuestPersonalizedRsvp(weddingId, guest.code, {
          attending,
          guestCount: attending === 'attending' ? guestCount : 0,
          notes,
        });
      } else {
        // Standard open public submission
        await submitRsvp(weddingId, {
          name,
          email,
          phone,
          attending,
          guestCount: attending === 'attending' ? guestCount : 0,
          message: notes,
        });
      }

      setSubmitted(true);
      setIsEditing(false);

      if (attending === 'attending') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#d4af37', '#f43f5e', '#fbbf24', '#ffffff', '#10b981'],
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = themeStyle === 'dark';

  // If already responded and not currently in edit mode, show warm confirmation view
  if ((submitted || (guest && guest.status !== 'pending')) && !isEditing) {
    const isAttending = attending === 'attending' || guest?.status === 'attending';
    const confirmedCount = guestCount || guest?.guestCount || 1;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'max-w-lg mx-auto text-center p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md border transition-all',
          isDark
            ? 'bg-stone-900/95 border-amber-500/30 text-white'
            : 'bg-white/95 border-rose-100/80 text-stone-900'
        )}
      >
        <div
          className={cn(
            'w-18 h-18 mx-auto mb-5 rounded-full flex items-center justify-center shadow-lg',
            isAttending
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-emerald-500/10'
              : 'bg-stone-100 text-stone-600 border border-stone-200 shadow-stone-500/10'
          )}
        >
          {isAttending ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          ) : (
            <XCircle className="w-10 h-10 text-stone-500" />
          )}
        </div>

        {guest && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Personal Invitation Confirmed
          </span>
        )}

        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
          {isAttending ? 'We Can’t Wait to Celebrate Together!' : 'Thank You for Letting Us Know'}
        </h3>

        <p className="text-sm text-stone-600 dark:text-stone-300 mb-6 leading-relaxed max-w-md mx-auto">
          {isAttending
            ? `Dearest ${name}, your attendance for ${confirmedCount} guest${confirmedCount > 1 ? 's' : ''} is confirmed! ${coupleNames} are overjoyed and look forward to sharing this magical day with you.`
            : `Dearest ${name}, your response has been recorded with warm appreciation. You will be missed dearly, but we know you are celebrating with us in spirit!`}
        </p>

        <button
          onClick={() => {
            setIsEditing(true);
            setSubmitted(false);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 underline transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Change or update response</span>
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'max-w-xl mx-auto p-6 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md transition-all',
        isDark
          ? 'bg-stone-900/95 border border-amber-500/30 text-stone-100'
          : 'bg-white/95 border border-rose-100/90 text-stone-900'
      )}
    >
      <div className="text-center mb-8">
        {/* Personalized Guest Badge Ribbon */}
        {guest ? (
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-xs font-serif font-bold text-rose-900">
              Personalized for {guest.name}
            </span>
            <span className="text-[10px] text-rose-600 font-sans font-medium">
              • {guest.seatsAllocated} Seat{guest.seatsAllocated > 1 ? 's' : ''} Reserved
            </span>
          </div>
        ) : (
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-500 flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Wedding RSVP
          </span>
        )}

        <h3 className="text-2xl sm:text-3xl font-serif font-bold">
          {guest ? `Dearest ${guest.name}, Will You Join Us?` : 'Will You Be Joining Us?'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5 max-w-md mx-auto leading-relaxed">
          {guest
            ? `We have joyfully reserved ${guest.seatsAllocated} seat${guest.seatsAllocated > 1 ? 's' : ''} in your honor. Please let us know if you can attend.`
            : 'Kindly confirm your attendance so we can prepare your place at our celebration.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* Attendance choice buttons */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        <button
          type="button"
          onClick={() => setAttending('attending')}
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer',
            attending === 'attending'
              ? 'border-rose-500 bg-rose-50/90 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
              : isDark
              ? 'border-stone-800 bg-stone-800/50 text-stone-300 hover:bg-stone-800'
              : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-100'
          )}
        >
          <span className="text-base mb-1 flex items-center gap-1.5">
            <span>Joyfully Accept</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </span>
          <span className="text-[11px] font-normal text-stone-500">I will be there!</span>
        </button>

        <button
          type="button"
          onClick={() => setAttending('declined')}
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer',
            attending === 'declined'
              ? 'border-stone-500 bg-stone-100 text-stone-800 shadow-sm ring-2 ring-stone-400/20'
              : isDark
              ? 'border-stone-800 bg-stone-800/50 text-stone-300 hover:bg-stone-800'
              : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-100'
          )}
        >
          <span className="text-base mb-1">Regretfully Decline</span>
          <span className="text-[11px] font-normal text-stone-500">Celebrating from afar</span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Full Name *
            </label>
            {guest && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Identified Guest
              </span>
            )}
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kasun Fernando"
            required
            readOnly={Boolean(guest)}
            className={cn(
              isDark ? 'bg-stone-800 border-stone-700 text-white' : '',
              guest ? 'bg-stone-50/80 font-medium' : ''
            )}
          />
        </div>

        {attending === 'attending' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                Number of Guests Attending
              </label>
              {guest && (
                <span className="text-[11px] text-stone-500">
                  Max: {guest.seatsAllocated} {guest.seatsAllocated === 1 ? 'seat' : 'seats'}
                </span>
              )}
            </div>
            <Select
              value={String(guestCount)}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              options={Array.from({ length: maxAllowedSeats }, (_, i) => ({
                value: String(i + 1),
                label: i === 0 ? '1 Guest (Just me)' : `${i + 1} Guests`,
              }))}
              className={isDark ? 'bg-stone-800 border-stone-700 text-white' : ''}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-stone-600 dark:text-stone-300">
              Email Address (Optional)
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
              Phone / WhatsApp
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94 77 123 4567"
              className={isDark ? 'bg-stone-800 border-stone-700 text-white' : ''}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-stone-600 dark:text-stone-300">
            Warm Wishes or Note for Couple (Optional)
          </label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Congratulations! So thrilled for you both..."
            className={isDark ? 'bg-stone-800 border-stone-700 text-white' : ''}
          />
        </div>
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full shadow-xl text-base py-3.5 cursor-pointer"
          style={{
            backgroundColor: primaryColor,
          }}
          rightIcon={<Send className="w-4 h-4" />}
        >
          {attending === 'attending' ? 'Confirm Joyful Attendance' : 'Submit Response with Regrets'}
        </Button>
      </div>
    </form>
  );
}
