import { z } from 'zod';

export const CreateCommentSchema = z.object({
  episodeId: z.string().min(1, 'Episode ID is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  authorName: z.string().trim().min(2, 'Name must be at least 2 characters').max(30, 'Name cannot exceed 30 characters').default('Anonymous Creator'),
  text: z.string().trim().min(5, 'Your idea must be at least 5 characters').max(280, 'Your idea cannot exceed 280 characters'),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

export const VoteCommentSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  voteType: z.enum(['up', 'down']),
});

export type VoteCommentInput = z.infer<typeof VoteCommentSchema>;

export const UpdateJourneySchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  seriesId: z.string().min(1, 'Series ID is required'),
  episodeId: z.string().min(1, 'Episode ID is required'),
});

export type UpdateJourneyInput = z.infer<typeof UpdateJourneySchema>;

export const SeriesQuerySchema = z.object({
  genre: z.enum(['all', 'sci-fi', 'horror', 'cyberpunk', 'thriller', 'space', 'mystery', 'fantasy']).optional().default('all'),
  sort: z.enum(['trending', 'newest', 'most_branched', 'top_rated']).optional().default('trending'),
  search: z.string().optional(),
});

export type SeriesQueryInput = z.infer<typeof SeriesQuerySchema>;
