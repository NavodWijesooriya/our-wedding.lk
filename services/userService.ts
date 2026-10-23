import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, ADMIN_EMAIL } from '@/lib/firebase';
import { UserProfile, UserApprovalStatus } from '@/types/auth';

const LOCAL_USERS_KEY = 'wedding_platform_registered_users';

export function getLocalUsers(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalUsers(users: UserProfile[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  }
}

/**
 * Fetch all registered users for the Admin Dashboard
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  if (isFirebaseConfigured && db && auth?.currentUser) {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: UserProfile[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          uid: d.id,
          email: data.email || '',
          displayName: data.displayName || '',
          photoURL: data.photoURL || null,
          role: data.role || (data.email?.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user'),
          status: data.status || (data.email?.toLowerCase() === ADMIN_EMAIL ? 'approved' : 'pending'),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
          rejectionReason: data.rejectionReason,
        });
      });
      return list;
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Error fetching users from Firestore, falling back to local users:', err);
      }
    }
  }

  return getLocalUsers();
}

/**
 * Update user status (approve, reject, or set pending)
 */
export async function updateUserStatus(
  userId: string,
  status: UserApprovalStatus,
  rejectionReason = ''
): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : '',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Error updating user status in Firestore:', err);
      throw err;
    }
  }

  const list = getLocalUsers();
  const idx = list.findIndex((u) => u.uid === userId);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : '',
      updatedAt: new Date().toISOString(),
    };
    saveLocalUsers(list);
  }
}

/**
 * Fetch a single user profile from Firestore or local storage
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        const data = snap.data();
        return {
          uid: snap.id,
          email: data.email || '',
          displayName: data.displayName || '',
          photoURL: data.photoURL || null,
          role: data.role || (data.email?.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user'),
          status: data.status || (data.email?.toLowerCase() === ADMIN_EMAIL ? 'approved' : 'pending'),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
          rejectionReason: data.rejectionReason,
        };
      }
    } catch (err) {
      console.warn('Error fetching user profile from Firestore:', err);
    }
  }

  const list = getLocalUsers();
  return list.find((u) => u.uid === userId) || null;
}
