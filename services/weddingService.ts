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
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { WeddingProject, WeddingDetails, WeddingThemeConfig, WeddingTemplateId } from '@/types/wedding';
import { INITIAL_DEMO_WEDDINGS, WEDDING_TEMPLATES } from '@/lib/mockData';
import { slugify } from '@/lib/utils';

const LOCAL_WEDDINGS_KEY = 'wedding_platform_projects';

function getLocalWeddings(): WeddingProject[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_WEDDINGS;
  const raw = localStorage.getItem(LOCAL_WEDDINGS_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_WEDDINGS_KEY, JSON.stringify(INITIAL_DEMO_WEDDINGS));
    return INITIAL_DEMO_WEDDINGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_WEDDINGS;
  }
}

function saveLocalWeddings(weddings: WeddingProject[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_WEDDINGS_KEY, JSON.stringify(weddings));
  }
}

export async function getWeddingsByUser(userId: string): Promise<WeddingProject[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'weddings'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const list: WeddingProject[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<WeddingProject, 'id'>) });
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('Error fetching weddings from Firestore, falling back to local storage:', err);
    }
  }

  const list = getLocalWeddings();
  return list.filter((w) => w.userId === userId || userId === 'demo-user-123');
}

export async function getWeddingById(id: string): Promise<WeddingProject | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'weddings', id));
      if (snap.exists()) {
        return { id: snap.id, ...(snap.data() as Omit<WeddingProject, 'id'>) };
      }
    } catch (err) {
      console.warn('Error fetching wedding by id from Firestore:', err);
    }
  }

  const list = getLocalWeddings();
  return list.find((w) => w.id === id) || null;
}

export async function getWeddingBySlug(slug: string): Promise<WeddingProject | null> {
  const cleanSlug = slug.toLowerCase().trim();
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'weddings'),
        where('slug', '==', cleanSlug),
        where('status', '==', 'published')
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const first = snap.docs[0];
        return { id: first.id, ...(first.data() as Omit<WeddingProject, 'id'>) };
      }
    } catch (err) {
      console.warn('Error fetching wedding by slug from Firestore:', err);
    }
  }

  const list = getLocalWeddings();
  return list.find((w) => w.slug.toLowerCase() === cleanSlug && w.status === 'published') || null;
}

export async function isSlugAvailable(slug: string, currentWeddingId?: string): Promise<boolean> {
  const cleanSlug = slug.toLowerCase().trim();
  if (!cleanSlug) return false;

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'weddings'), where('slug', '==', cleanSlug));
      const snap = await getDocs(q);
      if (snap.empty) return true;
      if (currentWeddingId && snap.docs.length === 1 && snap.docs[0].id === currentWeddingId) {
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Error checking slug in Firestore:', err);
    }
  }

  const list = getLocalWeddings();
  const match = list.find((w) => w.slug.toLowerCase() === cleanSlug);
  if (!match) return true;
  return currentWeddingId ? match.id === currentWeddingId : false;
}

export interface CreateWeddingParams {
  userId: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  templateId: WeddingTemplateId;
  customSlug?: string;
}

