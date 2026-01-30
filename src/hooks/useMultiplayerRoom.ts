"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security";
import { validatePlayerName, validateRoomCode } from "@/lib/security";
import { generateRoomCode } from "@/lib/core";

export interface RoomPlayer {
    id: string;
    user_id: string;
    display_name: string;
    is_ready: boolean;
    joined_at: string;
}

export interface Room {
    id: string;
    code: string;
    host_id: string;
    game_id: string | null;
    status: "waiting" | "playing" | "finished";
    is_public: boolean;
    max_players: number;
    created_at: string;
    updated_at: string;
}

interface UseMultiplayerRoomReturn {
    room: Room | null;
    players: RoomPlayer[];
    isHost: boolean;
    isLoading: boolean;
    error: string | null;
    createRoom: (displayName: string) => Promise<string | null>;
    joinRoom: (code: string, displayName: string) => Promise<boolean>;
    leaveRoom: () => Promise<void>;
    setGameId: (gameId: string | null) => Promise<void>;
    setIsPublic: (isPublic: boolean) => Promise<void>;
    setMaxPlayers: (max: number) => Promise<void>;
    setReady: (isReady: boolean) => Promise<void>;
    startGame: () => Promise<boolean>;
    kickPlayer: (playerId: string) => Promise<boolean>;
}

