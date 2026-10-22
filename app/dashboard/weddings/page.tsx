'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getWeddingsByUser, deleteWedding, updateWedding } from '@/services/weddingService';
import { WeddingProject } from '@/types/wedding';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { WeddingCardsSkeleton } from '@/components/ui/Skeletons';
import { formatDate } from '@/lib/utils';
import {
  CalendarHeart,
  Plus,
  Edit3,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Globe,
  Search,
  Clock,
  MapPin,
} from 'lucide-react';

export default function MyWeddingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weddings, setWeddings] = useState<WeddingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteTarget, setDeleteTarget] = useState<WeddingProject | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    try {
      const list = await getWeddingsByUser(user.uid);
      setWeddings(list);
    } catch (err: any) {
      toast.error('Failed to load wedding projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCopyLink = async (wedding: WeddingProject) => {
    const url = `${window.location.origin}/wedding/${wedding.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(wedding.id);
      toast.success('Invitation link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleTogglePublish = async (wedding: WeddingProject) => {
    if (!user) return;
    const newStatus = wedding.status === 'published' ? 'draft' : 'published';
    try {
      await updateWedding(wedding.id, user.uid, { status: newStatus });
      toast.success(newStatus === 'published' ? 'Wedding website published!' : 'Website returned to draft');
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update publication status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !user) return;
    try {
      await deleteWedding(deleteTarget.id, user.uid);
      toast.success('Wedding invitation project deleted.');
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete wedding.');
    }
  };

  const filteredWeddings = weddings.filter((w) => {
    const matchSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.details.brideName.toLowerCase().includes(search.toLowerCase()) ||
      w.details.groomName.toLowerCase().includes(search.toLowerCase()) ||
      w.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">My Wedding Websites</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage, customize, and publish your personalized wedding invitation projects.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Website
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by couple names or URL slug..."
            leftElement={<Search className="w-4 h-4 text-stone-400" />}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All ({weddings.length})
          </Button>
          <Button
            variant={statusFilter === 'published' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('published')}
          >
            Published ({weddings.filter((w) => w.status === 'published').length})
          </Button>
          <Button
            variant={statusFilter === 'draft' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('draft')}
          >
            Drafts ({weddings.filter((w) => w.status === 'draft').length})
          </Button>
        </div>
      </div>

      {/* Grid of Weddings */}
      {loading ? (
        <WeddingCardsSkeleton count={6} />
      ) : filteredWeddings.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white border border-dashed border-stone-300 space-y-4">
          <CalendarHeart className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-semibold text-stone-800">No Wedding Websites Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {search ? 'No results matched your search query.' : 'Get started by creating your first wedding website.'}
          </p>
          <Link href="/dashboard/create">
            <Button variant="primary" size="md">
              Create New Website
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeddings.map((w, index) => {
            const isPublished = w.status === 'published';
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.details.heroImage || w.details.coverImage}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <Badge variant={isPublished ? 'emerald' : 'stone'}>
                        {isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                      {w.templateId.replace('-', ' ')}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        {w.details.brideName} & {w.details.groomName}
                      </h3>
                      <p className="text-xs font-mono text-stone-400 mt-0.5 truncate">/wedding/{w.slug}</p>
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

                {/* Card Actions */}
                <div className="p-5 pt-0 border-t border-stone-100 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Link href={`/editor/${w.id}`} className="flex-1">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                      >
                        Customize Editor
                      </Button>
                    </Link>

                    {isPublished && (
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
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                    <button
                      onClick={() => handleCopyLink(w)}
                      className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium transition cursor-pointer"
                    >
                      {copiedId === w.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleTogglePublish(w)}
                      className="text-stone-500 hover:text-stone-900 font-medium transition cursor-pointer"
                    >
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => setDeleteTarget(w)}
                      className="text-red-500 hover:text-red-700 transition cursor-pointer p-1"
                      title="Delete website"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Wedding Project?"
        description="Are you sure you want to permanently remove this wedding website?"
      >
        <div className="space-y-4">
          <p className="text-sm text-stone-600">
            This action cannot be undone. All saved customization settings and guest RSVPs associated
            with <strong>{deleteTarget?.title}</strong> will be erased.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
