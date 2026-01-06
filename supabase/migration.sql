-- Migration script to add subscription columns to existing profiles table
-- Run this in Supabase SQL Editor

-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pro_tier TEXT CHECK (pro_tier IS NULL OR pro_tier IN ('weekly', 'monthly', 'yearly'));

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pro_granted_by UUID;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create pro_grants table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.pro_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  granter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  grantee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create user_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  favorite_game TEXT,
  last_played_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON public.profiles(is_pro);

-- Enable RLS on new tables
ALTER TABLE public.pro_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Grant yourself admin (replace with your user ID from Supabase Auth -> Users)
-- UPDATE public.profiles SET is_admin = TRUE WHERE id = 'your-user-id-here';

SELECT 'Migration complete! Now run the UPDATE command above with your user ID to become admin.' as status;
