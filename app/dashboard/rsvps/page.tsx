'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getWeddingsByUser } from '@/services/weddingService';
import { getRsvpsByWedding, deleteRsvp } from '@/services/rsvpService';
import { WeddingProject } from '@/types/wedding';
import { RsvpResponse, AttendanceStatus } from '@/types/rsvp';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { exportToCSV } from '@/lib/utils';
import {
  Users,
  UserCheck,
  UserX,
  Download,
  Search,
  Filter,
  Trash2,
  Utensils,
  MessageSquare,
  Mail,
  Phone,
} from 'lucide-react';

export default function RsvpManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weddings, setWeddings] = useState<WeddingProject[]>([]);
  const [selectedWeddingId, setSelectedWeddingId] = useState<string>('');
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRsvps, setLoadingRsvps] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined'>('all');

  // Load weddings owned by user
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

  // Load RSVPs for selected wedding
  useEffect(() => {
    async function loadRsvps() {
      if (!selectedWeddingId) {
        setRsvps([]);
        return;
      }
      setLoadingRsvps(true);
      try {
        const list = await getRsvpsByWedding(selectedWeddingId);
        setRsvps(list);
      } catch (err) {
        console.error('Failed to load RSVPs:', err);
        toast.error('Failed to load RSVP records.');
      } finally {
        setLoadingRsvps(false);
      }
    }
    loadRsvps();
  }, [selectedWeddingId]);

  const handleDelete = async (rsvpId: string) => {
    if (!confirm('Are you sure you want to delete this RSVP response?')) return;
    try {
      await deleteRsvp(selectedWeddingId, rsvpId);
      setRsvps((prev) => prev.filter((r) => r.id !== rsvpId));
      toast.success('RSVP record removed.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete RSVP.');
    }
  };

  const handleExportCSV = () => {
    const selected = weddings.find((w) => w.id === selectedWeddingId);
    const filename = `${selected?.title || 'Wedding'}_RSVPs_${new Date().toISOString().slice(0, 10)}`;

    const rows = filteredRsvps.map((r) => ({
      'Guest Name': r.name,
      'Email': r.email || '',
      'Phone': r.phone || '',
      'Status': r.attending === 'attending' ? 'Attending' : 'Declined',
      'Number of Guests': r.attending === 'attending' ? r.guestCount : 0,
      'Meal Choice': r.mealPreference || '',
      'Dietary Notes': r.dietaryRestrictions || '',
      'Message': r.message || '',
      'Submitted Date': new Date(r.createdAt).toLocaleString(),
    }));

    exportToCSV(filename, rows);
    toast.success(`Exported ${rows.length} RSVP responses to CSV!`);
  };

  // Filtered list
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.mealPreference?.toLowerCase().includes(search.toLowerCase()) ||
      r.message?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.attending === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalAttending = rsvps.filter((r) => r.attending === 'attending').length;
  const totalDeclined = rsvps.filter((r) => r.attending === 'declined').length;
  const totalGuestCount = rsvps
    .filter((r) => r.attending === 'attending')
    .reduce((sum, curr) => sum + (curr.guestCount || 1), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Guest RSVP Management</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track confirmed attendees, meal choices, heartfelt messages, and export guest data.
          </p>
        </div>

        {/* Wedding project selector */}
        {weddings.length > 0 && (
          <div className="w-full sm:w-72">
            <Select
              label="Select Wedding Invitation"
              value={selectedWeddingId}
              onChange={(e) => setSelectedWeddingId(e.target.value)}
              options={weddings.map((w) => ({
                value: w.id,
                label: `${w.details.brideName} & ${w.details.groomName} (${w.status})`,
              }))}
            />
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Responses</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">{rsvps.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Attending Parties</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800">{totalAttending}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Headcount</span>
            <Users className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-rose-800">{totalGuestCount}</p>
          <p className="text-[10px] text-stone-400">Total reserved seats</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Declined</span>
            <UserX className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-700">{totalDeclined}</p>
        </div>
      </div>

      {/* Filter and Export Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="w-full sm:w-72">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest name or meal..."
            leftElement={<Search className="w-4 h-4 text-stone-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex gap-1.5">
            <Button
              variant={statusFilter === 'all' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'attending' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('attending')}
            >
              Attending ({totalAttending})
            </Button>
            <Button
              variant={statusFilter === 'declined' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('declined')}
            >
              Declined ({totalDeclined})
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={filteredRsvps.length === 0}
            leftIcon={<Download className="w-3.5 h-3.5 text-stone-600" />}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Responses Table */}
      {loading || loadingRsvps ? (
        <TableSkeleton rows={5} />
      ) : filteredRsvps.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white border border-dashed border-stone-300 space-y-3">
          <Users className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-semibold text-stone-800">No RSVP Responses Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {rsvps.length === 0
              ? 'Once your wedding website is published, guest submissions will show up here automatically.'
              : 'No responses matched your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-4">Guest Information</th>
                  <th className="px-5 py-4">Attendance</th>
                  <th className="px-5 py-4">Seats Reserved</th>
                  <th className="px-5 py-4">Meal Selection</th>
                  <th className="px-5 py-4">Dietary Notes</th>
                  <th className="px-5 py-4">Personal Wishes</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRsvps.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-stone-900 text-sm">{r.name}</div>
                      {(r.email || r.phone) && (
                        <div className="text-[11px] text-stone-400 flex flex-col gap-0.5 mt-0.5">
                          {r.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {r.email}
                            </span>
                          )}
                          {r.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {r.phone}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={r.attending === 'attending' ? 'emerald' : 'stone'}>
                        {r.attending === 'attending' ? 'Attending' : 'Declined'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-800">
                      {r.attending === 'attending' ? `${r.guestCount} guest(s)` : '-'}
                    </td>
                    <td className="px-5 py-4 text-stone-700">
                      {r.mealPreference ? (
                        <span className="inline-flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-stone-400" />
                          {r.mealPreference}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-5 py-4 text-stone-500 max-w-44 truncate">
                      {r.dietaryRestrictions || '-'}
                    </td>
                    <td className="px-5 py-4 text-stone-600 italic max-w-64">
                      {r.message ? (
                        <span className="line-clamp-2">&quot;{r.message}&quot;</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-5 py-4 text-stone-400 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
