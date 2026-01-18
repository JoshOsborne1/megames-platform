import { createBrowserClient } from "@supabase/ssr";

// Cached client instance - only cache valid clients
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time, return a non-cached placeholder
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not found - using placeholder during build");
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }

  // Return cached client if available (only for valid clients)
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}
