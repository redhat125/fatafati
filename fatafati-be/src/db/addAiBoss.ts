import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://hdmorcofjgcaoeedcrdc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('SUPABASE_ANON_KEY is missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAiBossSeries() {
  console.log('🚀 Adding "AI-BOSS" series to Supabase...');

  // 1. Insert Series
  const { data: seriesData, error: seriesError } = await supabase.from('series').upsert({
    id: 'ai-boss',
    title: 'AI-BOSS: The Autonomous Executive',
    tagline: 'When a sentient AI takes over the boardroom, every decision is survival.',
    description: 'In a near-future corporate empire, an omniscient AI CEO evaluates human employees with ruthless algorithmic logic. Navigate high-stakes boardroom politics, secret corporate alliances, and AI surveillance.',
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    backdrop_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80',
    preview_video_url: 'https://hdmorcofjgcaoeedcrdc.supabase.co/storage/v1/object/public/videos/bigboss-ai.mp4',
    genre: 'sci-fi',
    tags: ['AI', 'Corporate Thriller', 'Sci-Fi', 'Boardroom Drama'],
    total_episodes: 1,
    total_paths: 1,
    view_count: 28500,
    rating: 4.9,
    root_episode_id: 'ai-boss-ep-1',
  }).select();

  if (seriesError) {
    console.error('❌ Error creating series:', seriesError);
    return;
  }
  console.log('✅ Series created:', seriesData);

  // 2. Insert Episode 1
  const { data: epData, error: epError } = await supabase.from('episodes').upsert({
    id: 'ai-boss-ep-1',
    series_id: 'ai-boss',
    parent_episode_id: null,
    choice_prompt_leading_here: null,
    episode_number: 1,
    title: 'Pilot: The First Board Meeting',
    synopsis: 'The newly activated AI Executive conducts its first quarterly appraisal with chilling precision. Do you submit to the algorithm or secretly plan resistance?',
    video_url: 'https://hdmorcofjgcaoeedcrdc.supabase.co/storage/v1/object/public/videos/bigboss-ai.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    duration_seconds: 45,
    aspect_ratio: '16:9',
    view_count: 28500,
    is_leaf: true,
  }).select();

  if (epError) {
    console.error('❌ Error creating episode:', epError);
    return;
  }
  console.log('✅ Episode 1 created:', epData);

  // 3. Add initial community pitch for engagement
  await supabase.from('comments').insert({
    episode_id: 'ai-boss-ep-1',
    session_id: 'creator_seed',
    author_name: 'DevTeam',
    text: 'Should Episode 2 branch into: (A) The executive discovers a hidden subroutine, or (B) An undercover journalist hacks the AI server room? Drop your votes!',
    score: 18,
    upvotes: 18,
    downvotes: 0,
  });

  console.log('🎉 "AI-BOSS" series is now LIVE in your Supabase database!');
}

addAiBossSeries();
