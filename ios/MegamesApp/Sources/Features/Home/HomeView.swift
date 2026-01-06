import SwiftUI

/// Home screen with quick actions and featured games
struct HomeView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.megamesBackground
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: Spacing.xl) {
                        // Welcome header
                        VStack(alignment: .leading, spacing: Spacing.xs) {
                            Text("Welcome back!")
                                .font(.megamesCaption)
                                .foregroundColor(.megamesTextSecondary)
                            
                            Text("Ready to play?")
                                .font(.megamesHeadline)
                                .foregroundColor(.megamesTextPrimary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        // Quick action cards
                        HStack(spacing: Spacing.md) {
                            QuickActionCard(
                                title: "New Game",
                                icon: "plus.circle.fill",
                                gradient: [.megamesPrimary, .megamesSecondary]
                            ) {
                                // Navigate to game selection
                            }
                            
                            QuickActionCard(
                                title: "Join Lobby",
                                icon: "person.2.fill",
                                gradient: [.megamesAccent, .megamesPrimary]
                            ) {
                                // Navigate to lobbies
                            }
                        }
                        
                        // Featured games section
                        VStack(alignment: .leading, spacing: Spacing.md) {
                            Text("Featured Games")
                                .font(.megamesSubheadline)
                                .foregroundColor(.megamesTextPrimary)
                            
                            ForEach(GameInfo.allGames) { game in
                                NavigationLink(destination: GameDetailView(game: game)) {
                                    GameRowCard(game: game)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                    .padding(Spacing.lg)
                }
            }
            .navigationTitle("Megames")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Image(systemName: "gamecontroller.fill")
                        .foregroundColor(.megamesAccent)
                }
            }
        }
    }
}

struct QuickActionCard: View {
    let title: String
    let icon: String
    let gradient: [Color]
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: Spacing.sm) {
                Image(systemName: icon)
                    .font(.system(size: 32))
                Text(title)
                    .font(.megamesCaptionBold)
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, Spacing.lg)
            .background(
                LinearGradient(colors: gradient, startPoint: .topLeading, endPoint: .bottomTrailing)
            )
            .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
        }
    }
}

struct GameRowCard: View {
    let game: GameInfo
    
    var body: some View {
        HStack(spacing: Spacing.md) {
            Image(systemName: game.icon)
                .font(.system(size: 28))
                .foregroundColor(game.accentColor)
                .frame(width: 50, height: 50)
                .background(game.accentColor.opacity(0.15))
                .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium))
            
            VStack(alignment: .leading, spacing: Spacing.xxs) {
                Text(game.name)
                    .font(.megamesBodyBold)
                    .foregroundColor(.megamesTextPrimary)
                
                Text(game.shortDescription)
                    .font(.megamesCaption)
                    .foregroundColor(.megamesTextSecondary)
                    .lineLimit(1)
                
                Text("\(game.playerRange) Players")
                    .font(.megamesSmall)
                    .foregroundColor(.megamesTextMuted)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .foregroundColor(.megamesTextMuted)
        }
        .padding(Spacing.md)
        .background(Color.megamesCard)
        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
    }
}

#Preview {
    HomeView()
        .environmentObject(AppState())
}
