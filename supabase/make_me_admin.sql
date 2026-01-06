-- FIX SCRIPT: Run this entire script in Supabase SQL Editor

-- 1. Ensure your profile exists (in case you signed up before the tables were ready)
INSERT INTO public.profiles (id, username, display_name, avatar_url)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'display_name', raw_user_meta_data->>'full_name'),
  raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id = 'd3ae2a5a-e693-43ed-8406-718f7af97fb0'
ON CONFLICT (id) DO NOTHING;

-- 2. Grant Admin Access
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE id = 'd3ae2a5a-e693-43ed-8406-718f7af97fb0';

-- 3. Verify it worked
SELECT id, username, is_admin, is_pro FROM public.profiles WHERE id = 'd3ae2a5a-e693-43ed-8406-718f7af97fb0';