export async function createWedding(params: CreateWeddingParams): Promise<WeddingProject> {
  const template = WEDDING_TEMPLATES.find((t) => t.id === params.templateId) || WEDDING_TEMPLATES[0];
  
  let baseSlug = slugify(`${params.brideName}-and-${params.groomName}`);
  if (params.customSlug) {
    baseSlug = slugify(params.customSlug);
  }
  if (!baseSlug) baseSlug = `wedding-${Date.now().toString(36)}`;

  // Ensure unique slug
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (!(await isSlugAvailable(uniqueSlug))) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const defaultDetails: WeddingDetails = {
    brideName: params.brideName,
    groomName: params.groomName,
    brideFullName: `${params.brideName}`,
    groomFullName: `${params.groomName}`,
    brideParents: '',
    groomParents: '',
    weddingDate: params.weddingDate || '2026-12-31',
    weddingTime: '4:30 PM',
    ceremonyVenue: 'The Grand Chapel',
    ceremonyAddress: '123 Romantic Way, St. Augustine, FL',
    ceremonyTime: '4:30 PM - 5:30 PM',
    receptionVenue: 'The Rosewood Conservatory',
    receptionAddress: '123 Romantic Way, St. Augustine, FL',
    receptionTime: '6:00 PM - 11:00 PM',
    mapsUrl: 'https://maps.google.com/?q=St+Augustine+FL',
    invitationHeadline: 'Two Lives, One Love',
    invitationMessage: 'We request the honor of your presence as we unite our hearts and lives in holy matrimony.',
    storyTitle: 'How Our Story Began',
    storyIntro: 'Every love story is beautiful, but ours is our favorite.',
    milestones: [
      {
        id: 'm1',
        yearOrDate: '2022',
        title: 'Where It Began',
        description: 'A serendipitous encounter that started with smiles and endless conversation.',
      },
      {
        id: 'm2',
        yearOrDate: '2025',
        title: 'The Proposal',
        description: 'Under a canopy of stars, we promised to love each other forever.',
      },
    ],
    heroImage: template.previewImage,
    coverImage: template.previewImage,
    galleryImages: [
      template.previewImage,
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    ],
    dressCode: 'Cocktail Attire or Black-Tie Optional',
    accommodationsNote: 'Rooms reserved at the local boutique hotel with shuttle service.',
    contactEmail: '',
    contactPhone: '',
    enableMusic: true,
    musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-112191.mp3',
    musicTitle: 'Romantic Acoustic Melody',
    showHero: true,
    showCountdown: true,
    showInvitationMessage: true,
    showStory: true,
    showSchedule: true,
    showVenue: true,
    showGallery: true,
    showDressCode: true,
    showRsvp: true,
    showContact: true,
  };

  const defaultTheme: WeddingThemeConfig = {
    primaryColor: template.primaryColor,
    secondaryColor: template.accentColor,
    accentColor: template.primaryColor,
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: (template.font as any) || 'playfair',
    borderStyle: 'soft',
  };

  const newId = 'wed_' + Math.random().toString(36).substring(2, 11);
  const now = new Date().toISOString();

  const newProject: WeddingProject = {
    id: newId,
    userId: params.userId,
    title: `${params.brideName} & ${params.groomName}'s Wedding`,
    slug: uniqueSlug,
    status: 'draft',
    templateId: params.templateId,
    details: defaultDetails,
    themeConfig: defaultTheme,
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'weddings', newId), {
        ...newProject,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Error creating wedding in Firestore:', err);
    }
  }

  // Always sync to local list as well
  const list = getLocalWeddings();
  list.unshift(newProject);
  saveLocalWeddings(list);

  return newProject;
}

export async function updateWedding(
  id: string,
  userId: string,
  updates: Partial<Omit<WeddingProject, 'id' | 'userId' | 'createdAt'>>
): Promise<WeddingProject> {
  const existing = await getWeddingById(id);
  if (!existing) {
    throw new Error('Wedding project not found');
  }
  // Enforce ownership: user must own it or be demo user
  if (existing.userId !== userId && userId !== 'demo-user-123') {
    throw new Error('Unauthorized: You do not own this wedding project.');
  }

  const updated: WeddingProject = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'weddings', id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Error updating wedding in Firestore:', err);
    }
  }

  const list = getLocalWeddings();
  const idx = list.findIndex((w) => w.id === id);
  if (idx !== -1) {
    list[idx] = updated;
  } else {
    list.unshift(updated);
  }
  saveLocalWeddings(list);

  return updated;
}

export async function deleteWedding(id: string, userId: string): Promise<void> {
  const existing = await getWeddingById(id);
  if (!existing) return;
  if (existing.userId !== userId && userId !== 'demo-user-123') {
    throw new Error('Unauthorized: Cannot delete a wedding you do not own.');
  }

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'weddings', id));
    } catch (err) {
      console.warn('Error deleting wedding in Firestore:', err);
    }
  }

  const list = getLocalWeddings().filter((w) => w.id !== id);
  saveLocalWeddings(list);
}
