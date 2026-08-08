import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { INITIAL_SERIES, INITIAL_EPISODES, INITIAL_COMMENTS } from './seedData';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in fatafati-be/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🚀 Seeding Supabase Database with FataFati story universe...');

  try {
    // 1. Seed Series
    console.log(`📦 Inserting ${INITIAL_SERIES.length} series...`);
    for (const s of INITIAL_SERIES) {
      const { error } = await supabase.from('series').upsert({
        id: s.id,
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        cover_image: s.coverImage,
        backdrop_image: s.backdropImage,
        preview_video_url: s.previewVideoUrl || null,
        genre: s.genre,
        tags: s.tags,
        total_episodes: s.totalEpisodes,
        total_paths: s.totalPaths,
        view_count: s.viewCount,
        rating: s.rating,
        root_episode_id: s.rootEpisodeId,
        created_at: s.createdAt,
        updated_at: s.updatedAt,
      });

      if (error) {
        console.error(`Failed to seed series ${s.id}:`, error.message);
      }
    }

    // 2. Pass 1: Insert all Episodes first
    console.log(`🎬 Pass 1: Inserting ${INITIAL_EPISODES.length} episodes...`);
    for (const ep of INITIAL_EPISODES) {
      const { error: epErr } = await supabase.from('episodes').upsert({
        id: ep.id,
        series_id: ep.seriesId,
        parent_episode_id: ep.parentEpisodeId || null,
        choice_prompt_leading_here: ep.choicePromptLeadingHere || null,
        episode_number: ep.episodeNumber,
        title: ep.title,
        synopsis: ep.synopsis,
        video_url: ep.videoUrl,
        thumbnail_url: ep.thumbnailUrl,
        duration_seconds: ep.durationSeconds,
        aspect_ratio: ep.aspectRatio || '16:9',
        view_count: ep.viewCount || 0,
        is_leaf: ep.isLeaf || false,
        created_at: ep.createdAt,
      });

      if (epErr) {
        console.error(`Failed to seed episode ${ep.id}:`, epErr.message);
      }
    }

    // 3. Pass 2: Insert all Choices (since target_episode_ids now exist)
    console.log(`🔀 Pass 2: Inserting branching choices...`);
    for (const ep of INITIAL_EPISODES) {
      if (ep.choices && ep.choices.length > 0) {
        for (const c of ep.choices) {
          const { error: chErr } = await supabase.from('episode_choices').upsert({
            id: c.id,
            episode_id: ep.id,
            target_episode_id: c.targetEpisodeId,
            label: c.label,
            text: c.text,
            description: c.description || null,
            preview_thumbnail_url: c.previewThumbnailUrl || null,
            pick_count: c.pickCount || 0,
            pick_percentage: c.pickPercentage || 0,
          });

          if (chErr) {
            console.error(`Failed to seed choice ${c.id}:`, chErr.message);
          }
        }
      }
    }

    // 4. Seed Comments
    console.log(`💬 Inserting ${INITIAL_COMMENTS.length} initial community pitches...`);
    for (const com of INITIAL_COMMENTS) {
      const { error: comErr } = await supabase.from('comments').upsert({
        id: com.id,
        episode_id: com.episodeId,
        session_id: com.sessionId,
        author_name: com.authorName,
        text: com.text,
        upvotes: com.upvotes,
        downvotes: com.downvotes,
        score: com.score,
        is_picked: com.isPicked || false,
        created_at: com.createdAt,
      });

      if (comErr) {
        console.error(`Failed to seed comment ${com.id}:`, comErr.message);
      }
    }

    console.log('🎉 Supabase database successfully seeded with 100% of series, branching DAGs, and community comments!');
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  }
}

seed();
