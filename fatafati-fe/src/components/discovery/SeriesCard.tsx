'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, GitFork, Eye, Star, Sparkles } from 'lucide-react';
import { Series } from '@fatafati/common';
import { Badge } from '../common/Badge';

interface SeriesCardProps {
  series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getGenreColorVariant = (genre: string) => {
    switch (genre.toLowerCase()) {
      case 'cyberpunk': return 'cyan';
      case 'horror': return 'magenta';
      case 'space': return 'purple';
      case 'thriller': return 'amber';
      default: return 'default';
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-card)',
        border: isHovered ? '1px solid rgba(0, 240, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isHovered
          ? '0 16px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 240, 255, 0.2)'
          : '0 4px 16px rgba(0, 0, 0, 0.4)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Thumbnail Area */}
      <Link href={`/watch/${series.rootEpisodeId}`} style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', display: 'block' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${series.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />

        {/* Gradient Shadow Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(7,7,10,0.1) 0%, rgba(7,7,10,0.4) 60%, rgba(11,12,18,0.95) 100%)',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <Badge variant={getGenreColorVariant(series.genre) as any}>
            {series.genre}
          </Badge>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f59e0b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            {series.rating}
          </span>
        </div>

        {/* Hover Play Button Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
            transition: 'all 0.25s ease',
            zIndex: 3,
            background: 'rgba(7, 7, 10, 0.4)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f0ff, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
            }}
          >
            <Play size={24} fill="#07070a" color="#07070a" style={{ marginLeft: '4px' }} />
          </div>
        </div>
      </Link>

      {/* Card Content Area */}
      <div style={{ padding: '18px 18px 20px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link href={`/series/${series.id}`}>
          <h3
            style={{
              fontSize: '1.15rem',
              marginBottom: '6px',
              color: isHovered ? 'var(--accent-cyan)' : '#fff',
              transition: 'color 0.2s',
            }}
          >
            {series.title}
          </h3>
        </Link>

        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {series.tagline || series.description}
        </p>

        {/* Card Footer Metrics */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)', fontWeight: 600 }}>
            <GitFork size={14} />
            <span>{series.totalPaths} story paths</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Eye size={13} />
            <span>{series.viewCount.toLocaleString()} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
