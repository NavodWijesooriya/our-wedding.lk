'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email || !password) {
      setError('Please provide an email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const u = await register(email, password, name.trim());
      if (u.role === 'admin' || u.status === 'approved') {
        router.push('/dashboard');
      } else {
        router.push('/pending-approval');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-serif font-bold text-stone-900">Create your free account</h2>
        <p className="mt-1 text-sm text-stone-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700 underline underline-offset-2">
            Sign in &rarr;
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-stone-200/80 sm:px-10 space-y-6">
          {/* Quick Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <Link
              href="/login"
              className="py-2.5 text-center text-xs font-semibold text-stone-500 hover:text-rose-600 hover:bg-stone-50 rounded-xl transition"
            >
              Sign In
            </Link>
            <div className="py-2.5 text-center text-xs font-bold text-stone-900 bg-white rounded-xl shadow-xs">
              Create Account
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sophia Montgomery"
              leftElement={<User className="w-4 h-4 text-stone-400" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftElement={<Mail className="w-4 h-4 text-stone-400" />}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftElement={<Lock className="w-4 h-4 text-stone-400" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              leftElement={<Lock className="w-4 h-4 text-stone-400" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started Free
            </Button>
          </form>

          <div className="pt-4 border-t border-stone-200 text-center space-y-2">
            <p className="text-xs text-stone-500">
              Already registered an account?{' '}
              <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700 underline">
                Log in here
              </Link>
            </p>
          </div>

          <p className="text-[11px] text-stone-400 text-center leading-relaxed">
            By registering, you agree to create and manage personal wedding invitation websites
            under EternalTie&apos;s privacy and security terms.
          </p>
        </div>
      </div>
    </div>
  );
}
