import { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/storyService';
import { getRepository } from '../db';
import { Series, Episode, EpisodeChoice } from '@fatafati/common';

const storyService = new StoryService(getRepository());

export async function upsertSeries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const seriesData: Series = req.body;
    const series = await storyService.upsertSeries(seriesData);
    res.json({ success: true, data: series });
  } catch (error) {
    next(error);
  }
}

export async function upsertEpisode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const episodeData: Episode = req.body;
    const episode = await storyService.upsertEpisode(episodeData);
    res.json({ success: true, data: episode });
  } catch (error) {
    next(error);
  }
}

export async function upsertChoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const choiceData: EpisodeChoice & { episodeId: string } = req.body;
    const choice = await storyService.upsertEpisodeChoice(choiceData);
    res.json({ success: true, data: choice });
  } catch (error) {
    next(error);
  }
}

export async function deleteSeries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await storyService.deleteSeries(id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function deleteEpisode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await storyService.deleteEpisode(id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function deleteChoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await storyService.deleteEpisodeChoice(id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
