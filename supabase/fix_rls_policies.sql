-- Fix Multiplayer RLS Policies
-- Run this in Supabase SQL Editor
-- This will drop old policies and create simpler, working ones

-- First, re-enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on rooms
DROP POLICY IF EXISTS "Users can view public rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can view rooms they are in" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON public.rooms;
DROP POLICY IF EXISTS "Hosts can update their rooms" ON public.rooms;
DROP POLICY IF EXISTS "Hosts can delete their rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can check room codes" ON public.rooms;

-- Drop all existing policies on room_players
DROP POLICY IF EXISTS "Users can view room players" ON public.room_players;
DROP POLICY IF EXISTS "Users can join rooms" ON public.room_players;
DROP POLICY IF EXISTS "Users can update their own player status" ON public.room_players;
DROP POLICY IF EXISTS "Users can leave rooms" ON public.room_players;
DROP POLICY IF EXISTS "Hosts can remove players" ON public.room_players;

-- ============================================
-- ROOMS TABLE - Simple, working policies
-- ============================================

-- SELECT: Authenticated users can view all rooms (needed for code checking and joining)
CREATE POLICY "rooms_select_policy"
  ON public.rooms FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Authenticated users can create rooms where they are the host
CREATE POLICY "rooms_insert_policy"
  ON public.rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

-- UPDATE: Only the host can update their room
CREATE POLICY "rooms_update_policy"
  ON public.rooms FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

-- DELETE: Only the host can delete their room
CREATE POLICY "rooms_delete_policy"
  ON public.rooms FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

-- ============================================
-- ROOM_PLAYERS TABLE - Simple, working policies
-- ============================================

-- SELECT: Authenticated users can view all players (needed for lobby display)
CREATE POLICY "room_players_select_policy"
  ON public.room_players FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Authenticated users can add themselves to a room
CREATE POLICY "room_players_insert_policy"
  ON public.room_players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own player record
CREATE POLICY "room_players_update_policy"
  ON public.room_players FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- DELETE: Users can leave (delete themselves) OR hosts can kick players
CREATE POLICY "room_players_delete_policy"
  ON public.room_players FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.rooms 
      WHERE rooms.id = room_players.room_id 
      AND rooms.host_id = auth.uid()
    )
  );
