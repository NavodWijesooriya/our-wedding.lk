'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createWedding, isSlugAvailable } from '@/services/weddingService';
import { WEDDING_TEMPLATES } from '@/lib/mockData';
import { WeddingTemplateId } from '@/types/wedding';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { slugify } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Heart, Sparkles, Check, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreateWeddingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-12-12');
  const [templateId, setTemplateId] = useState<WeddingTemplateId>('elegant-floral');
  const [slug, setSlug] = useState('');
  const [isSlugChecking, setIsSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<'available' | 'taken' | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-generate slug when names change
  const handleNameChange = (b: string, g: string) => {
    setBrideName(b);
    setGroomName(g);
    if (b && g) {
      setSlug(slugify(`${b}-and-${g}`));
      setSlugStatus(null);
    }
  };

  const handleNextStep1 = () => {
    if (!brideName.trim() || !groomName.trim()) {
      toast.error("Please provide both bride and groom's names.");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const checkSlugNow = async () => {
    const clean = slugify(slug);
    if (!clean) return;
    setIsSlugChecking(true);
    try {
      const avail = await isSlugAvailable(clean);
      setSlugStatus(avail ? 'available' : 'taken');
      if (avail) {
        toast.success('Slug is available!');
      } else {
        toast.error('Slug is already taken.');
      }
    } finally {
      setIsSlugChecking(false);
    }
  };

  const handleFinishCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const created = await createWedding({
        userId: user.uid,
        brideName: brideName.trim(),
        groomName: groomName.trim(),
        weddingDate,
        templateId,
        customSlug: slug.trim(),
      });

      toast.success('Wedding invitation created! Opening editor...');
      router.push(`/editor/${created.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create wedding website.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/weddings" className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Create New Wedding Website</h1>
          <p className="text-xs text-stone-500">Step {step} of 3: {step === 1 ? 'Couple & Date' : step === 2 ? 'Select Design Template' : 'Choose Web Address'}</p>
        </div>
      </div>

      {/* Step Progress indicators */}
      <div className="grid grid-cols-3 gap-2">
        <div className={cn('h-1.5 rounded-full transition-all', step >= 1 ? 'bg-rose-600' : 'bg-stone-200')} />
        <div className={cn('h-1.5 rounded-full transition-all', step >= 2 ? 'bg-rose-600' : 'bg-stone-200')} />
        <div className={cn('h-1.5 rounded-full transition-all', step >= 3 ? 'bg-rose-600' : 'bg-stone-200')} />
      </div>

      {/* Animated Step Cards */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6"
          >
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>
              <h2 className="text-xl font-bold font-serif text-stone-900">Who is getting married?</h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter the names of the couple and the planned wedding ceremony date.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <Input
                label="Bride's Name"
                value={brideName}
                onChange={(e) => handleNameChange(e.target.value, groomName)}
                placeholder="e.g. Sophia"
                required
              />
              <Input
                label="Groom's Name"
                value={groomName}
                onChange={(e) => handleNameChange(brideName, e.target.value)}
                placeholder="e.g. Julian"
                required
              />
            </div>

            <div className="max-w-lg mx-auto">
              <Input
                label="Wedding Date"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100 max-w-lg mx-auto">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNextStep1}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Templates
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6"
          >
            <div className="text-center max-w-md mx-auto mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-serif text-stone-900">Choose Your Wedding Template</h2>
              <p className="text-xs text-stone-500 mt-1">
                Select an invitation aesthetic. You can freely change this anytime inside the editor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WEDDING_TEMPLATES.map((tpl) => {
                const isSelected = templateId === tpl.id;
                return (
                  <motion.div
                    key={tpl.id}
                    whileHover={{ y: -4 }}
                    onClick={() => setTemplateId(tpl.id)}
                    className={cn(
                      'rounded-2xl border p-4 cursor-pointer transition-all flex flex-col justify-between group overflow-hidden bg-white text-left',
                      isSelected
                        ? 'border-rose-600 ring-2 ring-rose-600/20 shadow-md'
                        : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                    )}
                  >
                    <div>
                      <div className="aspect-16/10 rounded-xl overflow-hidden mb-3 bg-stone-100 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={tpl.previewImage} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {tpl.badge}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm text-stone-900">{tpl.name}</h3>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">{tpl.description}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center gap-1.5 mt-3 text-[11px] text-stone-400">
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: tpl.primaryColor }} />
                      <span>{tpl.mood}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <Button variant="ghost" size="md" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={handleNextStep2} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to URL Slug
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <form onSubmit={handleFinishCreate} className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
              <div className="text-center max-w-md mx-auto mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold font-serif text-stone-900">Your Unique Web Address</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Choose the public link your guests will visit. You can always change it later before publishing.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Invitation URL Slug
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={slug}
                      onChange={(e) => {
                        setSlug(slugify(e.target.value));
                        setSlugStatus(null);
                      }}
                      leftElement={<span className="text-stone-400 text-xs">/wedding/</span>}
                      placeholder="sophia-and-julian"
                      required
                    />
                  </div>
                  <Button type="button" variant="outline" size="md" onClick={checkSlugNow} isLoading={isSlugChecking}>
                    Check
                  </Button>
                </div>

                {slugStatus === 'available' && (
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> This URL is available!
                  </p>
                )}
                {slugStatus === 'taken' && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> This slug is already taken. Please choose another one.
                  </p>
                )}

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1 mt-4">
                  <p className="font-semibold text-stone-800">Summary:</p>
                  <p>• Couple: {brideName} & {groomName}</p>
                  <p>• Date: {weddingDate}</p>
                  <p>• Design: {templateId.replace('-', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <Button type="button" variant="ghost" size="md" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Open Live Builder Now
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
