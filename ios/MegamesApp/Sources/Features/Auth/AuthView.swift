import SwiftUI

/// Authentication view with login and signup tabs
struct AuthView: View {
    @State private var isLogin = true
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        ZStack {
            Color.megamesBackground
                .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: Spacing.xl) {
                    // Logo and title
                    VStack(spacing: Spacing.md) {
                        Image(systemName: "gamecontroller.fill")
                            .font(.system(size: 60))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.megamesAccent, .megamesPrimary],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                        
                        Text("Megames")
                            .font(.megamesTitle)
                            .foregroundColor(.megamesTextPrimary)
                        
                        Text("All Your Favorite Board Games in One Digital Deck")
                            .font(.megamesCaption)
                            .foregroundColor(.megamesTextSecondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, Spacing.xxl)
                    
                    // Tab selector
                    HStack(spacing: 0) {
                        TabButton(title: "Sign In", isSelected: isLogin) {
                            withAnimation { isLogin = true }
                        }
                        TabButton(title: "Sign Up", isSelected: !isLogin) {
                            withAnimation { isLogin = false }
                        }
                    }
                    .background(Color.megamesSurface)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium))
                    
                    // Form fields
                    VStack(spacing: Spacing.md) {
                        MegamesTextField("Email", text: $email, icon: "envelope")
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                        
                        MegamesTextField("Password", text: $password, icon: "lock", isSecure: true)
                            .textContentType(isLogin ? .password : .newPassword)
                        
                        if !isLogin {
                            MegamesTextField("Confirm Password", text: $confirmPassword, icon: "lock.fill", isSecure: true)
                                .textContentType(.newPassword)
                        }
                    }
                    
                    // Error message
                    if let error = errorMessage {
                        Text(error)
                            .font(.megamesCaption)
                            .foregroundColor(.megamesError)
                            .padding(.horizontal)
                    }
                    
                    // Submit button
                    PrimaryButton(
                        isLogin ? "Sign In" : "Create Account",
                        icon: isLogin ? "arrow.right" : "person.badge.plus",
                        isLoading: isLoading
                    ) {
                        Task { await handleAuth() }
                    }
                    
                    // Skip for now (guest mode)
                    Button {
                        // Allow guest mode for testing
                        appState.isAuthenticated = true
                    } label: {
                        Text("Continue as Guest")
                            .font(.megamesCaption)
                            .foregroundColor(.megamesTextMuted)
                    }
                }
                .padding(.horizontal, Spacing.lg)
            }
        }
    }
    
    private func handleAuth() async {
        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = "Please fill in all fields"
            return
        }
        
        if !isLogin && password != confirmPassword {
            errorMessage = "Passwords don't match"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            if isLogin {
                try await appState.signIn(email: email, password: password)
            } else {
                try await appState.signUp(email: email, password: password)
            }
        } catch {
            errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
}

struct TabButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.megamesBodyBold)
                .foregroundColor(isSelected ? .megamesTextPrimary : .megamesTextMuted)
                .frame(maxWidth: .infinity)
                .padding(.vertical, Spacing.sm)
                .background(isSelected ? Color.megamesSurfaceElevated : Color.clear)
                .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small))
        }
        .padding(Spacing.xxs)
    }
}

#Preview {
    AuthView()
        .environmentObject(AppState())
}
