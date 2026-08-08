'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Play } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  title: string;
  episodeNumber: number;
  choicePrompt?: string | null;
}

interface BranchTimelineProps {
  seriesTitle: string;
  seriesId: string;
  breadcrumbs: BreadcrumbItem[];
  currentEpisodeId: string;
}

export function BranchTimeline({
  seriesTitle,
  seriesId,
  breadcrumbs,
  currentEpisodeId,
}: BranchTimelineProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        padding: '12px 16px',
        marginBottom: '20px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(17, 19, 28, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.85rem',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-muted)',
          transition: 'color 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        <Home size={14} />
      </Link>

      <ChevronRight size={14} color="var(--text-muted)" />

      <Link
        href={`/series/${seriesId}`}
        style={{
          color: 'var(--text-secondary)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {seriesTitle}
      </Link>

      {breadcrumbs.map((crumb, idx) => {
        const isCurrent = crumb.id === currentEpisodeId;
        return (
          <React.Fragment key={crumb.id}>
            <ChevronRight size={14} color="var(--text-muted)" />
            <Link
              href={`/watch/${crumb.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? '#00f0ff' : 'var(--text-secondary)',
                background: isCurrent ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                border: isCurrent ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
              }}
            >
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCurrent ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
                  color: isCurrent ? '#000' : '#fff',
                  fontWeight: 800,
                }}
              >
                {crumb.episodeNumber}
              </span>
              <span>{crumb.title}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
}
