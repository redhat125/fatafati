'use client';

import { useState, useEffect, useCallback } from 'react';
import { Series, SeriesGenre, SortOption } from '@fatafati/common';
import { api } from '../services/apiClient';

export function useSeries() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<SeriesGenre>('all');
  const [sortOption, setSortOption] = useState<SortOption>('trending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getSeries({
        genre: selectedGenre,
        sort: sortOption,
        search: searchQuery.trim() || undefined,
      });
      setSeriesList(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load series');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenre, sortOption, searchQuery]);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  return {
    seriesList,
    selectedGenre,
    setSelectedGenre,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    refresh: fetchSeries,
  };
}
