'use client';

import React, { useState, useEffect } from 'react';
import { EpisodeChoice, Episode } from '@fatafati/common';
import { PathCard } from './PathCard';
import Link from 'next/link';

interface ChoiceCardsOverlayProps {
  episode: Episode;
  onSelectChoice: (choice: EpisodeChoice) => void;
  onRewatch: () => void;
  seriesId: string;
  videoStatusMap: Record<string, 'ready' | 'generating' | 'scheduled'>;
}

export function ChoiceCardsOverlay({
  episode,
  onSelectChoice,
  onRewatch,
  seriesId,
  videoStatusMap,
}: ChoiceCardsOverlayProps) {
  const [isGlitching, setIsGlitching] = useState(true);
  const [cookingChoice, setCookingChoice] = useState<EpisodeChoice | null>(null);

  // Trigger glitch animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsGlitching(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChoiceClick = (choice: EpisodeChoice) => {
    const status = !choice.targetEpisodeId ? 'generating' : (videoStatusMap[choice.targetEpisodeId] || 'ready');
    if (status !== 'ready') {
      setCookingChoice(choice);
      onSelectChoice(choice);
    } else {
      onSelectChoice(choice);
    }
  };

  const hasChoices = episode.choices && episode.choices.length > 0;

  return (
    <div 
      style={{ 
        position: 'absolute', inset: 0, 
        display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none'
      }} 
    >
      {/* Global scanline effect over the video when choices are up */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(transparent 0, rgba(0, 240, 255, 0.03) 2px, transparent 4px)',
        animation: 'scanlines 20s linear infinite',
        zIndex: -1
      }} />

      <div className="hologram-container" style={{
        animation: isGlitching ? 'cyber-glitch 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '90%',
        maxWidth: '900px',
        position: 'relative',
        pointerEvents: 'auto'
      }}>
        {/* Decorative corner brackets */}
        <div className="cyber-bracket cyber-bracket-tl" />
        <div className="cyber-bracket cyber-bracket-tr" />
        <div className="cyber-bracket cyber-bracket-bl" />
        <div className="cyber-bracket cyber-bracket-br" />

        {cookingChoice ? (
          <div className="cyber-panel" style={{ padding: '24px 60px', width: '100%', textAlign: 'center' }}>
            <h2 className="text-cyber-glow" style={{ fontSize: '2.4rem', fontWeight: 700, margin: 0, color: '#0ff', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
              BRILLIANT CHOICE, DIRECTOR.
            </h2>
            <p style={{ color: '#fff', fontSize: '1.2rem', marginTop: '16px', textShadow: '0 0 5px #fff' }}>
              Your exclusive episode for <strong style={{ color: '#f0f' }}>"{cookingChoice.label}"</strong> is rendering in the AI engine.
            </p>
            <div style={{ marginTop: '30px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/" style={{ color: '#0ff', textDecoration: 'none', border: '1px solid #0ff', padding: '10px 20px', fontWeight: 'bold' }}>
                EXPLORE OTHER STORIES
              </Link>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCookingChoice(null); onRewatch(); }} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
                REWATCH EPISODE
              </button>
            </div>
          </div>
        ) : hasChoices ? (
          <>
            <div className="cyber-panel" style={{ padding: '24px 60px', width: '100%', textAlign: 'center' }}>
              <h2 className="text-cyber-glow" style={{ fontSize: '2.4rem', fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
                {episode.choiceQuestion || 'Choose your path...'}
              </h2>
              <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '3px', opacity: 0.6 }}>
                <div style={{ width: '40px' }} />
                <div style={{ width: '25px' }} />
                <div style={{ width: '15px' }} />
                <div style={{ width: '30px' }} />
                <div style={{ width: '20px' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
              {episode.choices.map((choice, idx) => (
                <PathCard
                  key={choice.id}
                  choice={choice}
                  index={idx}
                  onSelect={handleChoiceClick}
                  videoStatus={videoStatusMap[choice.targetEpisodeId] || 'ready'}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="cyber-panel" style={{ padding: '24px 60px', width: '100%', textAlign: 'center' }}>
            <h2 className="text-cyber-glow" style={{ fontSize: '2.4rem', fontWeight: 700, margin: 0, color: '#f0f', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif", textShadow: '0 0 10px rgba(255,0,255,0.8)' }}>
              {episode.isSeriesFinale ? 'SEASON FINALE REACHED' : 'PROCESSING BRANCH...'}
            </h2>
            <div style={{ marginTop: '20px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/" style={{ color: '#0ff', textDecoration: 'none', border: '1px solid #0ff', padding: '10px 20px', fontWeight: 'bold' }}>
                RETURN TO HOME
              </Link>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRewatch(); }} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
                REWATCH EPISODE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
