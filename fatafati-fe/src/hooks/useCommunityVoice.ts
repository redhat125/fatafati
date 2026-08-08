'use client';

import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@fatafati/common';
import { api } from '../services/apiClient';
import confetti from 'canvas-confetti';

export function useCommunityVoice(episodeId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!episodeId) return;
    setIsLoading(true);
    try {
      const data = await api.getComments(episodeId);
      setComments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [episodeId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitIdea = async (text: string, authorName?: string): Promise<boolean> => {
    if (!text.trim() || isSubmitting) return false;
    setIsSubmitting(true);
    setError(null);

    try {
      const newComment = await api.createComment(episodeId, text.trim(), authorName);
      setComments((prev) => [newComment, ...prev]);

      // Trigger celebratory mini-confetti for submitting a creative idea!
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00f0ff', '#a855f7', '#ec4899'],
        });
      } catch (e) {
        // Ignore in environments without canvas
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to post storyline idea');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const vote = async (commentId: string, voteType: 'up' | 'down') => {
    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;

        let newUp = c.upvotes;
        let newDown = c.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        if (c.userVote === voteType) {
          // Toggle off
          if (voteType === 'up') newUp = Math.max(0, newUp - 1);
          if (voteType === 'down') newDown = Math.max(0, newDown - 1);
          newUserVote = null;
        } else if (c.userVote) {
          // Switch vote
          if (voteType === 'up') {
            newUp += 1;
            newDown = Math.max(0, newDown - 1);
          } else {
            newDown += 1;
            newUp = Math.max(0, newUp - 1);
          }
        } else {
          // New vote
          if (voteType === 'up') newUp += 1;
          if (voteType === 'down') newDown += 1;
        }

        return {
          ...c,
          upvotes: newUp,
          downvotes: newDown,
          score: newUp - newDown,
          userVote: newUserVote,
        };
      })
    );

    try {
      const result = await api.voteComment(commentId, voteType);
      // Sync with server result
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...result.comment, userVote: result.userVote } : c))
      );
    } catch (err: any) {
      console.error('Failed to sync vote with server:', err);
      // Re-fetch to recover consistent state
      fetchComments();
    }
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    error,
    submitIdea,
    vote,
    refresh: fetchComments,
  };
}