export function useMultiplayerRoom(): UseMultiplayerRoomReturn {
    const [room, setRoom] = useState<Room | null>(null);
    const [players, setPlayers] = useState<RoomPlayer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    const supabase = createClient();

    // Get current user
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: { id: string } | null } }) => {
            setUserId(user?.id || null);
        });
    }, []);

    const isHost = room ? room.host_id === userId : false;

    // Subscribe to room updates
    const subscribeToRoom = useCallback((roomId: string) => {
        const roomChannel = supabase
            .channel(`room:${roomId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
                (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
                    if (payload.eventType === "UPDATE") {
                        setRoom(payload.new as unknown as Room);
                    } else if (payload.eventType === "DELETE") {
                        setRoom(null);
                        setPlayers([]);
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` },
                async (payload: { eventType: string; new: Record<string, unknown>; old: RoomPlayer }) => {
                    // Handle player removal (kicked or left)
                    if (payload.eventType === "DELETE") {
                        const deletedPlayer = payload.old as RoomPlayer;
                        // If current user was kicked, clean up
                        if (deletedPlayer.user_id === userId) {
                            setRoom(null);
                            setPlayers([]);
                            setError("You were removed from the room");
                            if (channel) {
                                supabase.removeChannel(channel);
                                setChannel(null);
                            }
                            return;
                        }
                    }
                    
                    // Refetch all players when there's a change
                    const { data } = await supabase
                        .from("room_players")
                        .select("*")
                        .eq("room_id", roomId)
                        .order("joined_at");
                    if (data) setPlayers(data);
                }
            )
            .subscribe();

        setChannel(roomChannel);
        return roomChannel;
    }, [supabase, userId]);

    // Cleanup subscription on unmount
    useEffect(() => {
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [channel, supabase]);

    // Generate room code - using shared utility
    const getUniqueRoomCode = generateRoomCode;

    // Create a new room
    const createRoom = async (displayName: string): Promise<string | null> => {
        if (!userId) {
            setError("You must be logged in to create a room");
            return null;
        }

        // Rate limiting check
        if (!checkRateLimit(`${userId}:createRoom`, RATE_LIMITS.createRoom)) {
            setError("Too many rooms created. Please wait a minute.");
            return null;
        }

        // Validate display name
        const nameValidation = validatePlayerName(displayName);
        if (!nameValidation.valid) {
            setError(nameValidation.error || "Invalid display name");
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Generate unique code
            let code = getUniqueRoomCode();
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                const { data: existing } = await supabase
                    .from("rooms")
                    .select("id")
                    .eq("code", code)
                    .single();

                if (!existing) break;
                code = getUniqueRoomCode();
                attempts++;
            }

            // Create room
            const { data: newRoom, error: roomError } = await supabase
                .from("rooms")
                .insert({
                    code,
                    host_id: userId,
                    game_id: null,
                    status: "waiting",
                    is_public: true,
                    max_players: 6,
                })
                .select()
                .single();

            if (roomError) throw roomError;

            // Add host as first player
            const { error: playerError } = await supabase
                .from("room_players")
                .insert({
                    room_id: newRoom.id,
                    user_id: userId,
                    display_name: displayName,
                    is_ready: true,
                });

            if (playerError) throw playerError;

            // Set room state
            setRoom(newRoom);
            setPlayers([{
                id: crypto.randomUUID(),
                user_id: userId,
                display_name: displayName,
                is_ready: true,
                joined_at: new Date().toISOString(),
            }]);

            // Subscribe to updates
            subscribeToRoom(newRoom.id);

            return code;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create room");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Join an existing room
    const joinRoom = async (code: string, displayName: string): Promise<boolean> => {
        if (!userId) {
            setError("You must be logged in to join a room");
            return false;
        }

        // Rate limiting check
        if (!checkRateLimit(`${userId}:joinRoom`, RATE_LIMITS.joinRoom)) {
            setError("Too many join attempts. Please wait a minute.");
            return false;
        }

        // Validate room code
        const codeValidation = validateRoomCode(code);
        if (!codeValidation.valid) {
            setError(codeValidation.error || "Invalid room code");
            return false;
        }

        // Validate display name
        const nameValidation = validatePlayerName(displayName);
        if (!nameValidation.valid) {
            setError(nameValidation.error || "Invalid display name");
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Find room by code
            const { data: existingRoom, error: findError } = await supabase
                .from("rooms")
                .select("*")
                .eq("code", code.toUpperCase())
                .eq("status", "waiting")
                .single();

            if (findError || !existingRoom) {
                setError("Room not found or game already started");
                return false;
            }

            // Check player count
            const { count } = await supabase
                .from("room_players")
                .select("*", { count: "exact", head: true })
                .eq("room_id", existingRoom.id);

            if (count && count >= existingRoom.max_players) {
                setError("Room is full");
                return false;
            }

            // Check if already in room
            const { data: existingPlayer } = await supabase
                .from("room_players")
                .select("*")
                .eq("room_id", existingRoom.id)
                .eq("user_id", userId)
                .single();

            if (!existingPlayer) {
                // Add player to room
                const { error: joinError } = await supabase
                    .from("room_players")
                    .insert({
                        room_id: existingRoom.id,
                        user_id: userId,
                        display_name: displayName,
                        is_ready: false,
                    });

                if (joinError) throw joinError;
            }

            // Fetch all players
            const { data: allPlayers } = await supabase
                .from("room_players")
                .select("*")
                .eq("room_id", existingRoom.id)
                .order("joined_at");

            setRoom(existingRoom);
            setPlayers(allPlayers || []);

            // Subscribe to updates
            subscribeToRoom(existingRoom.id);

            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to join room");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Leave room with host migration
    const leaveRoom = async (): Promise<void> => {
        if (!room || !userId) return;

        try {
            // Remove player from room
            await supabase
                .from("room_players")
                .delete()
                .eq("room_id", room.id)
                .eq("user_id", userId);

            // If host leaves, try to migrate or delete
            if (isHost) {
                // Get remaining players
                const { data: remainingPlayers } = await supabase
                    .from("room_players")
                    .select("*")
                    .eq("room_id", room.id)
                    .order("joined_at")
                    .limit(1);

                if (remainingPlayers && remainingPlayers.length > 0) {
                    // Migrate host to oldest player
                    const newHost = remainingPlayers[0];
                    await supabase
                        .from("rooms")
                        .update({ host_id: newHost.user_id })
                        .eq("id", room.id);
                    console.log("Host migrated to:", newHost.display_name);
                } else {
                    // No players left, delete the room
                    await supabase.from("rooms").delete().eq("id", room.id);
                }
            }

            // Cleanup
            if (channel) {
                supabase.removeChannel(channel);
                setChannel(null);
            }
            setRoom(null);
            setPlayers([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to leave room");
        }
    };

    // Host: Kick a player from the room
    const kickPlayer = async (playerId: string): Promise<boolean> => {
        if (!room || !isHost) {
            setError("Only the host can kick players");
            return false;
        }

        // Can't kick yourself
        if (playerId === userId) {
            setError("Cannot kick yourself");
            return false;
        }

        try {
            const { error: kickError } = await supabase
                .from("room_players")
                .delete()
                .eq("room_id", room.id)
                .eq("user_id", playerId);

            if (kickError) throw kickError;
            
            console.log("Kicked player:", playerId);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to kick player");
            return false;
        }
    };

    // Host: Set game
    const setGameId = async (gameId: string | null): Promise<void> => {
        if (!room || !isHost) return;

        try {
            await supabase
                .from("rooms")
                .update({ game_id: gameId })
                .eq("id", room.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to set game");
        }
    };

    // Host: Set public/private
    const setIsPublic = async (isPublic: boolean): Promise<void> => {
        if (!room || !isHost) return;

        try {
            await supabase
                .from("rooms")
                .update({ is_public: isPublic })
                .eq("id", room.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update room");
        }
    };

    // Host: Set max players
    const setMaxPlayers = async (max: number): Promise<void> => {
        if (!room || !isHost) return;

        try {
            await supabase
                .from("rooms")
                .update({ max_players: max })
                .eq("id", room.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update room");
        }
    };

    // Player: Set ready status
    const setReady = async (isReady: boolean): Promise<void> => {
        if (!room || !userId) return;

        try {
            await supabase
                .from("room_players")
                .update({ is_ready: isReady })
                .eq("room_id", room.id)
                .eq("user_id", userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update status");
        }
    };

    // Host: Start game
    const startGame = async (): Promise<boolean> => {
        if (!room || !isHost || !room.game_id) return false;

        try {
            await supabase
                .from("rooms")
                .update({ status: "playing" })
                .eq("id", room.id);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to start game");
            return false;
        }
    };

    return {
        room,
        players,
        isHost,
        isLoading,
        error,
        createRoom,
        joinRoom,
        leaveRoom,
        setGameId,
        setIsPublic,
        setMaxPlayers,
        setReady,
        startGame,
        kickPlayer,
    };
}
