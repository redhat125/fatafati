import { Request, Response, NextFunction } from 'express';
import { SeriesQuerySchema, ApiResponse, Series, StoryGraph } from '@fatafati/common';
import { StoryService } from '../services/storyService';
import { getRepository } from '../db';

const storyService = new StoryService(getRepository());

export async function listSeries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = SeriesQuerySchema.parse(req.query);
    const seriesList = await storyService.getAllSeries(query);
    const response: ApiResponse<Series[]> = {
      success: true,
      data: seriesList,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getSeriesById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const series = await storyService.getSeriesById(id);
    if (!series) {
      res.status(404).json({ success: false, error: 'Series not found' });
      return;
    }
    const response: ApiResponse<Series> = {
      success: true,
      data: series,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getStoryGraph(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const currentEpisodeId = req.query.currentEpisodeId as string | undefined;
    const userTraversedIds = req.query.traversed ? (req.query.traversed as string).split(',') : [];

    const graph = await storyService.getStoryGraph(id, currentEpisodeId, userTraversedIds);
    if (!graph) {
      res.status(404).json({ success: false, error: 'Series not found' });
      return;
    }

    const response: ApiResponse<StoryGraph> = {
      success: true,
      data: graph,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}
