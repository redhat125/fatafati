'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { Series } from '@fatafati/common';

interface HeroBannerProps {
  seriesList: Series[];
}

export function HeroBanner({ seriesList }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll logic
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (!seriesList || seriesList.length <= 1) return;
    
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === seriesList.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // 5 seconds per slide

    return () => {
      resetTimeout();
    };
  }, [currentIndex, seriesList.length]);

  if (!seriesList || seriesList.length === 0) return null;

  const currentSeries = seriesList[currentIndex];

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
        {/* Decorative corner brackets */}
        <div className="cyber-bracket cyber-bracket-tl" style={{ zIndex: 10, borderColor: '#ec4899' }} />
        <div className="cyber-bracket cyber-bracket-tr" style={{ zIndex: 10, borderColor: '#ec4899' }} />
        <div className="cyber-bracket cyber-bracket-bl" style={{ zIndex: 10, borderColor: '#ec4899' }} />
        <div className="cyber-bracket cyber-bracket-br" style={{ zIndex: 10, borderColor: '#ec4899' }} />

        {/* Animated Carousel Items */}
        {seriesList.map((series, index) => (
          <div
            key={series.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              pointerEvents: index === currentIndex ? 'auto' : 'none',
              zIndex: index === currentIndex ? 1 : 0,
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
                A PLOTPLAY ORIGINAL
              </div>

              {/* Title */}
              <h1
                className="text-cyber-glow"
                style={{
                  fontSize: 'clamp(2rem, 8vw, 3rem)',
                  lineHeight: 1,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                }}
              >
                {series.title}
              </h1>

              {/* Watch Now Button */}
              <Link href={`/watch/${series.rootEpisodeId}`} style={{ textDecoration: 'none', width: '100%', maxWidth: '240px' }}>
                <button
                  className="cyber-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    borderColor: '#ec4899',
                    boxShadow: '0 0 15px rgba(236, 72, 153, 0.4), inset 0 0 10px rgba(236, 72, 153, 0.2)',
                  }}
                >
                  Watch Now <Play size={18} fill="#fff" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Dots */}
      {seriesList.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
          }}
        >
          {seriesList.map((_, index) => (
            <span
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                resetTimeout();
              }}
              style={{
                width: index === currentIndex ? '16px' : '6px',
                height: '6px',
                borderRadius: index === currentIndex ? '4px' : '50%',
                background: index === currentIndex ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
