'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Heart, MessageCircle, GitFork, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CinematicVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  seriesTitle: string;
  viewCount?: number;
  onVideoEnd?: () => void;
  autoPlay?: boolean;
  onOpenMap?: () => void;
  onOpenComments?: () => void;
  onOpenDetails?: () => void;
  isActive?: boolean;
  isSurpriseMode?: boolean;
}

export function CinematicVideoPlayer({
  videoUrl,
  posterUrl,
  title,
  seriesTitle,
  viewCount = 0,
  onVideoEnd,
  autoPlay = true,
  onOpenMap,
  onOpenComments,
  onOpenDetails,
  isActive = true,
  isSurpriseMode = false,
}: CinematicVideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isLiked, setIsLiked] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide UI logic
  const resetUITimer = () => {
    setShowUI(true);
    if (uiTimeoutRef.current) {
      clearTimeout(uiTimeoutRef.current);
    }
    
    // In surprise mode, don't start the auto-hide timer until the user has interacted at least once
    if (isSurpriseMode && !hasInteracted) {
      return;
    }

    // Only auto-hide if playing
    if (isPlaying) {
      uiTimeoutRef.current = setTimeout(() => {
        setShowUI(false);
      }, 3500);
    }
  };

  useEffect(() => {
    resetUITimer();
    return () => {
      if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    };
  }, [isPlaying, hasInteracted]);

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    } else {
      resetUITimer();
    }
  };

  // Format views
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && autoPlay) {
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(console.error);
          }
        });
        setIsPlaying(true);
      } else if (!isActive) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
        // Reset interaction state when inactive so it's fresh when scrolling back
        setHasInteracted(false);
        setShowUI(true);
      }
    }
  }, [videoUrl, autoPlay, isActive]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowUI(true); // Always show UI when paused
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        // Attempt to enter fullscreen on mobile devices when playing starts
        if (containerRef.current && window.innerWidth < 768 && !document.fullscreenElement) {
          try {
            if (containerRef.current.requestFullscreen) {
              containerRef.current.requestFullscreen().catch(() => {});
            } else if ((containerRef.current as any).webkitRequestFullscreen) {
              (containerRef.current as any).webkitRequestFullscreen();
            }
          } catch (e) {}
        }
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowUI(true);
    if (onVideoEnd) onVideoEnd();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onClick={handleUserInteraction}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        autoPlay={autoPlay}
        playsInline
        loop={false} // Stops at end for branching choice
        onClick={handleVideoClick}
        onEnded={handleEnded}
        className="responsive-video-fit"
        style={{
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />

      {/* Dark gradient at bottom for text readability */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
          opacity: showUI ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Dark gradient at top for header readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '15%',
          background: 'linear-gradient(0deg, transparent 0%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
          opacity: showUI ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {showUI && (
        <>
          {/* Top Header (Back button) */}
          <div
            style={{
              position: 'absolute',
              top: 'env(safe-area-inset-top, 16px)',
              left: '16px',
              zIndex: 10,
            }}
          >
            <button
              onClick={() => router.back()}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          {/* Center Play Button Overlay (when paused) */}
          {!isPlaying && (
            <div
              onClick={handleVideoClick}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)',
                cursor: 'pointer',
                zIndex: 5,
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Play size={32} fill="#fff" style={{ marginLeft: '4px' }} />
              </div>
            </div>
          )}

          {/* Right Action Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '90px', // Above bottom edge
              right: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            {/* Like */}
            <button onClick={handleLike} style={actionButtonStyle}>
              <Heart size={28} color={isLiked ? '#ec4899' : '#fff'} fill={isLiked ? '#ec4899' : 'none'} />
              <span style={actionLabelStyle}>{formatCount(viewCount > 0 ? viewCount / 2 : 124)}</span>
            </button>

            {/* Comment / Pitch */}
            <button
              onClick={(e) => { e.stopPropagation(); if(onOpenComments) onOpenComments(); }}
              style={actionButtonStyle}
            >
              <MessageCircle size={28} color="#fff" />
              <span style={actionLabelStyle}>{formatCount(42)}</span>
            </button>

            {/* Story Map */}
            <button
              onClick={(e) => { e.stopPropagation(); if(onOpenMap) onOpenMap(); }}
              style={actionButtonStyle}
            >
              <GitFork size={28} color="#00f0ff" />
              <span style={actionLabelStyle}>Map</span>
            </button>

            {/* Details (Sandwich) */}
            <button
              onClick={(e) => { e.stopPropagation(); if(onOpenDetails) onOpenDetails(); }}
              style={actionButtonStyle}
            >
              <MoreHorizontal size={28} color="#fff" />
              <span style={actionLabelStyle}>Info</span>
            </button>
          </div>

          {/* Bottom Left Details */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '16px',
              right: '80px', // leave room for action bar
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)' }}>
                {seriesTitle}
              </span>
            </div>
            
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              {title}
            </h2>
          </div>
        </>
      )}
    </div>
  );
}

const actionButtonStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
};

const actionLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#fff',
  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
};
