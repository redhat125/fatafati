'use client';

import React from 'react';
import Link from 'next/link';
import { Play, GitFork, Sparkles, Flame, ShieldAlert, Compass } from 'lucide-react';
import { Series } from '@fatafati/common';
import { Badge } from '../common/Badge';

interface HeroBannerProps {
  series: Series;
}

export function HeroBanner({ series }: HeroBannerProps) {
  if (!series) return null;

  return (
    <section
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'flex-end',
        margin: '24px 0 40px 0',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.1)',
      }}
    >
      {/* Backdrop Image with Multi-layer Gradient Mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${series.backdropImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7) contrast(1.1)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 0,
        }}
      />

      {/* Dark Vignette and Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 7, 10, 0.2) 0%, rgba(7, 7, 10, 0.7) 50%, rgba(7, 7, 10, 0.98) 100%), linear-gradient(90deg, rgba(7, 7, 10, 0.95) 0%, rgba(7, 7, 10, 0.4) 60%, transparent 100%)',
          zIndex: 1,
        }}
      />

      {/* Hero Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '48px 40px',
          maxWidth: '750px',
        }}
      >
        {/* Badges Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Badge variant="cyan" icon={<Flame size={13} />}>
            Trending #1 • {(series.viewCount || 0).toLocaleString()} Views
          </Badge>
          <Badge variant="purple" icon={<GitFork size={13} />}>
            {series.totalPaths} Divergent Endings
          </Badge>
          <Badge variant="default">
            ⭐ {series.rating} / 5.0
          </Badge>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            lineHeight: 1.1,
            marginBottom: '14px',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
        >
          {series.title}
        </h1>

        {/* Tagline / Synopsis */}
        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '28px',
            maxWidth: '620px',
          }}
        >
          {series.tagline || series.description}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            href={`/watch/${series.rootEpisodeId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
              color: '#07070a',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.02em',
              boxShadow: '0 0 25px rgba(0, 240, 255, 0.4), 0 4px 12px rgba(0,0,0,0.5)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 240, 255, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.4)';
            }}
          >
            <Play size={20} fill="#07070a" />
            <span>Start Story Journey</span>
          </Link>

          <Link
            href={`/series/${series.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <GitFork size={18} color="#a855f7" />
            <span>Explore All Branches</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
