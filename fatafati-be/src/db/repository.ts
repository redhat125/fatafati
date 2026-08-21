import { 
  Series, 
  Episode, 
  Comment, 
  CommentVote, 
  UserJourney, 
  SeriesGenre, 
  SortOption 
} from '@fatafati/common';

export interface IStoryRepository {
  // Series
  getAllSeries(filter?: { genre?: SeriesGenre; sort?: SortOption; search?: string }): Promise<Series[]>;
  getSeriesById(id: string): Promise<Series | null>;

  // Episodes
  getEpisodeById(id: string): Promise<Episode | null>;
  getEpisodesBySeriesId(seriesId: string): Promise<Episode[]>;
  incrementEpisodeView(id: string): Promise<void>;
  recordChoicePick(choiceId: string): Promise<void>;

  // Comments
  getCommentsByEpisodeId(episodeId: string, sessionId?: string): Promise<Comment[]>;
  createComment(comment: Omit<Comment, 'id' | 'upvotes' | 'downvotes' | 'score' | 'isPicked' | 'createdAt'>): Promise<Comment>;
  voteComment(commentId: string, sessionId: string, voteType: 'up' | 'down'): Promise<{ comment: Comment; userVote: 'up' | 'down' | null }>;

  // Journeys & Choices
  getUserJourney(sessionId: string, seriesId: string): Promise<UserJourney | null>;
  saveUserJourney(sessionId: string, seriesId: string, episodeId: string): Promise<UserJourney>;
  recordUserChoice(sessionId: string, episodeId: string, choiceId: string): Promise<void>;

  // Admin Operations
  upsertSeries(series: Series): Promise<Series>;
  upsertEpisode(episode: Episode): Promise<Episode>;
  upsertEpisodeChoice(choice: import('@fatafati/common').EpisodeChoice & { episodeId: string }): Promise<import('@fatafati/common').EpisodeChoice>;
  deleteEpisode(id: string): Promise<void>;
  deleteSeries(id: string): Promise<void>;
  deleteEpisodeChoice(id: string): Promise<void>;
}
