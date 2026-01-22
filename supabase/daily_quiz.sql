-- Add Daily Quiz tracking to user_stats
-- Run this migration in your Supabase SQL Editor

ALTER TABLE public.user_stats 
ADD COLUMN IF NOT EXISTS daily_quiz_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_quiz_last_date DATE,
ADD COLUMN IF NOT EXISTS daily_quiz_best_streak INTEGER DEFAULT 0;

-- Index for date-based queries if needed
CREATE INDEX IF NOT EXISTS idx_user_stats_daily_quiz_last_date ON public.user_stats(daily_quiz_last_date);

-- Policy for updating daily quiz stats (already covered by existing user_stats policies)
-- Users can update their own stats via the existing policy:
-- "Users can update their own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id)
