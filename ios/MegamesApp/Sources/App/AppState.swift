import SwiftUI

/// Global app state managing authentication and navigation
@MainActor
class AppState: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = true
    
    private let supabaseClient = SupabaseManager.shared
    
    init() {
        Task {
            await checkAuthState()
        }
    }
    
    func checkAuthState() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            let session = try await supabaseClient.client.auth.session
            currentUser = User(id: session.user.id.uuidString, email: session.user.email ?? "")
            isAuthenticated = true
        } catch {
            isAuthenticated = false
            currentUser = nil
        }
    }
    
    func signIn(email: String, password: String) async throws {
        let session = try await supabaseClient.client.auth.signIn(email: email, password: password)
        currentUser = User(id: session.user.id.uuidString, email: session.user.email ?? "")
        isAuthenticated = true
    }
    
    func signUp(email: String, password: String) async throws {
        let session = try await supabaseClient.client.auth.signUp(email: email, password: password)
        currentUser = User(id: session.user.id.uuidString, email: session.user.email ?? "")
        isAuthenticated = true
    }
    
    func signOut() async throws {
        try await supabaseClient.client.auth.signOut()
        isAuthenticated = false
        currentUser = nil
    }
}

struct User: Identifiable, Codable {
    let id: String
    let email: String
}
