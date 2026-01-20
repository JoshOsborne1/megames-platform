"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { GameConfig, GAMES } from "@/config/games";
import { useMultiplayerRoom } from "@/hooks/useMultiplayerRoom";

interface RoomContextPlayer {
    id: string;
    name: string;
    isHost: boolean;
    isReady: boolean;
}

interface RoomState {
    isActive: boolean;
    roomCode: string;
    roomId: string | null;
    isHost: boolean;
    selectedGame: GameConfig | null;
    players: RoomContextPlayer[];
    isPublic: boolean;
    maxPlayers: number;
    status: "waiting" | "playing" | "finished";
}

interface RoomContextType {
    room: RoomState;
    isLoading: boolean;
    error: string | null;
    createRoom: (username: string) => Promise<string | null>;
    joinRoom: (code: string, username: string) => Promise<boolean>;
    leaveRoom: () => Promise<void>;
    setSelectedGame: (game: GameConfig | null) => Promise<void>;
    setIsPublic: (isPublic: boolean) => Promise<void>;
    setMaxPlayers: (max: number) => Promise<void>;
    setReady: (isReady: boolean) => Promise<void>;
    startGame: () => Promise<boolean>;
    kickPlayer: (playerId: string) => Promise<boolean>;
}

const defaultRoom: RoomState = {
    isActive: false,
    roomCode: "",
    roomId: null,
    isHost: false,
    selectedGame: null,
    players: [],
    isPublic: true,
    maxPlayers: 6,
    status: "waiting",
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
    const {
        room: dbRoom,
        players: dbPlayers,
        isHost,
        isLoading,
        error,
        createRoom: dbCreateRoom,
        joinRoom: dbJoinRoom,
        leaveRoom: dbLeaveRoom,
        setGameId,
        setIsPublic: dbSetIsPublic,
        setMaxPlayers: dbSetMaxPlayers,
        setReady: dbSetReady,
        startGame: dbStartGame,
        kickPlayer: dbKickPlayer,
    } = useMultiplayerRoom();

    // Transform DB data to context format
    const room: RoomState = dbRoom
        ? {
            isActive: true,
            roomCode: dbRoom.code,
            roomId: dbRoom.id,
            isHost,
            selectedGame: dbRoom.game_id ? GAMES.find(g => g.id === dbRoom.game_id) || null : null,
            players: dbPlayers.map(p => ({
                id: p.user_id,
                name: p.display_name,
                isHost: p.user_id === dbRoom.host_id,
                isReady: p.is_ready,
            })),
            isPublic: dbRoom.is_public,
            maxPlayers: dbRoom.max_players,
            status: dbRoom.status,
        }
        : defaultRoom;

    const createRoom = useCallback(async (username: string): Promise<string | null> => {
        return dbCreateRoom(username);
    }, [dbCreateRoom]);

    const joinRoom = useCallback(async (code: string, username: string): Promise<boolean> => {
        return dbJoinRoom(code, username);
    }, [dbJoinRoom]);

    const leaveRoom = useCallback(async (): Promise<void> => {
        await dbLeaveRoom();
    }, [dbLeaveRoom]);

    const setSelectedGame = useCallback(async (game: GameConfig | null): Promise<void> => {
        await setGameId(game?.id || null);
    }, [setGameId]);

    const setIsPublic = useCallback(async (isPublic: boolean): Promise<void> => {
        await dbSetIsPublic(isPublic);
    }, [dbSetIsPublic]);

    const setMaxPlayers = useCallback(async (max: number): Promise<void> => {
        await dbSetMaxPlayers(max);
    }, [dbSetMaxPlayers]);

    const setReady = useCallback(async (isReady: boolean): Promise<void> => {
        await dbSetReady(isReady);
    }, [dbSetReady]);

    const startGame = useCallback(async (): Promise<boolean> => {
        return dbStartGame();
    }, [dbStartGame]);

    const kickPlayer = useCallback(async (playerId: string): Promise<boolean> => {
        return dbKickPlayer(playerId);
    }, [dbKickPlayer]);

    return (
        <RoomContext.Provider
            value={{
                room,
                isLoading,
                error,
                createRoom,
                joinRoom,
                leaveRoom,
                setSelectedGame,
                setIsPublic,
                setMaxPlayers,
                setReady,
                startGame,
                kickPlayer,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
}

export function useRoom() {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error("useRoom must be used within RoomProvider");
    }
    return context;
}
