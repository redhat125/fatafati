import { UserJourney } from '@fatafati/common';
import { IStoryRepository } from '../db';

export class JourneyService {
  constructor(private repo: IStoryRepository) {}

  async getJourney(sessionId: string, seriesId: string): Promise<UserJourney | null> {
    return this.repo.getUserJourney(sessionId, seriesId);
  }

  async updateJourney(sessionId: string, seriesId: string, episodeId: string): Promise<UserJourney> {
    return this.repo.saveUserJourney(sessionId, seriesId, episodeId);
  }
}
