import { Request, Response, NextFunction } from 'express';
import { ApiResponse, Episode, Series } from '@fatafati/common';
import { StoryService } from '../services/storyService';
import { getRepository } from '../db';

const storyService = new StoryService(getRepository());

export async function getEpisodeById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const sessionId = req.sessionId;

    const result = await storyService.getEpisode(id, sessionId);
    if (!result) {
      res.status(404).json({ success: false, error: 'Episode not found' });
      return;
    }

    const response: ApiResponse<{
      episode: Episode;
      series: Series;
      breadcrumbs: Array<{ id: string; title: string; episodeNumber: number; choicePrompt?: string | null }>;
    }> = {
      success: true,
      data: result,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function choosePath(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { choiceId } = req.body;
    if (!choiceId) {
      res.status(400).json({ success: false, error: 'choiceId is required' });
      return;
    }

    await storyService.choosePath(choiceId);
    res.json({ success: true, message: 'Choice recorded' });
  } catch (error) {
    next(error);
  }
}
