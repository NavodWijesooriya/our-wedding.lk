export type WeddingTemplateId =
  | 'elegant-floral'
  | 'minimalist-modern'
  | 'luxury-gold'
  | 'romantic-garden'
  | 'traditional-wedding'
  | 'modern-dark'
  | 'mandala-lotus'
  | 'ceylon-heritage'
  | 'lotus-blossom';

export type WeddingStatus = 'draft' | 'published';

export type WeddingFontFamily =
  | 'playfair'
  | 'cormorant'
  | 'cinzel'
  | 'montserrat'
  | 'inter';

export interface StoryMilestone {
  id: string;
  yearOrDate: string;
  title: string;
  description: string;
  image?: string;
}

export interface WeddingDetails {
  brideName: string;
  groomName: string;
  brideFullName?: string;
  groomFullName?: string;
  brideParents?: string;
  groomParents?: string;
  weddingDate: string; // ISO format: YYYY-MM-DD
  weddingTime: string; // e.g. "4:00 PM"
  timezone?: string;
  
  // Venues
  ceremonyVenue: string;
  ceremonyAddress: string;
  ceremonyTime?: string;
  receptionVenue: string;
  receptionAddress: string;
  receptionTime?: string;
  mapsUrl: string;
  
  // Cultural & Traditional Sri Lankan Elements
  auspiciousTime?: string; // e.g. "09:42 AM (නැකත)"
  poruwaCeremonyTime?: string; // e.g. "10:15 AM (පෝරුවේ චාරිත්‍ර)"
  culturalBlessing?: string; // e.g. "ජය මංගලම්! / සාදර ඇරයුමයි!"
  
  // Invitation & Story
  invitationHeadline: string;
  invitationMessage: string;
  storyTitle: string;
  storyIntro: string;
  milestones: StoryMilestone[];
  
  // Imagery
  heroImage: string;
  coverImage: string;
  galleryImages: string[];
  
  // Additional info
  dressCode?: string;
  accommodationsNote?: string;
  registryNote?: string;
  contactEmail?: string;
  contactPhone?: string;
  
  // Background Music
  enableMusic: boolean;
  musicUrl: string;
  musicTitle: string;
  
  // Section Toggles
  showHero: boolean;
  showCountdown: boolean;
  showInvitationMessage: boolean;
  showStory: boolean;
  showSchedule: boolean;
  showVenue: boolean;
  showGallery: boolean;
  showDressCode: boolean;
  showRsvp: boolean;
  showContact: boolean;
}

export interface WeddingThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: WeddingFontFamily;
  borderStyle?: 'soft' | 'rounded' | 'sharp' | 'ornate';
}

export interface WeddingProject {
  id: string;
  userId: string;
  title: string;
  slug: string;
  status: WeddingStatus;
  templateId: WeddingTemplateId;
  details: WeddingDetails;
  themeConfig: WeddingThemeConfig;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
}
