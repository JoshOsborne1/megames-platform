import SwiftUI

/// List of all available games
struct GamesListView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Color.megamesBackground
                    .ignoresSafeArea()
                
                ScrollView {
                    LazyVStack(spacing: Spacing.md) {
                        ForEach(GameInfo.allGames) { game in
                            NavigationLink(destination: GameDetailView(game: game)) {
                                GameCard(game: game)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(Spacing.lg)
                }
            }
            .navigationTitle("Games")
        }
    }
}

struct GameCard: View {
    let game: GameInfo
    
    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            HStack {
                Image(systemName: game.icon)
                    .font(.system(size: 40))
                    .foregroundColor(game.accentColor)
                
                Spacer()
                
                Text("\(game.playerRange)")
                    .font(.megamesCaptionBold)
                    .foregroundColor(.megamesTextSecondary)
                    .padding(.horizontal, Spacing.sm)
                    .padding(.vertical, Spacing.xxs)
                    .background(Color.megamesSurface)
                    .clipShape(Capsule())
            }
            
            Text(game.name)
                .font(.megamesSubheadline)
                .foregroundColor(.megamesTextPrimary)
            
            Text(game.description)
                .font(.megamesCaption)
                .foregroundColor(.megamesTextSecondary)
                .lineLimit(2)
        }
        .padding(Spacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            LinearGradient(
                colors: [game.accentColor.opacity(0.15), Color.megamesCard],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
        .overlay(
            RoundedRectangle(cornerRadius: CornerRadius.large)
                .stroke(game.accentColor.opacity(0.2), lineWidth: 1)
        )
    }
}

/// Detailed game view with setup options
struct GameDetailView: View {
    let game: GameInfo
    @State private var showingSetup = false
    
    var body: some View {
        ZStack {
            Color.megamesBackground
                .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: Spacing.xl) {
                    // Game header
                    VStack(spacing: Spacing.md) {
                        Image(systemName: game.icon)
                            .font(.system(size: 80))
                            .foregroundColor(game.accentColor)
                        
                        Text(game.name)
                            .font(.megamesTitle)
                            .foregroundColor(.megamesTextPrimary)
                        
                        HStack(spacing: Spacing.lg) {
                            Label("\(game.playerRange) Players", systemImage: "person.2")
                            Label(game.duration, systemImage: "clock")
                        }
                        .font(.megamesCaption)
                        .foregroundColor(.megamesTextSecondary)
                    }
                    .padding(.top, Spacing.xl)
                    
                    // Description
                    Text(game.description)
                        .font(.megamesBody)
                        .foregroundColor(.megamesTextSecondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                    
                    // How to play
                    VStack(alignment: .leading, spacing: Spacing.md) {
                        Text("How to Play")
                            .font(.megamesSubheadline)
                            .foregroundColor(.megamesTextPrimary)
                        
                        ForEach(Array(game.rules.enumerated()), id: \.offset) { index, rule in
                            HStack(alignment: .top, spacing: Spacing.sm) {
                                Text("\(index + 1).")
                                    .font(.megamesCaptionBold)
                                    .foregroundColor(game.accentColor)
                                    .frame(width: 24)
                                
                                Text(rule)
                                    .font(.megamesCaption)
                                    .foregroundColor(.megamesTextSecondary)
                            }
                        }
                    }
                    .padding(Spacing.lg)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.megamesCard)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
                    
                    // Play button
                    NavigationLink(destination: GameSetupView(game: game)) {
                        HStack {
                            Image(systemName: "play.fill")
                            Text("Start Game")
                        }
                        .font(.megamesBodyBold)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Spacing.md)
                        .background(
                            LinearGradient(
                                colors: [game.accentColor, game.accentColor.opacity(0.7)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium))
                    }
                }
                .padding(Spacing.lg)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationStack {
        GamesListView()
    }
}
