// Room Manager - Handles Supabase Realtime for multiplayer
"use client";

import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { RoomPlayer, RoomState, BroadcastEvent, PresenceState } from "./types";

// Generate a random room code
export function generateRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Generate a random player ID
export function generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export class RoomManager {
    private supabase = createClient();
    private channel: RealtimeChannel | null = null;
    private roomState: RoomState | null = null;
    private playerId: string;
    private playerName: string;

    // Callbacks
    private onPlayersChange?: (players: RoomPlayer[]) => void;
    private onGameStateChange?: (gameState: unknown) => void;
    private onRoomStatusChange?: (status: RoomState["status"]) => void;
    private onError?: (error: string) => void;
    private onPlayerAction?: (playerId: string, action: string, data?: unknown) => void;

    constructor(playerId: string, playerName: string) {
        this.playerId = playerId;
        this.playerName = playerName;
    }

    // Set up event handlers
    setHandlers(handlers: {
        onPlayersChange?: (players: RoomPlayer[]) => void;
        onGameStateChange?: (gameState: unknown) => void;
        onRoomStatusChange?: (status: RoomState["status"]) => void;
        onError?: (error: string) => void;
        onPlayerAction?: (playerId: string, action: string, data?: unknown) => void;
    }) {
        this.onPlayersChange = handlers.onPlayersChange;
        this.onGameStateChange = handlers.onGameStateChange;
        this.onRoomStatusChange = handlers.onRoomStatusChange;
        this.onError = handlers.onError;
        this.onPlayerAction = handlers.onPlayerAction;
    }

    // Create a new room (host)
    async createRoom(gameId: string): Promise<string> {
        const roomCode = generateRoomCode();

        this.roomState = {
            roomCode,
            gameId,
            players: [{
                id: this.playerId,
                name: this.playerName,
                isHost: true,
                joinedAt: Date.now(),
            }],
            hostId: this.playerId,
            status: "waiting",
            gameState: null,
            createdAt: Date.now(),
        };

        await this.subscribeToRoom(roomCode);
        return roomCode;
    }

    // Join an existing room
    async joinRoom(roomCode: string): Promise<boolean> {
        try {
            await this.subscribeToRoom(roomCode);
            return true;
        } catch (error) {
            this.onError?.(`Failed to join room: ${error}`);
            return false;
        }
    }

    // Subscribe to a room's realtime channel
    private async subscribeToRoom(roomCode: string) {
        const channelName = `room:${roomCode}`;

        this.channel = this.supabase.channel(channelName, {
            config: {
                broadcast: { self: true },
                presence: { key: this.playerId },
            },
        });

        // Handle presence (players joining/leaving)
        this.channel.on("presence", { event: "sync" }, () => {
            const presenceState = this.channel?.presenceState() || {};
            const players: RoomPlayer[] = [];

            Object.entries(presenceState).forEach(([key, presences]) => {
                const presence = (presences as PresenceState[])[0];
                if (presence) {
                    players.push({
                        id: key,
                        name: presence.name,
                        isHost: this.roomState?.hostId === key,
                        joinedAt: new Date(presence.online_at).getTime(),
                    });
                }
            });

            if (this.roomState) {
                this.roomState.players = players;
            }

            this.onPlayersChange?.(players);
            console.log("[Multiplayer] Players synced:", players.map(p => p.name));
        });

        // Handle broadcast events (game state, actions)
        this.channel.on("broadcast", { event: "game_event" }, ({ payload }) => {
            const event = payload as BroadcastEvent;
            console.log("[Multiplayer] Received event:", event.type);

            switch (event.type) {
                case "GAME_STATE_UPDATE":
                    if (this.roomState) {
                        this.roomState.gameState = event.payload;
                    }
                    this.onGameStateChange?.(event.payload);
                    break;

                case "PLAYER_ACTION":
                    this.onPlayerAction?.(
                        event.payload.playerId,
                        event.payload.action,
                        event.payload.data
                    );
                    break;

                case "HOST_START_GAME":
                    if (this.roomState) {
                        this.roomState.status = "playing";
                        this.roomState.gameState = event.payload.gameState;
                    }
                    this.onRoomStatusChange?.("playing");
                    this.onGameStateChange?.(event.payload.gameState);
                    break;

                case "ROOM_CLOSED":
                    this.onError?.(`Room closed: ${event.payload.reason}`);
                    this.leaveRoom();
                    break;
            }
        });

        // Subscribe and track presence
        await this.channel.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                await this.channel?.track({
                    id: this.playerId,
                    name: this.playerName,
                    online_at: new Date().toISOString(),
                });
                console.log(`[Multiplayer] Joined room ${roomCode} as ${this.playerName}`);
            }
        });
    }

    // Broadcast game state to all players (host only)
    broadcastGameState(gameState: unknown) {
        if (!this.channel) {
            console.error("[Multiplayer] No channel connected");
            return;
        }

        this.channel.send({
            type: "broadcast",
            event: "game_event",
            payload: {
                type: "GAME_STATE_UPDATE",
                payload: gameState,
            } as BroadcastEvent,
        });
    }

    // Send a player action (any player)
    sendPlayerAction(action: string, data?: unknown) {
        if (!this.channel) {
            console.error("[Multiplayer] No channel connected");
            return;
        }

        this.channel.send({
            type: "broadcast",
            event: "game_event",
            payload: {
                type: "PLAYER_ACTION",
                payload: { playerId: this.playerId, action, data },
            } as BroadcastEvent,
        });
    }

    // Start the game (host only)
    startGame(initialGameState: unknown) {
        if (!this.channel) {
            console.error("[Multiplayer] No channel connected");
            return;
        }

        this.channel.send({
            type: "broadcast",
            event: "game_event",
            payload: {
                type: "HOST_START_GAME",
                payload: { gameState: initialGameState },
            } as BroadcastEvent,
        });
    }

    // Leave the current room
    leaveRoom() {
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
        }
        this.roomState = null;
        console.log("[Multiplayer] Left room");
    }

    // Getters
    getPlayerId() { return this.playerId; }
    getPlayerName() { return this.playerName; }
    getRoomState() { return this.roomState; }
    isHost() { return this.roomState?.hostId === this.playerId; }
    isConnected() { return this.channel !== null; }
}
