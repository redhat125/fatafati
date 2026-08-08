import { 
  Series, 
  Episode, 
  StoryGraph, 
  StoryGraphNode, 
  StoryGraphEdge, 
  SeriesGenre, 
  SortOption 
} from '@fatafati/common';
import { IStoryRepository } from '../db';

export class StoryService {
  constructor(private repo: IStoryRepository) {}

  async getAllSeries(filter?: { genre?: SeriesGenre; sort?: SortOption; search?: string }): Promise<Series[]> {
    return this.repo.getAllSeries(filter);
  }

  async getSeriesById(id: string): Promise<Series | null> {
    return this.repo.getSeriesById(id);
  }

  async getEpisode(id: string, sessionId?: string): Promise<{
    episode: Episode;
    series: Series;
    breadcrumbs: Array<{ id: string; title: string; episodeNumber: number; choicePrompt?: string | null }>;
  } | null> {
    const episode = await this.repo.getEpisodeById(id);
    if (!episode) return null;

    const series = await this.repo.getSeriesById(episode.seriesId);
    if (!series) return null;

    // Increment view count asynchronously
    this.repo.incrementEpisodeView(id).catch(console.error);

    // If session ID is provided, update user journey history
    if (sessionId) {
      this.repo.saveUserJourney(sessionId, series.id, episode.id).catch(console.error);
    }

    // Build breadcrumb trail back to root
    const allEpisodes = await this.repo.getEpisodesBySeriesId(series.id);
    const epMap = new Map<string, Episode>(allEpisodes.map((e) => [e.id, e]));

    const breadcrumbs: Array<{ id: string; title: string; episodeNumber: number; choicePrompt?: string | null }> = [];
    let curr: Episode | undefined = episode;

    while (curr) {
      breadcrumbs.unshift({
        id: curr.id,
        title: curr.title,
        episodeNumber: curr.episodeNumber,
        choicePrompt: curr.choicePromptLeadingHere,
      });
      curr = curr.parentEpisodeId ? epMap.get(curr.parentEpisodeId) : undefined;
    }

    return { episode, series, breadcrumbs };
  }

  async getStoryGraph(seriesId: string, currentEpisodeId?: string, userTraversedIds: string[] = []): Promise<StoryGraph | null> {
    const series = await this.repo.getSeriesById(seriesId);
    if (!series) return null;

    const episodes = await this.repo.getEpisodesBySeriesId(seriesId);
    const nodes: StoryGraphNode[] = [];
    const edges: StoryGraphEdge[] = [];

    for (const ep of episodes) {
      nodes.push({
        id: ep.id,
        title: ep.title,
        episodeNumber: ep.episodeNumber,
        choiceTextLeadingHere: ep.choicePromptLeadingHere || undefined,
        isLeaf: ep.isLeaf,
        isCurrent: currentEpisodeId === ep.id,
        isVisited: userTraversedIds.includes(ep.id),
        viewCount: ep.viewCount,
      });

      for (const choice of ep.choices) {
        edges.push({
          fromEpisodeId: ep.id,
          toEpisodeId: choice.targetEpisodeId,
          choiceText: choice.text,
          pickPercentage: choice.pickPercentage,
          isTraversed: userTraversedIds.includes(ep.id) && userTraversedIds.includes(choice.targetEpisodeId),
        });
      }
    }

    return {
      seriesId,
      rootEpisodeId: series.rootEpisodeId,
      nodes,
      edges,
    };
  }

  async choosePath(choiceId: string): Promise<void> {
    await this.repo.recordChoicePick(choiceId);
  }
}
