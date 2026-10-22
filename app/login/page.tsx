'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart, Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const u = await login(email, password);
      if (u.role === 'admin' || u.status === 'approved') {
        router.push('/dashboard');
      } else {
        router.push('/pending-approval');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await loginDemo();
      router.push('/dashboard');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-playfair text-2xl font-bold text-stone-900 tracking-tight">
            Eternal<span className="text-rose-600">Tie</span>
          </span>
        </Link>
        <h2 className="text-2xl font-serif font-bold text-stone-900">Sign in to your account</h2>
        <p className="mt-1 text-xs text-stone-500">
          Or{' '}
          <Link href="/register" className="font-semibold text-rose-600 hover:text-rose-500 underline">
            create a new account for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-stone-200/80 sm:px-10 space-y-6">
          {/* Quick Demo Access Button */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-center space-y-2">
            <span className="text-xs font-semibold text-amber-800 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Instant One-Click Demo
            </span>
            <p className="text-[11px] text-amber-700">
              Explore pre-populated wedding invitations and RSVP data without typing credentials:
            </p>
            <Button
              type="button"
              variant="gold"
              size="sm"
              onClick={handleDemoLogin}
              isLoading={demoLoading}
              className="w-full"
            >
              Enter as Demo User
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-400 font-medium">Or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftElement={<Mail className="w-4 h-4 text-stone-400" />}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-stone-500 hover:text-stone-900 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftElement={<Lock className="w-4 h-4 text-stone-400" />}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
