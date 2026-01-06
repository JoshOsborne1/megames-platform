import Foundation
import Supabase
import Realtime

/// Manages real-time multiplayer room connections
/// Mirrors the web's RoomManager functionality
@MainActor
class RealtimeManager: ObservableObject {
    @Published var players: [RoomPlayer] = []
    @Published var roomStatus: RoomStatus = .waiting
    @Published var isConnected = false
    @Published var error: String?
    
    private let supabase = SupabaseManager.shared.client
    private var channel: RealtimeChannelV2?
    private var roomCode: String?
    
    let playerId: String
    let playerName: String
    
    init(playerId: String, playerName: String) {
        self.playerId = playerId
        self.playerName = playerName
    }
    
    // MARK: - Room Management
    
    /// Create a new room and become the host
    func createRoom(gameId: String) async throws -> String {
        let code = generateRoomCode()
        roomCode = code
        
        try await subscribeToRoom(code: code, isHost: true, gameId: gameId)
        return code
    }
    
    /// Join an existing room
    func joinRoom(code: String) async throws {
        roomCode = code
        try await subscribeToRoom(code: code, isHost: false, gameId: nil)
    }
    
    /// Leave the current room
    func leaveRoom() async {
        guard let channel = channel else { return }
        await supabase.realtime.removeChannel(channel)
        self.channel = nil
        self.roomCode = nil
        self.players = []
        self.isConnected = false
    }
    
    // MARK: - Game Actions
    
    /// Broadcast game state update (host only)
    func broadcastGameState(_ gameState: GameState) async throws {
        guard let channel = channel else { return }
        
        let event = BroadcastEvent(
            type: .gameStateUpdate,
            payload: gameState
        )
        
        try await channel.broadcast(event: "game_event", message: event.asDictionary())
    }
    
    /// Send a player action
    func sendPlayerAction(action: String, data: [String: Any]? = nil) async throws {
        guard let channel = channel else { return }
        
        let actionEvent = PlayerActionEvent(
            playerId: playerId,
            action: action,
            data: data
        )
        
        try await channel.broadcast(event: "player_action", message: actionEvent.asDictionary())
    }
    
    /// Start the game (host only)
    func startGame(initialGameState: GameState) async throws {
        guard let channel = channel else { return }
        
        let startEvent = BroadcastEvent(
            type: .hostStartGame,
            payload: initialGameState
        )
        
        try await channel.broadcast(event: "game_event", message: startEvent.asDictionary())
        roomStatus = .playing
    }
    
    // MARK: - Private Methods
    
    private func subscribeToRoom(code: String, isHost: Bool, gameId: String?) async throws {
        let channelName = "room:\(code)"
        
        channel = supabase.realtime.channel(channelName)
        
        guard let channel = channel else { return }
        
        // Handle presence for player tracking
        let presence = channel.presenceV2
        
        Task {
            for await presenceState in presence.onChange {
                await handlePresenceChange(presenceState)
            }
        }
        
        // Handle broadcast events
        let broadcast = channel.broadcastStream(event: "game_event")
        
        Task {
            for await message in broadcast {
                await handleBroadcast(message)
            }
        }
        
        // Handle player actions
        let playerActions = channel.broadcastStream(event: "player_action")
        
        Task {
            for await action in playerActions {
                await handlePlayerAction(action)
            }
        }
        
        // Subscribe and track presence
        await channel.subscribe()
        
        try await presence.track([
            "id": playerId,
            "name": playerName,
            "isHost": isHost
        ])
        
        isConnected = true
    }
    
    private func handlePresenceChange(_ state: [String: [PresenceV2]]) async {
        players = state.values.flatMap { presences in
            presences.compactMap { presence -> RoomPlayer? in
                guard let payload = presence.payload as? [String: Any],
                      let id = payload["id"] as? String,
                      let name = payload["name"] as? String,
                      let isHost = payload["isHost"] as? Bool else {
                    return nil
                }
                return RoomPlayer(
                    id: id,
                    name: name,
                    isHost: isHost,
                    joinedAt: Date()
                )
            }
        }
    }
    
    private func handleBroadcast(_ message: JSONObject) async {
        // Handle game state updates, host start, room closed events
        if let typeString = message["type"]?.stringValue {
            switch typeString {
            case "GAME_STATE_UPDATE":
                // Notify listeners of game state change
                break
            case "HOST_START_GAME":
                roomStatus = .playing
            case "ROOM_CLOSED":
                await leaveRoom()
            default:
                break
            }
        }
    }
    
    private func handlePlayerAction(_ action: JSONObject) async {
        // Handle incoming player actions
        // This will be used by the game view models
    }
    
    private func generateRoomCode() -> String {
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        return String((0..<6).map { _ in chars.randomElement()! })
    }
}

// MARK: - Supporting Types

struct RoomPlayer: Identifiable, Equatable {
    let id: String
    let name: String
    let isHost: Bool
    let joinedAt: Date
}

enum RoomStatus: String {
    case waiting
    case playing
    case finished
}

enum BroadcastEventType: String, Codable {
    case gameStateUpdate = "GAME_STATE_UPDATE"
    case hostStartGame = "HOST_START_GAME"
    case roomClosed = "ROOM_CLOSED"
}

struct BroadcastEvent<T: Codable>: Codable {
    let type: BroadcastEventType
    let payload: T
    
    func asDictionary() -> [String: Any] {
        ["type": type.rawValue, "payload": payload]
    }
}

struct PlayerActionEvent {
    let playerId: String
    let action: String
    let data: [String: Any]?
    
    func asDictionary() -> [String: Any] {
        var dict: [String: Any] = [
            "playerId": playerId,
            "action": action
        ]
        if let data = data {
            dict["data"] = data
        }
        return dict
    }
}
