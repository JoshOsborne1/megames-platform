"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, Plus } from "lucide-react";

export interface Player {
    id: string;
    name: string;
    teamId?: number;
}

interface PlayerManagerProps {
    /** Current list of players */
    players: Player[];
    /** Callback when players list changes */
    onPlayersChange: (players: Player[]) => void;
    /** Minimum players required (default: 2) */
    minPlayers?: number;
    /** Maximum players allowed (default: 10) */
    maxPlayers?: number;
    /** Whether to assign teams automatically */
    assignTeams?: boolean;
    /** Number of teams for team assignment */
    teamCount?: number;
    /** Optional accent color (default: #ff006e) */
    accentColor?: string;
    /** Label for the section (default: "Players") */
    label?: string;
}

export function PlayerManager({
    players,
    onPlayersChange,
    minPlayers = 2,
    maxPlayers = 10,
    assignTeams = false,
    teamCount = 2,
    accentColor = "#ff006e",
    label = "Players",
}: PlayerManagerProps) {
    const [newPlayerName, setNewPlayerName] = useState("");

    const generatePlayerId = () => {
        return `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const addPlayer = () => {
        if (!newPlayerName.trim() || players.length >= maxPlayers) return;

        const newPlayer: Player = {
            id: generatePlayerId(),
            name: newPlayerName.trim(),
            teamId: assignTeams ? players.length % teamCount : undefined,
        };

        onPlayersChange([...players, newPlayer]);
        setNewPlayerName("");
    };

    const removePlayer = (id: string) => {
        // Allow removal but don't go below 0
        const updated = players.filter((p) => p.id !== id);
        // Reassign teams if needed
        if (assignTeams) {
            onPlayersChange(
                updated.map((p, i) => ({ ...p, teamId: i % teamCount }))
            );
        } else {
            onPlayersChange(updated);
        }
    };

    const updatePlayerName = (id: string, name: string) => {
        onPlayersChange(
            players.map((p) => (p.id === id ? { ...p, name } : p))
        );
    };

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4" style={{ color: accentColor }}>
                <Users className="w-5 h-5" />
                <h3 className="font-display font-bold text-xl uppercase tracking-wider">
                    {label} ({minPlayers}-{maxPlayers})
                </h3>
            </div>

            {/* Player List */}
            <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {players.map((player, index) => (
                    <motion.div
                        key={player.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-colors"
                    >
                        {/* Player Number */}
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-pixel text-xs text-white/50 flex-shrink-0">
                            {index + 1}
                        </div>

                        {/* Editable Name */}
                        <input
                            type="text"
                            value={player.name}
                            onChange={(e) => updatePlayerName(player.id, e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-white font-space font-bold placeholder-white/20 min-w-0"
                            placeholder={`Player ${index + 1}`}
                        />

                        {/* Team Badge */}
                        {assignTeams && player.teamId !== undefined && (
                            <span
                                className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
                                style={{
                                    backgroundColor: `${player.teamId === 0 ? "#00f5ff" : "#ff006e"
                                        }20`,
                                    color: player.teamId === 0 ? "#00f5ff" : "#ff006e",
                                }}
                            >
                                Team {player.teamId + 1}
                            </span>
                        )}

                        {/* Remove Button */}
                        <button
                            onClick={() => removePlayer(player.id)}
                            disabled={players.length <= minPlayers}
                            className="p-2 text-white/20 hover:text-red-500 transition-colors disabled:opacity-0 disabled:pointer-events-none flex-shrink-0"
                            title="Remove player"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Add Player Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                    placeholder="Add player name..."
                    maxLength={20}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-space outline-none transition-colors focus:border-white/30"
                    style={{
                        "--focus-color": accentColor,
                    } as React.CSSProperties}
                    disabled={players.length >= maxPlayers}
                />
                <motion.button
                    onClick={addPlayer}
                    disabled={players.length >= maxPlayers || !newPlayerName.trim()}
                    whileHover={
                        players.length < maxPlayers && newPlayerName.trim()
                            ? { scale: 1.05 }
                            : {}
                    }
                    whileTap={
                        players.length < maxPlayers && newPlayerName.trim()
                            ? { scale: 0.95 }
                            : {}
                    }
                    className="px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Plus className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Player Count Indicator */}
            <p className="text-white/40 text-xs font-space mt-3 text-center">
                {players.length} / {maxPlayers} players
                {players.length < minPlayers && (
                    <span className="text-yellow-500 ml-2">
                        (need {minPlayers - players.length} more to start)
                    </span>
                )}
            </p>
        </section>
    );
}

/**
 * Helper to create initial player list - starts empty by default
 */
export function createInitialPlayers(count: number = 0, assignTeams: boolean = false, teamCount: number = 2): Player[] {
    if (count === 0) return [];
    return Array.from({ length: count }, (_, i) => ({
        id: `player-init-${i}`,
        name: "",
        teamId: assignTeams ? i % teamCount : undefined,
    }));
}
