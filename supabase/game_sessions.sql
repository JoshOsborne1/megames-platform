-- Game Sessions Schema
-- Run this in Supabase SQL Editor to add game state persistence

-- Game sessions table for persisting game state
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  state JSONB NOT NULL DEFAULT '{}',
  round INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_room ON public.game_sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game ON public.game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_started ON public.game_sessions(started_at);

-- Enable RLS
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Players in the room can view the session
CREATE POLICY "Players can view game sessions"
  ON public.game_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.room_players 
      WHERE room_id = game_sessions.room_id AND user_id = auth.uid()
    )
  );

-- Host can create and update sessions
CREATE POLICY "Host can manage game sessions"
  ON public.game_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms 
      WHERE id = game_sessions.room_id AND host_id = auth.uid()
    )
  );

-- Updated at trigger
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON public.game_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable Realtime for game_sessions
ALTER publication supabase_realtime ADD TABLE public.game_sessions;

-- Scheduled cleanup function (can be called via pg_cron if available)
CREATE OR REPLACE FUNCTION cleanup_old_game_sessions()
RETURNS void AS $$
BEGIN
  -- Delete game sessions older than 7 days
  DELETE FROM public.game_sessions 
  WHERE ended_at IS NOT NULL 
  AND ended_at < NOW() - INTERVAL '7 days';
  
  -- Delete abandoned sessions (no update in 1 day)
  DELETE FROM public.game_sessions 
  WHERE ended_at IS NULL 
  AND updated_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;
