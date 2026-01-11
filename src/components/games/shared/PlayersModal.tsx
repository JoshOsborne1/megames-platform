"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Plus, Trash2, Check } from "lucide-react";
import type { SetupPlayer } from "@/hooks/usePlayerSetup";

interface PlayersModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback to close the modal */
    onClose: () => void;
    /** Current list of players */
    players: SetupPlayer[];
    /** Current value of the new player input */
    newPlayerName: string;
    /** Update the new player input value */
    onNewPlayerNameChange: (name: string) => void;
    /** Add a new player */
    onAddPlayer: () => void;
    /** Remove a player by ID */
    onRemovePlayer: (id: string) => void;
    /** Update a player's name */
    onUpdatePlayerName: (id: string, name: string) => void;
    /** Whether more players can be added */
    canAddMore: boolean;
    /** Whether players can be removed */
    canRemove: boolean;
    /** Accent color for theming (default: #ff006e) */
    accentColor?: string;
    /** Maximum character length for player names (default: 15) */
    maxNameLength?: number;
}

/**
 * Reusable modal for managing players in game setup screens.
 * Provides consistent UI/UX across all games.
 */
export function PlayersModal({
    isOpen,
    onClose,
    players,
    newPlayerName,
    onNewPlayerNameChange,
    onAddPlayer,
    onRemovePlayer,
    onUpdatePlayerName,
    canAddMore,
    canRemove,
    accentColor = "#ff006e",
    maxNameLength = 15,
}: PlayersModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-[#0a0015] border border-white/10 rounded-2xl p-5 shadow-2xl w-full max-w-sm pointer-events-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2" style={{ color: accentColor }}>
                                    <Users className="w-5 h-5" />
                                    <h3 className="font-display font-bold text-lg">Players</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Player List */}
                            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                {players.map((player, i) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg"
                                    >
                                        <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white/50">
                                            {i + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={player.name}
                                            onChange={(e) => onUpdatePlayerName(player.id, e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-white text-sm min-w-0"
                                            placeholder={`Player ${i + 1}`}
                                        />
                                        <button
                                            onClick={() => onRemovePlayer(player.id)}
                                            disabled={!canRemove}
                                            className="p-1.5 text-white/20 hover:text-red-500 disabled:opacity-0 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Player */}
                            {canAddMore && (
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newPlayerName}
                                        onChange={(e) => onNewPlayerNameChange(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && onAddPlayer()}
                                        placeholder="Add player..."
                                        maxLength={maxNameLength}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/20"
                                    />
                                    <button
                                        onClick={onAddPlayer}
                                        disabled={!newPlayerName.trim()}
                                        className="px-3 rounded-lg disabled:opacity-30 transition-colors"
                                        style={{
                                            backgroundColor: `${accentColor}20`,
                                            color: accentColor,
                                        }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Done Button */}
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                                style={{ backgroundColor: accentColor }}
                            >
                                <Check className="w-4 h-4" /> Done ({players.length} players)
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
