export type AttendanceStatus = 'attending' | 'declined';

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
