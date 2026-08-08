'use client';

import React from 'react';
import { SeriesGenre, SortOption } from '@fatafati/common';
import { Search, Flame, Clock, GitFork, Star, Film } from 'lucide-react';

interface FilterBarProps {
  selectedGenre: SeriesGenre;
  onSelectGenre: (genre: SeriesGenre) => void;
  sortOption: SortOption;
  onSelectSort: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const GENRES: Array<{ id: SeriesGenre; label: string; icon: string }> = [
  { id: 'all', label: 'All Universes', icon: '🌌' },
  { id: 'sci-fi', label: 'AI & Sci-Fi', icon: '🤖' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '⚡' },
  { id: 'horror', label: 'Gothic Horror', icon: '🕯️' },
  { id: 'space', label: 'Deep Space', icon: '🚀' },
  { id: 'thriller', label: 'Action & Speed', icon: '🏎️' },
  { id: 'reality-show', label: 'Reality AI', icon: '🎙️' },
  { id: 'anime', label: 'Anime', icon: '⚔️' },
  { id: 'comedy', label: 'Satire / Comedy', icon: '🎭' },
];

export function FilterBar({
  selectedGenre,
  onSelectGenre,
  sortOption,
  onSelectSort,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        margin: '32px 0 28px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Genre Filter Pills */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '4px',
            maxWidth: '100%',
          }}
        >
          {GENRES.map((g) => {
            const isActive = selectedGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onSelectGenre(g.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(168, 85, 247, 0.25))'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#00f0ff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(0, 240, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isActive ? '0 0 16px rgba(0, 240, 255, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search stories, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                background: 'rgba(24, 27, 40, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px 8px 36px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                width: '200px',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-cyan)';
                e.target.style.width = '240px';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                if (!searchQuery) e.target.style.width = '200px';
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            style={{
              background: 'rgba(24, 27, 40, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="trending">🔥 Most Trending</option>
            <option value="most_branched">🌿 Most Branched</option>
            <option value="top_rated">⭐ Highest Rated</option>
            <option value="newest">⏳ Newest Arrivals</option>
          </select>
        </div>
      </div>
    </div>
  );
}
