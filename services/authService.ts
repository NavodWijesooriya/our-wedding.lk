import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, ADMIN_EMAIL } from '@/lib/firebase';
import { UserProfile, UserRole, UserApprovalStatus } from '@/types/auth';
import { getLocalUsers, saveLocalUsers } from './userService';

const DEMO_USER_STORAGE_KEY = 'wedding_platform_demo_user';

export const DEMO_USER: UserProfile = {
  uid: 'demo-user-123',
  email: 'demo@weddinginvites.com',
  displayName: 'Sophia Montgomery',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'admin',
  status: 'approved',
  createdAt: new Date().toISOString(),
};

/**
 * Formats Firebase Authentication error codes into actionable user-friendly messages
 */
export function formatFirebaseAuthError(err: any): Error {
  const code = err?.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return new Error(
        'Email/Password sign-in is not yet enabled in your Firebase Console. Please go to Firebase Console (https://console.firebase.google.com/) -> Authentication -> Sign-in method -> click Email/Password, toggle Enable, and click Save.'
      );
    case 'auth/email-already-in-use':
      return new Error('This email address is already registered. Please sign in or use another email.');
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return new Error('Invalid email or password. Please verify your credentials.');
    case 'auth/weak-password':
      return new Error('Password should be at least 6 characters long.');
    case 'auth/invalid-email':
      return new Error('The email address is improperly formatted.');
    case 'auth/too-many-requests':
      return new Error('Too many failed attempts. Access to this account has been temporarily disabled. Try again later.');
    case 'auth/network-request-failed':
      return new Error('Network error. Please check your internet connection.');
    default:
      return new Error(err?.message || 'Authentication failed. Please try again.');
  }
}

export async function registerUser(
  email: string,
  pass: string,
  displayName: string
): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();
  const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();
  const role: UserRole = isAdmin ? 'admin' : 'user';
  const status: UserApprovalStatus = isAdmin ? 'approved' : 'pending';
  const now = new Date().toISOString();

  if (isFirebaseConfigured && auth && db) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
      if (cred.user) {
        await fbUpdateProfile(cred.user, { displayName });

        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: displayName || cred.user.displayName,
          photoURL: cred.user.photoURL || null,
          role,
          status,
          createdAt: now,
          updatedAt: now,
        };

        // Create user document in Cloud Firestore
        try {
          await setDoc(doc(db, 'users', cred.user.uid), {
            uid: cred.user.uid,
            email: normalizedEmail,
            displayName: displayName || cred.user.displayName || '',
            photoURL: cred.user.photoURL || null,
            role,
            status,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (dbErr: any) {
          console.warn('Firestore user profile save error:', dbErr);
          // If Firestore write fails, still return profile so user is not blocked
        }

        return newProfile;
      }
    } catch (authErr: any) {
      throw formatFirebaseAuthError(authErr);
    }
  }

  // Fallback local registration
  const user: UserProfile = {
    uid: 'local-user-' + Math.random().toString(36).substring(2, 9),
    email: normalizedEmail,
    displayName,
    photoURL: null,
    role,
    status,
    createdAt: now,
    updatedAt: now,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
    const allUsers = getLocalUsers();
    allUsers.unshift(user);
    saveLocalUsers(allUsers);
  }

  return user;
}

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();

  if (isFirebaseConfigured && auth && db) {
    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      const userDocRef = doc(db, 'users', cred.user.uid);
      
      try {
        const snap = await getDoc(userDocRef);

        if (snap.exists()) {
          const data = snap.data();
          const isAdmin = (data.email || normalizedEmail) === ADMIN_EMAIL.toLowerCase();
          return {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: data.displayName || cred.user.displayName,
            photoURL: data.photoURL || cred.user.photoURL,
            role: (data.role as UserRole) || (isAdmin ? 'admin' : 'user'),
            status: (data.status as UserApprovalStatus) || (isAdmin ? 'approved' : 'pending'),
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            rejectionReason: data.rejectionReason,
          };
        }

        // Auto-create doc if missing in Firestore
        const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();
        const fallbackProfile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || normalizedEmail.split('@')[0],
          photoURL: cred.user.photoURL,
          role: isAdmin ? 'admin' : 'user',
          status: isAdmin ? 'approved' : 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, {
          ...fallbackProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return fallbackProfile;
      } catch (dbErr: any) {
        console.warn('Firestore user fetch error during login:', dbErr);
        const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();
        return {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
          photoURL: cred.user.photoURL,
          role: isAdmin ? 'admin' : 'user',
          status: isAdmin ? 'approved' : 'pending',
          createdAt: new Date().toISOString(),
        };
      }
    } catch (authErr: any) {
      throw formatFirebaseAuthError(authErr);
    }
  }

  // Fallback demo login
  const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();
  const user: UserProfile = {
    ...DEMO_USER,
    email: normalizedEmail,
    role: isAdmin ? 'admin' : 'user',
    status: isAdmin ? 'approved' : 'pending',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

export async function loginAsDemo(): Promise<UserProfile> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(DEMO_USER));
  }
  return DEMO_USER;
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
  }
}

export async function resetPassword(email: string): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, email.toLowerCase().trim());
      return;
    } catch (err: any) {
      throw formatFirebaseAuthError(err);
    }
  }
  return;
}

/**
 * Subscribes to Firebase Auth state AND real-time Firestore user doc updates.
 * When the administrator approves or rejects a user, the user's browser updates in real time!
 */
export function subscribeToAuthState(callback: (user: UserProfile | null) => void): () => void {
  let unsubDoc: (() => void) | null = null;

  if (isFirebaseConfigured && auth && db) {
    const unsubAuth = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      // Clean up any previous doc listener
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (!fbUser) {
        // Fallback to local stored session if in demo mode
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (stored) {
            try {
              callback(JSON.parse(stored));
              return;
            } catch {
              // ignore json error
            }
          }
        }
        callback(null);
        return;
      }

      // Real-time Firestore document observer
      if (!db) return;
      const userDocRef = doc(db, 'users', fbUser.uid);
      unsubDoc = onSnapshot(
        userDocRef,
        (snap) => {
          const isAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

          if (snap.exists()) {
            const data = snap.data();
            callback({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: data.displayName || fbUser.displayName,
              photoURL: data.photoURL || fbUser.photoURL,
              role: (data.role as UserRole) || (isAdmin ? 'admin' : 'user'),
              status: (data.status as UserApprovalStatus) || (isAdmin ? 'approved' : 'pending'),
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
              rejectionReason: data.rejectionReason,
            });
          } else {
            callback({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName,
              photoURL: fbUser.photoURL,
              role: isAdmin ? 'admin' : 'user',
              status: isAdmin ? 'approved' : 'pending',
              createdAt: new Date().toISOString(),
            });
          }
        },
        (error) => {
          console.warn('User snapshot error (falling back to auth info):', error);
          const isAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          callback({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            role: isAdmin ? 'admin' : 'user',
            status: isAdmin ? 'approved' : 'pending',
            createdAt: new Date().toISOString(),
          });
        }
      );
    });

    return () => {
      if (unsubDoc) unsubDoc();
      unsubAuth();
    };
  }

  // Local fallback mode
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (stored) {
      try {
        callback(JSON.parse(stored));
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }
  } else {
    callback(null);
  }

  return () => {};
}
