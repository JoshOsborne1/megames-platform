-- Migration: Create RPC function for efficient lobby fetching
-- This replaces N+1 queries with a single efficient joined query

CREATE OR REPLACE FUNCTION get_public_lobbies_with_hosts()
RETURNS TABLE (
    id UUID,
    code TEXT,
    host_id UUID,
    host_name TEXT,
    game_id TEXT,
    max_players INTEGER,
    created_at TIMESTAMPTZ,
    player_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.code,
        r.host_id,
        COALESCE(p.display_name, p.username, 'Player') as host_name,
        r.game_id,
        r.max_players,
        r.created_at,
        COUNT(rp.user_id) as player_count
    FROM rooms r
    LEFT JOIN profiles p ON p.id = r.host_id
    LEFT JOIN room_players rp ON rp.room_id = r.id
    WHERE r.is_public = true 
      AND r.status = 'waiting'
    GROUP BY r.id, r.code, r.host_id, p.display_name, p.username, r.game_id, r.max_players, r.created_at
    ORDER BY r.created_at DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_rooms_public_waiting ON rooms(is_public, status, created_at DESC);
