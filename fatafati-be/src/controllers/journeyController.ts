import { Request, Response, NextFunction } from 'express';
import { UpdateJourneySchema, ApiResponse, UserJourney } from '@fatafati/common';
import { JourneyService } from '../services/journeyService';
import { getRepository } from '../db';

const journeyService = new JourneyService(getRepository());

export async function getJourney(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { seriesId } = req.params;
    const sessionId = (req.query.sessionId as string) || req.sessionId;

    if (!sessionId) {
      res.status(400).json({ success: false, error: 'Session ID is required' });
      return;
    }

    const journey = await journeyService.getJourney(sessionId, seriesId);
    const response: ApiResponse<UserJourney | null> = {
      success: true,
      data: journey,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateJourney(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = {
      ...req.body,
      sessionId: req.body.sessionId || req.sessionId,
    };

    const validated = UpdateJourneySchema.parse(body);
    const journey = await journeyService.updateJourney(
      validated.sessionId,
      validated.seriesId,
      validated.episodeId
    );

    const response: ApiResponse<UserJourney> = {
      success: true,
      data: journey,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}
