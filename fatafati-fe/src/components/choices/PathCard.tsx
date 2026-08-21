'use client';

import React from 'react';
import { EpisodeChoice } from '@fatafati/common';

interface PathCardProps {
  choice: EpisodeChoice;
  onSelect: (choice: EpisodeChoice) => void;
  index: number;
  videoStatus?: 'ready' | 'generating' | 'scheduled';
}

export function PathCard({ choice, onSelect, index, videoStatus = 'ready' }: PathCardProps) {
  const letters = ['A', 'B', 'C', 'D'];
  // Fallback to the first word of the text if label is missing
  const label = choice.label || choice.text.split(' ')[0] || `Option ${index + 1}`;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(choice);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      style={{
        background: 'rgba(10, 25, 40, 0.7)',
        border: '2px solid #00f0ff',
        padding: '14px 40px',
        color: '#fff',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
        transition: 'all 0.2s',
        boxShadow: '0 0 15px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        letterSpacing: '1px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.25)';
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.5), inset 0 0 15px rgba(0, 240, 255, 0.4)';
        e.currentTarget.style.textShadow = '0 0 8px #fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(10, 25, 40, 0.7)';
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.1)';
        e.currentTarget.style.textShadow = 'none';
      }}
    >
      <span>{letters[index] || '•'}. {label}</span>
      {videoStatus === 'generating' && (
        <span style={{
          fontSize: '0.8rem',
          color: '#f0f',
          animation: 'pulse 1s infinite',
          border: '1px solid rgba(255, 0, 255, 0.5)',
          padding: '2px 8px',
          background: 'rgba(255, 0, 255, 0.1)',
          clipPath: 'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
        }}>
          [RENDERING]
        </span>
      )}
    </button>
  );
}
