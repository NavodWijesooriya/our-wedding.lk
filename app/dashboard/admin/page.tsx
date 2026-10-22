'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getAllUsers, updateUserStatus } from '@/services/userService';
import { UserProfile, UserApprovalStatus } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  ShieldCheck,
  Users,
  Clock,
  UserCheck,
  UserX,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Mail,
  Calendar,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ADMIN_EMAIL } from '@/lib/firebase';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { success, error: toastError, info } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [processingUid, setProcessingUid] = useState<string | null>(null);

  // Reject modal state
  const [rejectTarget, setRejectTarget] = useState<UserProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('Account registration request was not approved.');

  // Guard: Admin only!
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'admin' && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        toastError('Access Denied', 'You do not have administrative privileges.');
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router, toastError]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      toastError('Load Failed', err?.message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())) {
      loadUsers();
    }
  }, [user]);

  // Handle Approve
  const handleApprove = async (targetUser: UserProfile) => {
    setProcessingUid(targetUser.uid);
    try {
      await updateUserStatus(targetUser.uid, 'approved');
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUser.uid ? { ...u, status: 'approved' } : u))
      );
      success('User Approved', `${targetUser.displayName || targetUser.email} has been approved.`);
    } catch (err: any) {
      toastError('Approval Error', err?.message || 'Could not approve user.');
    } finally {
      setProcessingUid(null);
    }
  };

  // Handle Reject
  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    setProcessingUid(rejectTarget.uid);
    try {
      await updateUserStatus(rejectTarget.uid, 'rejected', rejectReason);
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === rejectTarget.uid ? { ...u, status: 'rejected', rejectionReason: rejectReason } : u
        )
      );
      info('User Rejected', `${rejectTarget.displayName || rejectTarget.email} was declined.`);
      setRejectTarget(null);
    } catch (err: any) {
      toastError('Rejection Error', err?.message || 'Could not reject user.');
    } finally {
      setProcessingUid(null);
    }
  };

  // Handle Reset to Pending
  const handleSetPending = async (targetUser: UserProfile) => {
    setProcessingUid(targetUser.uid);
    try {
      await updateUserStatus(targetUser.uid, 'pending');
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUser.uid ? { ...u, status: 'pending' } : u))
      );
      info('Status Reset', `${targetUser.displayName || targetUser.email} status set to pending.`);
    } catch (err: any) {
      toastError('Status Error', err?.message || 'Could not update status.');
    } finally {
      setProcessingUid(null);
    }
  };

  // Metrics
  const stats = useMemo(() => {
    const total = users.length;
    const pending = users.filter((u) => u.status === 'pending').length;
    const approved = users.filter((u) => u.status === 'approved').length;
    const rejected = users.filter((u) => u.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ? true : u.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  if (authLoading || (user?.role !== 'admin' && user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase())) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-stone-500">Checking administrator privileges...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            System Administrator Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            User Registration Approvals
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review registration requests, verify couple accounts, and grant access to the wedding invitation builder.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadUsers}
          isLoading={loading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh List
        </Button>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">{stats.total}</div>
          <span className="text-[11px] text-stone-400 mt-1 block">Registered in database</span>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-2">{stats.pending}</div>
          <span className="text-[11px] text-amber-700 mt-1 block">Awaiting your approval</span>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>Approved Users</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 mt-2">{stats.approved}</div>
          <span className="text-[11px] text-emerald-700 mt-1 block">Full studio access active</span>
        </div>

        <div className="bg-red-50/70 p-5 rounded-2xl border border-red-200 shadow-xs">
          <div className="flex items-center justify-between text-red-800 text-xs font-semibold">
            <span>Declined Requests</span>
            <UserX className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-900 mt-2">{stats.rejected}</div>
          <span className="text-[11px] text-red-700 mt-1 block">Blocked from studio</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition shrink-0 cursor-pointer ${
                statusFilter === filter
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {filter}
              {filter === 'pending' && stats.pending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-white text-rose-600 text-[10px] font-bold">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">
            <div className="animate-spin w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full mx-auto mb-2" />
            Loading accounts from Firestore...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-stone-300 mx-auto" />
            <h4 className="text-sm font-semibold text-stone-700">No matching user accounts</h4>
            <p className="text-xs text-stone-500">No users found for the selected filter or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => {
                  const isSelf = u.uid === user?.uid;
                  const isProcessing = processingUid === u.uid;

                  return (
                    <tr key={u.uid} className="hover:bg-stone-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center uppercase text-xs">
                            {u.displayName?.[0] || u.email?.[0] || 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 block">
                              {u.displayName || 'No Name Provided'}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] text-purple-600 font-semibold">(You - Admin)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {u.createdAt ? formatDate(u.createdAt) : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
                            u.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.status === 'approved' && <UserCheck className="w-3 h-3" />}
                          {u.status === 'pending' && <Clock className="w-3 h-3 animate-pulse" />}
                          {u.status === 'rejected' && <UserX className="w-3 h-3" />}
                          <span className="capitalize">{u.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isSelf && (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {u.status !== 'approved' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApprove(u)}
                                isLoading={isProcessing}
                                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] py-1 h-7"
                              >
                                Approve
                              </Button>
                            )}

                            {u.status !== 'rejected' && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setRejectTarget(u);
                                  setRejectReason('Account registration request was not approved.');
                                }}
                                disabled={isProcessing}
                                leftIcon={<XCircle className="w-3.5 h-3.5" />}
                                className="text-[11px] py-1 h-7"
                              >
                                Reject
                              </Button>
                            )}

                            {u.status !== 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleSetPending(u)}
                                disabled={isProcessing}
                                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                                title="Reset to Pending"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      {rejectTarget && (
        <Modal
          isOpen={Boolean(rejectTarget)}
          onClose={() => setRejectTarget(null)}
          title="Decline User Registration"
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-600">
              Are you sure you want to decline registration access for{' '}
              <strong className="text-stone-900 font-semibold">{rejectTarget.displayName || rejectTarget.email}</strong>?
              They will be prevented from accessing the wedding studio.
            </p>

            <Input
              label="Decline Reason (Visible to user upon login)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Account registration request was not approved."
              className="text-xs"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setRejectTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                isLoading={processingUid === rejectTarget.uid}
              >
                Confirm Decline
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
