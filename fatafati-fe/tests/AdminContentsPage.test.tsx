import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminContentsPage from '../src/app/admin/contents/page';
import { api } from '../src/services/apiClient';

// Mock the API client
vi.mock('../src/services/apiClient', () => ({
  api: {
    getSeries: vi.fn(),
    getStoryGraph: vi.fn(),
    getEpisode: vi.fn(),
    upsertSeries: vi.fn(),
    deleteSeries: vi.fn(),
    upsertEpisode: vi.fn(),
    deleteEpisode: vi.fn(),
    upsertChoice: vi.fn(),
    deleteChoice: vi.fn(),
  }
}));

// Mock the Header component
vi.mock('../src/components/common/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

describe('AdminContentsPage', () => {
  const mockSeries = [
    { id: 'series-1', title: 'Test Series 1', genre: 'sci-fi' },
    { id: 'series-2', title: 'Test Series 2', genre: 'horror' }
  ];

  const mockEpisodes = {
    nodes: [
      { id: 'ep-1', seriesId: 'series-1', title: 'Root Episode', episodeNumber: 1, isLeaf: false },
      { id: 'ep-2', seriesId: 'series-1', title: 'Branch 1', episodeNumber: 2, isLeaf: true }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (api.getSeries as any).mockResolvedValue(mockSeries);
    (api.getStoryGraph as any).mockResolvedValue(mockEpisodes);
    (api.getEpisode as any).mockImplementation((id: string) => {
      const ep = mockEpisodes.nodes.find(n => n.id === id);
      return Promise.resolve({ episode: ep });
    });
  });

  it('renders loading state initially', () => {
    render(<AdminContentsPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads and displays series list', async () => {
    render(<AdminContentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
      expect(screen.getByText('Test Series 2')).toBeInTheDocument();
    });

    expect(screen.getByText('SELECT A SERIES')).toBeInTheDocument();
  });

  it('loads episodes when a series is clicked', async () => {
    render(<AdminContentsPage />);
    
    await waitFor(() => screen.getByText('Test Series 1'));
    
    fireEvent.click(screen.getByText('Test Series 1'));

    await waitFor(() => {
      expect(api.getStoryGraph).toHaveBeenCalledWith('series-1');
      expect(screen.getByText('Root Episode')).toBeInTheDocument();
      expect(screen.getByText('Branch 1')).toBeInTheDocument();
    });
  });

  it('opens new series form when + New is clicked', async () => {
    render(<AdminContentsPage />);
    
    await waitFor(() => screen.getByText('Test Series 1'));
    
    // Find the + New button in the sidebar
    const newBtns = screen.getAllByText('+ New');
    fireEvent.click(newBtns[0]); // First one should be series

    await waitFor(() => {
      expect(screen.getByText('New Series')).toBeInTheDocument();
    });
  });

  it('opens new episode form when + New episode is clicked', async () => {
    render(<AdminContentsPage />);
    
    await waitFor(() => screen.getByText('Test Series 1'));
    fireEvent.click(screen.getByText('Test Series 1'));

    await waitFor(() => screen.getByText('Root Episode'));

    const newBtns = screen.getAllByText('+ New');
    fireEvent.click(newBtns[1]); // Second one should be episode

    await waitFor(() => {
      expect(screen.getByText('New Episode')).toBeInTheDocument();
    });
  });
});
