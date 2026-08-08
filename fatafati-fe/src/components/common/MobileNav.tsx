'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Play, GitFork, MessageSquare } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const isWatch = pathname.startsWith('/watch/');
  const isSeries = pathname.startsWith('/series/');
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
          }}
        >
          <Compass size={22} color={isHome ? '#00f0ff' : 'currentColor'} />
          <span style={{ fontSize: '0.72rem', fontWeight: isHome ? 700 : 500 }}>
            Discover
          </span>
        </Link>

        {/* Watch / Active Theater */}
        <Link
          href={isWatch ? pathname : '/watch/cp-ep-1'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: isWatch ? '#00f0ff' : 'var(--text-muted)',
            minWidth: '56px',
            padding: '4px 0',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isWatch
                ? 'linear-gradient(135deg, #00f0ff, #a855f7)'
                : 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isWatch ? '0 0 14px rgba(0, 240, 255, 0.5)' : 'none',
            }}
          >
            <Play
              size={14}
              fill={isWatch ? '#07070a' : 'currentColor'}
              color={isWatch ? '#07070a' : 'currentColor'}
              style={{ marginLeft: '2px' }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: isWatch ? 700 : 500 }}>
            Theater
          </span>
        </Link>

        {/* Story Tree Map */}
        <button
          onClick={() => {
            const treeEl = document.getElementById('story-journey-map');
            if (treeEl) {
              treeEl.scrollIntoView({ behavior: 'smooth' });
            } else if (!isWatch) {
              window.location.href = '/watch/cp-ep-1#story-journey-map';
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--text-muted)',
            minWidth: '56px',
            padding: '4px 0',
            transition: 'all 0.2s ease',
          }}
        >
          <GitFork size={22} color="currentColor" />
          <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>
            Story Map
          </span>
        </button>

        {/* Writers Room */}
        <button
          onClick={() => {
            const writersEl = document.getElementById('writers-room-section');
            if (writersEl) {
              writersEl.scrollIntoView({ behavior: 'smooth' });
            } else if (!isWatch) {
              window.location.href = '/watch/cp-ep-1#writers-room-section';
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--text-muted)',
            minWidth: '56px',
            padding: '4px 0',
            transition: 'all 0.2s ease',
          }}
        >
          <MessageSquare size={22} color="currentColor" />
          <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>
            Pitches
          </span>
        </button>
      </div>
    </nav>
  );
}
