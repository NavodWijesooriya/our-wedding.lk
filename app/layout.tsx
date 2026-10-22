import type { Metadata } from 'next';
import {
  Playfair_Display,
  Cormorant_Garamond,
  Cinzel,
  Montserrat,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

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
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${cinzel.variable} ${montserrat.variable} ${jakarta.variable} font-jakarta h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-rose-100 selection:text-rose-900">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
