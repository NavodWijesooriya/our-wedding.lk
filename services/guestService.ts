import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { WeddingGuest, CreateGuestInput, GuestStats, AttendanceStatus, GuestRsvpStatus } from '@/types/rsvp';
import { WeddingProject } from '@/types/wedding';
import { INITIAL_DEMO_GUESTS } from '@/lib/mockData';
import { slugify, formatDate } from '@/lib/utils';
import { submitRsvp } from './rsvpService';

const LOCAL_GUESTS_KEY = 'wedding_platform_guests';

function getLocalGuests(): WeddingGuest[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_GUESTS;
  const raw = localStorage.getItem(LOCAL_GUESTS_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_GUESTS_KEY, JSON.stringify(INITIAL_DEMO_GUESTS));
    return INITIAL_DEMO_GUESTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_GUESTS;
  }
}

function saveLocalGuests(list: WeddingGuest[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_GUESTS_KEY, JSON.stringify(list));
  }
}

export async function getGuestsByWedding(weddingId: string): Promise<WeddingGuest[]> {
  // If demo wedding, or not logged into Firebase Auth, use local storage directly
  if (weddingId.startsWith('demo-') || !auth?.currentUser) {
    const list = getLocalGuests();
    return list.filter((g) => g.weddingId === weddingId);
  }

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'weddings', weddingId, 'guests');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: WeddingGuest[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<WeddingGuest, 'id'>) });
      });
      return list;
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Error fetching guests from Firestore:', err);
      }
    }
  }

  const list = getLocalGuests();
  return list.filter((g) => g.weddingId === weddingId);
}

export async function getGuestByCode(
  weddingId: string,
  code: string
): Promise<WeddingGuest | null> {
  const cleanCode = code.toLowerCase().trim();
  if (!cleanCode) return null;

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'weddings', weddingId, 'guests');
      const q = query(colRef, where('code', '==', cleanCode));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, ...(d.data() as Omit<WeddingGuest, 'id'>) };
      }
    } catch (err: any) {
      // ignore
    }
  }

  const list = getLocalGuests();
  return (
    list.find(
      (g) => g.weddingId === weddingId && g.code.toLowerCase() === cleanCode
    ) || null
  );
}

/**
 * Generate a friendly unique guest invite code (e.g. "kasun-f-8a3")
 */
function generateGuestCode(name: string, existingCodes: string[]): string {
  const base = slugify(name) || 'guest';
  let candidate = base;
  if (!existingCodes.includes(candidate)) {
    return candidate;
  }
  // If base exists, append random 3-char hex suffix
  let counter = 1;
  while (true) {
    const suffix = Math.random().toString(36).substring(2, 5);
    candidate = `${base}-${suffix}`;
    if (!existingCodes.includes(candidate)) {
      return candidate;
    }
    counter++;
    if (counter > 20) return `${base}-${Date.now().toString(36)}`;
  }
}

