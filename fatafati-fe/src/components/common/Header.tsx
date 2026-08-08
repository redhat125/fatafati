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
        borderBottom: 'var(--border-glass)',
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
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 30%, #00f0ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FataFati
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#a855f7',
                marginLeft: '6px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Interactive AI
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
            href="/series/cyberpunk-2099"
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
                placeholder="Your Creator Name"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
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
              title="Click to change your alias"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f0ff, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={12} color="#000" />
              </div>
              <span>{authorName}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
