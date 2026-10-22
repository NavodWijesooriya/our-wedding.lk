# EternalTie - Customizable Multi-User Wedding Invitation Website Builder

A modern, responsive full-stack SaaS platform built with **Next.js (App Router, Turbopack), TypeScript, Tailwind CSS, and Firebase (Authentication, Cloud Firestore, Firebase Storage)**. 

Allows multiple couples to register, log in, create personalized digital wedding invitation websites, customize every aspect in real-time without coding, and publish them to unique public web addresses with interactive RSVP tracking.

---

## 🌟 Key Features

### 1. Authentication & Multi-User Isolation
- **Secure Registration & Login:** Email/Password authentication with Firebase Authentication and persistent session state.
- **One-Click Instant Demo Login:** Explore the platform with pre-populated demo weddings and real RSVP responses without typing credentials.
- **Password Reset:** Automated password recovery workflow.
- **Multi-Tenant Security:** Strict ownership enforcement — users can only view, edit, or delete their own wedding invitations and guest data.
- **Protected Routes:** Guarded `/dashboard/**` and `/editor/**` routes.

### 2. Live Visual Wedding Website Editor
- **Split-Screen Real-Time Builder:** Side-by-side editing pane with instant reactive preview.
- **Responsive Viewport Switcher:** Test designs across Desktop, Tablet (768px), and Mobile (390px with simulated notch).
- **Tabbed Customization Controls:**
  - **General:** Bride & Groom names, full formal names, wedding date & start time, family details, and contact info.
  - **Venues & Maps:** Ceremony venue & address, reception venue & address, schedule timeframes, and direct Google Maps navigation links.
  - **Love Story:** Headline, invitation message, and dynamic interactive milestone timeline cards with dates, titles, descriptions, and photos.
  - **Gallery & Photos:** Primary portrait/cover photo upload, gallery manager, and pre-loaded curated high-resolution wedding photography presets.
  - **Design & Typography:** On-the-fly switching among all 6 templates, curated color themes (Blush, Sage, Gold, Crimson, Dark, Slate), custom hex color picker, and Google Fonts (`Playfair Display`, `Cormorant Garamond`, `Cinzel`, `Montserrat`, `Plus Jakarta Sans`).
  - **Background Audio Player:** Royalty-free ambient tracks (Acoustic Serenade, Canon in D, Piano Moment) with audio preview and custom MP3 stream support.
  - **Sections Visibility:** Toggle switches for Hero, Countdown, Invitation Note, Love Story, Venues, Gallery, Dress Code, RSVP, and Contact.
  - **Publishing & Custom Slug:** Real-time URL availability checker and one-click publish/unpublish toggle.

### 3. Six Signature Wedding Invitation Templates
1. **🌸 Elegant Floral:** Soft blush rose accents, delicate botanical framing, warm classic serif headers, romantic arch portrait.
2. **🖤 Minimalist Modern:** Chic high-fashion editorial layout, stark monochrome aesthetics, generous breathing room, contemporary typography.
3. **👑 Luxury Gold:** Opulent gilded gold foil accents, royal `Cinzel` serif headers, ornate flourishes, black-tie gala atmosphere.
4. **🌿 Romantic Garden:** Botanical eucalyptus & sage green tones, earthy organic warmth, `Cormorant Garamond` typography.
5. **🏰 Traditional Wedding:** Deep crimson & burgundy ceremonial grandeur, auspicious heritage banners, classic ornamental cards.
6. **✨ Modern Dark:** Velvet midnight obsidian backdrop, starry luminous gold & moonlight accents for evening galas.

### 4. Interactive Guest Features on Public Websites (`/wedding/[slug]`)
- **Live Countdown Timer:** Ticking days, hours, minutes, and seconds to the ceremony.
- **Floating Ambient Music Player:** Rotating vinyl disc animation with play/pause and mute controls.
- **Interactive RSVP Form:**
  - Joyfully Accepts vs Regretfully Declines toggle.
  - Guest name, email, phone number, and party size count.
  - Meal preference selection (Filet Mignon, Salmon, Wild Mushroom Risotto, Vegan Harvest Bowl, Kids Plate).
  - Dietary restrictions & food allergies note.
  - Heartfelt blessings message for the couple.
  - **Confetti Celebration:** Triggers dynamic celebratory confetti burst upon attendance confirmation!
- **Photo Lightbox:** Full-screen modal lightbox with keyboard arrow navigation.
- **Add to Calendar Widget:** One-click Google Calendar link and Apple/Outlook `.ics` event download.
- **Social Sharing:** Instant WhatsApp, Facebook, X (Twitter), and Copy URL buttons.

