/**
 * Supabase Database Types
 * 
 * TypeScript types matching the database schema
 */

export interface Profile {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    is_admin: boolean;
    is_pro: boolean;
    pro_tier: "weekly" | "monthly" | "yearly" | null;
    pro_expires_at: string | null;
    pro_granted_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProGrant {
    id: string;
    granter_id: string | null;
    grantee_id: string;
    granted_at: string;
    expires_at: string | null;
    reason: "family" | "friend" | "promo" | "admin" | string | null;
    notes: string | null;
    is_active: boolean;
}

export interface UserStats {
    id: string;
    user_id: string;
    games_played: number;
    games_won: number;
    total_points: number;
    favorite_game: string | null;
    last_played_at: string | null;
    updated_at: string;
}

// Extended types with relations
export interface ProfileWithStats extends Profile {
    user_stats: UserStats | null;
}

export interface ProGrantWithUsers extends ProGrant {
    granter: Profile | null;
    grantee: Profile;
}

// Database operation types
export type ProfileInsert = Omit<Profile, "id" | "created_at" | "updated_at">;
export type ProfileUpdate = Partial<ProfileInsert>;

export type ProGrantInsert = Omit<ProGrant, "id" | "granted_at">;
export type ProGrantUpdate = Partial<ProGrantInsert>;

export type UserStatsInsert = Omit<UserStats, "id" | "updated_at">;
export type UserStatsUpdate = Partial<UserStatsInsert>;
