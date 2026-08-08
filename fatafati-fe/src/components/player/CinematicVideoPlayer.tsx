'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Sparkles } from 'lucide-react';
import { AspectRatio } from '@fatafati/common';

interface CinematicVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  aspectRatio?: AspectRatio;
  title: string;
  onVideoEnd?: () => void;
  autoPlay?: boolean;
}

export function CinematicVideoPlayer({
  videoUrl,
  posterUrl,
  aspectRatio = '16:9',
  title,
  onVideoEnd,
  autoPlay = false,
}: CinematicVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [seekFeedback, setSeekFeedback] = useState<{ side: 'left' | 'right'; text: string } | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const lastTapXRef = useRef<number>(0);

  useEffect(() => {
    setIsEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (autoPlay) {
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback: mute and play
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(console.error);
          }
        });
      }
    }
  }, [videoUrl, autoPlay]);

  const wakeControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        setShowControls(false);
      }
    }, 3500);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      if (isEnded) {
        videoRef.current.currentTime = 0;
        setIsEnded(false);
      }
      videoRef.current.play().catch(console.error);
    }
    wakeControls();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    wakeControls();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (isEnded) setIsEnded(false);
    }
    wakeControls();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
    setShowControls(true);
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
    wakeControls();
  };

  // Mobile Touch Gestures: Double-tap left/right to skip ±5s, single-tap to toggle
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const touch = e.changedTouches[0];
    if (!touch || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const isLeftSide = touchX < rect.width / 2;

    const timeDiff = now - lastTapTimeRef.current;
    const distDiff = Math.abs(touchX - lastTapXRef.current);

    if (timeDiff < 300 && distDiff < 60) {
      // Double tap detected!
      if (videoRef.current) {
        if (isLeftSide) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          setSeekFeedback({ side: 'left', text: '⏪ 5s' });
        } else {
          videoRef.current.currentTime = Math.min(duration || 60, videoRef.current.currentTime + 5);
          setSeekFeedback({ side: 'right', text: '5s ⏩' });
        }
        setTimeout(() => setSeekFeedback(null), 800);
      }
      lastTapTimeRef.current = 0;
    } else {
      // Single tap
      lastTapTimeRef.current = now;
      lastTapXRef.current = touchX;
      wakeControls();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isVertical = aspectRatio === '9:16';

  return (
    <div
      ref={containerRef}
      onMouseMove={wakeControls}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: isVertical ? '440px' : '100%',
        margin: '0 auto',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: '#000',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 240, 255, 0.1)',
        aspectRatio: isVertical ? '9 / 16' : '16 / 9',
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        playsInline
        webkit-playsinline="true"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onClick={togglePlay}
        style={{
          width: '100%',
          height: '100%',
          objectFit: isVertical ? 'cover' : 'contain',
          backgroundColor: '#000',
          cursor: 'pointer',
          filter: isEnded ? 'grayscale(35%) brightness(0.7)' : 'none',
          transition: 'filter 0.5s ease',
        }}
      />

      {/* Double Tap Seek Feedback Ripple Indicator */}
      {seekFeedback && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: seekFeedback.side === 'left' ? '25%' : '75%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 240, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 240, 255, 0.6)',
            borderRadius: 'var(--radius-full)',
            padding: '12px 24px',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.1rem',
            letterSpacing: '0.05em',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.6)',
            pointerEvents: 'none',
            zIndex: 30,
            animation: 'cardMaterialize 0.2s ease-out',
          }}
        >
          {seekFeedback.text}
        </div>
      )}

      {/* Top Title Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '14px 16px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          opacity: showControls || !isPlaying ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00f0ff',
              boxShadow: '0 0 8px #00f0ff',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* Big Play/Pause/Replay Trigger in Center */}
      {(!isPlaying || isEnded) && (
        <button
          onClick={togglePlay}
          aria-label={isEnded ? 'Rewatch Episode' : isPlaying ? 'Pause' : 'Play Episode'}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.92), rgba(168, 85, 247, 0.92))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(0, 240, 255, 0.6)',
            zIndex: 15,
            transition: 'transform 0.2s ease',
          }}
        >
          {isEnded ? (
            <RotateCcw size={30} color="#07070a" strokeWidth={2.5} />
          ) : (
            <Play size={30} fill="#07070a" color="#07070a" style={{ marginLeft: '4px' }} />
          )}
        </button>
      )}

      {/* Bottom Custom Control Bar with Touch Friendly Tap Targets */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 16px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10,
          opacity: showControls || !isPlaying ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        {/* Progress Bar / Scrubber */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          aria-label="Video scrubber"
          style={{
            width: '100%',
            height: '6px',
            accentColor: '#00f0ff',
            cursor: 'pointer',
          }}
        />

        {/* Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
              }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
              }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
              }}
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
