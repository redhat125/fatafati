'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Film, Compass, GitFork, User, Search, Play } from 'lucide-react';
import { useSession } from '../../hooks/useSession';

export function Header() {
  const { authorName, setAuthorName } = useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setAuthorName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 'var(--header-height)',
        background: 'rgba(7, 7, 10, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '2px solid var(--accent-cyan)',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)',
            }}
          >
            <Sparkles size={22} color="#07070a" strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              className="text-cyber-glow"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #00f0ff 30%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PlotPlay
            </span>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', paddingLeft: '2px' }}>
              you are the <span style={{ color: 'var(--accent-magenta)', fontWeight: 700 }}>director</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links (Desktop Only) */}
        <nav
          className="desktop-only"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              transition: 'color 0.2s',
            }}
          >
            <Compass size={16} color="#00f0ff" />
            Discover
          </Link>
          <Link
            href="/series/ai-boss"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
          >
            <Play size={16} color="#a855f7" />
            Featured Series
          </Link>
        </nav>

        {/* User Alias / Anonymous Session Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isEditingName ? (
            <form onSubmit={handleNameSubmit} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Name"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                  width: '100px',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--accent-cyan)',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                Save
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTempName(authorName);
                setIsEditingName(true);
              }}
              title={authorName === 'Anonymous Creator' ? 'Click to set alias' : `Change alias (${authorName})`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(168, 85, 247, 0.15))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 240, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {authorName && authorName !== 'Anonymous Creator'
                ? authorName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : <User size={18} />}
            </button>
          )}
        </div>
      </div>
      {/* Decorative cyber track at the bottom of header */}
      <div style={{ position: 'absolute', bottom: -2, left: '20px', display: 'flex', gap: '4px', opacity: 0.8 }}>
        <div style={{ width: '40px', height: '2px', background: '#ec4899' }} />
        <div style={{ width: '15px', height: '2px', background: '#ec4899' }} />
        <div style={{ width: '8px', height: '2px', background: '#ec4899' }} />
      </div>
    </header>
  );
}
