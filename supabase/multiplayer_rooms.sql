-- Multiplayer Rooms Schema
-- Run this in Supabase SQL Editor to add real-time multiplayer support

-- Required helper function (if not already present)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT, -- References game config id (e.g., 'dynamic-decks', 'lyric-legends')
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  is_public BOOLEAN DEFAULT TRUE,
  max_players INTEGER DEFAULT 6 CHECK (max_players >= 2 AND max_players <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room players table
CREATE TABLE IF NOT EXISTS public.room_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  is_ready BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_host ON public.rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_players_room ON public.room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user ON public.room_players(user_id);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;

-- Rooms policies
-- Anyone authenticated can view public rooms or rooms they're in
CREATE POLICY "Users can view public rooms"
  ON public.rooms FOR SELECT
  USING (is_public = TRUE OR host_id = auth.uid());

CREATE POLICY "Users can view rooms they are in"
  ON public.rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.room_players 
      WHERE room_id = rooms.id AND user_id = auth.uid()
    )
  );

-- Users can create rooms
CREATE POLICY "Authenticated users can create rooms"
  ON public.rooms FOR INSERT
  WITH CHECK (auth.uid() = host_id);

-- Hosts can update their rooms
CREATE POLICY "Hosts can update their rooms"
  ON public.rooms FOR UPDATE
  USING (auth.uid() = host_id);

-- Hosts can delete their rooms
CREATE POLICY "Hosts can delete their rooms"
  ON public.rooms FOR DELETE
  USING (auth.uid() = host_id);

-- Room players policies
-- Users can view players in rooms they can see
CREATE POLICY "Users can view room players"
  ON public.room_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms 
      WHERE id = room_players.room_id 
      AND (is_public = TRUE OR host_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.room_players rp 
        WHERE rp.room_id = rooms.id AND rp.user_id = auth.uid()
      ))
    )
  );

-- Users can join rooms
CREATE POLICY "Users can join rooms"
  ON public.room_players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own status
CREATE POLICY "Users can update their own player status"
  ON public.room_players FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can leave rooms
CREATE POLICY "Users can leave rooms"
  ON public.room_players FOR DELETE
  USING (auth.uid() = user_id);

-- Hosts can remove players
CREATE POLICY "Hosts can remove players"
  ON public.room_players FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms 
      WHERE id = room_players.room_id AND host_id = auth.uid()
    )
  );

-- Updated at trigger for rooms
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable Realtime for rooms and room_players
ALTER publication supabase_realtime ADD TABLE public.rooms;
ALTER publication supabase_realtime ADD TABLE public.room_players;

-- Function to generate unique room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INTEGER;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..5 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    -- Check if code is unique
    IF NOT EXISTS (SELECT 1 FROM public.rooms WHERE rooms.code = code) THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old/abandoned rooms (can be called periodically)
CREATE OR REPLACE FUNCTION cleanup_old_rooms()
RETURNS void AS $$
BEGIN
  -- Delete rooms that have been waiting for more than 24 hours
  DELETE FROM public.rooms 
  WHERE status = 'waiting' 
  AND created_at < NOW() - INTERVAL '24 hours';
  
  -- Delete finished rooms older than 1 hour
  DELETE FROM public.rooms 
  WHERE status = 'finished' 
  AND updated_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
