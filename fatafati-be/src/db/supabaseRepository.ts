import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Series, 
  Episode, 
  Comment, 
  UserJourney, 
  SeriesGenre, 
  SortOption 
} from '@fatafati/common';
import { IStoryRepository } from './repository';

export class SupabaseStoryRepository implements IStoryRepository {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  async getAllSeries(filter?: { genre?: SeriesGenre; sort?: SortOption; search?: string }): Promise<Series[]> {
    let query = this.client.from('series').select('*');

    if (filter?.genre && filter.genre !== 'all') {
      query = query.eq('genre', filter.genre);
    }

    if (filter?.search) {
      query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
    }

    const sort = filter?.sort || 'trending';
    switch (sort) {
      case 'trending':
        query = query.order('view_count', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'most_branched':
        query = query.order('total_paths', { ascending: false });
        break;
      case 'top_rated':
        query = query.order('rating', { ascending: false });
        break;
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      tagline: row.tagline,
      description: row.description,
      coverImage: row.cover_image,
      backdropImage: row.backdrop_image,
      previewVideoUrl: row.preview_video_url,
      genre: row.genre,
      tags: row.tags || [],
      totalEpisodes: row.total_episodes,
      totalPaths: row.total_paths,
      viewCount: row.view_count,
      rating: Number(row.rating),
      rootEpisodeId: row.root_episode_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async getSeriesById(id: string): Promise<Series | null> {
    const { data, error } = await this.client.from('series').select('*').eq('id', id).single();
    if (error || !data) return null;
    return {
      id: data.id,
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      coverImage: data.cover_image,
      backdropImage: data.backdrop_image,
      previewVideoUrl: data.preview_video_url,
      genre: data.genre,
      tags: data.tags || [],
      totalEpisodes: data.total_episodes,
      totalPaths: data.total_paths,
      viewCount: data.view_count,
      rating: Number(data.rating),
      rootEpisodeId: data.root_episode_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getEpisodeById(id: string): Promise<Episode | null> {
    const { data: epData, error: epErr } = await this.client.from('episodes').select('*').eq('id', id).single();
    if (epErr || !epData) return null;

    const { data: choicesData } = await this.client.from('episode_choices').select('*').eq('episode_id', id);

    const choices = (choicesData || []).map((c) => ({
      id: c.id,
      targetEpisodeId: c.target_episode_id,
      label: c.label,
      text: c.text,
      description: c.description,
      previewThumbnailUrl: c.preview_thumbnail_url,
      pickCount: c.pick_count,
      pickPercentage: Number(c.pick_percentage),
    }));

    return {
      id: epData.id,
      seriesId: epData.series_id,
      parentEpisodeId: epData.parent_episode_id,
      choicePromptLeadingHere: epData.choice_prompt_leading_here,
      episodeNumber: epData.episode_number,
      title: epData.title,
      synopsis: epData.synopsis,
      videoUrl: epData.video_url,
      thumbnailUrl: epData.thumbnail_url,
      durationSeconds: epData.duration_seconds,
      aspectRatio: epData.aspect_ratio || '16:9',
      viewCount: epData.view_count,
      isLeaf: epData.is_leaf,
      choices,
      createdAt: epData.created_at,
    };
  }

  async getEpisodesBySeriesId(seriesId: string): Promise<Episode[]> {
    const { data, error } = await this.client.from('episodes').select('*').eq('series_id', seriesId);
    if (error || !data) return [];

    const episodes: Episode[] = [];
    for (const epData of data) {
      const { data: choicesData } = await this.client.from('episode_choices').select('*').eq('episode_id', epData.id);
      episodes.push({
        id: epData.id,
        seriesId: epData.series_id,
        parentEpisodeId: epData.parent_episode_id,
        choicePromptLeadingHere: epData.choice_prompt_leading_here,
        episodeNumber: epData.episode_number,
        title: epData.title,
        synopsis: epData.synopsis,
        videoUrl: epData.video_url,
        thumbnailUrl: epData.thumbnail_url,
        durationSeconds: epData.duration_seconds,
        aspectRatio: epData.aspect_ratio || '16:9',
        viewCount: epData.view_count,
        isLeaf: epData.is_leaf,
        choices: (choicesData || []).map((c) => ({
          id: c.id,
          targetEpisodeId: c.target_episode_id,
          label: c.label,
          text: c.text,
          description: c.description,
          previewThumbnailUrl: c.preview_thumbnail_url,
          pickCount: c.pick_count,
          pickPercentage: Number(c.pick_percentage),
        })),
        createdAt: epData.created_at,
      });
    }
    return episodes;
  }

  async incrementEpisodeView(id: string): Promise<void> {
    await this.client.rpc('increment_view_count', { ep_id: id });
  }

  async recordChoicePick(choiceId: string): Promise<void> {
    await this.client.rpc('increment_choice_pick', { choice_id: choiceId });
  }

  async getCommentsByEpisodeId(episodeId: string, sessionId?: string): Promise<Comment[]> {
    const { data: comments, error } = await this.client
      .from('comments')
      .select('*')
      .eq('episode_id', episodeId)
      .order('score', { ascending: false });

    if (error || !comments) return [];

    let userVotesMap = new Map<string, 'up' | 'down'>();
    if (sessionId) {
      const { data: votes } = await this.client
        .from('comment_votes')
        .select('*')
        .eq('session_id', sessionId);

      if (votes) {
        for (const v of votes) {
          userVotesMap.set(v.comment_id, v.vote_type as 'up' | 'down');
        }
      }
    }

    return comments.map((c) => ({
      id: c.id,
      episodeId: c.episode_id,
      sessionId: c.session_id,
      authorName: c.author_name,
      text: c.text,
      upvotes: c.upvotes,
      downvotes: c.downvotes,
      score: c.score,
      isPicked: c.is_picked,
      createdAt: c.created_at,
      userVote: userVotesMap.get(c.id) || null,
    }));
  }

  async createComment(commentData: Omit<Comment, 'id' | 'upvotes' | 'downvotes' | 'score' | 'isPicked' | 'createdAt'>): Promise<Comment> {
    const { data, error } = await this.client
      .from('comments')
      .insert([
        {
          episode_id: commentData.episodeId,
          session_id: commentData.sessionId,
          author_name: commentData.authorName,
          text: commentData.text,
          upvotes: 0,
          downvotes: 0,
          score: 0,
          is_picked: false,
        },
      ])
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create comment');

    return {
      id: data.id,
      episodeId: data.episode_id,
      sessionId: data.session_id,
      authorName: data.author_name,
      text: data.text,
      upvotes: data.upvotes,
      downvotes: data.downvotes,
      score: data.score,
      isPicked: data.is_picked,
      createdAt: data.created_at,
    };
  }

  async voteComment(commentId: string, sessionId: string, voteType: 'up' | 'down'): Promise<{ comment: Comment; userVote: 'up' | 'down' | null }> {
    // Check existing vote
    const { data: existingVote } = await this.client
      .from('comment_votes')
      .select('*')
      .match({ comment_id: commentId, session_id: sessionId })
      .maybeSingle();

    let finalUserVote: 'up' | 'down' | null = voteType;

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote
        await this.client.from('comment_votes').delete().match({ comment_id: commentId, session_id: sessionId });
        finalUserVote = null;
      } else {
        // Switch vote
        await this.client
          .from('comment_votes')
          .update({ vote_type: voteType })
          .match({ comment_id: commentId, session_id: sessionId });
      }
    } else {
      // Add vote
      await this.client.from('comment_votes').insert([
        {
          comment_id: commentId,
          session_id: sessionId,
          vote_type: voteType,
        },
      ]);
    }

    // Calculate total upvotes and downvotes from comment_votes
    const { count: upCount } = await this.client
      .from('comment_votes')
      .select('*', { count: 'exact', head: true })
      .match({ comment_id: commentId, vote_type: 'up' });

    const { count: downCount } = await this.client
      .from('comment_votes')
      .select('*', { count: 'exact', head: true })
      .match({ comment_id: commentId, vote_type: 'down' });

    const upvotes = upCount || 0;
    const downvotes = downCount || 0;
    const score = upvotes - downvotes;

    // Update comments table with aggregated numbers
    const { data: updatedComment, error: updateErr } = await this.client
      .from('comments')
      .update({ upvotes, downvotes, score })
      .eq('id', commentId)
      .select()
      .single();

    if (updateErr || !updatedComment) throw new Error('Comment not found');

    return {
      comment: {
        id: updatedComment.id,
        episodeId: updatedComment.episode_id,
        sessionId: updatedComment.session_id,
        authorName: updatedComment.author_name,
        text: updatedComment.text,
        upvotes: updatedComment.upvotes,
        downvotes: updatedComment.downvotes,
        score: updatedComment.score,
        isPicked: updatedComment.is_picked,
        createdAt: updatedComment.created_at,
      },
      userVote: finalUserVote,
    };
  }

  async getUserJourney(sessionId: string, seriesId: string): Promise<UserJourney | null> {
    const { data } = await this.client
      .from('user_journeys')
      .select('*')
      .match({ session_id: sessionId, series_id: seriesId })
      .maybeSingle();

    if (!data) return null;
    return {
      id: data.id,
      sessionId: data.session_id,
      seriesId: data.series_id,
      pathEpisodeIds: data.path_episode_ids || [],
      currentEpisodeId: data.current_episode_id,
      updatedAt: data.updated_at,
    };
  }

  async saveUserJourney(sessionId: string, seriesId: string, episodeId: string): Promise<UserJourney> {
    const existing = await this.getUserJourney(sessionId, seriesId);
    let path = existing ? [...existing.pathEpisodeIds] : [];
    if (!path.includes(episodeId)) path.push(episodeId);

    const { data, error } = await this.client
      .from('user_journeys')
      .upsert(
        {
          session_id: sessionId,
          series_id: seriesId,
          path_episode_ids: path,
          current_episode_id: episodeId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id,series_id' }
      )
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to save journey');

    return {
      id: data.id,
      sessionId: data.session_id,
      seriesId: data.series_id,
      pathEpisodeIds: data.path_episode_ids,
      currentEpisodeId: data.current_episode_id,
      updatedAt: data.updated_at,
    };
  }
}
