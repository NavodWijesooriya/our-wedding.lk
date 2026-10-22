import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

export const metadata: Metadata = {
  title: 'EternalTie - Luxury Wedding Invitation Platform & Website Builder',
  description:
    'Design, customize, and publish breathtaking wedding invitation websites with live preview, RSVP tracking, music, and interactive love stories.',
  keywords: [
    'wedding invitation',
    'wedding website builder',
    'rsvp management',
    'digital wedding card',
    'customizable wedding website',
  ],
  authors: [{ name: 'EternalTie' }],
  openGraph: {
    title: 'EternalTie - Luxury Wedding Invitation Platform',
    description:
      'Design, customize, and publish romantic wedding websites in real-time with zero coding.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-jakarta h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-rose-100 selection:text-rose-900">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
