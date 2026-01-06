import Foundation
import Supabase

/// Singleton manager for Supabase client connections
final class SupabaseManager {
    static let shared = SupabaseManager()
    
    let client: SupabaseClient
    
    private init() {
        // These values come from the web app's .env.local
        let supabaseURL = URL(string: "https://bowzeihdsmqgxdtdewip.supabase.co")!
        let supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvd3plaWhkc21xZ3hkdGRld2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjM2MTAsImV4cCI6MjA4MTM5OTYxMH0.3r9ZpWmoJ3TZ6I7mj-5mawGvnFNJtuO0hYgLhzSEF-8"
        
        client = SupabaseClient(
            supabaseURL: supabaseURL,
            supabaseKey: supabaseKey
        )
    }
}
