'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getWeddingsByUser } from '@/services/weddingService';
import { getRsvpsByWedding, deleteRsvp } from '@/services/rsvpService';
import {
  getGuestsByWedding,
  addGuest,
  updateGuest,
  deleteGuest,
  generatePersonalizedInviteUrl,
  generateWhatsAppClickUrl,
  generateWhatsAppMessage,
} from '@/services/guestService';
import { WeddingProject } from '@/types/wedding';
import { RsvpResponse, WeddingGuest, GuestRsvpStatus } from '@/types/rsvp';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { exportToCSV, formatDate } from '@/lib/utils';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Download,
  Search,
  Filter,
  Trash2,
  Edit2,
  Copy,
  Check,
  Plus,
  ExternalLink,
  Send,
  MessageCircle,
  Sparkles,
  Heart,
  X,
  Share2,
} from 'lucide-react';

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export default function RsvpManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [weddings, setWeddings] = useState<WeddingProject[]>([]);
  const [selectedWeddingId, setSelectedWeddingId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'guests' | 'public_rsvps'>('guests');

  // Guests list & public RSVPs
  const [guests, setGuests] = useState<WeddingGuest[]>([]);
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'attending' | 'declined'>('all');

  // Modals & Action States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<WeddingGuest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Form states for Add/Edit Guest
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSeats, setFormSeats] = useState<number>(2);
  const [formNotes, setFormNotes] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  // Active Wedding object
  const activeWedding = useMemo(() => {
    return weddings.find((w) => w.id === selectedWeddingId) || null;
  }, [weddings, selectedWeddingId]);

  // Load user weddings
  useEffect(() => {
    async function loadWeddings() {
      if (!user) return;
      try {
        const list = await getWeddingsByUser(user.uid);
        setWeddings(list);
        if (list.length > 0) {
          setSelectedWeddingId(list[0].id);
        }
      } catch {
        toast.error('Failed to load wedding projects.');
      } finally {
        setLoading(false);
      }
    }
    loadWeddings();
  }, [user]);

  // Load Guests & RSVPs for selected wedding
  useEffect(() => {
    async function loadData() {
      if (!selectedWeddingId) {
        setGuests([]);
        setRsvps([]);
        return;
      }
      setLoadingData(true);
      try {
        const [gList, rList] = await Promise.all([
          getGuestsByWedding(selectedWeddingId),
          getRsvpsByWedding(selectedWeddingId),
        ]);
        setGuests(gList);
        setRsvps(rList);
      } catch (err) {
        console.error('Failed to load data:', err);
        toast.error('Failed to load guests and RSVP records.');
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [selectedWeddingId]);

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        (g.phone && g.phone.includes(search)) ||
        (g.email && g.email.toLowerCase().includes(search.toLowerCase())) ||
        g.code.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || g.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [guests, search, statusFilter]);

  // Filtered Public RSVPs
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        (r.phone && r.phone.includes(search));
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'attending' && r.attending === 'attending') ||
        (statusFilter === 'declined' && r.attending === 'declined');
      return matchSearch && matchStatus;
    });
  }, [rsvps, search, statusFilter]);

  // Guest Statistics
  const guestStats = useMemo(() => {
    const totalInvited = guests.length;
    const totalSeats = guests.reduce((acc, g) => acc + (g.seatsAllocated || 1), 0);
    const attendingList = guests.filter((g) => g.status === 'attending');
    const confirmedGuests = attendingList.length;
    const confirmedSeats = attendingList.reduce(
      (acc, g) => acc + (g.guestCount ?? g.seatsAllocated ?? 1),
      0
    );
    const pendingGuests = guests.filter((g) => g.status === 'pending').length;
    const declinedGuests = guests.filter((g) => g.status === 'declined').length;

    return {
      totalInvited,
      totalSeats,
      confirmedGuests,
      confirmedSeats,
      pendingGuests,
      declinedGuests,
    };
  }, [guests]);

  // Add or Edit Guest Handler
  const handleSaveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Please enter the guest name.');
      return;
    }

    setFormSaving(true);
    try {
      if (editingGuest) {
        const updated = await updateGuest(selectedWeddingId, editingGuest.id, {
          name: formName.trim(),
          phone: formPhone.trim(),
          email: formEmail.trim(),
          seatsAllocated: formSeats,
          notes: formNotes.trim(),
        });
        setGuests((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        toast.success(`Guest "${updated.name}" updated!`);
      } else {
        const newGuest = await addGuest(selectedWeddingId, {
          name: formName.trim(),
          phone: formPhone.trim(),
          email: formEmail.trim(),
          seatsAllocated: formSeats,
          notes: formNotes.trim(),
        });
        setGuests((prev) => [newGuest, ...prev]);
        toast.success(`Guest "${newGuest.name}" added with personalized invite link!`);
      }

      // Reset Form & Close Modal
      setIsAddModalOpen(false);
      setEditingGuest(null);
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormSeats(2);
      setFormNotes('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save guest.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleOpenEdit = (g: WeddingGuest) => {
    setEditingGuest(g);
    setFormName(g.name);
    setFormPhone(g.phone || '');
    setFormEmail(g.email || '');
    setFormSeats(g.seatsAllocated || 2);
    setFormNotes(g.notes || '');
    setIsAddModalOpen(true);
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!confirm(`Are you sure you want to remove "${guestName}" from your guest list?`)) return;
    try {
      await deleteGuest(selectedWeddingId, guestId);
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      toast.success('Guest removed from list.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete guest.');
    }
  };

  const handleDeleteRsvp = async (rsvpId: string) => {
    if (!confirm('Are you sure you want to delete this public RSVP record?')) return;
    try {
      await deleteRsvp(selectedWeddingId, rsvpId);
      setRsvps((prev) => prev.filter((r) => r.id !== rsvpId));
      toast.success('RSVP record removed.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete RSVP.');
    }
  };

  const handleCopyInviteLink = async (guest: WeddingGuest) => {
    if (!activeWedding) return;
    const url = generatePersonalizedInviteUrl(activeWedding.slug, guest.code);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(guest.id);
      toast.success(`Personal link for ${guest.name} copied!`);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  const handleCopyWhatsAppMessage = async (guest: WeddingGuest) => {
    if (!activeWedding) return;
    const message = generateWhatsAppMessage(activeWedding, guest);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessageId(guest.id);
      toast.success(`WhatsApp invitation message copied for ${guest.name}!`);
      setTimeout(() => setCopiedMessageId(null), 2500);
    } catch {
      toast.error('Failed to copy message.');
    }
  };

  const handleExportGuestsCSV = () => {
    if (!activeWedding) return;
    const filename = `${activeWedding.title || 'Wedding'}_Guest_List_${new Date().toISOString().slice(0, 10)}`;
    const rows = filteredGuests.map((g) => ({
      'Guest Name': g.name,
      'WhatsApp Phone': g.phone || '',
      'Email': g.email || '',
      'Status': g.status.toUpperCase(),
      'Seats Reserved': g.seatsAllocated,
      'Confirmed Headcount': g.status === 'attending' ? g.guestCount || g.seatsAllocated : 0,
      'Personal Link': generatePersonalizedInviteUrl(activeWedding.slug, g.code),
      'Notes': g.notes || '',
      'Responded At': g.respondedAt ? formatDate(g.respondedAt) : 'Not Yet',
    }));
    exportToCSV(filename, rows);
    toast.success('Guest list CSV exported!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-stone-200 animate-pulse rounded-lg" />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Wedding Project Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
            <span>Guests &amp; WhatsApp Invites</span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-sans font-semibold border border-emerald-200 flex items-center gap-1">
              <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
              WhatsApp Direct
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Generate unique personalized invitation links for each guest, share via WhatsApp with one tap, and track real-time attendance.
          </p>
        </div>

        {weddings.length > 0 && (
          <div className="w-full sm:w-72">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Active Wedding Project
            </label>
            <Select
              value={selectedWeddingId}
              onChange={(e) => setSelectedWeddingId(e.target.value)}
              options={weddings.map((w) => ({
                value: w.id,
                label: `${w.title} (${w.status})`,
              }))}
            />
          </div>
        )}
      </div>

      {weddings.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-stone-800 mb-1">
            No Wedding Projects Found
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Create your first wedding project before sending guest invitations.
          </p>
        </div>
      ) : (
        <>
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-500 mb-2">
                <Users className="w-4 h-4 text-stone-700" />
                <span className="text-xs font-semibold uppercase tracking-wider">Total Invited</span>
              </div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {guestStats.totalInvited}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {guestStats.totalSeats} seats allocated
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <UserCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Attending</span>
              </div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
                {guestStats.confirmedGuests}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                {guestStats.confirmedSeats} confirmed seats
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-100 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
              </div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-700">
                {guestStats.pendingGuests}
              </p>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                Awaiting response
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-400 mb-2">
                <UserX className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Declined</span>
              </div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-600">
                {guestStats.declinedGuests}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">With warm regrets</p>
            </div>

            <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Quick Action
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setEditingGuest(null);
                  setFormName('');
                  setFormPhone('');
                  setFormEmail('');
                  setFormSeats(2);
                  setFormNotes('');
                  setIsAddModalOpen(true);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
                className="w-full mt-2 shadow-md cursor-pointer"
              >
                Add Guest &amp; Invite
              </Button>
            </div>
          </div>

          {/* Navigation Tabs between Personalized Guests & Public RSVPs */}
          <div className="flex items-center justify-between border-b border-stone-200 pt-2">
            <div className="flex gap-4 sm:gap-6">
              <button
                onClick={() => setActiveTab('guests')}
                className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'guests'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                <span>Personalized WhatsApp Guest List ({guests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('public_rsvps')}
                className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'public_rsvps'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <span>Open Public Submissions ({rsvps.length})</span>
              </button>
            </div>

            {activeTab === 'guests' && guests.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportGuestsCSV}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="hidden sm:inline-flex mb-2"
              >
                Export CSV
              </Button>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by guest name, phone, or code..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('attending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'attending'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Attending
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('declined')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'declined'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Declined
              </button>
            </div>
          </div>

          {/* TAB 1: PERSONALIZED GUESTS TABLE & CARDS */}
          {activeTab === 'guests' && (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              {loadingData ? (
                <div className="p-8">
                  <TableSkeleton rows={5} />
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
                    <WhatsAppIcon className="w-7 h-7 fill-[#25D366]" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-800 mb-1">
                    No Guests Found
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                    {search || statusFilter !== 'all'
                      ? 'No guests match your current filter. Try adjusting your query.'
                      : 'Start adding your family, friends, and VIP guests to send them custom WhatsApp invitation links.'}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setEditingGuest(null);
                      setFormName('');
                      setFormPhone('');
                      setFormEmail('');
                      setFormSeats(2);
                      setFormNotes('');
                      setIsAddModalOpen(true);
                    }}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Your First Guest
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                        <th className="py-3.5 px-4 sm:px-6">Guest / Party Name</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Reserved Seats</th>
                        <th className="py-3.5 px-4">RSVP Status</th>
                        <th className="py-3.5 px-4 text-center">WhatsApp Invite</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                      {filteredGuests.map((g) => {
                        const whatsAppUrl = activeWedding ? generateWhatsAppClickUrl(activeWedding, g) : '';
                        const inviteUrl = activeWedding ? generatePersonalizedInviteUrl(activeWedding.slug, g.code) : '';

                        return (
                          <tr key={g.id} className="hover:bg-stone-50/80 transition-colors group">
                            {/* Guest Name & Notes */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="font-semibold text-stone-900 flex items-center gap-2">
                                <span>{g.name}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-stone-400 font-mono">
                                  code: {g.code}
                                </span>
                                {g.notes && (
                                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md truncate max-w-44">
                                    {g.notes}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Contact Info */}
                            <td className="py-4 px-4 text-stone-600">
                              <div className="font-medium text-stone-800">
                                {g.phone || <span className="text-stone-300 italic">No phone</span>}
                              </div>
                              {g.email && (
                                <div className="text-[11px] text-stone-400 truncate max-w-36">
                                  {g.email}
                                </div>
                              )}
                            </td>

                            {/* Allocated Seats & Headcount */}
                            <td className="py-4 px-4">
                              <span className="font-bold text-stone-900">
                                {g.seatsAllocated} {g.seatsAllocated === 1 ? 'Seat' : 'Seats'}
                              </span>
                              {g.status === 'attending' && (
                                <div className="text-[11px] text-emerald-600 font-medium">
                                  {g.guestCount || g.seatsAllocated} Confirmed
                                </div>
                              )}
                            </td>

                            {/* Status Badge */}
                            <td className="py-4 px-4">
                              {g.status === 'attending' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  Attending
                                </span>
                              ) : g.status === 'declined' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                  <UserX className="w-3.5 h-3.5 text-rose-600" />
                                  Declined
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  Pending
                                </span>
                              )}
                            </td>

                            {/* WhatsApp Direct Send Button */}
                            <td className="py-4 px-4 text-center">
                              <a
                                href={whatsAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer"
                                title="Open WhatsApp and send customized invitation message"
                              >
                                <WhatsAppIcon className="w-4 h-4 fill-white" />
                                <span>Send WhatsApp</span>
                              </a>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Copy Personalized Invite Link */}
                                <button
                                  type="button"
                                  onClick={() => handleCopyInviteLink(g)}
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                                  title="Copy unique personal link"
                                >
                                  {copiedId === g.id ? (
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Copy WhatsApp Message Text */}
                                <button
                                  type="button"
                                  onClick={() => handleCopyWhatsAppMessage(g)}
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                                  title="Copy WhatsApp invitation text"
                                >
                                  {copiedMessageId === g.id ? (
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Share2 className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Preview Link */}
                                <a
                                  href={inviteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  title="Preview guest invitation page"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>

                                {/* Edit Guest */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(g)}
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                                  title="Edit guest details"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                {/* Delete Guest */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGuest(g.id, g.name)}
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                  title="Delete guest"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PUBLIC OPEN RSVPS */}
          {activeTab === 'public_rsvps' && (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              {loadingData ? (
                <div className="p-8">
                  <TableSkeleton rows={5} />
                </div>
              ) : filteredRsvps.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-700">No Public RSVPs Recorded</p>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    When guests without a personalized link RSVP directly on your website, their submissions will be listed here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                        <th className="py-3.5 px-6">Guest Name</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Attending</th>
                        <th className="py-3.5 px-4">Party Size</th>
                        <th className="py-3.5 px-4">Warm Wishes / Note</th>
                        <th className="py-3.5 px-6 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                      {filteredRsvps.map((r) => (
                        <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-4 px-6 font-semibold text-stone-900">{r.name}</td>
                          <td className="py-4 px-4 text-stone-600">
                            <div>{r.email || '—'}</div>
                            <div className="text-[11px] text-stone-400">{r.phone}</div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={r.attending === 'attending' ? 'emerald' : 'stone'}>
                              {r.attending === 'attending' ? 'Attending' : 'Declined'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 font-bold text-stone-800">
                            {r.attending === 'attending' ? r.guestCount : 0}
                          </td>
                          <td className="py-4 px-4 text-stone-600 max-w-xs truncate">
                            {r.message || '—'}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteRsvp(r.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ADD / EDIT GUEST MODAL */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 mb-2">
                    <WhatsAppIcon className="w-3 h-3 fill-[#25D366]" />
                    WhatsApp Personalized Invite
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    {editingGuest ? 'Edit Guest' : 'Add New Wedding Guest'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Enter the guest details to generate their personalized RSVP link and WhatsApp greeting.
                  </p>
                </div>

                <form onSubmit={handleSaveGuest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Guest / Party Name *
                    </label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Kasun Fernando or Mr. & Mrs. Perera"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        WhatsApp Number
                      </label>
                      <Input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="e.g. 0771234567 or +94..."
                      />
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        Sri Lanka 07... will format to 947...
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Seats Reserved
                      </label>
                      <Select
                        value={String(formSeats)}
                        onChange={(e) => setFormSeats(Number(e.target.value))}
                        options={[
                          { value: '1', label: '1 Seat (Single)' },
                          { value: '2', label: '2 Seats (Couple)' },
                          { value: '3', label: '3 Seats' },
                          { value: '4', label: '4 Seats (Family)' },
                          { value: '5', label: '5 Seats' },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <Input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="guest@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Table / Special Notes (Optional)
                    </label>
                    <Input
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="e.g. Bride's VIP Table, Vegan preference"
                    />
                  </div>

                  {/* Preview Banner */}
                  {formName.trim() && activeWedding && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600 space-y-1">
                      <span className="font-semibold text-stone-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Personalized Greeting Preview:
                      </span>
                      <p className="italic text-stone-500 line-clamp-2">
                        &quot;Dearest *{formName}*, you are cordially invited to celebrate the wedding of {activeWedding.details.brideName} &amp; {activeWedding.details.groomName}...&quot;
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={formSaving}
                      leftIcon={<Check className="w-4 h-4" />}
                      className="cursor-pointer"
                    >
                      {editingGuest ? 'Save Changes' : 'Create & Generate Link'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
