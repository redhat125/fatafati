'use client';

import React from 'react';
import { useCommunityVoice } from '../../hooks/useCommunityVoice';
import { CommentInput } from './CommentInput';
import { UpvoteCounter } from './UpvoteCounter';
import { MessageSquarePlus, Sparkles, Award, User } from 'lucide-react';

interface CommunityVoiceProps {
  episodeId: string;
}

export function CommunityVoice({ episodeId }: CommunityVoiceProps) {
  const { comments, isLoading, isSubmitting, submitIdea, vote } = useCommunityVoice(episodeId);

  return (
    <section
      id="writers-room-section"
      style={{
        marginTop: '36px',
        padding: '24px 20px',
        borderRadius: 'var(--radius-lg)',
        background: 'transparent',
        border: 'none',
        scrollMarginTop: '80px',
      }}
    >
      {/* Title Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ec4899, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquarePlus size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Community Writers Room</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Upvoted suggestions inspire the next AI-generated story branches!
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {comments.length} suggestions
        </span>
      </div>

      {/* Pitch Form */}
      <div style={{ marginBottom: '28px' }}>
        <CommentInput onSubmit={submitIdea} isSubmitting={isSubmitting} />
      </div>

      {/* Ideas List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
            Loading community ideas...
          </div>
        ) : comments.length === 0 ? (
          <div
            className="cyber-panel"
            style={{
              textAlign: 'center',
              padding: '36px 16px',
            }}
          >
            <Sparkles size={28} color="#a855f7" style={{ margin: '0 auto 8px auto' }} />
            <h5 style={{ color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>
              Be the first to shape this branch!
            </h5>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Pitch your storyline idea above to get community votes.
            </p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const isTopRanked = index === 0 && comment.score > 0;
            return (
              <div
                key={comment.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '18px 20px',
                  borderRadius: 0,
                  clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                  background: isTopRanked
                    ? 'rgba(0, 240, 255, 0.05)'
                    : 'rgba(24, 27, 40, 0.5)',
                  border: isTopRanked
                    ? '2px solid rgba(0, 240, 255, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isTopRanked ? '0 0 20px rgba(0, 240, 255, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Author row & badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <User size={12} color="#fff" />
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                      {comment.authorName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      • {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {comment.isPicked && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#10b981',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Award size={12} />
                        Canonized Episode
                      </span>
                    )}

                    {isTopRanked && !comment.isPicked && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(0, 240, 255, 0.15)',
                          border: '1px solid rgba(0, 240, 255, 0.4)',
                          color: '#00f0ff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Sparkles size={12} />
                        #1 Top Community Pitch
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment Text */}
                <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {comment.text}
                </p>

                {/* Footer / Upvotes */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <UpvoteCounter
                    score={comment.score}
                    upvotes={comment.upvotes}
                    downvotes={comment.downvotes}
                    userVote={comment.userVote}
                    onVote={(voteType) => vote(comment.id, voteType)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
