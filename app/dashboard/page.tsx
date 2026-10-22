'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getWeddingsByUser } from '@/services/weddingService';
import { getRsvpsByWedding } from '@/services/rsvpService';
import { WeddingProject } from '@/types/wedding';
import { RsvpResponse } from '@/types/rsvp';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { DashboardOverviewSkeleton } from '@/components/ui/Skeletons';
import { motion } from 'motion/react';
import {
  CalendarHeart,
  Globe,
  Users,
  UserCheck,
  Plus,
  Edit3,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [weddings, setWeddings] = useState<WeddingProject[]>([]);
  const [recentRsvps, setRecentRsvps] = useState<RsvpResponse[]>([]);
  const [totalGuests, setTotalGuests] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadOverview() {
      if (!user) return;
      try {
        const list = await getWeddingsByUser(user.uid);
        setWeddings(list);

        // Fetch RSVPs for all user's weddings
        let allRsvps: RsvpResponse[] = [];
        for (const w of list) {
          const r = await getRsvpsByWedding(w.id);
          allRsvps = [...allRsvps, ...r];
        }

        allRsvps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentRsvps(allRsvps.slice(0, 5));

        const confirmed = allRsvps
          .filter((r) => r.attending === 'attending')
          .reduce((sum, curr) => sum + (curr.guestCount || 1), 0);
        setTotalGuests(confirmed);
      } catch (err) {
        console.error('Failed to load dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, [user]);

  const publishedCount = weddings.filter((w) => w.status === 'published').length;

  if (loading) {
    return <DashboardOverviewSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wedding Website Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Welcome back, {user?.displayName || 'Celebrant'}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Manage your wedding invitation websites, customize layouts in real-time, and track guest
            RSVPs from a single unified hub.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/dashboard/create">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-lg shadow-rose-900/40"
              >
                Create New Wedding Site
              </Button>
            </Link>
            <Link href="/dashboard/weddings">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                View All Websites
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">My Websites</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <CalendarHeart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{weddings.length}</p>
          <p className="text-xs text-stone-400">Total wedding invitations</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Live</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{publishedCount}</p>
          <p className="text-xs text-stone-400">Publicly accessible URLs</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">RSVP Responses</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{recentRsvps.length}</p>
          <p className="text-xs text-stone-400">Total submissions</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Attending Guests</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{totalGuests}</p>
          <p className="text-xs text-stone-400">Confirmed seats reserved</p>
        </div>
      </div>

      {/* Main Section: Recent Websites */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">My Wedding Invitations</h2>
            <p className="text-xs text-stone-500">
              Click &quot;Customize&quot; to open the visual live builder or view published links.
            </p>
          </div>
          <Link href="/dashboard/weddings">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              See All
            </Button>
          </Link>
        </div>

        {weddings.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-stone-300 space-y-4">
            <CalendarHeart className="w-12 h-12 text-stone-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-stone-800">No Wedding Websites Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Create your first personalized wedding invitation with custom dates, music, love
                stories, and RSVP tracking.
              </p>
            </div>
            <Link href="/dashboard/create">
              <Button variant="primary" size="md">
                Create Your First Website
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map((w) => {
              const isPublished = w.status === 'published';
              return (
                <div
                  key={w.id}
                  className="group rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={w.details.heroImage || w.details.coverImage}
                        alt={w.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant={isPublished ? 'emerald' : 'stone'}>
                          {isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider font-medium">
                        {w.templateId.replace('-', ' ')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-rose-600 transition">
                          {w.details.brideName} & {w.details.groomName}
                        </h3>
                        <p className="text-xs text-stone-500 truncate">{w.title}</p>
                      </div>

                      <div className="space-y-1 text-xs text-stone-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formatDate(w.details.weddingDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{w.details.ceremonyVenue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-4">
                    <Link href={`/editor/${w.id}`} className="flex-1">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                      >
                        Customize
                      </Button>
                    </Link>

                    {isPublished ? (
                      <a
                        href={`/wedding/${w.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Live Public Website"
                      >
                        <Button variant="outline" size="sm" className="p-2">
                          <ExternalLink className="w-4 h-4 text-stone-600" />
                        </Button>
                      </a>
                    ) : (
                      <Link href={`/editor/${w.id}`}>
                        <Button variant="outline" size="sm" className="p-2" title="Publish in editor">
                          <Globe className="w-4 h-4 text-stone-400" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent RSVP Activity Table */}
      {recentRsvps.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">Recent Guest RSVPs</h2>
              <p className="text-xs text-stone-500">Live responses submitted from your wedding websites.</p>
            </div>
            <Link href="/dashboard/rsvps">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All RSVPs
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Guest Name</th>
                    <th className="px-5 py-3.5">Attendance</th>
                    <th className="px-5 py-3.5">Party Size</th>
                    <th className="px-5 py-3.5">Meal Choice</th>
                    <th className="px-5 py-3.5">Message / Note</th>
                    <th className="px-5 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentRsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50/50 transition">
                      <td className="px-5 py-4 font-semibold text-stone-900">{r.name}</td>
                      <td className="px-5 py-4">
                        <Badge variant={r.attending === 'attending' ? 'emerald' : 'stone'}>
                          {r.attending === 'attending' ? 'Attending' : 'Declined'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-stone-700 font-medium">
                        {r.attending === 'attending' ? `${r.guestCount} guest(s)` : '-'}
                      </td>
                      <td className="px-5 py-4 text-stone-600 truncate max-w-44">
                        {r.mealPreference || '-'}
                      </td>
                      <td className="px-5 py-4 text-stone-500 truncate max-w-56 italic">
                        &quot;{r.message || 'No message'}&quot;
                      </td>
                      <td className="px-5 py-4 text-stone-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
