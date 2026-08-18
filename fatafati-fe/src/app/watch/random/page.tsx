'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { api } from '../../../services/apiClient';

export default function RandomWatchPage() {
  const router = useRouter();

  useEffect(() => {
    async function loadRandom() {
      try {
        const seriesData = await api.getSeries({ sort: 'trending' });
        if (seriesData && seriesData.length > 0) {
          const randomIndex = Math.floor(Math.random() * seriesData.length);
          const randomSeries = seriesData[randomIndex];
          router.replace(`/watch/${randomSeries.rootEpisodeId}`);
        } else {
          router.replace('/');
        }
      } catch (err) {
        router.replace('/');
      }
    }
    loadRandom();
  }, [router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', backgroundColor: '#000', color: 'var(--text-secondary)' }}>
      <Sparkles size={36} color="#00f0ff" style={{ marginBottom: '16px' }} />
      <p>Finding a surprise for you...</p>
    </div>
  );
}
