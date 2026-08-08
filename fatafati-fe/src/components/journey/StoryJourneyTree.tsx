'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StoryGraph, StoryGraphNode } from '@fatafati/common';
import { GitFork, Sparkles, CheckCircle, CircleDot } from 'lucide-react';
import { api } from '../../services/apiClient';

interface StoryJourneyTreeProps {
  seriesId: string;
  currentEpisodeId: string;
}

export function StoryJourneyTree({ seriesId, currentEpisodeId }: StoryJourneyTreeProps) {
  const [graph, setGraph] = useState<StoryGraph | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadGraph() {
      try {
        const data = await api.getStoryGraph(seriesId, currentEpisodeId);
        setGraph(data);
      } catch (err) {
        console.error('Failed to load story graph:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadGraph();
  }, [seriesId, currentEpisodeId]);

  if (isLoading || !graph) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading story map...
      </div>
    );
  }

  // Group nodes by episode depth
  const levels = new Map<number, StoryGraphNode[]>();
  for (const node of graph.nodes) {
    const arr = levels.get(node.episodeNumber) || [];
    arr.push(node);
    levels.set(node.episodeNumber, arr);
  }

  const sortedLevels = Array.from(levels.entries()).sort(([a], [b]) => a - b);

  return (
    <section
      id="story-journey-map"
      style={{
        padding: '24px 20px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(17, 19, 28, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginTop: '32px',
        scrollMarginTop: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitFork size={18} color="#00f0ff" />
          <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Interactive Story Map</h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {graph.nodes.length} Episodes • Branching DAG
        </span>
      </div>

      {/* Visual DAG Levels with Mobile Touch Horizontal Swipe */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative',
        }}
      >
        {sortedLevels.map(([depth, nodes]) => (
          <div key={depth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Episode Depth {depth} {depth === 1 ? '(Prologue / Root)' : ''}
            </div>

            <div
              className="no-scrollbar"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '4px',
              }}
            >
              {nodes.map((node) => {
                const isCurrent = node.id === currentEpisodeId;
                return (
                  <Link
                    key={node.id}
                    href={`/watch/${node.id}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: isCurrent
                        ? 'rgba(0, 240, 255, 0.12)'
                        : node.isLeaf
                        ? 'rgba(236, 72, 153, 0.08)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: isCurrent
                        ? '1px solid #00f0ff'
                        : node.isLeaf
                        ? '1px solid rgba(236, 72, 153, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isCurrent ? '0 0 20px rgba(0, 240, 255, 0.3)' : 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      minWidth: '200px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: isCurrent ? '#00f0ff' : node.isLeaf ? '#ec4899' : '#a855f7',
                        }}
                      >
                        {node.isLeaf ? '✨ Ending Branch' : `Episode ${node.episodeNumber}`}
                      </span>

                      {isCurrent && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: '#00f0ff',
                            color: '#07070a',
                          }}
                        >
                          YOU ARE HERE
                        </span>
                      )}
                    </div>

                    <h5 style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 600 }}>
                      {node.title}
                    </h5>

                    {node.choiceTextLeadingHere && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        &ldquo;{node.choiceTextLeadingHere}&rdquo;
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
