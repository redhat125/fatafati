'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWatch = pathname?.startsWith('/watch/');

  if (isWatch) {
    return (
      <main style={{ width: '100%', height: '100dvh', overflow: 'hidden' }}>
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main
        style={{
          minHeight: 'calc(100dvh - var(--header-height) - 180px)',
          paddingBottom: 'calc(var(--mobile-nav-height, 70px) + 40px)',
        }}
      >
        {children}
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
