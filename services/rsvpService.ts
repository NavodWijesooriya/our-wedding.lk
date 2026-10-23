import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { RsvpResponse, RsvpStats, AttendanceStatus } from '@/types/rsvp';
import { INITIAL_DEMO_RSVPS } from '@/lib/mockData';

const LOCAL_RSVPS_KEY = 'wedding_platform_rsvps';

function getLocalRsvps(): RsvpResponse[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_RSVPS;
  const raw = localStorage.getItem(LOCAL_RSVPS_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(INITIAL_DEMO_RSVPS));
    return INITIAL_DEMO_RSVPS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_RSVPS;
  }
}

function saveLocalRsvps(list: RsvpResponse[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(list));
  }
}

export async function getRsvpsByWedding(weddingId: string): Promise<RsvpResponse[]> {
  // If demo wedding, or not signed in to Firebase Auth, read local storage directly
  if (weddingId.startsWith('demo-') || !auth?.currentUser) {
    const list = getLocalRsvps();
    return list.filter((r) => r.weddingId === weddingId);
  }

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'weddings', weddingId, 'rsvps');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: RsvpResponse[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<RsvpResponse, 'id'>) });
      });
      return list;
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Error fetching RSVPs from Firestore:', err);
      }
    }
  }

  const list = getLocalRsvps();
  return list.filter((r) => r.weddingId === weddingId);
}

export interface SubmitRsvpInput {
  name: string;
  email: string;
  phone?: string;
  attending: AttendanceStatus;
  guestCount: number;
  mealPreference?: string;
  dietaryRestrictions?: string;
  message?: string;
}

export async function submitRsvp(
  weddingId: string,
  input: SubmitRsvpInput
): Promise<RsvpResponse> {
  if (!input.name || !input.name.trim()) {
    throw new Error('Please provide your name.');
  }

  const rsvpId = 'rsvp_' + Math.random().toString(36).substring(2, 11);
  const now = new Date().toISOString();

  const newRsvp: RsvpResponse = {
    id: rsvpId,
    weddingId,
    name: input.name.trim(),
    email: input.email?.trim() || '',
    phone: input.phone?.trim() || '',
    attending: input.attending,
    guestCount: input.attending === 'attending' ? Math.max(1, input.guestCount || 1) : 0,
    mealPreference: input.mealPreference || '',
    dietaryRestrictions: input.dietaryRestrictions || '',
    message: input.message?.trim() || '',
    createdAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'weddings', weddingId, 'rsvps', rsvpId);
      await setDoc(docRef, {
        ...newRsvp,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Error saving RSVP to Firestore:', err);
    }
  }

  const list = getLocalRsvps();
  list.unshift(newRsvp);
  saveLocalRsvps(list);

  return newRsvp;
}

export async function deleteRsvp(weddingId: string, rsvpId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'weddings', weddingId, 'rsvps', rsvpId));
    } catch (err) {
      console.warn('Error deleting RSVP from Firestore:', err);
    }
  }

  const list = getLocalRsvps().filter((r) => r.id !== rsvpId);
  saveLocalRsvps(list);
}

export async function getRsvpStats(weddingId: string): Promise<RsvpStats> {
  const rsvps = await getRsvpsByWedding(weddingId);
  const totalResponses = rsvps.length;
  const attendingList = rsvps.filter((r) => r.attending === 'attending');
  const attendingCount = attendingList.length;
  const declinedCount = rsvps.filter((r) => r.attending === 'declined').length;
  const totalGuests = attendingList.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);

  return {
    totalResponses,
    attendingCount,
    declinedCount,
    totalGuests,
  };
}
