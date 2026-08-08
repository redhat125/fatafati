import { Comment } from '@fatafati/common';
import { IStoryRepository } from '../db';

export class CommentService {
  constructor(private repo: IStoryRepository) {}

  async getEpisodeComments(episodeId: string, sessionId?: string): Promise<Comment[]> {
    return this.repo.getCommentsByEpisodeId(episodeId, sessionId);
  }

  async postComment(data: {
    episodeId: string;
    sessionId: string;
    authorName: string;
    text: string;
  }): Promise<Comment> {
    return this.repo.createComment(data);
  }

  async vote(commentId: string, sessionId: string, voteType: 'up' | 'down'): Promise<{ comment: Comment; userVote: 'up' | 'down' | null }> {
    return this.repo.voteComment(commentId, sessionId, voteType);
  }
}
