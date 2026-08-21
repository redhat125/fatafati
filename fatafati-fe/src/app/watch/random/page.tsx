'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, ChevronUp } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { Series, Episode } from '@fatafati/common';
import { CinematicVideoPlayer } from '../../../components/player/CinematicVideoPlayer';
import { BottomSheetOverlay } from '../../../components/common/BottomSheetOverlay';
import { StoryJourneyTree } from '../../../components/journey/StoryJourneyTree';
import { CommunityVoice } from '../../../components/community/CommunityVoice';
import { ChoiceCardsOverlay } from '../../../components/choices/ChoiceCardsOverlay';
import { EpisodeChoice } from '@fatafati/common';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface FeedItem {
  series: Series;
  episode: Episode;
}

export default function RandomWatchPage() {
  const router = useRouter();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSheet, setActiveSheet] = useState<'map' | 'comments' | 'details' | null>(null);
  const [showChoices, setShowChoices] = useState(false);
  const [videoStatusMap, setVideoStatusMap] = useState<Record<string, 'ready' | 'generating' | 'scheduled'>>({});
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        setIsLoading(true);
        // Fetch trending series
        const seriesData = await api.getSeries({ sort: 'trending' });
        if (!seriesData || seriesData.length === 0) {
          setError('No series available.');
          setIsLoading(false);
          return;
        }

        // Shuffle series array
        const shuffledSeries = [...seriesData].sort(() => 0.5 - Math.random());
        // Take top 5 for the feed to keep loading fast
        const feedSeries = shuffledSeries.slice(0, 5);
        
        // Fetch root episodes for each series and their choice target statuses
        const items: FeedItem[] = [];
        const statuses: Record<string, 'ready' | 'generating' | 'scheduled'> = {};
        for (const series of feedSeries) {
          try {
            const data = await api.getEpisode(series.rootEpisodeId);
            items.push({ series, episode: data.episode });
            
            // Pre-fetch statuses for choices
            if (data.episode.choices && data.episode.choices.length > 0) {
              await Promise.all(data.episode.choices.map(async (c) => {
                try {
                  const targetData = await api.getEpisode(c.targetEpisodeId);
                  statuses[c.targetEpisodeId] = targetData.episode.videoStatus || 'ready';
                } catch (e) {
                  statuses[c.targetEpisodeId] = 'ready';
                }
              }));
            }
          } catch (err) {
            console.error(`Failed to load episode for series ${series.id}`, err);
          }
        }
        
        setVideoStatusMap(statuses);
        setFeedItems(items);
      } catch (err: any) {
        setError(err.message || 'Failed to load feed.');
      } finally {
        setIsLoading(false);
      }
    }
    loadFeed();
  }, []);

  // Set up IntersectionObserver to detect which video is currently active
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              if (activeIndex !== index) {
                setActiveIndex(index);
                setShowChoices(false); // Reset choices when scrolling to a new video
              }
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // Trigger when 60% of the video is visible
      }
    );

    const videoElements = containerRef.current.querySelectorAll('.feed-video-container');
    videoElements.forEach((el) => observer.observe(el));

    return () => {
      videoElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [feedItems]);

  const handleScroll = useCallback(() => {
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  }, [hasScrolled]);

  const handleVideoEnd = (index: number) => {
    if (activeIndex === index) {
      setShowChoices(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00f0ff', '#a855f7', '#10b981'],
          zIndex: 9999,
        });
      } catch (e) {}
    }
  };

  const handleChoiceSelect = async (choice: EpisodeChoice) => {
    try {
      const episodeId = feedItems[activeIndex].episode.id;
      await api.choosePath(episodeId, choice.id);
      
      const status = videoStatusMap[choice.targetEpisodeId] || 'ready';
      if (status === 'ready') {
        router.push(`/watch/${choice.targetEpisodeId}`);
      }
    } catch (err) {
      console.error('Failed to record choice:', err);
      if (videoStatusMap[choice.targetEpisodeId] !== 'generating') {
        router.push(`/watch/${choice.targetEpisodeId}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', backgroundColor: '#000', color: 'var(--text-secondary)' }}>
        <Sparkles size={36} color="#00f0ff" style={{ marginBottom: '16px' }} />
        <p>Curating your surprise feed...</p>
      </div>
    );
  }

  if (error || feedItems.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', backgroundColor: '#000', color: 'var(--text-secondary)' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Oops!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'No content found.'}</p>
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
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      onTouchMove={handleScroll}
      style={{
        height: '100dvh',
        width: '100%',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        backgroundColor: '#000',
        position: 'relative',
      }}
    >
      {/* Swipe Indicator (Only visible on first video until scrolled) */}
      {!hasScrolled && activeIndex === 0 && (
        <div
          style={{
            position: 'fixed', // Use fixed so it stays relative to viewport
            bottom: 'env(safe-area-inset-bottom, 80px)', // Above mobile nav
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            pointerEvents: 'none',
            zIndex: 100,
            animation: 'bounce 2s infinite',
          }}
        >
          <ChevronUp size={32} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Swipe Up
          </span>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-15px); }
              60% { transform: translateY(-7px); }
            }
          `}} />
        </div>
      )}

      {feedItems.map((item, index) => (
        <div
          key={`feed-${item.series.id}-${index}`}
          className="feed-video-container"
          data-index={index}
          style={{
            height: '100dvh',
            width: '100%',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            position: 'relative',
          }}
        >
          <CinematicVideoPlayer
            videoUrl={item.episode.videoUrl}
            posterUrl={item.episode.thumbnailUrl || item.series.backdropImage}
            title={item.episode.title}
            seriesTitle={item.series.title}
            viewCount={item.series.viewCount}
            autoPlay={true}
            isActive={activeIndex === index}
            isSurpriseMode={true}
            onVideoEnd={() => handleVideoEnd(index)}
            onOpenMap={() => setActiveSheet('map')}
            onOpenComments={() => setActiveSheet('comments')}
            onOpenDetails={() => setActiveSheet('details')}
          />
        </div>
      ))}

      {/* Choice Cards Overlay (Shown on video end for the active video) */}
      {showChoices && feedItems[activeIndex] && (
        <div style={{
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
        }}>
          <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '600px' }}>
            <ChoiceCardsOverlay
              episode={feedItems[activeIndex].episode}
              seriesId={feedItems[activeIndex].series.id}
              onSelectChoice={handleChoiceSelect}
              onRewatch={() => setShowChoices(false)}
              videoStatusMap={videoStatusMap}
            />
          </div>
        </div>
      )}

      {/* Bottom Sheet Overlays */}
      {feedItems[activeIndex] && (
        <>
          <BottomSheetOverlay
            isOpen={activeSheet === 'map'}
            onClose={() => setActiveSheet(null)}
            title="Interactive Story Map"
            height="85dvh"
          >
            <StoryJourneyTree 
              seriesId={feedItems[activeIndex].series.id} 
              currentEpisodeId={feedItems[activeIndex].episode.id} 
            />
          </BottomSheetOverlay>

          <BottomSheetOverlay
            isOpen={activeSheet === 'comments'}
            onClose={() => setActiveSheet(null)}
            title="Community Writers Room"
            height="75dvh"
          >
            <CommunityVoice episodeId={feedItems[activeIndex].episode.id} />
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
                  Episode {feedItems[activeIndex].episode.episodeNumber} • {feedItems[activeIndex].series.title}
                </span>
                {feedItems[activeIndex].episode.isLeaf && (
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
              
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
                {feedItems[activeIndex].episode.title}
              </h2>
              
              {feedItems[activeIndex].episode.synopsis && (
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {feedItems[activeIndex].episode.synopsis}
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {feedItems[activeIndex].series.tags?.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BottomSheetOverlay>
        </>
      )}
    </div>
  );
}
