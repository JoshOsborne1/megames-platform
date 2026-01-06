import SwiftUI

/// ViewModel for multiplayer lobby management
@MainActor
class LobbiesViewModel: ObservableObject {
    @Published var activeLobbyCode: String?
    @Published var lobbyPlayers: [RoomPlayer] = []
    @Published var isHost = false
    @Published var isLoading = false
    @Published var error: String?
    
    private var realtimeManager: RealtimeManager?
    
    // MARK: - Lobby Actions
    
    func createLobby(playerName: String, gameId: String) async {
        isLoading = true
        defer { isLoading = false }
        
        let playerId = UUID().uuidString
        realtimeManager = RealtimeManager(playerId: playerId, playerName: playerName)
        
        do {
            let code = try await realtimeManager?.createRoom(gameId: gameId)
            activeLobbyCode = code
            isHost = true
            
            // Start observing player changes
            observeRealtimeChanges()
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func joinLobby(code: String) {
        Task {
            await joinLobbyAsync(code: code)
        }
    }
    
    private func joinLobbyAsync(code: String) async {
        isLoading = true
        defer { isLoading = false }
        
        let playerId = UUID().uuidString
        let playerName = "Player" // TODO: Get from user profile
        realtimeManager = RealtimeManager(playerId: playerId, playerName: playerName)
        
        do {
            try await realtimeManager?.joinRoom(code: code)
            activeLobbyCode = code
            isHost = false
            
            observeRealtimeChanges()
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func leaveLobby() {
        Task {
            await realtimeManager?.leaveRoom()
            activeLobbyCode = nil
            lobbyPlayers = []
            isHost = false
            realtimeManager = nil
        }
    }
    
    func startGame() {
        guard isHost else { return }
        
        // Create initial game state and broadcast
        let gameState = GameState(
            players: lobbyPlayers.map { Player(id: $0.id, name: $0.name, score: 0) },
            currentPlayerIndex: 0,
            clueGiverIndex: 0,
            difficulty: .medium,
            gameMode: .classic,
            currentRound: 1,
            maxRounds: 3,
            score: 0,
            timer: 60,
            phase: .instructions,
            currentCard: nil,
            usedCardIds: [],
            roundScore: 0,
            skipsUsed: 0,
            cardsInRound: 0,
            maxCardsInRound: 10,
            deckId: "classic",
            lastWinnerId: nil
        )
        
        Task {
            try? await realtimeManager?.startGame(initialGameState: gameState)
        }
    }
    
    // MARK: - Realtime Observation
    
    private func observeRealtimeChanges() {
        guard let manager = realtimeManager else { return }
        
        // Observe player changes
        Task {
            for await players in manager.$players.values {
                await MainActor.run {
                    self.lobbyPlayers = players
                }
            }
        }
    }
}
