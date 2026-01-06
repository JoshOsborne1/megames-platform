import SwiftUI

/// Main gameplay view for Dynamic Decks
struct DynamicDecksGameView: View {
    let players: [Player]
    let difficulty: GameState.Difficulty
    let gameMode: GameState.GameMode
    let maxRounds: Int
    let timerSeconds: Int
    
    @StateObject private var viewModel: DynamicDecksViewModel
    @Environment(\.dismiss) private var dismiss
    
    init(players: [Player], difficulty: GameState.Difficulty, gameMode: GameState.GameMode, maxRounds: Int, timerSeconds: Int) {
        self.players = players
        self.difficulty = difficulty
        self.gameMode = gameMode
        self.maxRounds = maxRounds
        self.timerSeconds = timerSeconds
        
        _viewModel = StateObject(wrappedValue: DynamicDecksViewModel(
            players: players,
            difficulty: difficulty,
            gameMode: gameMode,
            maxRounds: maxRounds,
            timerSeconds: timerSeconds
        ))
    }
    
    var body: some View {
        ZStack {
            Color.megamesBackground
                .ignoresSafeArea()
            
            switch viewModel.phase {
            case .instructions:
                InstructionsView(
                    clueGiver: viewModel.currentClueGiver,
                    gameMode: gameMode,
                    onStart: { viewModel.startRound() }
                )
                
            case .playing:
                PlayingView(viewModel: viewModel)
                
            case .roundSummary, .turnEnded:
                RoundSummaryView(
                    roundScore: viewModel.roundScore,
                    cardsCompleted: viewModel.cardsInRound,
                    isLastRound: viewModel.currentRound >= maxRounds,
                    onContinue: { viewModel.nextRound() },
                    onEndGame: { viewModel.endGame() }
                )
                
            case .gameOver:
                GameOverView(
                    players: viewModel.players,
                    onPlayAgain: { dismiss() },
                    onExit: { dismiss() }
                )
                
            default:
                LoadingView()
            }
        }
        .statusBarHidden()
    }
}

// MARK: - Instructions View
struct InstructionsView: View {
    let clueGiver: Player
    let gameMode: GameState.GameMode
    let onStart: () -> Void
    
    var body: some View {
        VStack(spacing: Spacing.xl) {
            Spacer()
            
            Image(systemName: "hand.point.up.fill")
                .font(.system(size: 60))
                .foregroundColor(.megamesAccent)
            
            VStack(spacing: Spacing.md) {
                Text("\(clueGiver.name)'s Turn")
                    .font(.megamesTitle)
                    .foregroundColor(.megamesTextPrimary)
                
                Text(gameMode == .classic
                     ? "Give clues without using the forbidden words!"
                     : "Read the clues to everyone - fastest guesser wins!")
                    .font(.megamesBody)
                    .foregroundColor(.megamesTextSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, Spacing.xl)
            }
            
            Spacer()
            
            PrimaryButton("Ready? Start!", icon: "play.fill") {
                onStart()
            }
            .padding(.horizontal, Spacing.lg)
            .padding(.bottom, Spacing.xxl)
        }
    }
}

// MARK: - Playing View
struct PlayingView: View {
    @ObservedObject var viewModel: DynamicDecksViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            // HUD
            HStack {
                // Timer
                HStack(spacing: Spacing.xs) {
                    Image(systemName: "clock.fill")
                        .foregroundColor(viewModel.timer <= 10 ? .megamesError : .megamesAccent)
                    Text("\(viewModel.timer)")
                        .font(.megamesTimer)
                        .foregroundColor(viewModel.timer <= 10 ? .megamesError : .megamesTextPrimary)
                        .monospacedDigit()
                }
                
                Spacer()
                
                // Round score
                VStack(alignment: .trailing, spacing: 2) {
                    Text("Score")
                        .font(.megamesSmall)
                        .foregroundColor(.megamesTextMuted)
                    Text("\(viewModel.roundScore)")
                        .font(.megamesScore)
                        .foregroundColor(.megamesAccent)
                }
            }
            .padding(Spacing.lg)
            .background(Color.megamesSurface)
            
            Spacer()
            
