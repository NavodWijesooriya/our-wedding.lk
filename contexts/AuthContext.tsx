'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types/auth';
import {
  subscribeToAuthState,
  loginUser,
  registerUser,
  loginAsDemo,
  logoutUser,
  resetPassword as sendReset,
} from '@/services/authService';
import { isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseConnected: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (email: string, pass: string, name: string) => Promise<UserProfile>;
  loginDemo: () => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const u = await loginUser(email, pass);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const u = await registerUser(email, pass, name);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (): Promise<UserProfile> => {
    setLoading(true);
    try {
      const u = await loginAsDemo();
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendReset(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConnected: isFirebaseConfigured,
        login,
        register,
        loginDemo,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
