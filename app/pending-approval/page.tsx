'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { getUserProfile } from '@/services/userService';
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  Heart,
  RefreshCw,
  LogOut,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function PendingApprovalPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const { info, success, error: toastError } = useToast();
  const [checking, setChecking] = useState(false);

  // If approved or admin, redirect to dashboard immediately
  useEffect(() => {
    if (!authLoading && user) {
      if (user.status === 'approved' || user.role === 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router]);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleManualCheck = async () => {
    if (!user) return;
    setChecking(true);
    try {
      const refreshed = await getUserProfile(user.uid);
      if (refreshed?.status === 'approved') {
        success('Account Approved!', 'Welcome to EternalTie. Redirecting to your dashboard...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else if (refreshed?.status === 'rejected') {
        toastError('Account Status', 'Your registration was rejected by the administrator.');
      } else {
        info('Still Pending', 'Your registration is still under review by the administrator.');
      }
    } catch {
      info('Review in Progress', 'Please check back shortly.');
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/login');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="animate-pulse text-stone-500 text-sm">Verifying account credentials...</div>
      </div>
    );
  }

  const isRejected = user.status === 'rejected';

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-playfair text-2xl font-bold text-stone-900 tracking-tight">
            Eternal<span className="text-rose-600">Tie</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          {isRejected ? 'Account Access Restricted' : 'Registration Pending Approval'}
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          {isRejected
            ? 'Your registration request could not be approved at this time.'
            : 'Welcome! Your account was registered and is awaiting administrator verification.'}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-stone-200/80 sm:px-10 space-y-6">
          {/* Status Indicator Banner */}
          {isRejected ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900">Registration Declined</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  {user.rejectionReason ||
                    'The administrator declined access for this email address. If you believe this is in error, please contact the administrator.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Review in Progress</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  To maintain platform security, all accounts must be approved by the system administrator (
                  <strong className="font-semibold text-amber-900">navodtwijesooriya@gmail.com</strong>) before access is granted.
                </p>
              </div>
            </div>
          )}

          {/* Account Profile Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Registered Credentials
            </span>
            <div className="flex items-center justify-between text-stone-700">
              <span className="text-stone-500">Full Name:</span>
              <span className="font-semibold text-stone-900">{user.displayName || 'User'}</span>
            </div>
            <div className="flex items-center justify-between text-stone-700">
              <span className="text-stone-500">Email Address:</span>
              <span className="font-semibold text-stone-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-stone-700">
              <span className="text-stone-500">Account Status:</span>
              <span
                className={`font-bold capitalize px-2 py-0.5 rounded-full text-[11px] ${
                  isRejected
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline for Pending State */}
          {!isRejected && (
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Approval Progress
              </span>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-emerald-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>1. User account created in Firebase Authentication</span>
                </div>
                <div className="flex items-center gap-3 text-amber-800 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Clock className="w-4 h-4 animate-spin" />
                  </div>
                  <span>2. Administrator review pending (navodtwijesooriya@gmail.com)</span>
                </div>
                <div className="flex items-center gap-3 text-stone-400">
                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>3. Full access to Wedding Studio & live invitations</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            {!isRejected && (
              <Button
                variant="primary"
                onClick={handleManualCheck}
                isLoading={checking}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full"
              >
                Check Approval Status Now
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleSignOut}
              leftIcon={<LogOut className="w-4 h-4" />}
              className="w-full text-stone-700"
            >
              Sign Out
            </Button>
          </div>

          {/* Help Contact */}
          <div className="text-center pt-2 border-t border-stone-100">
            <p className="text-[11px] text-stone-500">
              Need immediate assistance? Email the administrator at{' '}
              <a
                href="mailto:navodtwijesooriya@gmail.com"
                className="text-rose-600 font-semibold hover:underline"
              >
                navodtwijesooriya@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
