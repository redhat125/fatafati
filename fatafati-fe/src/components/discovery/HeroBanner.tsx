'use client';

import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { Series } from '@fatafati/common';

interface HeroBannerProps {
  series: Series;
}

export function HeroBanner({ series }: HeroBannerProps) {
  if (!series) return null;

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 0 24px 0',
      }}
    >
      {/* Poster Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          aspectRatio: '3 / 4',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 240, 255, 0.05)',
        }}
      >
        {/* Backdrop Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${series.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            filter: 'brightness(0.9) contrast(1.1)',
            zIndex: 0,
          }}
        />

        {/* Gradient Overlay for Text Readability at Bottom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,16,22,0) 0%, rgba(15,16,22,0.2) 50%, rgba(21,22,31,0.98) 100%)',
            zIndex: 1,
          }}
        />

        {/* Hero Content (Centered at Bottom) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            padding: '32px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Top Badge */}
          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: 'var(--accent-magenta)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            A FATAFATI ORIGINAL
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              lineHeight: 1,
              fontWeight: 800,
              color: '#fff',
              marginBottom: '16px',
              textShadow: '0 4px 16px rgba(0,0,0,0.8)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            {series.title}
          </h1>

          {/* Watch Now Button */}
          <Link href={`/watch/${series.rootEpisodeId}`} style={{ textDecoration: 'none', width: '100%', maxWidth: '240px' }}>
            <button
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-magenta)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 700,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)',
                cursor: 'pointer',
              }}
            >
              Watch Now <Play size={18} fill="#fff" />
            </button>
          </Link>
        </div>
      </div>

      {/* Carousel Dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
        }}
      >
        <span style={{ width: '16px', height: '6px', borderRadius: '4px', background: '#fff' }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
      </div>
    </section>
  );
}
