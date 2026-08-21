import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi, describe } from 'vitest';
import { ChoiceCardsOverlay } from '../src/components/choices/ChoiceCardsOverlay';
import { Episode } from '@fatafati/common';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
    };
  },
}));

describe('ChoiceCardsOverlay', () => {
  const mockEpisode: Episode = {
    id: 'ep-1',
    seriesId: 'series-1',
    parentEpisodeId: null,
    episodeNumber: 1,
    title: 'Test',
    synopsis: 'Test',
    videoUrl: 'test.mp4',
    thumbnailUrl: 'test.png',
    durationSeconds: 10,
    aspectRatio: '16:9',
    viewCount: 0,
    isLeaf: false,
    isSeriesFinale: false,
    videoStatus: 'ready',
    createdAt: new Date().toISOString(),
    choiceQuestion: 'What next?',
    choices: [
      {
        id: 'ch-1',
        targetEpisodeId: 'ep-2a',
        label: 'A',
        text: 'Choice A',
        pickCount: 0,
        pickPercentage: 50,
      },
      {
        id: 'ch-2',
        targetEpisodeId: 'ep-2b',
        label: 'B',
        text: 'Choice B',
        pickCount: 0,
        pickPercentage: 50,
      }
    ],
  };

  test('renders branching choices state correctly', () => {
    const onSelect = vi.fn();
    render(
      <ChoiceCardsOverlay
        episode={mockEpisode}
        onSelectChoice={onSelect}
        onRewatch={() => {}}
        seriesId="series-1"
        videoStatusMap={{ 'ep-2a': 'ready', 'ep-2b': 'ready' }}
      />
    );

    expect(screen.getByText('What next?')).toBeDefined();
    expect(screen.getByText('A. A')).toBeDefined();
    expect(screen.getByText('B. B')).toBeDefined();
  });

  test('renders cooking state when generating choice is selected', () => {
    const onSelect = vi.fn();
    const { getByText, queryByText } = render(
      <ChoiceCardsOverlay
        episode={mockEpisode}
        onSelectChoice={onSelect}
        onRewatch={() => {}}
        seriesId="series-1"
        videoStatusMap={{ 'ep-2a': 'generating', 'ep-2b': 'ready' }}
      />
    );

    // Initial render has '[RENDERING]' badge for choice A
    expect(getByText('[RENDERING]')).toBeDefined();

    // Click generating choice
    fireEvent.click(getByText('A. A'));

    // Should switch to cooking state
    expect(getByText('BRILLIANT CHOICE, DIRECTOR.')).toBeDefined();
    expect(getByText(/is rendering in the AI engine/)).toBeDefined();
    expect(queryByText('What next?')).toBeNull(); // Old header is gone
  });

  test('renders series finale state correctly', () => {
    const finaleEpisode = {
      ...mockEpisode,
      choices: [],
      isSeriesFinale: true,
      isLeaf: true,
      choiceQuestion: null,
    };

    render(
      <ChoiceCardsOverlay
        episode={finaleEpisode}
        onSelectChoice={() => {}}
        onRewatch={() => {}}
        seriesId="series-1"
        videoStatusMap={{}}
      />
    );

    expect(screen.getByText('SEASON FINALE REACHED')).toBeDefined();
  });

  test('renders dead end state correctly', () => {
    const deadEndEpisode = {
      ...mockEpisode,
      choices: [],
      isSeriesFinale: false,
      isLeaf: true,
      choiceQuestion: null,
    };

    render(
      <ChoiceCardsOverlay
        episode={deadEndEpisode}
        onSelectChoice={() => {}}
        onRewatch={() => {}}
        seriesId="series-1"
        videoStatusMap={{}}
      />
    );

    expect(screen.getByText('PROCESSING BRANCH...')).toBeDefined();
  });
});