            // Current card
            if let card = viewModel.currentCard {
                GameCardView(
                    word: card.word,
                    forbidden: card.forbidden,
                    color: cardColor(from: card.color),
                    points: card.points
                )
                .frame(width: 300)
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .move(edge: .leading).combined(with: .opacity)
                ))
            }
            
            Spacer()
            
            // Action buttons
            HStack(spacing: Spacing.lg) {
                // Skip button
                Button {
                    withAnimation(.spring(response: 0.3)) {
                        viewModel.skipCard()
                    }
                } label: {
                    VStack(spacing: Spacing.xs) {
                        Image(systemName: "arrow.right.circle.fill")
                            .font(.system(size: 40))
                        Text("Skip")
                            .font(.megamesCaptionBold)
                    }
                    .foregroundColor(.megamesWarning)
                }
                
                // Correct button
                Button {
                    withAnimation(.spring(response: 0.3)) {
                        viewModel.correctAnswer()
                    }
                } label: {
                    VStack(spacing: Spacing.xs) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 60))
                        Text("Correct!")
                            .font(.megamesBodyBold)
                    }
                    .foregroundColor(.megamesSuccess)
                }
                
                // End turn button
                Button {
                    viewModel.endTurn()
                } label: {
                    VStack(spacing: Spacing.xs) {
                        Image(systemName: "stop.circle.fill")
                            .font(.system(size: 40))
                        Text("End")
                            .font(.megamesCaptionBold)
                    }
                    .foregroundColor(.megamesError)
                }
            }
            .padding(.bottom, Spacing.xxl)
        }
    }
    
    private func cardColor(from type: Card.CardColorType) -> CardColor {
        switch type {
        case .yellow: return .yellow
        case .blue: return .blue
        case .green: return .green
        case .red: return .red
        }
    }
}

// MARK: - Round Summary View
struct RoundSummaryView: View {
    let roundScore: Int
    let cardsCompleted: Int
    let isLastRound: Bool
    let onContinue: () -> Void
    let onEndGame: () -> Void
    
    var body: some View {
        VStack(spacing: Spacing.xl) {
            Spacer()
            
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 80))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.megamesAccent, .megamesPrimary],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
            
            Text("Round Complete!")
                .font(.megamesTitle)
                .foregroundColor(.megamesTextPrimary)
            
            VStack(spacing: Spacing.sm) {
                HStack {
                    Text("Cards Completed")
                        .foregroundColor(.megamesTextSecondary)
                    Spacer()
                    Text("\(cardsCompleted)")
                        .foregroundColor(.megamesTextPrimary)
                        .font(.megamesBodyBold)
                }
                
                HStack {
                    Text("Points Earned")
                        .foregroundColor(.megamesTextSecondary)
                    Spacer()
                    Text("+\(roundScore)")
                        .foregroundColor(.megamesSuccess)
                        .font(.megamesBodyBold)
                }
            }
            .font(.megamesBody)
            .padding(Spacing.lg)
            .background(Color.megamesCard)
            .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
            .padding(.horizontal, Spacing.xl)
            
            Spacer()
            
            VStack(spacing: Spacing.md) {
                if !isLastRound {
                    PrimaryButton("Next Round", icon: "arrow.right") {
                        onContinue()
                    }
                }
                
                SecondaryButton(isLastRound ? "See Results" : "End Game") {
                    onEndGame()
                }
            }
            .padding(.horizontal, Spacing.lg)
            .padding(.bottom, Spacing.xxl)
        }
    }
}

// MARK: - Game Over View
struct GameOverView: View {
    let players: [Player]
    let onPlayAgain: () -> Void
    let onExit: () -> Void
    
    var sortedPlayers: [Player] {
        players.sorted { $0.score > $1.score }
    }
    
    var body: some View {
        VStack(spacing: Spacing.xl) {
            Spacer()
            
            // Winner announcement
            if let winner = sortedPlayers.first {
                VStack(spacing: Spacing.md) {
                    Text("🏆")
                        .font(.system(size: 80))
                    
                    Text("\(winner.name) Wins!")
                        .font(.megamesTitle)
                        .foregroundColor(.megamesTextPrimary)
                    
                    Text("\(winner.score) points")
                        .font(.megamesSubheadline)
                        .foregroundColor(.megamesAccent)
                }
            }
            
            // Leaderboard
            VStack(spacing: Spacing.sm) {
                ForEach(Array(sortedPlayers.enumerated()), id: \.element.id) { index, player in
                    HStack {
                        Text("\(index + 1).")
                            .font(.megamesBodyBold)
                            .foregroundColor(index == 0 ? .megamesAccent : .megamesTextMuted)
                            .frame(width: 30)
                        
                        Text(player.name)
                            .font(.megamesBody)
                            .foregroundColor(.megamesTextPrimary)
                        
                        Spacer()
                        
                        Text("\(player.score)")
                            .font(.megamesBodyBold)
                            .foregroundColor(index == 0 ? .megamesAccent : .megamesTextSecondary)
                    }
                    .padding(Spacing.md)
                    .background(index == 0 ? Color.megamesAccent.opacity(0.1) : Color.megamesSurface)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium))
                }
            }
            .padding(.horizontal, Spacing.lg)
            
            Spacer()
            
            VStack(spacing: Spacing.md) {
                PrimaryButton("Play Again", icon: "arrow.counterclockwise") {
                    onPlayAgain()
                }
                
                SecondaryButton("Exit", icon: "xmark") {
                    onExit()
                }
            }
            .padding(.horizontal, Spacing.lg)
            .padding(.bottom, Spacing.xxl)
        }
    }
}

#Preview {
    DynamicDecksGameView(
        players: [Player(name: "Alice"), Player(name: "Bob")],
        difficulty: .medium,
        gameMode: .classic,
        maxRounds: 3,
        timerSeconds: 60
    )
}
