'use client';

import React from 'react';
import { useSeries } from '../hooks/useSeries';
import { HeroBanner } from '../components/discovery/HeroBanner';
import { PortraitSeriesCard } from '../components/discovery/PortraitSeriesCard';
import { RankedSeriesCard } from '../components/discovery/RankedSeriesCard';
import { HorizontalScrollSection } from '../components/discovery/HorizontalScrollSection';
import { Sparkles, Film } from 'lucide-react';

export default function HomePage() {
  const { seriesList, isLoading, error } = useSeries();

  // Sort by views for Top 10
  const top10Series = [...seriesList].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10);
  
  // Featured (Top 5)
  const featuredSeriesList = top10Series.slice(0, 5);

  // Filter for specific genres/sections (fallback to all if few items)
  const sciFiAndCyberpunk = seriesList.filter(s => ['sci-fi', 'cyberpunk', 'space'].includes(s.genre));
  const horrorAndMystery = seriesList.filter(s => ['horror', 'mystery', 'thriller'].includes(s.genre));
  const allTimeClassics = [...seriesList].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div style={{ paddingBottom: '20px', position: 'relative' }}>
      {/* Global Background Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(transparent 0, rgba(0, 240, 255, 0.02) 2px, transparent 4px)',
        animation: 'scanlines 20s linear infinite',
        zIndex: -1
      }} />
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
          <Sparkles size={32} color="#ec4899" style={{ margin: '0 auto 12px auto' }} />
          <p>Loading PlotPlay Originals...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444' }}>
          <p>Failed to load series: {error}</p>
        </div>
      ) : seriesList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Film size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#fff', marginBottom: '6px' }}>No Story Series Found</h3>
        </div>
      ) : (
        <>
          {/* Flagship Hero Story Slider */}
          {featuredSeriesList.length > 0 && (
            <div style={{ padding: '0 16px' }}>
              <HeroBanner seriesList={featuredSeriesList} />
            </div>
          )}

          {/* Top 10 Section */}
          {top10Series.length > 0 && (
            <HorizontalScrollSection title="Top 10 on PlotPlay" showSeeAll={false}>
              {top10Series.map((series, index) => (
                <RankedSeriesCard key={`top10-${series.id}`} series={series} rank={index + 1} />
              ))}
            </HorizontalScrollSection>
          )}

          {/* Sci-Fi & Cyberpunk Row */}
          {(sciFiAndCyberpunk.length > 0 ? sciFiAndCyberpunk : seriesList).length > 0 && (
            <HorizontalScrollSection title="Sci-Fi & Cyberpunk Adventures">
              {(sciFiAndCyberpunk.length > 0 ? sciFiAndCyberpunk : seriesList).map((series) => (
                <PortraitSeriesCard key={`scifi-${series.id}`} series={series} />
              ))}
            </HorizontalScrollSection>
          )}

          {/* Thrillers & Mysteries Row */}
          {(horrorAndMystery.length > 0 ? horrorAndMystery : seriesList).length > 0 && (
            <HorizontalScrollSection title="Thrillers & Mysteries">
              {(horrorAndMystery.length > 0 ? horrorAndMystery : seriesList).map((series) => (
                <PortraitSeriesCard key={`thriller-${series.id}`} series={series} />
              ))}
            </HorizontalScrollSection>
          )}

          {/* Top Dramas Of All Time (Grid Layout) */}
          {allTimeClassics.length > 0 && (
            <section style={{ margin: '24px 16px 40px 16px' }}>
              <h2
                className="text-cyber-glow"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#00f0ff',
                  letterSpacing: '0.01em',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                }}
              >
                Top Dramas Of All Time
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {allTimeClassics.map((series, index) => (
                  <RankedSeriesCard key={`drama-${series.id}`} series={series} rank={index + 1} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
