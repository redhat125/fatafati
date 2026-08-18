'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useSession } from '../../hooks/useSession';

export default function ProfilePage() {
  const { authorName, setAuthorName } = useSession();
  const [tempName, setTempName] = useState(authorName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setAuthorName(tempName.trim());
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Your Profile</h1>
      
      <div
        style={{
          background: 'var(--bg-card)',
          border: 'var(--border-glass)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          maxWidth: '500px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(168, 85, 247, 0.15))',
              border: '2px solid rgba(0, 240, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            {authorName && authorName !== 'Anonymous Creator'
              ? authorName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : <User size={36} />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>{authorName}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Fatafati Creator</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Display Name
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
              color: '#000',
              border: 'none',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
