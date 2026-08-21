import React from 'react';
import Link from 'next/link';
import { Sparkles, GitFork, Video, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: 'var(--border-glass)',
        background: 'rgba(7, 7, 10, 0.95)',
        padding: '48px 0 32px 0',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '32px',
            paddingBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ maxWidth: '360px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} color="#07070a" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
                PlotPlay
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The interactive micro-story platform where viewers direct the narrative and community ideas become canonical episodes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', marginBottom: '14px' }}>
                Explore
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li><Link href="/?genre=reality-show">Reality</Link></li>
                <li><Link href="/?genre=cyberpunk">Cyberpunk</Link></li>
                <li><Link href="/?genre=horror">Horror</Link></li>
                <li><Link href="/?genre=space">Space</Link></li>
                <li><Link href="/?genre=thriller">Thriller</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-purple)', marginBottom: '14px' }}>
                Contact Us
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li><Link href="mailto:[EMAIL_ADDRESS]">[EMAIL_ADDRESS]</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '24px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <p>© 2026 PlotPlay. All branching narratives preserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Engineered for next-gen interactive storytelling</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
