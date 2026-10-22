'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardNavbar } from '@/components/navbar/DashboardNavbar';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { motion } from 'motion/react';
import { ADMIN_EMAIL } from '@/lib/firebase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && mounted) {
      if (!user) {
        router.push('/login');
        return;
      }

      // Check approval status: only approved users and admin can access
      const isAdmin =
        user.role === 'admin' || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (!isAdmin && user.status !== 'approved') {
        router.push('/pending-approval');
      }
    }
  }, [user, loading, mounted, router]);

  const isAdmin =
    user?.role === 'admin' || user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isApproved = isAdmin || user?.status === 'approved';

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f6]">
      <DashboardNavbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* On server pass (mounted=false), render children so segment tree validation succeeds */}
        {mounted && (!user || loading) ? (
          <LoadingScreen
            message="Entering Wedding Studio..."
            submessage="Verifying credentials & authorization"
          />
        ) : mounted && !isApproved ? (
          <LoadingScreen
            message="Verifying Account Status..."
            submessage="Checking approval with administrator"
          />
        ) : (
          children
        )}
      </motion.main>
    </div>
  );
}
