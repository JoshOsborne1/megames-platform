import SwiftUI

/// Game setup view for configuring players and game options
struct GameSetupView: View {
    let game: GameInfo
    
    @State private var players: [Player] = [
        Player(name: ""),
        Player(name: "")
    ]
    @State private var difficulty: GameState.Difficulty = .medium
    @State private var gameMode: GameState.GameMode = .classic
    @State private var selectedDeckId = "classic"
    @State private var maxRounds = 3
    @State private var timerSeconds = 60
    
    @State private var isStartingGame = false
    @State private var showingGame = false
    
    var canStartGame: Bool {
        let validPlayers = players.filter { !$0.name.trimmingCharacters(in: .whitespaces).isEmpty }
        return validPlayers.count >= 2
    }
    
    var body: some View {
        ZStack {
            Color.megamesBackground
                .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: Spacing.xl) {
                    // Players section
                    VStack(alignment: .leading, spacing: Spacing.md) {
                        HStack {
                            Text("Players")
                                .font(.megamesSubheadline)
                                .foregroundColor(.megamesTextPrimary)
                            
                            Spacer()
                            
                            Button {
                                withAnimation {
                                    players.append(Player(name: ""))
                                }
                            } label: {
                                Image(systemName: "plus.circle.fill")
                                    .foregroundColor(.megamesAccent)
                            }
                        }
                        
                        ForEach(Array(players.enumerated()), id: \.element.id) { index, player in
                            HStack {
                                MegamesTextField(
                                    "Player \(index + 1)",
                                    text: Binding(
                                        get: { players[index].name },
                                        set: { players[index].name = $0 }
                                    ),
                                    icon: "person.fill"
                                )
                                
                                if players.count > 2 {
                                    Button {
                                        withAnimation {
                                            players.remove(at: index)
                                        }
                                    } label: {
                                        Image(systemName: "xmark.circle.fill")
                                            .foregroundColor(.megamesError)
                                    }
                                }
                            }
                        }
                    }
                    .padding(Spacing.lg)
                    .background(Color.megamesCard)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
                    
                    // Game options section
                    VStack(alignment: .leading, spacing: Spacing.md) {
                        Text("Game Options")
                            .font(.megamesSubheadline)
                            .foregroundColor(.megamesTextPrimary)
                        
                        // Difficulty picker
                        VStack(alignment: .leading, spacing: Spacing.xs) {
                            Text("Difficulty")
                                .font(.megamesCaption)
                                .foregroundColor(.megamesTextSecondary)
                            
                            Picker("Difficulty", selection: $difficulty) {
                                ForEach(GameState.Difficulty.allCases, id: \.self) { diff in
                                    Text(diff.displayName).tag(diff)
                                }
                            }
                            .pickerStyle(.segmented)
                        }
                        
                        // Game mode picker
                        VStack(alignment: .leading, spacing: Spacing.xs) {
                            Text("Game Mode")
                                .font(.megamesCaption)
                                .foregroundColor(.megamesTextSecondary)
                            
                            Picker("Mode", selection: $gameMode) {
                                ForEach(GameState.GameMode.allCases, id: \.self) { mode in
                                    Text(mode.displayName).tag(mode)
                                }
                            }
                            .pickerStyle(.segmented)
                        }
                        
                        // Rounds stepper
                        HStack {
                            Text("Rounds")
                                .font(.megamesBody)
                                .foregroundColor(.megamesTextPrimary)
                            
                            Spacer()
                            
                            Stepper("\(maxRounds)", value: $maxRounds, in: 1...10)
                                .foregroundColor(.megamesTextSecondary)
                        }
                        
                        // Timer stepper
                        HStack {
                            Text("Timer (seconds)")
                                .font(.megamesBody)
                                .foregroundColor(.megamesTextPrimary)
                            
                            Spacer()
                            
                            Stepper("\(timerSeconds)s", value: $timerSeconds, in: 30...120, step: 15)
                                .foregroundColor(.megamesTextSecondary)
                        }
                    }
                    .padding(Spacing.lg)
                    .background(Color.megamesCard)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
                    
                    // Start game button
                    PrimaryButton(
                        "Start Game",
                        icon: "play.fill",
                        isLoading: isStartingGame
                    ) {
                        startGame()
                    }
                    .disabled(!canStartGame)
                    .opacity(canStartGame ? 1 : 0.5)
                    
                    if !canStartGame {
                        Text("Enter at least 2 player names to start")
                            .font(.megamesSmall)
                            .foregroundColor(.megamesTextMuted)
                    }
                }
                .padding(Spacing.lg)
            }
        }
        .navigationTitle("Setup \(game.name)")
        .navigationBarTitleDisplayMode(.inline)
        .fullScreenCover(isPresented: $showingGame) {
            DynamicDecksGameView(
                players: players.filter { !$0.name.isEmpty },
                difficulty: difficulty,
                gameMode: gameMode,
                maxRounds: maxRounds,
                timerSeconds: timerSeconds
            )
        }
    }
    
    private func startGame() {
        isStartingGame = true
        
        // Filter empty player names
        players = players.filter { !$0.name.trimmingCharacters(in: .whitespaces).isEmpty }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            isStartingGame = false
            showingGame = true
        }
    }
}

#Preview {
    NavigationStack {
        GameSetupView(game: GameInfo.allGames[0])
    }
}
