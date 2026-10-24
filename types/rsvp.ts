export type AttendanceStatus = 'attending' | 'declined';
export type GuestRsvpStatus = 'pending' | 'attending' | 'declined';

export interface RsvpResponse {
  id: string;
  weddingId: string;
  name: string;
  email: string;
  phone?: string;
  attending: AttendanceStatus;
  guestCount: number;
  mealPreference?: string;
  dietaryRestrictions?: string;
  message?: string;
  createdAt: string;
}

export interface RsvpStats {
  totalResponses: number;
  attendingCount: number;
  declinedCount: number;
  totalGuests: number;
}

export interface WeddingGuest {
  id: string;
  weddingId: string;
  name: string;
  phone?: string;
  email?: string;
  code: string; // Unique personalized URL code (e.g. 'perera-family-7k')
  seatsAllocated: number; // Max seats / plus-ones invited (default 1 or 2)
  status: GuestRsvpStatus;
  guestCount?: number; // Confirmed seats (0 if declined)
  respondedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGuestInput {
  name: string;
  phone?: string;
  email?: string;
  seatsAllocated?: number;
  notes?: string;
  customCode?: string;
}

export interface GuestStats {
  totalInvitedGuests: number;
  totalSeatsAllocated: number;
  confirmedGuests: number;
  confirmedSeats: number;
  declinedGuests: number;
  pendingGuests: number;
}
