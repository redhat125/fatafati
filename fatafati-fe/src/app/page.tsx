'use client';

import React from 'react';
import { useSeries } from '../hooks/useSeries';
import { HeroBanner } from '../components/discovery/HeroBanner';
import { FilterBar } from '../components/discovery/FilterBar';
import { SeriesCard } from '../components/discovery/SeriesCard';
import { Film, GitFork, Sparkles, MessageSquare, Play } from 'lucide-react';

export default function HomePage() {
  const {
    seriesList,
    selectedGenre,
    setSelectedGenre,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
  } = useSeries();

  const featuredSeries = seriesList.find((s) => s.id === 'cyberpunk-2099') || seriesList[0];

  return (
    <div className="container">
      {/* Flagship Hero Story */}
      {featuredSeries && <HeroBanner series={featuredSeries} />}

      {/* How It Works Section */}
      <section
        style={{
          margin: '40px 0 20px 0',
          padding: '24px 28px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(17, 19, 28, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#00f0ff',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            How FataFati Works
          </span>
          <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>
            Interactive Cinema in Your Hands
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(0, 240, 255, 0.15)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Play size={20} color="#00f0ff" />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>1. Watch Micro-Clips</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Bite-sized 30-60 second AI cinematic episodes with rich atmospheric sound and pacing.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <GitFork size={20} color="#a855f7" />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>2. Choose Next Action</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                At each climax, pick between branching story choices that immediately alter the narrative course.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(236, 72, 153, 0.15)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MessageSquare size={20} color="#ec4899" />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>3. Pitch & Canonize</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Pitch your own twist in the Writers Room. Top upvoted ideas become new branching episodes!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Filters */}
      <FilterBar
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
        sortOption={sortOption}
        onSelectSort={setSortOption}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Series Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <Sparkles size={32} color="#00f0ff" style={{ margin: '0 auto 12px auto' }} />
          <p>Discovering interactive story universes...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444' }}>
          <p>Failed to load series: {error}</p>
        </div>
      ) : seriesList.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(17, 19, 28, 0.5)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          <Film size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#fff', marginBottom: '6px' }}>No Story Series Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Try adjusting your search terms or genre filters.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {seriesList.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      )}
    </div>
  );
}
