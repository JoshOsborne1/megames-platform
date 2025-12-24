// React hook for multiplayer functionality
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RoomManager, generatePlayerId } from "./room-manager";
import { RoomPlayer } from "./types";

interface UseMultiplayerOptions {
    playerName: string;
    onGameStateChange?: (gameState: unknown) => void;
    onPlayerAction?: (playerId: string, action: string, data?: unknown) => void;
}

interface UseMultiplayerReturn {
    // Connection state
    isConnected: boolean;
    isHost: boolean;
    roomCode: string | null;
    players: RoomPlayer[];
    error: string | null;

    // Actions
    createRoom: (gameId: string) => Promise<string>;
    joinRoom: (roomCode: string) => Promise<boolean>;
    leaveRoom: () => void;

    // Game actions
    broadcastGameState: (gameState: unknown) => void;
    sendPlayerAction: (action: string, data?: unknown) => void;
    startGame: (initialGameState: unknown) => void;

    // Player info
    playerId: string;
}

export function useMultiplayer(options: UseMultiplayerOptions): UseMultiplayerReturn {
    const { playerName, onGameStateChange, onPlayerAction } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [players, setPlayers] = useState<RoomPlayer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);

    const roomManagerRef = useRef<RoomManager | null>(null);
    const playerIdRef = useRef<string>(generatePlayerId());

    // Use refs for callbacks to avoid stale closures
    const onGameStateChangeRef = useRef(onGameStateChange);
    const onPlayerActionRef = useRef(onPlayerAction);

    // Update refs when callbacks change
    useEffect(() => {
        onGameStateChangeRef.current = onGameStateChange;
    }, [onGameStateChange]);

    useEffect(() => {
        onPlayerActionRef.current = onPlayerAction;
    }, [onPlayerAction]);

    // Initialize room manager once
    useEffect(() => {
        if (!roomManagerRef.current) {
            roomManagerRef.current = new RoomManager(playerIdRef.current, playerName);

            roomManagerRef.current.setHandlers({
                onPlayersChange: (newPlayers) => {
                    console.log("[useMultiplayer] Players updated:", newPlayers.length);
                    setPlayers([...newPlayers]); // Create new array to ensure React re-renders
                    setIsHost(roomManagerRef.current?.isHost() || false);
                },
                onGameStateChange: (gameState) => {
                    console.log("[useMultiplayer] Game state received:", gameState);
                    onGameStateChangeRef.current?.(gameState);
                },
                onPlayerAction: (pId, action, data) => {
                    console.log("[useMultiplayer] Player action:", pId, action);
                    onPlayerActionRef.current?.(pId, action, data);
                },
                onRoomStatusChange: (status) => {
                    console.log("[useMultiplayer] Room status:", status);
                },
                onError: (err) => {
                    setError(err);
                    console.error("[useMultiplayer] Error:", err);
                },
            });
        }

        return () => {
            roomManagerRef.current?.leaveRoom();
            roomManagerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    const createRoom = useCallback(async (gameId: string): Promise<string> => {
        // Recreate manager if needed
        if (!roomManagerRef.current) {
            roomManagerRef.current = new RoomManager(playerIdRef.current, playerName);
            roomManagerRef.current.setHandlers({
                onPlayersChange: (newPlayers) => {
                    setPlayers([...newPlayers]);
                    setIsHost(roomManagerRef.current?.isHost() || false);
                },
                onGameStateChange: (gameState) => {
                    onGameStateChangeRef.current?.(gameState);
                },
                onPlayerAction: (pId, action, data) => {
                    onPlayerActionRef.current?.(pId, action, data);
                },
                onRoomStatusChange: () => { },
                onError: (err) => setError(err),
            });
        }

        const code = await roomManagerRef.current.createRoom(gameId);
        setRoomCode(code);
        setIsConnected(true);
        setIsHost(true);
        setError(null);
        return code;
    }, [playerName]);

    const joinRoom = useCallback(async (code: string): Promise<boolean> => {
        // Recreate manager if needed
        if (!roomManagerRef.current) {
            roomManagerRef.current = new RoomManager(playerIdRef.current, playerName);
            roomManagerRef.current.setHandlers({
                onPlayersChange: (newPlayers) => {
                    setPlayers([...newPlayers]);
                    setIsHost(roomManagerRef.current?.isHost() || false);
                },
                onGameStateChange: (gameState) => {
                    onGameStateChangeRef.current?.(gameState);
                },
                onPlayerAction: (pId, action, data) => {
                    onPlayerActionRef.current?.(pId, action, data);
                },
                onRoomStatusChange: () => { },
                onError: (err) => setError(err),
            });
        }

        const success = await roomManagerRef.current.joinRoom(code);
        if (success) {
            setRoomCode(code);
            setIsConnected(true);
            setError(null);
        }
        return success;
    }, [playerName]);

    const leaveRoom = useCallback(() => {
        roomManagerRef.current?.leaveRoom();
        setRoomCode(null);
        setIsConnected(false);
        setPlayers([]);
        setIsHost(false);
    }, []);

    const broadcastGameState = useCallback((gameState: unknown) => {
        roomManagerRef.current?.broadcastGameState(gameState);
    }, []);

    const sendPlayerAction = useCallback((action: string, data?: unknown) => {
        roomManagerRef.current?.sendPlayerAction(action, data);
    }, []);

    const startGame = useCallback((initialGameState: unknown) => {
        roomManagerRef.current?.startGame(initialGameState);
    }, []);

    return {
        isConnected,
        isHost,
        roomCode,
        players,
        error,
        createRoom,
        joinRoom,
        leaveRoom,
        broadcastGameState,
        sendPlayerAction,
        startGame,
        playerId: playerIdRef.current,
    };
}

