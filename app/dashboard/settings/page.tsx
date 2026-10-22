'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Database, Key, CheckCircle2, AlertCircle, Copy } from 'lucide-react';

export default function SettingsPage() {
  const { user, isFirebaseConnected } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Account & Platform Settings</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Manage your personal account details and verify Firebase backend connection.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-stone-900">Profile Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={user?.displayName || 'Sophia Montgomery'} readOnly />
          <Input label="Email Address" value={user?.email || 'demo@weddinginvites.com'} readOnly />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Account User ID (UID)
          </label>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-600 select-all">
            {user?.uid || 'demo-user-123'}
          </div>
        </div>
      </div>

      {/* Backend & Firebase Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-600" />
              Firebase Cloud Integration Status
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Cloud Firestore database, Firebase Authentication, and Cloud Storage status.
            </p>
          </div>
          <Badge variant={isFirebaseConnected ? 'emerald' : 'amber'}>
            {isFirebaseConnected ? 'Firebase Active' : 'Local Storage Mode'}
          </Badge>
        </div>

        {isFirebaseConnected ? (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 space-y-1">
              <p className="font-bold">Connected to Live Firebase Project</p>
              <p>
                Your invitations, wedding customization settings, uploaded images, and guest RSVPs
                are syncing directly to Google Cloud Firestore and Firebase Storage.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-700 space-y-1">
                <p className="font-bold text-stone-900">
                  Currently running in Offline/Demo Reactive Mode
                </p>
                <p>
                  The platform is fully interactive and stores all wedding projects, photos, and RSVPs
                  in local storage. To connect your live Firebase project, create a{' '}
                  <code className="bg-stone-200 px-1.5 py-0.5 rounded font-mono text-[11px]">
                    .env.local
                  </code>{' '}
                  file in the project root with the following keys:
                </p>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-stone-900 text-stone-200 text-xs font-mono overflow-x-auto">
{`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`}
            </pre>
          </div>
        )}
      </div>

      {/* Security & Data Ownership Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Data Security & Multi-User Isolation
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Each wedding website is strictly associated with its creator&apos;s UID. Private dashboard
          routes, RSVPs, and guest lists can never be viewed or edited by other platform users.
          Firestore Security Rules enforce that wedding documents can only be modified by the
          matching authenticated owner, while public guests only have read access to published
          invitations and write access to the RSVP submission endpoint.
        </p>
      </div>
    </div>
  );
}
