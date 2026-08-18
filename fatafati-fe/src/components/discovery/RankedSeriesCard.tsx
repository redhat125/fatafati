'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { Series } from '@fatafati/common';

interface RankedSeriesCardProps {
  series: Series;
  rank: number;
}

export function RankedSeriesCard({ series, rank }: RankedSeriesCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '210px', // Wider to accommodate the number
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      <Link href={`/watch/${series.rootEpisodeId}`} style={{ display: 'flex', width: '100%', textDecoration: 'none' }}>
        
        {/* Large Outlined Number */}
        <div
          style={{
            position: 'absolute',
            left: '-10px',
            bottom: '10px',
            fontSize: '8rem',
            fontWeight: 900,
            lineHeight: 0.8,
            color: 'transparent',
            WebkitTextStroke: '2px #ffffff',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {rank}
        </div>

        {/* Card Container */}
        <div
          style={{
            marginLeft: '40px', // Space for the number
            width: '150px',
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
            zIndex: 2,
          }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '2 / 3', overflow: 'hidden' }}>
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

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15,16,22,0) 0%, rgba(15,16,22,0.4) 60%, rgba(21,22,31,0.95) 100%)',
              }}
            />

            {/* Bottom Info: Title & View Count */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 800,
                  color: '#ec4899',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '2px',
                }}
              >
                A FATAFATI ORIGINAL
              </div>
              
              <h3
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {series.title}
              </h3>
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: '2px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Play size={10} fill="#e2e8f0" /> {formatViews(series.viewCount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
