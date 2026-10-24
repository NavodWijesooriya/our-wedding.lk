'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WeddingProject } from '@/types/wedding';
import { WeddingGuest } from '@/types/rsvp';
import {
  getGuestsByWedding,
  addGuest,
  deleteGuest,
  generatePersonalizedInviteUrl,
  generateWhatsAppClickUrl,
} from '@/services/guestService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/contexts/ToastContext';
import {
  Users,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Sparkles,
  ArrowRight,
  Clock,
  UserCheck,
  UserX,
} from 'lucide-react';

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

interface GuestsTabProps {
  wedding: WeddingProject;
}

export function GuestsTab({ wedding }: GuestsTabProps) {
  const { toast } = useToast();
  const [guests, setGuests] = useState<WeddingGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState<number>(2);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const list = await getGuestsByWedding(wedding.id);
      setGuests(list);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, [wedding.id]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const g = await addGuest(wedding.id, {
        name: name.trim(),
        phone: phone.trim(),
        seatsAllocated: seats,
      });
      setGuests((prev) => [g, ...prev]);
      setName('');
      setPhone('');
      setSeats(2);
      setIsAdding(false);
      toast.success(`Personalized invite created for ${g.name}!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add guest.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm('Remove this guest?')) return;
    try {
      await deleteGuest(wedding.id, guestId);
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      toast.success('Guest removed.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const handleCopy = async (g: WeddingGuest) => {
    const url = generatePersonalizedInviteUrl(wedding.slug, g.code);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(g.id);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <span>Personalized Guests &amp; WhatsApp Invites</span>
            <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Create unique links for your guests and invite them directly on WhatsApp.
          </p>
        </div>

        <Link
          href={`/dashboard/rsvps`}
          className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Full Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Add Guest Form / Button */}
      {!isAdding ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          leftIcon={<Plus className="w-4 h-4 text-emerald-600" />}
          className="w-full border-dashed border-2 py-3 text-stone-700 hover:text-stone-900 hover:border-emerald-400"
        >
          + Add Guest &amp; Generate WhatsApp Invite Link
        </Button>
      ) : (
        <form onSubmit={handleAddGuest} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800">New Guest Invitation</span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <Input
            label="Guest / Party Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kasun Fernando"
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="WhatsApp Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0771234567"
            />
            <Select
              label="Seats Reserved"
              value={String(seats)}
              onChange={(e) => setSeats(Number(e.target.value))}
              options={[
                { value: '1', label: '1 Seat' },
                { value: '2', label: '2 Seats' },
                { value: '3', label: '3 Seats' },
                { value: '4', label: '4 Seats' },
                { value: '5', label: '5 Seats' },
              ]}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={saving}
            className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white border-0 font-bold"
            leftIcon={<WhatsAppIcon className="w-3.5 h-3.5 fill-white" />}
          >
            Create Guest &amp; Get WhatsApp Link
          </Button>
        </form>
      )}

      {/* Guest List Preview Cards */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 flex items-center justify-between">
          <span>Guest List ({guests.length})</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-14 bg-stone-100 rounded-xl animate-pulse" />
            <div className="h-14 bg-stone-100 rounded-xl animate-pulse" />
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center py-8 px-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-400">
            No guests added yet. Add guests above to generate WhatsApp links.
          </div>
        ) : (
          guests.map((g) => {
            const waUrl = generateWhatsAppClickUrl(wedding, g);
            const inviteUrl = generatePersonalizedInviteUrl(wedding.slug, g.code);

            return (
              <div
                key={g.id}
                className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">{g.name}</h5>
                    <p className="text-[10px] text-stone-400">
                      {g.phone || 'No phone'} • {g.seatsAllocated} {g.seatsAllocated === 1 ? 'seat' : 'seats'}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {g.status === 'attending' ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      Attending
                    </span>
                  ) : g.status === 'declined' ? (
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                      <UserX className="w-3 h-3 text-rose-600" />
                      Declined
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold transition shadow-2xs"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                    <span>Send Invite</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(g)}
                    className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                    title="Copy personalized link"
                  >
                    {copiedId === g.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                    title="Preview invite"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(g.id)}
                    className="p-1.5 rounded-xl border border-stone-200 text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete guest"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
