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
import { BottomSheetOverlay } from '../../../components/common/BottomSheetOverlay';
import { Sparkles, ArrowLeft } from 'lucide-react';
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
  const [videoStatusMap, setVideoStatusMap] = useState<Record<string, 'ready' | 'generating' | 'scheduled'>>({});
  
  // States for Overlays
  const [showChoices, setShowChoices] = useState<boolean>(false);
  const [activeSheet, setActiveSheet] = useState<'map' | 'comments' | 'details' | null>(null);

  const loadEpisodeData = useCallback(async () => {
    if (!episodeId) return;
    setIsLoading(true);
    setError(null);
    setShowChoices(false);
    setActiveSheet(null);

    try {
      const data = await api.getEpisode(episodeId);
      setEpisode(data.episode);
      setSeries(data.series);
      setBreadcrumbs(data.breadcrumbs);

      // Fetch video statuses for all target episodes of choices
      if (data.episode.choices && data.episode.choices.length > 0) {
        const statuses: Record<string, 'ready' | 'generating' | 'scheduled'> = {};
        await Promise.all(data.episode.choices.map(async (c) => {
          try {
            const targetData = await api.getEpisode(c.targetEpisodeId);
            statuses[c.targetEpisodeId] = targetData.episode.videoStatus || 'ready';
          } catch (e) {
            statuses[c.targetEpisodeId] = 'ready'; // Fallback
          }
        }));
        setVideoStatusMap(statuses);
      } else {
        setVideoStatusMap({});
      }

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
        zIndex: 200, // Show over video
      });
    } catch (e) {
      // Ignore if canvas is unavailable
    }
  };

  const handleChoiceSelect = async (choice: EpisodeChoice) => {
    try {
      await api.choosePath(episodeId!, choice.id);
      
      const status = !choice.targetEpisodeId ? 'generating' : (videoStatusMap[choice.targetEpisodeId] || 'ready');
      if (status === 'ready') {
        router.push(`/watch/${choice.targetEpisodeId}`);
      }
    } catch (err) {
      console.error('Failed to record choice:', err);
      // Fallback route on error if ready
      const fallbackStatus = !choice.targetEpisodeId ? 'generating' : (videoStatusMap[choice.targetEpisodeId] || 'ready');
      if (fallbackStatus === 'ready') {
        router.push(`/watch/${choice.targetEpisodeId}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#000', color: 'var(--text-secondary)' }}>
        <Sparkles size={36} color="#00f0ff" style={{ marginBottom: '16px' }} />
        <p>Entering interactive cinema universe...</p>
      </div>
    );
  }

  if (error || !episode || !series) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#000', color: 'var(--text-secondary)' }}>
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
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Return to Series Discovery
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Full Screen Cinematic Player */}
      <CinematicVideoPlayer
        videoUrl={episode.videoUrl}
        posterUrl={episode.thumbnailUrl || series.backdropImage}
        title={episode.title}
        seriesTitle={series.title}
        viewCount={1240} // Mock data for view count
        onVideoEnd={handleVideoEnd}
        autoPlay={true}
        onOpenMap={() => setActiveSheet('map')}
        onOpenComments={() => setActiveSheet('comments')}
        onOpenDetails={() => setActiveSheet('details')}
      />

      {/* Choice Cards Overlay (Shown on video end) */}
      {showChoices && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ChoiceCardsOverlay 
              episode={episode} 
              onSelectChoice={handleChoiceSelect} 
              onRewatch={() => setShowChoices(false)} 
              seriesId={series!.id}
              videoStatusMap={videoStatusMap}
            />
          </div>
        </div>
      )}

      {/* Bottom Sheet Overlays */}
      <BottomSheetOverlay
        isOpen={activeSheet === 'map'}
        onClose={() => setActiveSheet(null)}
        title="Interactive Story Map"
        height="85dvh"
      >
        <StoryJourneyTree seriesId={series.id} currentEpisodeId={episode.id} />
      </BottomSheetOverlay>

      <BottomSheetOverlay
        isOpen={activeSheet === 'comments'}
        onClose={() => setActiveSheet(null)}
        title="Community Writers Room"
        height="75dvh"
      >
        <CommunityVoice episodeId={episode.id} />
      </BottomSheetOverlay>

      <BottomSheetOverlay
        isOpen={activeSheet === 'details'}
        onClose={() => setActiveSheet(null)}
        title="Episode Details"
        height="60dvh"
      >
        <div style={{ paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
                  borderRadius: 0,
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                  background: 'rgba(236, 72, 153, 0.2)',
                  border: '1px solid rgba(236, 72, 153, 0.6)',
                  color: '#ec4899',
                }}
              >
                Final Ending Branch
              </span>
            )}
          </div>
          
          <h2 className="text-cyber-glow" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>{episode.title}</h2>
          
          {episode.synopsis && (
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
              {episode.synopsis}
            </p>
          )}

          <h3 className="text-cyber-glow" style={{ fontSize: '1rem', fontWeight: 600, color: '#00f0ff', marginBottom: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', textTransform: 'uppercase' }}>
            Branch Timeline
          </h3>
          <BranchTimeline
            seriesTitle={series.title}
            seriesId={series.id}
            breadcrumbs={breadcrumbs}
            currentEpisodeId={episode.id}
          />
        </div>
      </BottomSheetOverlay>
    </>
  );
}
