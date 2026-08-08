'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Series, StoryGraph } from '@fatafati/common';
import { api } from '../../../services/apiClient';
import { Badge } from '../../../components/common/Badge';
import { StoryJourneyTree } from '../../../components/journey/StoryJourneyTree';
import { Play, GitFork, Eye, Star, ArrowLeft, Clock, Film } from 'lucide-react';

export default function SeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const seriesId = params.id as string;

  const [series, setSeries] = useState<Series | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSeries() {
      if (!seriesId) return;
      setIsLoading(true);
      try {
        const data = await api.getSeriesById(seriesId);
        setSeries(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load series details');
      } finally {
        setIsLoading(false);
      }
    }
    loadSeries();
  }, [seriesId]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading series details...
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Series Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'Unable to retrieve series data.'}</p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
          }}
        >
          <ArrowLeft size={16} />
          Back to Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      {/* Back Button */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          marginBottom: '20px',
          transition: 'color 0.2s',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to All Series</span>
      </Link>

      {/* Series Hero Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'flex-end',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${series.backdropImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6) contrast(1.1)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(7, 7, 10, 0.2) 0%, rgba(7, 7, 10, 0.8) 60%, rgba(7, 7, 10, 0.98) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '40px',
            maxWidth: '800px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <Badge variant="cyan">{series.genre}</Badge>
            <Badge variant="purple" icon={<GitFork size={13} />}>
              {series.totalPaths} Divergent Endings
            </Badge>
            <Badge variant="default">
              ⭐ {series.rating} / 5.0
            </Badge>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1.15, marginBottom: '14px' }}>
            {series.title}
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {series.description}
          </p>

          {/* Action CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              href={`/watch/${series.rootEpisodeId}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
                color: '#07070a',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <Play size={20} fill="#07070a" />
              <span>Watch From Episode 1</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Story Tree */}
      <StoryJourneyTree seriesId={series.id} currentEpisodeId={series.rootEpisodeId} />
    </div>
  );
}
