/**
 * Supabase Auth Helpers
 * Standardized utilities for auth operations across the app
 */

import { createClient } from "./client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Get current authenticated user
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Subscribe to auth state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  const supabase = createClient();
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event: AuthChangeEvent, session: Session | null) => {
      callback(session?.user ?? null);
    }
  );
  return () => subscription.unsubscribe();
}

/**
 * Check if user is authenticated
 * @returns Boolean indicating auth status
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Get user profile data from profiles table
 * @param userId The user ID to fetch profile for
 * @returns Profile data or null
 */
export async function getUserProfile<T = Record<string, unknown>>(
  userId: string
): Promise<T | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data as T | null;
}

/**
 * Sign out current user
 * @returns Error message if sign out failed, null otherwise
 */
export async function signOut(): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return error ? error.message : null;
}
