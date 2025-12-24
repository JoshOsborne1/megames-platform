// Multiplayer Types

export interface RoomPlayer {
    id: string;
    name: string;
    isHost: boolean;
    joinedAt: number;
}

export interface RoomState {
    roomCode: string;
    gameId: string;
    players: RoomPlayer[];
    hostId: string;
    status: "waiting" | "playing" | "finished";
    gameState: unknown; // Generic game state
    createdAt: number;
}

export type BroadcastEvent =
    | { type: "GAME_STATE_UPDATE"; payload: unknown }
    | { type: "PLAYER_ACTION"; payload: { playerId: string; action: string; data?: unknown } }
    | { type: "HOST_START_GAME"; payload: { gameState: unknown } }
    | { type: "ROOM_CLOSED"; payload: { reason: string } };

export interface PresenceState {
    id: string;
    name: string;
    online_at: string;
}
