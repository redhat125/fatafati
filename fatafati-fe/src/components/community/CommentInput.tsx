'use client';

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useSession } from '../../hooks/useSession';

interface CommentInputProps {
  onSubmit: (text: string, authorName?: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export function CommentInput({ onSubmit, isSubmitting }: CommentInputProps) {
  const { authorName } = useSession();
  const [text, setText] = useState('');
  const maxLength = 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    const success = await onSubmit(text, authorName);
    if (success) {
      setText('');
    }
  };

  const remaining = maxLength - text.length;

  return (
    <form
      className="cyber-panel"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '18px 20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#00f0ff" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
            Pitch Next Episode Twist
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Posting as <strong style={{ color: '#00f0ff' }}>{authorName}</strong>
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What do you desire to happen next in this story? (e.g. 'She discovers a hidden map inside the reactor core')"
        maxLength={maxLength}
        rows={3}
        style={{
          width: '100%',
          background: 'rgba(11, 12, 18, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          color: '#fff',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          resize: 'none',
          outline: 'none',
          fontFamily: 'inherit',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 240, 255, 0.5)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '0.78rem',
            color: remaining < 20 ? '#ef4444' : 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {remaining} characters left
        </span>

        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className={!text.trim() || isSubmitting ? '' : 'cyber-btn'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: !text.trim() || isSubmitting
              ? 'rgba(255, 255, 255, 0.1)'
              : undefined,
            color: !text.trim() || isSubmitting ? 'var(--text-muted)' : '#fff',
            fontSize: '0.82rem',
            fontWeight: 700,
            border: !text.trim() || isSubmitting ? 'none' : undefined,
            borderRadius: !text.trim() || isSubmitting ? 'var(--radius-sm)' : undefined,
            cursor: !text.trim() || isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          <Send size={14} />
          <span>{isSubmitting ? 'Submitting...' : 'Pitch Twist'}</span>
        </button>
      </div>
    </form>
  );
}
