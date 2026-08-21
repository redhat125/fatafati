-- ========================================================================
-- FataFati Supabase Database Schema with RLS Policies
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Series Table
CREATE TABLE IF NOT EXISTS series (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    backdrop_image TEXT NOT NULL,
    preview_video_url TEXT,
    genre TEXT NOT NULL,
    tags TEXT [] DEFAULT '{}',
    total_episodes INT DEFAULT 1,
    total_paths INT DEFAULT 1,
    view_count INT DEFAULT 0,
    rating NUMERIC(3, 1) DEFAULT 4.8,
    root_episode_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Episodes Table (Nodes in the story DAG)
CREATE TABLE IF NOT EXISTS episodes (
    id TEXT PRIMARY KEY,
    series_id TEXT NOT NULL REFERENCES series (id) ON DELETE CASCADE,
    parent_episode_id TEXT REFERENCES episodes (id) ON DELETE SET NULL,
    choice_prompt_leading_here TEXT,
    episode_number INT NOT NULL,
    title TEXT NOT NULL,
    synopsis TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    aspect_ratio TEXT DEFAULT '16:9',
    view_count INT DEFAULT 0,
    is_leaf BOOLEAN DEFAULT FALSE,
    is_series_finale BOOLEAN DEFAULT FALSE,
    video_status TEXT DEFAULT 'ready',
    choice_question TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_episodes_series ON episodes (series_id);

CREATE INDEX IF NOT EXISTS idx_episodes_parent ON episodes (parent_episode_id);

-- 3. Episode Choices Table (Edges in the story DAG)
CREATE TABLE IF NOT EXISTS episode_choices (
    id TEXT PRIMARY KEY,
    episode_id TEXT NOT NULL REFERENCES episodes (id) ON DELETE CASCADE,
    target_episode_id TEXT REFERENCES episodes (id) ON DELETE SET NULL,
    label TEXT NOT NULL,
    text TEXT NOT NULL,
    description TEXT,
    preview_thumbnail_url TEXT,
    pick_count INT DEFAULT 0,
    pick_percentage NUMERIC(5, 2) DEFAULT 0.0
);

CREATE INDEX IF NOT EXISTS idx_choices_episode ON episode_choices (episode_id);

CREATE INDEX IF NOT EXISTS idx_choices_target ON episode_choices (target_episode_id);

-- 4. Comments Table (Community Story Ideas)
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4 ()::TEXT,
    episode_id TEXT NOT NULL REFERENCES episodes (id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    author_name TEXT NOT NULL DEFAULT 'Anonymous Creator',
    text TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    score INT DEFAULT 0,
    is_picked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_episode ON comments (episode_id);

CREATE INDEX IF NOT EXISTS idx_comments_score ON comments (score DESC);

-- 5. Comment Votes Table
CREATE TABLE IF NOT EXISTS comment_votes (
    comment_id TEXT NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (comment_id, session_id)
);

-- 6. User Journeys Table
CREATE TABLE IF NOT EXISTS user_journeys (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4 ()::TEXT,
    session_id TEXT NOT NULL,
    series_id TEXT NOT NULL REFERENCES series (id) ON DELETE CASCADE,
    path_episode_ids TEXT [] NOT NULL DEFAULT '{}',
    current_episode_id TEXT NOT NULL REFERENCES episodes (id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (session_id, series_id)
);

-- 7. User Choices Table
CREATE TABLE IF NOT EXISTS user_choices (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4 ()::TEXT,
    session_id TEXT NOT NULL,
    episode_id TEXT NOT NULL REFERENCES episodes (id) ON DELETE CASCADE,
    choice_id TEXT NOT NULL REFERENCES episode_choices (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (session_id, episode_id)
);

-- ========================================================================
-- Enable Row Level Security (RLS) & Public Policies
-- ========================================================================
ALTER TABLE series ENABLE ROW LEVEL SECURITY;

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

ALTER TABLE episode_choices ENABLE ROW LEVEL SECURITY;

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_choices ENABLE ROW LEVEL SECURITY;

-- Allow Public Read on catalog & episodes
DROP POLICY IF EXISTS "Public can view series" ON series;
CREATE POLICY "Public can view series" ON series FOR
SELECT USING (true);

DROP POLICY IF EXISTS "Public can view episodes" ON episodes;
CREATE POLICY "Public can view episodes" ON episodes FOR
SELECT USING (true);

DROP POLICY IF EXISTS "Public can view choices" ON episode_choices;
CREATE POLICY "Public can view choices" ON episode_choices FOR
SELECT USING (true);

DROP POLICY IF EXISTS "Public can view comments" ON comments;
CREATE POLICY "Public can view comments" ON comments FOR
SELECT USING (true);

DROP POLICY IF EXISTS "Public can view votes" ON comment_votes;
CREATE POLICY "Public can view votes" ON comment_votes FOR
SELECT USING (true);

DROP POLICY IF EXISTS "Public can view user_journeys" ON user_journeys;
CREATE POLICY "Public can view user_journeys" ON user_journeys FOR
SELECT USING (true);

DROP POLICY IF EXISTS "Public can view user_choices" ON user_choices;
CREATE POLICY "Public can view user_choices" ON user_choices FOR
SELECT USING (true);

-- Allow Public Insert & Update for Series, Episodes, Choices (Seeding & Admin)
DROP POLICY IF EXISTS "Public can insert series" ON series;
CREATE POLICY "Public can insert series" ON series FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update series" ON series;
CREATE POLICY "Public can update series" ON series FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public can delete series" ON series;
CREATE POLICY "Public can delete series" ON series FOR DELETE USING (true);
DROP POLICY IF EXISTS "Public can insert episodes" ON episodes;
CREATE POLICY "Public can insert episodes" ON episodes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update episodes" ON episodes;
CREATE POLICY "Public can update episodes" ON episodes FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public can delete episodes" ON episodes;
CREATE POLICY "Public can delete episodes" ON episodes FOR DELETE USING (true);
DROP POLICY IF EXISTS "Public can insert choices" ON episode_choices;
CREATE POLICY "Public can insert choices" ON episode_choices FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update choices" ON episode_choices;
CREATE POLICY "Public can update choices" ON episode_choices FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public can delete choices" ON episode_choices;
CREATE POLICY "Public can delete choices" ON episode_choices FOR DELETE USING (true);

-- Allow Public Insert & Update for Community Pitches & Votes
DROP POLICY IF EXISTS "Public can insert comments" ON comments;
CREATE POLICY "Public can insert comments" ON comments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update comment score" ON comments;
CREATE POLICY "Public can update comment score" ON comments FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public can insert votes" ON comment_votes;
CREATE POLICY "Public can insert votes" ON comment_votes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update votes" ON comment_votes;
CREATE POLICY "Public can update votes" ON comment_votes FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public can insert user_journeys" ON user_journeys;
CREATE POLICY "Public can insert user_journeys" ON user_journeys FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update user_journeys" ON user_journeys;
CREATE POLICY "Public can update user_journeys" ON user_journeys FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public can insert user_choices" ON user_choices;
CREATE POLICY "Public can insert user_choices" ON user_choices FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update user_choices" ON user_choices;
CREATE POLICY "Public can update user_choices" ON user_choices FOR UPDATE USING (true);

-- ========================================================================
-- Grants
-- ========================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;-- Migration: Make target_episode_id nullable for pending generation choices
ALTER TABLE episode_choices ALTER COLUMN target_episode_id DROP NOT NULL;
ALTER TABLE episode_choices DROP CONSTRAINT IF EXISTS episode_choices_target_episode_id_fkey;
ALTER TABLE episode_choices ADD CONSTRAINT episode_choices_target_episode_id_fkey FOREIGN KEY (target_episode_id) REFERENCES episodes(id) ON DELETE SET NULL;
