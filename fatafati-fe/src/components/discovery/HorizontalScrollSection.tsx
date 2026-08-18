'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface HorizontalScrollSectionProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAllClick?: () => void;
  children: React.ReactNode;
}

export function HorizontalScrollSection({
  title,
  showSeeAll = true,
  onSeeAllClick,
  children,
}: HorizontalScrollSectionProps) {
  return (
    <section style={{ margin: '24px 0' }}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '12px',
          padding: '0 16px',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </h2>
        {showSeeAll && (
          <button
            onClick={onSeeAllClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            See All <ChevronRight size={14} style={{ marginLeft: '2px' }} />
          </button>
        )}
      </div>

      {/* Horizontally Scrolling Container */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          gap: '16px',
          padding: '8px 16px',
          /* Hide scrollbar for Chrome, Safari and Opera */
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none', /* IE and Edge */
          scrollbarWidth: 'none', /* Firefox */
        }}
        className="hide-scrollbar"
      >
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
        {children}
      </div>
    </section>
  );
}