export async function addGuest(
  weddingId: string,
  input: CreateGuestInput
): Promise<WeddingGuest> {
  if (!input.name || !input.name.trim()) {
    throw new Error('Guest name is required.');
  }

  const existingGuests = await getGuestsByWedding(weddingId);

  // Prevent duplicate names or codes within the same wedding
  const trimmedName = input.name.trim();
  const duplicate = existingGuests.find(
    (g) => g.name.toLowerCase() === trimmedName.toLowerCase()
  );
  if (duplicate) {
    throw new Error(`A guest named "${trimmedName}" already exists on your list.`);
  }

  const existingCodes = existingGuests.map((g) => g.code.toLowerCase());
  const code = input.customCode
    ? slugify(input.customCode)
    : generateGuestCode(trimmedName, existingCodes);

  const guestId = 'gst_' + Math.random().toString(36).substring(2, 11);
  const now = new Date().toISOString();

  const newGuest: WeddingGuest = {
    id: guestId,
    weddingId,
    name: trimmedName,
    phone: input.phone?.trim() || '',
    email: input.email?.trim() || '',
    code,
    seatsAllocated: Math.max(1, input.seatsAllocated || 1),
    status: 'pending',
    notes: input.notes?.trim() || '',
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db && auth?.currentUser) {
    try {
      const docRef = doc(db, 'weddings', weddingId, 'guests', guestId);
      await setDoc(docRef, {
        ...newGuest,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Error saving guest to Firestore:', err);
    }
  }

  const list = getLocalGuests();
  list.unshift(newGuest);
  saveLocalGuests(list);

  return newGuest;
}

export async function updateGuest(
  weddingId: string,
  guestId: string,
  updates: Partial<WeddingGuest>
): Promise<WeddingGuest> {
  const existingList = await getGuestsByWedding(weddingId);
  const existing = existingList.find((g) => g.id === guestId);
  if (!existing) {
    throw new Error('Guest not found.');
  }

  const now = new Date().toISOString();
  const updated: WeddingGuest = {
    ...existing,
    ...updates,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'weddings', weddingId, 'guests', guestId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Error updating guest in Firestore:', err);
    }
  }

  const list = getLocalGuests();
  const idx = list.findIndex((g) => g.id === guestId);
  if (idx !== -1) {
    list[idx] = updated;
  } else {
    list.unshift(updated);
  }
  saveLocalGuests(list);

  return updated;
}

export async function deleteGuest(
  weddingId: string,
  guestId: string
): Promise<void> {
  if (isFirebaseConfigured && db && auth?.currentUser) {
    try {
      await deleteDoc(doc(db, 'weddings', weddingId, 'guests', guestId));
    } catch (err) {
      console.warn('Error deleting guest in Firestore:', err);
    }
  }

  const list = getLocalGuests().filter((g) => g.id !== guestId);
  saveLocalGuests(list);
}

/**
 * Record a personalized guest RSVP response without requiring guest authentication
 */
export async function submitGuestPersonalizedRsvp(
  weddingId: string,
  guestCode: string,
  response: {
    attending: AttendanceStatus;
    guestCount: number;
    notes?: string;
  }
): Promise<WeddingGuest> {
  const guest = await getGuestByCode(weddingId, guestCode);
  if (!guest) {
    throw new Error('Invalid personalized invitation code.');
  }

  const confirmedSeats = response.attending === 'attending'
    ? Math.min(Math.max(1, response.guestCount || 1), guest.seatsAllocated)
    : 0;

  const now = new Date().toISOString();

  // Update guest document
  const updatedGuest = await updateGuest(weddingId, guest.id, {
    status: response.attending,
    guestCount: confirmedSeats,
    notes: response.notes?.trim() || guest.notes || '',
    respondedAt: now,
  });

  // Also record in rsvpService for consolidated dashboard tracking
  try {
    await submitRsvp(weddingId, {
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      attending: response.attending,
      guestCount: confirmedSeats,
      message: response.notes || '',
    });
  } catch (err) {
    // Non-fatal if already saved in guest record
  }

  return updatedGuest;
}

/**
 * Formats clean phone number for WhatsApp URL (handles Sri Lanka 07... -> 947...)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';

  // Sri Lanka local numbers starting with 07X... -> 947X...
  if (digits.startsWith('0') && digits.length === 10) {
    return '94' + digits.substring(1);
  }
  return digits;
}

/**
 * Generate personalized invitation URL for a guest
 */
export function generatePersonalizedInviteUrl(
  weddingSlug: string,
  guestCode: string
): string {
  const base = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://eternal-tie.lk';
  return `${base}/wedding/${weddingSlug}?guest=${encodeURIComponent(guestCode)}`;
}

/**
 * Generate romantic, polished WhatsApp message text with wedding details and personalized link
 */
export function generateWhatsAppMessage(
  wedding: WeddingProject,
  guest: WeddingGuest
): string {
  const inviteUrl = generatePersonalizedInviteUrl(wedding.slug, guest.code);
  const formattedDate = formatDate(wedding.details.weddingDate);
  const time = wedding.details.weddingTime || 'Ceremony Time';
  const venue = wedding.details.ceremonyVenue || 'Wedding Venue';
  const couple = `${wedding.details.brideName} & ${wedding.details.groomName}`;

  return `🌺 *Wedding Invitation* 🌺

Dearest *${guest.name}*,

With joy in our hearts, we cordially invite you to celebrate our wedding day with us!

👰🤵 *${couple}*
📅 *Date:* ${formattedDate}
⏰ *Time:* ${time}
📍 *Venue:* ${venue}
${guest.seatsAllocated > 1 ? `✨ *Seats Reserved for You:* ${guest.seatsAllocated} Guests\n` : ''}
💌 *Your Personalized Invitation & RSVP Link:*
${inviteUrl}

Please tap the link above to view your personalized invitation, ceremony timings, and to confirm your attendance.

We cannot wait to celebrate this magical milestone with you! 💍🥂`;
}

/**
 * Generates direct WhatsApp click-to-chat URL
 */
export function generateWhatsAppClickUrl(
  wedding: WeddingProject,
  guest: WeddingGuest
): string {
  const message = generateWhatsAppMessage(wedding, guest);
  const cleanPhone = formatPhoneForWhatsApp(guest.phone || '');

  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  }
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

/**
 * Calculate guest stats
 */
export async function getGuestStats(weddingId: string): Promise<GuestStats> {
  const guests = await getGuestsByWedding(weddingId);
  const totalInvitedGuests = guests.length;
  const totalSeatsAllocated = guests.reduce(
    (acc, g) => acc + (g.seatsAllocated || 1),
    0
  );
  const attendingList = guests.filter((g) => g.status === 'attending');
  const confirmedGuests = attendingList.length;
  const confirmedSeats = attendingList.reduce(
    (acc, g) => acc + (g.guestCount ?? g.seatsAllocated ?? 1),
    0
  );
  const declinedGuests = guests.filter((g) => g.status === 'declined').length;
  const pendingGuests = guests.filter((g) => g.status === 'pending').length;

  return {
    totalInvitedGuests,
    totalSeatsAllocated,
    confirmedGuests,
    confirmedSeats,
    declinedGuests,
    pendingGuests,
  };
}
