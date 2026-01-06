import SwiftUI

/// User profile view
struct ProfileView: View {
    @EnvironmentObject var appState: AppState
    @State private var showingSignOutAlert = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.megamesBackground
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: Spacing.xl) {
                        // Profile header
                        VStack(spacing: Spacing.md) {
                            Image(systemName: "person.circle.fill")
                                .font(.system(size: 80))
                                .foregroundColor(.megamesAccent)
                            
                            if let user = appState.currentUser {
                                Text(user.email)
                                    .font(.megamesBody)
                                    .foregroundColor(.megamesTextSecondary)
                            } else {
                                Text("Guest Player")
                                    .font(.megamesSubheadline)
                                    .foregroundColor(.megamesTextPrimary)
                                
                                Text("Sign in to save your progress")
                                    .font(.megamesCaption)
                                    .foregroundColor(.megamesTextMuted)
                            }
                        }
                        .padding(.top, Spacing.xl)
                        
                        // Stats cards
                        HStack(spacing: Spacing.md) {
                            StatCard(title: "Games", value: "12", icon: "gamecontroller.fill")
                            StatCard(title: "Wins", value: "8", icon: "trophy.fill")
                            StatCard(title: "Points", value: "245", icon: "star.fill")
                        }
                        
                        // Settings section
                        VStack(spacing: 0) {
                            SettingsRow(title: "Notifications", icon: "bell.fill", iconColor: .megamesSecondary) {
                                Toggle("", isOn: .constant(true))
                                    .tint(.megamesAccent)
                            }
                            
                            Divider().background(Color.megamesTextMuted.opacity(0.2))
                            
                            SettingsRow(title: "Sound Effects", icon: "speaker.wave.2.fill", iconColor: .megamesPrimary) {
                                Toggle("", isOn: .constant(true))
                                    .tint(.megamesAccent)
                            }
                            
                            Divider().background(Color.megamesTextMuted.opacity(0.2))
                            
                            SettingsRow(title: "Haptic Feedback", icon: "iphone.radiowaves.left.and.right", iconColor: .cardGreen) {
                                Toggle("", isOn: .constant(true))
                                    .tint(.megamesAccent)
                            }
                        }
                        .background(Color.megamesCard)
                        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
                        
                        // Links section
                        VStack(spacing: 0) {
                            SettingsRow(title: "Rate App", icon: "star.fill", iconColor: .cardYellow) {
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.megamesTextMuted)
                            }
                            
                            Divider().background(Color.megamesTextMuted.opacity(0.2))
                            
                            SettingsRow(title: "Privacy Policy", icon: "hand.raised.fill", iconColor: .megamesTextSecondary) {
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.megamesTextMuted)
                            }
                            
                            Divider().background(Color.megamesTextMuted.opacity(0.2))
                            
                            SettingsRow(title: "Terms of Service", icon: "doc.text.fill", iconColor: .megamesTextSecondary) {
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.megamesTextMuted)
                            }
                        }
                        .background(Color.megamesCard)
                        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
                        
                        // Sign out button
                        if appState.isAuthenticated {
                            Button {
                                showingSignOutAlert = true
                            } label: {
                                HStack {
                                    Image(systemName: "rectangle.portrait.and.arrow.right")
                                    Text("Sign Out")
                                }
                                .font(.megamesBodyBold)
                                .foregroundColor(.megamesError)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, Spacing.md)
                                .background(Color.megamesError.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium))
                            }
                        }
                        
                        // App version
                        Text("Version 1.0.0")
                            .font(.megamesSmall)
                            .foregroundColor(.megamesTextMuted)
                            .padding(.top, Spacing.md)
                    }
                    .padding(Spacing.lg)
                }
            }
            .navigationTitle("Profile")
            .alert("Sign Out", isPresented: $showingSignOutAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Sign Out", role: .destructive) {
                    Task {
                        try? await appState.signOut()
                    }
                }
            } message: {
                Text("Are you sure you want to sign out?")
            }
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    
    var body: some View {
        VStack(spacing: Spacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(.megamesAccent)
            
            Text(value)
                .font(.megamesHeadline)
                .foregroundColor(.megamesTextPrimary)
            
            Text(title)
                .font(.megamesSmall)
                .foregroundColor(.megamesTextMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, Spacing.lg)
        .background(Color.megamesCard)
        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
    }
}

struct SettingsRow<Content: View>: View {
    let title: String
    let icon: String
    let iconColor: Color
    let trailing: () -> Content
    
    var body: some View {
        HStack(spacing: Spacing.md) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(iconColor)
                .frame(width: 28)
            
            Text(title)
                .font(.megamesBody)
                .foregroundColor(.megamesTextPrimary)
            
            Spacer()
            
            trailing()
        }
        .padding(Spacing.md)
    }
}

#Preview {
    ProfileView()
        .environmentObject(AppState())
}
