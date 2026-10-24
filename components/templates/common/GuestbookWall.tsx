'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Send, MessageCircleHeart, Quote, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Wish {
  id: string;
  name: string;
  relation: string;
  message: string;
  emoji: string;
  likes: number;
  date: string;
}

interface GuestbookWallProps {
  coupleNames: string;
  primaryColor?: string;
  accentColor?: string;
  isDark?: boolean;
}

const DEFAULT_WISHES: Wish[] = [
  {
    id: 'w1',
    name: 'Elena Rostova',
    relation: 'Maid of Honor',
    message: 'To the most beautiful couple in the world! Watching your love story grow has been the greatest joy. May your days together be filled with endless laughter and adventure!',
    emoji: '🥂',
    likes: 18,
    date: 'Just now',
  },
  {
    id: 'w2',
    name: 'David & Amanda Vance',
    relation: 'Groom’s Family',
    message: 'Welcome to our family, Sophia! You two bring out the very best in each other. We could not be prouder or happier for you both today and always.',
    emoji: '💍',
    likes: 24,
    date: 'Today',
  },
  {
    id: 'w3',
    name: 'Marcus Chen',
    relation: 'College Best Friend',
    message: 'Julian, remember when you said you’d never settle down until you met someone truly extraordinary? Well, you found her. Wishing you both a lifetime of happiness!',
    emoji: '✨',
    likes: 15,
    date: 'Yesterday',
  },
  {
    id: 'w4',
    name: 'Auntie Chandrani',
    relation: 'Family Friend',
    message: 'May the Triple Gem bless your holy union! Wishing you peace, boundless prosperity, and good health as you begin this sacred journey as husband and wife.',
    emoji: '🌸',
    likes: 29,
    date: '2 days ago',
  },
];

export function GuestbookWall({
  coupleNames,
  primaryColor = '#e11d48',
  accentColor = '#fce7f3',
  isDark = false,
}: GuestbookWallProps) {
  const [wishes, setWishes] = useState<Wish[]>(DEFAULT_WISHES);
  const [authorName, setAuthorName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Load any previously persisted wishes from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`eternaltie_wishes_${coupleNames}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
        }
      }
    } catch {
      // Ignore fallback
    }
  }, [coupleNames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const newWish: Wish = {
      id: `wish_${Date.now()}`,
      name: authorName.trim(),
      relation: relation.trim() || 'Honored Guest',
      message: message.trim(),
      emoji: selectedEmoji,
      likes: 1,
      date: 'Just now',
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem(`eternaltie_wishes_${coupleNames}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Trigger sweet confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: [primaryColor, '#d4af37', '#f43f5e', '#fb7185'],
    });

    setAuthorName('');
    setRelation('');
    setMessage('');
    setIsSubmitting(false);
  };

  const handleLike = (id: string) => {
    if (likedMap[id]) return;
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setWishes((prev) =>
      prev.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w))
    );
  };

  const emojiOptions = ['❤️', '🥂', '💍', '✨', '🌸', '🕊️', '💐'];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3"
          style={{
            backgroundColor: isDark ? 'rgba(212,175,55,0.15)' : accentColor,
            color: isDark ? '#fef08a' : primaryColor,
          }}
        >
          <MessageCircleHeart className="w-3.5 h-3.5" />
          <span>Love &amp; Blessings</span>
        </motion.div>
        <h2
          className={`text-3xl sm:text-5xl font-serif font-normal tracking-tight ${
            isDark ? 'text-white' : 'text-stone-900'
          }`}
        >
          Words of Love &amp; Well Wishes
        </h2>
        <p
          className={`text-sm sm:text-base font-sans mt-3 max-w-xl mx-auto ${
            isDark ? 'text-stone-400' : 'text-stone-600'
          }`}
        >
          Leave a heartwarming note or congratulations for {coupleNames}. Your words will be treasured forever!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Wish Submission Card */}
        <div className="lg:col-span-5">
          <div
            className={`p-6 sm:p-8 rounded-3xl shadow-lg border relative overflow-hidden ${
              isDark
                ? 'bg-stone-900/90 border-stone-800 text-stone-200'
                : 'bg-white/95 border-rose-100 text-stone-800'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-serif text-xl font-semibold">Write Your Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya & Kasun"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition ${
                    isDark
                      ? 'bg-stone-800/80 border-stone-700 text-white placeholder:text-stone-500 focus:border-amber-400'
                      : 'bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:border-rose-400 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Your Relationship / Role (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bride's Cousin, Close Friend"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition ${
                    isDark
                      ? 'bg-stone-800/80 border-stone-700 text-white placeholder:text-stone-500 focus:border-amber-400'
                      : 'bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:border-rose-400 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Choose a Romantic Seal
                </label>
                <div className="flex items-center gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition cursor-pointer ${
                        selectedEmoji === emoji
                          ? 'scale-115 ring-2 ring-rose-400 shadow-xs bg-rose-50'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Heartfelt Wish &amp; Blessings *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Wishing you a lifetime filled with deep laughter, sweet moments, and timeless romance..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition resize-none ${
                    isDark
                      ? 'bg-stone-800/80 border-stone-700 text-white placeholder:text-stone-500 focus:border-amber-400'
                      : 'bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:border-rose-400 focus:bg-white'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full font-sans text-xs uppercase tracking-widest font-semibold text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Your Wish For {coupleNames}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Wishes Masonry Grid */}
        <div className="lg:col-span-7 space-y-4 max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence>
            {wishes.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`p-5 sm:p-6 rounded-2xl border shadow-xs transition hover:shadow-md relative group ${
                  isDark
                    ? 'bg-stone-900/60 border-stone-800/80 text-stone-300'
                    : 'bg-white/90 border-rose-100/70 text-stone-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">{item.emoji}</span>
                    <div>
                      <h4
                        className={`font-serif font-bold text-base ${
                          isDark ? 'text-white' : 'text-stone-900'
                        }`}
                      >
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-400 font-sans">
                        {item.relation} • {item.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                      likedMap[item.id]
                        ? 'bg-rose-100 text-rose-700 font-bold'
                        : 'bg-stone-100/80 text-stone-500 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        likedMap[item.id] ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    <span>{item.likes}</span>
                  </button>
                </div>

                <p className="text-sm font-sans leading-relaxed italic text-stone-600 dark:text-stone-300 pl-2 border-l-2 border-rose-200/80 my-2">
                  &ldquo;{item.message}&rdquo;
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
