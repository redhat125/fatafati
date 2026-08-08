import { 
  Series, 
  Episode, 
  Comment, 
  CommentVote, 
  UserJourney, 
  SeriesGenre, 
  SortOption 
} from '@fatafati/common';
import { IStoryRepository } from './repository';
import { INITIAL_SERIES, INITIAL_EPISODES, INITIAL_COMMENTS } from './seedData';

export class MemoryStoryRepository implements IStoryRepository {
  private series: Map<string, Series> = new Map();
  private episodes: Map<string, Episode> = new Map();
  private comments: Map<string, Comment> = new Map();
  private votes: Map<string, CommentVote> = new Map(); // key: `${commentId}_${sessionId}`
  private journeys: Map<string, UserJourney> = new Map(); // key: `${sessionId}_${seriesId}`

  constructor() {
    this.seed();
  }

  public seed(): void {
    this.series.clear();
    this.episodes.clear();
    this.comments.clear();
    this.votes.clear();
    this.journeys.clear();

    for (const s of INITIAL_SERIES) {
      this.series.set(s.id, JSON.parse(JSON.stringify(s)));
    }
    for (const ep of INITIAL_EPISODES) {
      this.episodes.set(ep.id, JSON.parse(JSON.stringify(ep)));
    }
    for (const c of INITIAL_COMMENTS) {
      this.comments.set(c.id, JSON.parse(JSON.stringify(c)));
    }
  }

  async getAllSeries(filter?: { genre?: SeriesGenre; sort?: SortOption; search?: string }): Promise<Series[]> {
    let result = Array.from(this.series.values());

    if (filter?.genre && filter.genre !== 'all') {
      result = result.filter((s) => s.genre.toLowerCase() === filter.genre?.toLowerCase());
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const sort = filter?.sort || 'trending';
    switch (sort) {
      case 'trending':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'most_branched':
        result.sort((a, b) => b.totalPaths - a.totalPaths);
        break;
      case 'top_rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }

  async getSeriesById(id: string): Promise<Series | null> {
    const s = this.series.get(id);
    return s ? JSON.parse(JSON.stringify(s)) : null;
  }

  async getEpisodeById(id: string): Promise<Episode | null> {
    const ep = this.episodes.get(id);
    return ep ? JSON.parse(JSON.stringify(ep)) : null;
  }

  async getEpisodesBySeriesId(seriesId: string): Promise<Episode[]> {
    const eps = Array.from(this.episodes.values()).filter((ep) => ep.seriesId === seriesId);
    return JSON.parse(JSON.stringify(eps));
  }

  async incrementEpisodeView(id: string): Promise<void> {
    const ep = this.episodes.get(id);
    if (ep) {
      ep.viewCount += 1;
      const s = this.series.get(ep.seriesId);
      if (s) {
        s.viewCount += 1;
      }
    }
  }

  async recordChoicePick(choiceId: string): Promise<void> {
    for (const ep of this.episodes.values()) {
      const choice = ep.choices.find((c) => c.id === choiceId);
      if (choice) {
        choice.pickCount += 1;
        const total = ep.choices.reduce((sum, c) => sum + c.pickCount, 0);
        for (const c of ep.choices) {
          c.pickPercentage = total > 0 ? Math.round((c.pickCount / total) * 100) : 0;
        }
        break;
      }
    }
  }

  async getCommentsByEpisodeId(episodeId: string, sessionId?: string): Promise<Comment[]> {
    const list = Array.from(this.comments.values())
      .filter((c) => c.episodeId === episodeId)
      .sort((a, b) => b.score - a.score || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list.map((c) => {
      const copy: Comment = JSON.parse(JSON.stringify(c));
      if (sessionId) {
        const vote = this.votes.get(`${c.id}_${sessionId}`);
        copy.userVote = vote ? vote.voteType : null;
      }
      return copy;
    });
  }

  async createComment(commentData: Omit<Comment, 'id' | 'upvotes' | 'downvotes' | 'score' | 'isPicked' | 'createdAt'>): Promise<Comment> {
    const id = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const comment: Comment = {
      ...commentData,
      id,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      isPicked: false,
      createdAt: new Date().toISOString(),
    };
    this.comments.set(id, comment);
    return JSON.parse(JSON.stringify(comment));
  }

  async voteComment(commentId: string, sessionId: string, voteType: 'up' | 'down'): Promise<{ comment: Comment; userVote: 'up' | 'down' | null }> {
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new Error(`Comment with ID ${commentId} not found`);
    }

    const voteKey = `${commentId}_${sessionId}`;
    const existingVote = this.votes.get(voteKey);

    let finalUserVote: 'up' | 'down' | null = voteType;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Toggle off: remove existing vote
        if (voteType === 'up') comment.upvotes = Math.max(0, comment.upvotes - 1);
        if (voteType === 'down') comment.downvotes = Math.max(0, comment.downvotes - 1);
        this.votes.delete(voteKey);
        finalUserVote = null;
      } else {
        // Switch vote: up -> down or down -> up
        if (existingVote.voteType === 'up') {
          comment.upvotes = Math.max(0, comment.upvotes - 1);
          comment.downvotes += 1;
        } else {
          comment.downvotes = Math.max(0, comment.downvotes - 1);
          comment.upvotes += 1;
        }
        existingVote.voteType = voteType;
        finalUserVote = voteType;
      }
    } else {
      // New vote
      if (voteType === 'up') comment.upvotes += 1;
      if (voteType === 'down') comment.downvotes += 1;
      this.votes.set(voteKey, {
        commentId,
        sessionId,
        voteType,
        createdAt: new Date().toISOString(),
      });
      finalUserVote = voteType;
    }

    comment.score = comment.upvotes - comment.downvotes;
    return {
      comment: JSON.parse(JSON.stringify(comment)),
      userVote: finalUserVote,
    };
  }

  async getUserJourney(sessionId: string, seriesId: string): Promise<UserJourney | null> {
    const journey = this.journeys.get(`${sessionId}_${seriesId}`);
    return journey ? JSON.parse(JSON.stringify(journey)) : null;
  }

  async saveUserJourney(sessionId: string, seriesId: string, episodeId: string): Promise<UserJourney> {
    const key = `${sessionId}_${seriesId}`;
    let journey = this.journeys.get(key);

    if (!journey) {
      journey = {
        id: `journey_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sessionId,
        seriesId,
        pathEpisodeIds: [episodeId],
        currentEpisodeId: episodeId,
        updatedAt: new Date().toISOString(),
      };
    } else {
      if (!journey.pathEpisodeIds.includes(episodeId)) {
        journey.pathEpisodeIds.push(episodeId);
      }
      journey.currentEpisodeId = episodeId;
      journey.updatedAt = new Date().toISOString();
    }

    this.journeys.set(key, JSON.parse(JSON.stringify(journey)));
    return JSON.parse(JSON.stringify(journey));
  }
}
