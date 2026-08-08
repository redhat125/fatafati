import { Request, Response, NextFunction } from 'express';
import { CreateCommentSchema, VoteCommentSchema, ApiResponse, Comment } from '@fatafati/common';
import { CommentService } from '../services/commentService';
import { getRepository } from '../db';

const commentService = new CommentService(getRepository());

export async function getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { episodeId } = req.params;
    const sessionId = req.sessionId;

    const comments = await commentService.getEpisodeComments(episodeId, sessionId);
    const response: ApiResponse<Comment[]> = {
      success: true,
      data: comments,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { episodeId } = req.params;
    const body = {
      ...req.body,
      episodeId,
      sessionId: req.body.sessionId || req.sessionId,
    };

    const validated = CreateCommentSchema.parse(body);
    const comment = await commentService.postComment(validated);

    const response: ApiResponse<Comment> = {
      success: true,
      data: comment,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function voteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { commentId } = req.params;
    const body = {
      ...req.body,
      sessionId: req.body.sessionId || req.sessionId,
    };

    const validated = VoteCommentSchema.parse(body);
    const result = await commentService.vote(commentId, validated.sessionId, validated.voteType);

    const response: ApiResponse<{ comment: Comment; userVote: 'up' | 'down' | null }> = {
      success: true,
      data: result,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}
