import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MobileNav } from '../components/common/MobileNav';

export const metadata: Metadata = {
  title: 'PlotPlay — AI-Driven Interactive Branching Micro-Series',
  description:
    'Experience next-generation interactive AI cinema. Watch 30-60 second micro-episodes, choose your path at pivotal moments, explore branching narrative universes, and vote on community-crafted storylines.',
  keywords: [
    'interactive video',
    'AI cinema',
    'branching narrative',
    'choose your own adventure',
    'micro-episodes',
    'PlotPlay',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#07070a',
};

import { LayoutWrapper } from '../components/common/LayoutWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
