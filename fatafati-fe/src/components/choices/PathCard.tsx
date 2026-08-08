'use client';

import React, { useState } from 'react';
import { EpisodeChoice } from '@fatafati/common';
import { ArrowRight, Sparkles, Users } from 'lucide-react';

interface PathCardProps {
  choice: EpisodeChoice;
  onSelect: (choice: EpisodeChoice) => void;
  index: number;
}

export function PathCard({ choice, onSelect, index }: PathCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colors = [
    { border: 'rgba(0, 240, 255, 0.5)', glow: 'rgba(0, 240, 255, 0.25)', accent: '#00f0ff' },
    { border: 'rgba(168, 85, 247, 0.5)', glow: 'rgba(168, 85, 247, 0.25)', accent: '#a855f7' },
    { border: 'rgba(236, 72, 153, 0.5)', glow: 'rgba(236, 72, 153, 0.25)', accent: '#ec4899' },
    { border: 'rgba(245, 158, 11, 0.5)', glow: 'rgba(245, 158, 11, 0.25)', accent: '#f59e0b' },
  ];

  const theme = colors[index % colors.length];

  return (
    <button
      onClick={() => onSelect(choice)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        width: '100%',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        background: isHovered ? 'rgba(24, 27, 40, 0.95)' : 'rgba(17, 19, 28, 0.85)',
        border: isHovered ? `1px solid ${theme.accent}` : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isHovered ? `0 12px 30px rgba(0,0,0,0.6), 0 0 25px ${theme.glow}` : '0 4px 16px rgba(0,0,0,0.4)',
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Choice Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: theme.accent,
            padding: '3px 8px',
            borderRadius: '6px',
            background: `${theme.glow}`,
          }}
        >
          {choice.label || `Path ${index + 1}`}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Users size={13} color={theme.accent} />
          <span>{choice.pickPercentage}% chose this</span>
        </div>
      </div>

      {/* Choice Text */}
      <h4
        style={{
          fontSize: '1.05rem',
          lineHeight: 1.4,
          color: isHovered ? '#fff' : 'var(--text-primary)',
          marginBottom: '8px',
          fontWeight: 700,
        }}
      >
        {choice.text}
      </h4>

      {choice.description && (
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
          {choice.description}
        </p>
      )}

      {/* Progress Bar showing community distribution */}
      <div
        style={{
          width: '100%',
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          marginTop: 'auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${choice.pickPercentage}%`,
            background: `linear-gradient(90deg, ${theme.accent}, #fff)`,
            borderRadius: '2px',
          }}
        />
      </div>

      {/* Action Arrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: theme.accent,
          marginTop: '12px',
        }}
      >
        <span>Watch this branch</span>
        <ArrowRight size={14} style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
      </div>
    </button>
  );
}
