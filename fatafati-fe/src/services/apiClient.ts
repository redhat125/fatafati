import { 
  Series, 
  Episode, 
  Comment, 
  StoryGraph, 
  UserJourney, 
  SeriesGenre, 
  SortOption, 
  ApiResponse,
  EpisodeChoice
} from '@fatafati/common';

const rawBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').trim().replace(/\/+$/, '');
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_render_session';
  let id = localStorage.getItem('fatafati_session_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('fatafati_session_id', id);
  }
  return id;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const sessionId = getSessionId();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('x-session-id', sessionId);

  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json: ApiResponse<T> = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || json.error || `HTTP Error ${res.status}`);
    }

    return json.data as T;
  } catch (error: any) {
    console.error(`❌ [API Error] ${options.method || 'GET'} ${path}:`, error.message);
    throw error;
  }
}

export const api = {
  // Series
  async getSeries(params?: { genre?: SeriesGenre; sort?: SortOption; search?: string }): Promise<Series[]> {
    const query = new URLSearchParams();
    if (params?.genre && params.genre !== 'all') query.set('genre', params.genre);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.search) query.set('search', params.search);

    const queryString = query.toString();
    return request<Series[]>(`/series${queryString ? `?${queryString}` : ''}`);
  },

  async getSeriesById(id: string): Promise<Series> {
    return request<Series>(`/series/${id}`);
  },

  async getStoryGraph(seriesId: string, currentEpisodeId?: string, traversed: string[] = []): Promise<StoryGraph> {
    const query = new URLSearchParams();
    if (currentEpisodeId) query.set('currentEpisodeId', currentEpisodeId);
    if (traversed.length > 0) query.set('traversed', traversed.join(','));

    const queryString = query.toString();
    return request<StoryGraph>(`/series/${seriesId}/tree${queryString ? `?${queryString}` : ''}`);
  },

  // Episode
  async getEpisode(id: string): Promise<{
    episode: Episode;
    series: Series;
    breadcrumbs: Array<{ id: string; title: string; episodeNumber: number; choicePrompt?: string | null }>;
  }> {
    return request<{
      episode: Episode;
      series: Series;
      breadcrumbs: Array<{ id: string; title: string; episodeNumber: number; choicePrompt?: string | null }>;
    }>(`/episodes/${id}`);
  },

  async choosePath(episodeId: string, choiceId: string): Promise<void> {
    await request<void>('/choices', {
      method: 'POST',
      body: JSON.stringify({ episodeId, choiceId }),
    });
  },

  // Comments / Community Voice
  async getComments(episodeId: string): Promise<Comment[]> {
    return request<Comment[]>(`/episodes/${episodeId}/comments`);
  },

  async createComment(episodeId: string, text: string, authorName?: string): Promise<Comment> {
    return request<Comment>(`/episodes/${episodeId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        authorName: authorName || 'Anonymous Creator',
      }),
    });
  },

  async voteComment(commentId: string, voteType: 'up' | 'down'): Promise<{ comment: Comment; userVote: 'up' | 'down' | null }> {
    return request<{ comment: Comment; userVote: 'up' | 'down' | null }>(`/comments/${commentId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  },

  // Journey
  async getJourney(seriesId: string): Promise<UserJourney | null> {
    return request<UserJourney | null>(`/journeys/${seriesId}`);
  },

  async saveJourney(seriesId: string, episodeId: string): Promise<UserJourney> {
    return request<UserJourney>('/journeys', {
      method: 'POST',
      body: JSON.stringify({ seriesId, episodeId }),
    });
  },

  // --- Admin ---
  async upsertSeries(series: Partial<Series>): Promise<Series> {
    return request<Series>('/admin/series', {
      method: 'PUT',
      body: JSON.stringify(series),
    });
  },

  async deleteSeries(id: string): Promise<void> {
    return request<void>(`/admin/series/${id}`, { method: 'DELETE' });
  },

  async upsertEpisode(episode: Partial<Episode>): Promise<Episode> {
    return request<Episode>('/admin/episodes', {
      method: 'PUT',
      body: JSON.stringify(episode),
    });
  },

  async deleteEpisode(id: string): Promise<void> {
    return request<void>(`/admin/episodes/${id}`, { method: 'DELETE' });
  },

  async upsertChoice(choice: Partial<EpisodeChoice> & { episodeId: string }): Promise<EpisodeChoice> {
    return request<EpisodeChoice>('/admin/choices', {
      method: 'PUT',
      body: JSON.stringify(choice),
    });
  },

  async deleteChoice(id: string): Promise<void> {
    return request<void>(`/admin/choices/${id}`, { method: 'DELETE' });
  },
};
