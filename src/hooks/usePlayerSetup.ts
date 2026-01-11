"use client";

import { useState, useCallback, useMemo } from "react";

/**
 * Player type for game setup (minimal - just id and name)
 * This is intentionally separate from game-specific Player types
 * that may include score, team, etc.
 */
export interface SetupPlayer {
    id: string;
    name: string;
}

interface UsePlayerSetupOptions {
    /** Minimum number of players required (default: 2) */
    minPlayers?: number;
    /** Maximum number of players allowed (default: 8) */
    maxPlayers?: number;
    /** Initial players to start with (default: empty array) */
    initialPlayers?: SetupPlayer[];
}

interface UsePlayerSetupReturn {
    /** Current list of players */
    players: SetupPlayer[];
    /** Current value of the "add player" input field */
    newPlayerName: string;
    /** Update the "add player" input field */
    setNewPlayerName: (name: string) => void;
    /** Add a new player with the current newPlayerName */
    addPlayer: () => void;
    /** Remove a player by ID */
    removePlayer: (id: string) => void;
    /** Update a player's name by ID */
    updatePlayerName: (id: string, name: string) => void;
    /** Whether the game can start (enough players with valid names) */
    canStart: boolean;
    /** Whether more players can be added */
    canAddMore: boolean;
    /** Whether players can be removed (above minimum) */
    canRemove: boolean;
    /** Number of valid players (with non-empty names) */
    validPlayerCount: number;
    /** Reset players to initial state */
    resetPlayers: () => void;
    /** Set players directly (useful for multiplayer room sync) */
    setPlayers: (players: SetupPlayer[]) => void;
}

/**
 * Generates a unique player ID
 */
function createPlayerId(): string {
    return `player-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Shared hook for player management in game setup screens.
 * Extracts common logic from GameSetup, LyricLegends, ShadeSignals, QuizGameSetup, etc.
 * 
 * @example
 * ```tsx
 * const {
 *   players,
 *   newPlayerName,
 *   setNewPlayerName,
 *   addPlayer,
 *   removePlayer,
 *   updatePlayerName,
 *   canStart,
 * } = usePlayerSetup({ minPlayers: 2, maxPlayers: 8 });
 * ```
 */
export function usePlayerSetup(options: UsePlayerSetupOptions = {}): UsePlayerSetupReturn {
    const {
        minPlayers = 2,
        maxPlayers = 8,
        initialPlayers = [],
    } = options;

    const [players, setPlayers] = useState<SetupPlayer[]>(initialPlayers);
    const [newPlayerName, setNewPlayerName] = useState("");

    const addPlayer = useCallback(() => {
        const trimmedName = newPlayerName.trim();
        if (!trimmedName || players.length >= maxPlayers) return;

        setPlayers(prev => [
            ...prev,
            { id: createPlayerId(), name: trimmedName }
        ]);
        setNewPlayerName("");
    }, [newPlayerName, players.length, maxPlayers]);

    const removePlayer = useCallback((id: string) => {
        setPlayers(prev => prev.filter(p => p.id !== id));
    }, []);

    const updatePlayerName = useCallback((id: string, name: string) => {
        setPlayers(prev => prev.map(p =>
            p.id === id ? { ...p, name } : p
        ));
    }, []);

    const resetPlayers = useCallback(() => {
        setPlayers(initialPlayers);
        setNewPlayerName("");
    }, [initialPlayers]);

    // Derived state
    const validPlayerCount = useMemo(
        () => players.filter(p => p.name.trim()).length,
        [players]
    );

    const canStart = useMemo(
        () => players.length >= minPlayers && players.every(p => p.name.trim()),
        [players, minPlayers]
    );

    const canAddMore = players.length < maxPlayers;
    const canRemove = players.length > minPlayers;

    return {
        players,
        newPlayerName,
        setNewPlayerName,
        addPlayer,
        removePlayer,
        updatePlayerName,
        canStart,
        canAddMore,
        canRemove,
        validPlayerCount,
        resetPlayers,
        setPlayers,
    };
}
