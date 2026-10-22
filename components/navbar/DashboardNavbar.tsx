'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Plus,
  LayoutDashboard,
  CalendarHeart,
  Users,
  Palette,
  Settings,
  LogOut,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { ADMIN_EMAIL } from '@/lib/firebase';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  isAdmin?: boolean;
}

export function DashboardNavbar() {
  const pathname = usePathname();
  const { user, logout, isFirebaseConnected } = useAuth();

  const isDemoUser =
    user?.uid === 'demo-user-123' ||
    user?.email?.toLowerCase() === 'demo@weddinginvites.com';

  const isAdmin =
    !isDemoUser &&
    (user?.role === 'admin' || user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  const baseNavLinks: NavItem[] = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/weddings', label: 'My Weddings', icon: CalendarHeart },
    { href: '/dashboard/rsvps', label: 'RSVP Responses', icon: Users },
    { href: '/dashboard/templates', label: 'Templates', icon: Palette },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const adminNavLink: NavItem = {
    href: '/dashboard/admin',
    label: 'Admin Approvals',
    icon: ShieldCheck,
    isAdmin: true,
  };

  const navLinks: NavItem[] = isAdmin ? [...baseNavLinks, adminNavLink] : baseNavLinks;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-stone-200">
      {/* Top Banner for connection status */}
      <div className="bg-stone-50 border-b border-stone-100 text-xs text-stone-500 px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isFirebaseConnected ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 Cloud Connected (Auth & Cloud Active)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                <Database className="w-3.5 h-3.5 text-amber-600" />
                Local Storage Mode
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-stone-400">|</span>
            <span className="text-stone-600">
              Logged in as:{' '}
              <strong className="font-semibold text-stone-800">
                {user?.displayName || user?.email || 'Guest User'}
              </strong>
            </span>
            {isAdmin ? (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                System Admin
              </span>
            ) : isDemoUser ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                Demo User
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                Approved
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-sm">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="font-playfair text-lg font-bold text-stone-900 tracking-tight">
              Eternal<span className="text-rose-600">Tie</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const isSpecialAdmin = 'isAdmin' in item && item.isAdmin;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                    isActive
                      ? isSpecialAdmin
                        ? 'bg-purple-100 text-purple-900 font-semibold shadow-xs'
                        : 'bg-rose-50 text-rose-700 font-semibold'
                      : isSpecialAdmin
                      ? 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isSpecialAdmin && 'text-purple-600')} />
                  {item.label}
                  {isSpecialAdmin && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/create">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Website
            </Button>
          </Link>

          {/* User profile dropdown / logout */}
          <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-bold text-xs uppercase overflow-hidden">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.displayName?.[0] || user?.email?.[0] || 'U'
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              title="Sign Out"
              className="text-stone-500 hover:text-red-600 p-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden border-t border-stone-100 bg-stone-50/50 px-4 py-2 flex items-center justify-between overflow-x-auto gap-2 text-xs">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const isSpecialAdmin = 'isAdmin' in item && item.isAdmin;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shrink-0',
                isActive
                  ? isSpecialAdmin
                    ? 'bg-purple-100 text-purple-900 font-bold'
                    : 'bg-rose-100 text-rose-800 font-bold'
                  : isSpecialAdmin
                  ? 'text-purple-700 font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
