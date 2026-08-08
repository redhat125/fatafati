import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '../src/components/common/Badge';
import { SeriesCard } from '../src/components/discovery/SeriesCard';
import { FilterBar } from '../src/components/discovery/FilterBar';
import { PathCard } from '../src/components/choices/PathCard';
import { UpvoteCounter } from '../src/components/community/UpvoteCounter';
import { CommentInput } from '../src/components/community/CommentInput';
import { BranchTimeline } from '../src/components/journey/BranchTimeline';
import { Series, EpisodeChoice } from '@fatafati/common';

const mockSeries: Series = {
  id: 'cyberpunk-2099',
  title: 'Cyberpunk 2099: Neon Syndicate',
  tagline: 'In Neo-Kolkata, one memory hack changes everything.',
  description: 'In Neo-Kolkata, rogue hacker Vesper discovers a secret AI protocol.',
  genre: 'cyberpunk',
  tags: ['Cyberpunk', 'AI', 'Action'],
  coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
  backdropImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80',
  rootEpisodeId: 'cp-ep-1',
  totalEpisodes: 7,
  totalPaths: 4,
  rating: 4.9,
  viewCount: 14200,
  createdAt: '2026-08-01T00:00:00Z',
  updatedAt: '2026-08-01T00:00:00Z',
};

const mockChoice: EpisodeChoice = {
  id: 'cp-ch-1a',
  targetEpisodeId: 'cp-ep-2a',
  text: 'Hack the Corp Server',
  description: 'Infiltrate the grid before the security sweep begins.',
  pickCount: 120,
  pickPercentage: 58,
  label: 'Option A',
};

describe('FataFati Frontend Component Suite', () => {
  describe('Badge Component', () => {
    it('renders text with appropriate colors and styles', () => {
      render(<Badge variant="cyan">Cyberpunk</Badge>);
      expect(screen.getByText('Cyberpunk')).toBeDefined();
    });
  });

  describe('SeriesCard Component', () => {
    it('displays title, rating, and story paths count', () => {
      render(<SeriesCard series={mockSeries} />);
      expect(screen.getByText('Cyberpunk 2099: Neon Syndicate')).toBeDefined();
      expect(screen.getByText('4.9')).toBeDefined();
      expect(screen.getByText('4 story paths')).toBeDefined();
    });
  });

  describe('FilterBar Component', () => {
    it('calls onSelectGenre when a genre pill is clicked', () => {
      const handleSelectGenre = vi.fn();
      const handleSelectSort = vi.fn();
      const handleSearchChange = vi.fn();

      render(
        <FilterBar
          selectedGenre="all"
          onSelectGenre={handleSelectGenre}
          sortOption="trending"
          onSelectSort={handleSelectSort}
          searchQuery=""
          onSearchChange={handleSearchChange}
        />
      );

      const cyberpunkButton = screen.getByText('Cyberpunk');
      fireEvent.click(cyberpunkButton);
      expect(handleSelectGenre).toHaveBeenCalledWith('cyberpunk');
    });
  });

  describe('PathCard Component', () => {
    it('renders choice prompt and pick percentage bar', () => {
      const handleSelect = vi.fn();
      render(<PathCard choice={mockChoice} onSelect={handleSelect} index={0} />);

      expect(screen.getByText('Hack the Corp Server')).toBeDefined();
      expect(screen.getByText('58% chose this')).toBeDefined();

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleSelect).toHaveBeenCalledWith(mockChoice);
    });
  });

  describe('UpvoteCounter Component', () => {
    it('handles upvoting and downvoting actions', () => {
      const handleVote = vi.fn();
      render(
        <UpvoteCounter
          score={42}
          upvotes={45}
          downvotes={3}
          userVote={null}
          onVote={handleVote}
        />
      );

      expect(screen.getByText('45')).toBeDefined();
      expect(screen.getByText('3')).toBeDefined();

      const upvoteBtn = screen.getByTitle('Upvote this twist idea');
      fireEvent.click(upvoteBtn);
      expect(handleVote).toHaveBeenCalledWith('up');
    });
  });

  describe('BranchTimeline Component', () => {
    it('renders breadcrumb steps with link to series and episodes', () => {
      render(
        <BranchTimeline
          seriesTitle="Cyberpunk 2099"
          seriesId="cyberpunk-2099"
          breadcrumbs={[
            { id: 'cp-ep-1', title: 'The Glitch', episodeNumber: 1 },
            { id: 'cp-ep-2a', title: 'Ghost in the Machine', episodeNumber: 2 },
          ]}
          currentEpisodeId="cp-ep-2a"
        />
      );

      expect(screen.getByText('Cyberpunk 2099')).toBeDefined();
      expect(screen.getByText('The Glitch')).toBeDefined();
      expect(screen.getByText('Ghost in the Machine')).toBeDefined();
    });
  });
});
