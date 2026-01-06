import SwiftUI

/// Lobbies list view for multiplayer
struct LobbiesView: View {
    @StateObject private var viewModel = LobbiesViewModel()
    @State private var showingCreateLobby = false
    @State private var showingJoinLobby = false
    @State private var joinCode = ""
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.megamesBackground
                    .ignoresSafeArea()
                
                VStack(spacing: Spacing.lg) {
                    // Action buttons
                    HStack(spacing: Spacing.md) {
                        PrimaryButton("Create Lobby", icon: "plus.circle.fill") {
                            showingCreateLobby = true
                        }
                        
                        SecondaryButton("Join", icon: "arrow.right.circle") {
                            showingJoinLobby = true
                        }
                    }
                    .padding(.horizontal, Spacing.lg)
                    .padding(.top, Spacing.md)
                    
                    // Join code input
                    if showingJoinLobby {
                        HStack(spacing: Spacing.sm) {
                            MegamesTextField("Enter room code", text: $joinCode, icon: "number")
                                .textInputAutocapitalization(.characters)
                            
                            Button {
                                viewModel.joinLobby(code: joinCode)
                            } label: {
                                Image(systemName: "arrow.right.circle.fill")
                                    .font(.system(size: 32))
                                    .foregroundColor(.megamesAccent)
                            }
                            .disabled(joinCode.count != 6)
                        }
                        .padding(.horizontal, Spacing.lg)
                    }
                    
                    // Active lobbies
                    if viewModel.activeLobbyCode != nil {
                        ActiveLobbyCard(viewModel: viewModel)
                            .padding(.horizontal, Spacing.lg)
                    }
                    
                    // Instructions when no active lobby
                    if viewModel.activeLobbyCode == nil {
                        VStack(spacing: Spacing.md) {
                            Spacer()
                            
                            Image(systemName: "person.2.circle")
                                .font(.system(size: 60))
                                .foregroundColor(.megamesTextMuted)
                            
                            Text("Play with Friends")
                                .font(.megamesSubheadline)
                                .foregroundColor(.megamesTextPrimary)
                            
                            Text("Create a lobby or join one with a code to play together!")
                                .font(.megamesCaption)
                                .foregroundColor(.megamesTextSecondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, Spacing.xl)
                            
                            Spacer()
                        }
                    }
                    
                    Spacer()
                }
            }
            .navigationTitle("Lobbies")
            .sheet(isPresented: $showingCreateLobby) {
                CreateLobbySheet(viewModel: viewModel, isPresented: $showingCreateLobby)
            }
        }
    }
}

struct ActiveLobbyCard: View {
    @ObservedObject var viewModel: LobbiesViewModel
    
    var body: some View {
        VStack(spacing: Spacing.md) {
            HStack {
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Text("Active Lobby")
                        .font(.megamesCaptionBold)
                        .foregroundColor(.megamesTextMuted)
                    
                    Text(viewModel.activeLobbyCode ?? "")
                        .font(.megamesHeadline)
                        .foregroundColor(.megamesAccent)
                        .kerning(4)
                }
                
                Spacer()
                
                Button {
                    UIPasteboard.general.string = viewModel.activeLobbyCode
                } label: {
                    Image(systemName: "doc.on.doc")
                        .foregroundColor(.megamesAccent)
                }
            }
            
            Divider()
                .background(Color.megamesTextMuted.opacity(0.3))
            
            // Players list
            VStack(alignment: .leading, spacing: Spacing.sm) {
                Text("Players (\(viewModel.lobbyPlayers.count))")
                    .font(.megamesCaptionBold)
                    .foregroundColor(.megamesTextMuted)
                
                ForEach(viewModel.lobbyPlayers) { player in
                    HStack {
                        Image(systemName: player.isHost ? "crown.fill" : "person.fill")
                            .foregroundColor(player.isHost ? .cardYellow : .megamesTextSecondary)
                        
                        Text(player.name)
                            .font(.megamesBody)
                            .foregroundColor(.megamesTextPrimary)
                        
                        Spacer()
                        
                        if player.isHost {
                            Text("Host")
                                .font(.megamesSmall)
                                .foregroundColor(.cardYellow)
                        }
                    }
                }
            }
            
            HStack(spacing: Spacing.md) {
                if viewModel.isHost {
                    PrimaryButton("Start Game", icon: "play.fill") {
                        viewModel.startGame()
                    }
                    .disabled(viewModel.lobbyPlayers.count < 2)
                }
                
                SecondaryButton("Leave") {
                    viewModel.leaveLobby()
                }
            }
        }
        .padding(Spacing.lg)
        .background(Color.megamesCard)
        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
        .overlay(
            RoundedRectangle(cornerRadius: CornerRadius.large)
                .stroke(Color.megamesAccent.opacity(0.3), lineWidth: 1)
        )
    }
}

struct CreateLobbySheet: View {
    @ObservedObject var viewModel: LobbiesViewModel
    @Binding var isPresented: Bool
    @State private var playerName = ""
    @State private var selectedGame = GameInfo.allGames[0]
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.megamesBackground
                    .ignoresSafeArea()
                
                VStack(spacing: Spacing.xl) {
                    MegamesTextField("Your Name", text: $playerName, icon: "person.fill")
                        .padding(.top, Spacing.lg)
                    
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Text("Select Game")
                            .font(.megamesCaptionBold)
                            .foregroundColor(.megamesTextMuted)
                        
                        ForEach(GameInfo.allGames) { game in
                            Button {
                                selectedGame = game
                            } label: {
                                HStack {
                                    Image(systemName: game.icon)
                                        .foregroundColor(game.accentColor)
                                    
                                    Text(game.name)
                                        .foregroundColor(.megamesTextPrimary)
                                    
                                    Spacer()
                                    
                                    if selectedGame.id == game.id {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundColor(.megamesAccent)
                                    }
                                }
                                .padding(Spacing.md)
                                .background(selectedGame.id == game.id ? Color.megamesSurfaceElevated : Color.megamesSurface)
                                .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium))
                            }
                        }
                    }
                    
                    Spacer()
                    
                    PrimaryButton("Create Lobby", icon: "plus.circle.fill") {
                        Task {
                            await viewModel.createLobby(playerName: playerName, gameId: selectedGame.id)
                            isPresented = false
                        }
                    }
                    .disabled(playerName.isEmpty)
                    .padding(.bottom, Spacing.lg)
                }
                .padding(.horizontal, Spacing.lg)
            }
            .navigationTitle("Create Lobby")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        isPresented = false
                    }
                    .foregroundColor(.megamesAccent)
                }
            }
        }
        .presentationDetents([.medium])
    }
}

#Preview {
    LobbiesView()
}
