'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Episode, Series, EpisodeChoice } from '@fatafati/common';
import { api } from '../../../services/apiClient';
import { BranchTimeline } from '../../../components/journey/BranchTimeline';
import { CinematicVideoPlayer } from '../../../components/player/CinematicVideoPlayer';
import { ChoiceCardsOverlay } from '../../../components/choices/ChoiceCardsOverlay';
import { StoryJourneyTree } from '../../../components/journey/StoryJourneyTree';
import { CommunityVoice } from '../../../components/community/CommunityVoice';
import { Sparkles, GitFork, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function WatchEpisodePage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.id as string;

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [series, setSeries] = useState<Series | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string; title: string; episodeNumber: number; choicePrompt?: string | null }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showChoices, setShowChoices] = useState<boolean>(false);

  const loadEpisodeData = useCallback(async () => {
    if (!episodeId) return;
    setIsLoading(true);
    setError(null);
    setShowChoices(false);

    try {
      const data = await api.getEpisode(episodeId);
      setEpisode(data.episode);
      setSeries(data.series);
      setBreadcrumbs(data.breadcrumbs);

      // Record user journey progression
      api.saveJourney(data.series.id, data.episode.id).catch(console.error);
    } catch (err: any) {
      setError(err.message || 'Failed to load episode');
    } finally {
      setIsLoading(false);
    }
  }, [episodeId]);

  useEffect(() => {
    loadEpisodeData();
  }, [loadEpisodeData]);

  const handleVideoEnd = () => {
    setShowChoices(true);
    // Trigger celebratory confetti on reaching episode climax
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#a855f7', '#ec4899', '#f59e0b'],
      });
    } catch (e) {
      // Ignore if canvas is unavailable
    }
  };

  const handleChoiceSelect = async (choice: EpisodeChoice) => {
    try {
      await api.choosePath(choice.id);
      router.push(`/watch/${choice.targetEpisodeId}`);
    } catch (err) {
      console.error('Failed to record choice:', err);
      router.push(`/watch/${choice.targetEpisodeId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Sparkles size={36} color="#00f0ff" style={{ margin: '0 auto 12px auto' }} />
        <p>Entering interactive cinema universe...</p>
      </div>
    );
  }

  if (error || !episode || !series) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Episode Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'Unable to retrieve episode.'}</p>
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
          Return to Series Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '16px' }}>
      {/* Breadcrumb Navigation Trail */}
      <BranchTimeline
        seriesTitle={series.title}
        seriesId={series.id}
        breadcrumbs={breadcrumbs}
        currentEpisodeId={episode.id}
      />

      {/* Episode Header */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent-cyan)',
            }}
          >
            Episode {episode.episodeNumber} • {series.title}
          </span>
          {episode.isLeaf && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(236, 72, 153, 0.2)',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                color: '#ec4899',
              }}
            >
              Final Ending Branch
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', lineHeight: 1.2 }}>
          {episode.title}
        </h1>

        {episode.synopsis && (
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '800px', lineHeight: 1.5 }}>
            {episode.synopsis}
          </p>
        )}
      </div>

      {/* Cinematic Custom Video Player */}
      <CinematicVideoPlayer
        videoUrl={episode.videoUrl}
        posterUrl={episode.thumbnailUrl || series.backdropImage}
        aspectRatio={episode.aspectRatio}
        title={`${series.title} — Ep ${episode.episodeNumber}: ${episode.title}`}
        onVideoEnd={handleVideoEnd}
        autoPlay={true}
      />

      {/* Choice Prompt Trigger Button (if choices are hidden and user wants to choose early) */}
      {!showChoices && episode.choices && episode.choices.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            onClick={() => setShowChoices(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00f0ff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <GitFork size={16} />
            <span>Reveal Branch Choices Now</span>
          </button>
        </div>
      )}

      {/* Choice Cards Overlay (Shown on video end or manual reveal) */}
      {showChoices && (
        <ChoiceCardsOverlay
          episode={episode}
          seriesId={series.id}
          onSelectChoice={handleChoiceSelect}
          onRewatch={() => setShowChoices(false)}
        />
      )}

      {/* Interactive Story DAG Tree Map */}
      <StoryJourneyTree seriesId={series.id} currentEpisodeId={episode.id} />

      {/* Community Writers Room for submitting twists & upvoting */}
      <CommunityVoice episodeId={episode.id} />
    </div>
  );
}
