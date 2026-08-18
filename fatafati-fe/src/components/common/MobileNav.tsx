'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Play } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: 'rgba(11, 12, 18, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 6px)',
        paddingTop: '8px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {/* Discover */}
        <Link
          href="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: isHome ? '#00f0ff' : 'var(--text-muted)',
            minWidth: '56px',
            padding: '4px 0',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
          }}
        >
          <Compass size={22} color={isHome ? '#00f0ff' : 'currentColor'} />
          <span style={{ fontSize: '0.72rem', fontWeight: isHome ? 700 : 500 }}>
            Discover
          </span>
        </Link>

        {/* Surprise (Random Series) */}
        <Link
          href="/watch/random"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: pathname === '/watch/random' ? '#a855f7' : 'var(--text-muted)',
            minWidth: '56px',
            padding: '4px 0',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: pathname === '/watch/random'
                ? 'linear-gradient(135deg, #00f0ff, #a855f7)'
                : 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: pathname === '/watch/random' ? '0 0 14px rgba(168, 85, 247, 0.5)' : 'none',
            }}
          >
            <Play
              size={14}
              fill={pathname === '/watch/random' ? '#07070a' : 'currentColor'}
              color={pathname === '/watch/random' ? '#07070a' : 'currentColor'}
              style={{ marginLeft: '2px' }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: pathname === '/watch/random' ? 700 : 500 }}>
            Surprise
          </span>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: pathname === '/profile' ? '#ec4899' : 'var(--text-muted)',
            minWidth: '56px',
            padding: '4px 0',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={pathname === '/profile' ? '#ec4899' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span style={{ fontSize: '0.72rem', fontWeight: pathname === '/profile' ? 700 : 500 }}>
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
