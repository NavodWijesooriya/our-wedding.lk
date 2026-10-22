'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Menu, X, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function PublicNavbar() {
  const { user, loginDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      await loginDemo();
      window.location.href = '/dashboard';
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#faf8f5]/85 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-playfair text-xl font-bold tracking-tight text-stone-900 leading-none">
              Eternal<span className="text-rose-600">Tie</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
              Wedding Studio
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link href="/#features" className="hover:text-rose-600 transition">
            Features
          </Link>
          <Link href="/#templates" className="hover:text-rose-600 transition">
            Templates
          </Link>
          <Link href="/#how-it-works" className="hover:text-rose-600 transition">
            How It Works
          </Link>
          <Link href="/#faq" className="hover:text-rose-600 transition">
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href={user.status === 'approved' || user.role === 'admin' ? '/dashboard' : '/pending-approval'}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {user.status === 'approved' || user.role === 'admin' ? 'Go to Dashboard' : 'Approval Status'}
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDemo}
                isLoading={demoLoading}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              >
                Instant Demo
              </Button>
              <Link href="/login">
                <Button variant="ghost" size="sm" leftIcon={<User className="w-4 h-4" />}>
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white/95 px-5 py-4 space-y-3 backdrop-blur-md">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 py-1"
          >
            Features
          </Link>
          <Link
            href="/#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 py-1"
          >
            Templates
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 py-1"
          >
            How It Works
          </Link>
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            {user ? (
              <Link href={user.status === 'approved' || user.role === 'admin' ? '/dashboard' : '/pending-approval'}>
                <Button variant="primary" size="sm" className="w-full">
                  {user.status === 'approved' || user.role === 'admin' ? 'Dashboard' : 'Approval Status'}
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDemo}
                  isLoading={demoLoading}
                  className="w-full"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-2" />
                  Instant Demo
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button variant="primary" size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
