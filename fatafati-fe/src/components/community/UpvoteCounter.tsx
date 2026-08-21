'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface UpvoteCounterProps {
  score: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  onVote: (voteType: 'up' | 'down') => void;
}

export function UpvoteCounter({
  score,
  upvotes,
  downvotes,
  userVote,
  onVote,
}: UpvoteCounterProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(0, 240, 255, 0.05)',
        padding: '4px 8px',
        borderRadius: 0,
        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
      }}
    >
      {/* Upvote Button */}
      <button
        onClick={() => onVote('up')}
        title="Upvote this twist idea"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '9999px',
          background: userVote === 'up' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
          color: userVote === 'up' ? '#00f0ff' : 'var(--text-secondary)',
          transition: 'all 0.2s ease',
        }}
      >
        <ThumbsUp size={14} fill={userVote === 'up' ? '#00f0ff' : 'none'} />
        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{upvotes}</span>
      </button>

      <span style={{ color: 'rgba(255, 255, 255, 0.15)', fontSize: '0.8rem' }}>•</span>

      {/* Downvote Button */}
      <button
        onClick={() => onVote('down')}
        title="Downvote"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '9999px',
          background: userVote === 'down' ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
          color: userVote === 'down' ? '#ec4899' : 'var(--text-muted)',
          transition: 'all 0.2s ease',
        }}
      >
        <ThumbsDown size={14} fill={userVote === 'down' ? '#ec4899' : 'none'} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{downvotes}</span>
      </button>
    </div>
  );
}