### 5. Host RSVP & Guest Management Dashboard
- **Live Summary Metrics:** Total submissions, confirmed parties, total headcount/seats reserved, and declines.
- **Search & Filter:** Search guests by name or meal choice; filter by attendance status.
- **Export to CSV:** Download guest responses and meal choices into a clean spreadsheet file with one click.
- **Guest Privacy:** Guest responses cannot be viewed by other platform users.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict type checking) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Google Fonts integration |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animation & Effects** | `canvas-confetti` |
| **Backend & Database** | [Cloud Firestore](https://firebase.google.com/docs/firestore) & [Firebase Auth](https://firebase.google.com/docs/auth) |
| **Media Storage** | [Firebase Storage](https://firebase.google.com/docs/storage) with base64 data URI fallback |
| **Architecture** | Dual-driver design (Instant Local Storage fallback + Cloud Firestore sync) |

---

## 📁 Project Structure

```
wedding-site/
├── app/
│   ├── dashboard/
│   │   ├── create/page.tsx         # 3-step wedding creation wizard
│   │   ├── rsvps/page.tsx          # RSVP management & CSV export
│   │   ├── settings/page.tsx       # Account & Firebase configuration status
│   │   ├── templates/page.tsx      # Templates catalog showcase
│   │   ├── weddings/page.tsx       # My Weddings project management
│   │   ├── layout.tsx              # Authenticated layout with Navbar
│   │   └── page.tsx                # Overview dashboard & KPI cards
│   ├── editor/[id]/page.tsx        # Live split-screen visual customization editor
│   ├── wedding/[slug]/page.tsx     # Public wedding invitation website route
│   ├── forgot-password/page.tsx    # Password reset page
│   ├── login/page.tsx              # Login page with instant demo shortcut
│   ├── register/page.tsx           # Registration page
│   ├── layout.tsx                  # Root layout with fonts & AuthProvider
│   ├── globals.css                 # Tailwind CSS styles & typography variables
│   └── page.tsx                    # Landing page with hero showcase & features
├── components/
│   ├── editor/
│   │   ├── EditorHeader.tsx        # Save, publish, and device switcher
│   │   ├── LivePreviewFrame.tsx    # Device frame containers (Desktop, Tablet, Mobile)
│   │   └── tabs/                   # General, Venues, Story, Gallery, Design, Music, Sections, Publish
│   ├── navbar/
│   │   ├── PublicNavbar.tsx        # Brand navigation with demo shortcut
│   │   └── DashboardNavbar.tsx     # Platform navigation with status indicators
│   ├── templates/
│   │   ├── TemplateRenderer.tsx    # Dynamic template resolver
│   │   ├── ElegantFloralTemplate.tsx
│   │   ├── MinimalistModernTemplate.tsx
│   │   ├── LuxuryGoldTemplate.tsx
│   │   ├── RomanticGardenTemplate.tsx
│   │   ├── TraditionalWeddingTemplate.tsx
│   │   ├── ModernDarkTemplate.tsx
│   │   └── common/                 # CountdownTimer, MusicPlayer, RsvpForm, PhotoLightbox, AddToCalendar, SocialShare
│   └── ui/                         # Button, Input, Textarea, Select, Badge, Modal, Switch
├── contexts/
│   └── AuthContext.tsx             # Persistent authentication context
├── lib/
│   ├── firebase.ts                 # Firebase client & cloud detection
│   ├── mockData.ts                 # Curated templates, presets, demo weddings & RSVPs
│   └── utils.ts                    # Class merger, slugifier, date formatter, CSV exporter
├── services/
│   ├── authService.ts              # Firebase Auth & demo account driver
│   ├── weddingService.ts           # Wedding CRUD & slug uniqueness
│   ├── rsvpService.ts              # RSVP submissions & metrics
│   └── storageService.ts           # Cloud image upload with fallback
├── firestore.rules                 # Cloud Firestore security rules
├── storage.rules                   # Firebase Storage security rules
└── .env.example                    # Environment variable template
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (Node 20+ or 24 recommended)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables (Optional for Live Firebase)
The platform features an **intelligent dual-driver architecture**. It runs out of the box with offline/demo storage, and seamlessly switches to live Firebase whenever credentials are provided.

To connect your live Firebase project, create `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Firestore Rules

Production Firestore Security Rules are included in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /weddings/{weddingId} {
      allow read: if resource.data.status == 'published' || 
        (request.auth != null && resource.data.userId == request.auth.uid);
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      
      match /rsvps/{rsvpId} {
        allow read: if request.auth != null && 
          get(/databases/$(database)/documents/weddings/$(weddingId)).data.userId == request.auth.uid;
        allow create: if request.resource.data.name is string &&
          request.resource.data.name.size() > 0 &&
          request.resource.data.attending in ['attending', 'declined'];
        allow delete: if request.auth != null && 
          get(/databases/$(database)/documents/weddings/$(weddingId)).data.userId == request.auth.uid;
      }
    }
  }
}
```

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add your `NEXT_PUBLIC_FIREBASE_*` variables from `.env.example`.
4. Click **Deploy**. Next.js App Router will build and optimize your static and dynamic routes automatically.
