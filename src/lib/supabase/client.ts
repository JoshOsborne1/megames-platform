import { createBrowserClient } from "@supabase/ssr";

// Cached client instance
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Return cached client if available
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time, these may not be available - return a dummy client
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't throw during build
    // This should never be used at runtime as env vars will be present
    console.warn("Supabase credentials not found - using placeholder during build");
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}
