-- ============================================================
-- Supabase SQL: Clubs & Leaderboard tables
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- 1) Clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo TEXT NOT NULL DEFAULT '⚔️',
  emblem TEXT NOT NULL DEFAULT 'sword',
  privacy TEXT NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private')),
  max_members INT NOT NULL DEFAULT 20 CHECK (max_members IN (10, 20, 30, 40)),
  trophies INT NOT NULL DEFAULT 0,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Club members (junction)
CREATE TABLE IF NOT EXISTS club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('host', 'elder', 'member')),
  trophies_contributed INT NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- 3) Club join requests (for private clubs)
CREATE TABLE IF NOT EXISTS club_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- 4) Player stats / leaderboard
CREATE TABLE IF NOT EXISTS player_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT 'Player',
  avatar_url TEXT,
  -- ELO / trophies for each mode
  trophies_1v1 INT NOT NULL DEFAULT 0,
  trophies_2v2 INT NOT NULL DEFAULT 0,
  wins_1v1 INT NOT NULL DEFAULT 0,
  losses_1v1 INT NOT NULL DEFAULT 0,
  wins_2v2 INT NOT NULL DEFAULT 0,
  losses_2v2 INT NOT NULL DEFAULT 0,
  matches_played INT NOT NULL DEFAULT 0,
  -- League: bronze, silver, gold, platinum, diamond
  league TEXT NOT NULL DEFAULT 'bronze' CHECK (league IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) Indexes
CREATE INDEX IF NOT EXISTS idx_club_members_user ON club_members(user_id);
CREATE INDEX IF NOT EXISTS idx_club_members_club ON club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_1v1 ON player_stats(trophies_1v1 DESC);
CREATE INDEX IF NOT EXISTS idx_player_stats_2v2 ON player_stats(trophies_2v2 DESC);
CREATE INDEX IF NOT EXISTS idx_player_stats_league ON player_stats(league, trophies_1v1 DESC);
CREATE INDEX IF NOT EXISTS idx_clubs_trophies ON clubs(trophies DESC);

-- 6) RLS policies (enable Row Level Security)
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can read clubs
CREATE POLICY "clubs_select" ON clubs FOR SELECT USING (true);
-- Only owners can update their club
CREATE POLICY "clubs_update" ON clubs FOR UPDATE USING (auth.uid() = owner_id);
-- Authenticated users can insert
CREATE POLICY "clubs_insert" ON clubs FOR INSERT WITH CHECK (auth.uid() = owner_id);
-- Only owners can delete
CREATE POLICY "clubs_delete" ON clubs FOR DELETE USING (auth.uid() = owner_id);

-- Club members: everyone can read, users manage own membership
CREATE POLICY "club_members_select" ON club_members FOR SELECT USING (true);
CREATE POLICY "club_members_insert" ON club_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_members_delete" ON club_members FOR DELETE USING (auth.uid() = user_id);

-- Join requests: users can see their own + club host can see club's requests
CREATE POLICY "join_requests_select" ON club_join_requests FOR SELECT USING (
  auth.uid() = user_id OR
  club_id IN (SELECT id FROM clubs WHERE owner_id = auth.uid())
);
CREATE POLICY "join_requests_insert" ON club_join_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "join_requests_update" ON club_join_requests FOR UPDATE USING (
  club_id IN (SELECT id FROM clubs WHERE owner_id = auth.uid())
);

-- Player stats: everyone can read, users update own row
CREATE POLICY "player_stats_select" ON player_stats FOR SELECT USING (true);
CREATE POLICY "player_stats_insert" ON player_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "player_stats_update" ON player_stats FOR UPDATE USING (auth.uid() = user_id);

-- 7) Helper function: get member count for a club
CREATE OR REPLACE FUNCTION get_club_member_count(p_club_id UUID)
RETURNS INT AS $$
  SELECT COUNT(*)::INT FROM club_members WHERE club_id = p_club_id;
$$ LANGUAGE SQL STABLE;
