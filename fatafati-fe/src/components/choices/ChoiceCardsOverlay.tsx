'use client';

import React from 'react';
import { EpisodeChoice, Episode } from '@fatafati/common';
import { PathCard } from './PathCard';
import { Sparkles, GitFork, RotateCcw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ChoiceCardsOverlayProps {
  episode: Episode;
  onSelectChoice: (choice: EpisodeChoice) => void;
  onRewatch: () => void;
  seriesId: string;
}

export function ChoiceCardsOverlay({
  episode,
  onSelectChoice,
  onRewatch,
  seriesId,
}: ChoiceCardsOverlayProps) {
  const hasChoices = episode.choices && episode.choices.length > 0;

  return (
    <div
      style={{
        marginTop: '28px',
        padding: '28px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(17, 19, 28, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 240, 255, 0.15)',
        animation: 'cardMaterialize 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: hasChoices
                ? 'linear-gradient(135deg, #00f0ff, #a855f7)'
                : 'linear-gradient(135deg, #10b981, #00f0ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {hasChoices ? (
              <GitFork size={18} color="#07070a" strokeWidth={2.5} />
            ) : (
              <CheckCircle2 size={18} color="#07070a" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>
              {hasChoices ? 'What Happens Next?' : 'Story Branch Completed'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {hasChoices
                ? 'Choose your path to unlock the next episode in your story journey.'
                : 'You have reached a divergent ending. Explore other paths or pitch a twist below!'}
            </p>
          </div>
        </div>

        <button
          onClick={onRewatch}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-primary)',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          <RotateCcw size={14} />
          <span>Rewatch Episode</span>
        </button>
      </div>

      {/* Choice Grid or Ending Banner */}
      {hasChoices ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {episode.choices.map((choice, idx) => (
            <PathCard
              key={choice.id}
              choice={choice}
              index={idx}
              onSelect={onSelectChoice}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 16px',
            background: 'rgba(24, 27, 40, 0.5)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
          }}
        >
          <Sparkles size={36} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>
            Congratulations, You Reached an Ending!
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 20px auto' }}>
            Your unique journey has concluded. Want to see how the other choices played out?
          </p>
          <Link
            href={`/series/${seriesId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #00f0ff, #a855f7)',
              color: '#07070a',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            <GitFork size={16} />
            <span>Explore Alternate Branches</span>
          </Link>
        </div>
      )}
    </div>
  );
}
