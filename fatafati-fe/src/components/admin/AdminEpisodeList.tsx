'use client';

import React from 'react';
import { Episode } from '@fatafati/common';
import { PlayCircle, GitCommit, FileVideo } from 'lucide-react';

interface AdminEpisodeListProps {
  episodes: Episode[];
  selectedEpisodeId: string | null;
  onSelect: (id: string) => void;
  onNewEpisode: () => void;
}

export function AdminEpisodeList({ episodes, selectedEpisodeId, onSelect, onNewEpisode }: AdminEpisodeListProps) {
  // Sort episodes by depth, then by creation date
  const sortedEpisodes = [...episodes].sort((a, b) => {
    if (a.episodeNumber !== b.episodeNumber) {
      return a.episodeNumber - b.episodeNumber;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="cyber-panel" style={{ background: 'rgba(10, 15, 25, 0.8)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="text-cyber-glow" style={{ margin: 0, color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileVideo size={20} color="#00f0ff" /> Episodes
        </h3>
        <button 
          onClick={onNewEpisode}
          className="cyber-btn"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          + New
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {sortedEpisodes.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
            No episodes yet. Create the root episode first.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sortedEpisodes.map(ep => {
              const isSelected = selectedEpisodeId === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => onSelect(ep.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px',
                    background: isSelected ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                    border: isSelected ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
                    borderLeft: `4px solid ${isSelected ? '#00f0ff' : 'transparent'}`,
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderRadius: '0 4px 4px 0'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '24px', opacity: 0.7 }}>
                    {ep.episodeNumber === 1 ? <PlayCircle size={20} color="#a855f7" /> : <GitCommit size={18} color="#00f0ff" />}
                    <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>D{ep.episodeNumber}</span>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ep.title || 'Untitled Episode'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>{ep.videoStatus}</span>
                      {ep.isLeaf && <span style={{ color: '#ec4899' }}>Leaf</span>}
                      {ep.isSeriesFinale && <span style={{ color: '#f59e0b' }}>Finale</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
