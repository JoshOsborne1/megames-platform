"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain, Users, Check, ChevronRight, X, Users2, Zap, Sparkles,
    Globe, Landmark, Trophy, Music, User, Play
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { GameSettings, GameMode, MixedDifficulty, GAME_CONFIG } from "@/lib/games/quiz-quarter/types";
import { PACKS, getDecksByPack, getQuestionsByDeck } from "@/lib/games/quiz-quarter/data";
import { useHaptic } from "@/hooks/useHaptic";
import Link from "next/link";

// Icon mapping for packs
const PACK_ICONS: Record<string, LucideIcon> = {
    Globe, Landmark, Trophy, Music
};

interface QuizGameSetupProps {
    onStart: (playerNames: string[], settings: GameSettings, gameMode: GameMode) => void;
    onBack: () => void;
}

const DIFFICULTY_OPTIONS: { id: MixedDifficulty; label: string; color: string; icon: React.ReactNode }[] = [
    { id: "easy", label: "Easy", color: "#00f5ff", icon: <Sparkles className="w-3 h-3" /> },
    { id: "medium", label: "Medium", color: "#ff9f1c", icon: <Zap className="w-3 h-3" /> },
    { id: "hard", label: "Hard", color: "#ff006e", icon: <Brain className="w-3 h-3" /> },
    { id: "mixed", label: "All", color: "#8338ec", icon: <Sparkles className="w-3 h-3" /> },
];

export function QuizGameSetup({ onStart, onBack }: QuizGameSetupProps) {
    const { trigger } = useHaptic();

    // Game mode - default to solo for minimal friction
    const [gameMode, setGameMode] = useState<GameMode>("solo");

    // Settings
    const [difficulty, setDifficulty] = useState<MixedDifficulty>("mixed");

    // Pack selection - all selected by default for minimal setup
    const [selectedPackIds, setSelectedPackIds] = useState<string[]>(PACKS.map(p => p.id));

    // Party mode player management
    const [players, setPlayers] = useState<string[]>(["", ""]);
    const [showPlayersModal, setShowPlayersModal] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState("");

    // Toggle pack selection
    const togglePack = (packId: string) => {
        trigger();
        if (selectedPackIds.includes(packId)) {
            if (selectedPackIds.length > 1) {
                setSelectedPackIds(prev => prev.filter(id => id !== packId));
            }
        } else {
            setSelectedPackIds(prev => [...prev, packId]);
        }
    };

    // Toggle all packs
    const toggleAllPacks = () => {
        trigger();
        if (selectedPackIds.length === PACKS.length) {
            // If all selected, just keep first one
            setSelectedPackIds([PACKS[0].id]);
        } else {
            // Select all
            setSelectedPackIds(PACKS.map(p => p.id));
        }
    };

    // Player management for party mode
    const addPlayer = () => {
        if (!newPlayerName.trim() || players.length >= 8) return;
        setPlayers([...players, newPlayerName.trim()]);
        setNewPlayerName("");
    };

    const removePlayer = (index: number) => {
        if (players.length <= 2) return;
        setPlayers(players.filter((_, i) => i !== index));
    };

    const updatePlayerName = (index: number, name: string) => {
        const updated = [...players];
        updated[index] = name;
        setPlayers(updated);
    };

    // Start game
    const handleStart = () => {
        const selectedDeckIds = selectedPackIds.flatMap(packId =>
            getDecksByPack(packId).map(d => d.id)
        );

        if (selectedDeckIds.length === 0) return;

        // Solo mode: just "You", infinite questions, no timer
        // Party mode: multiple players, timed rounds
        const validNames = gameMode === "solo"
            ? ["You"]
            : players.filter(n => n.trim().length > 0);

        if (gameMode === "party" && validNames.length < 2) return;

        const settings: GameSettings = {
            difficulty,
            timePerQuestion: gameMode === "party" ? GAME_CONFIG.defaultTimePerQuestion : 0, // No timer in solo
            questionsPerRound: gameMode === "party" ? 10 : 999, // Endless in solo
            totalRounds: gameMode === "party" ? GAME_CONFIG.defaultRounds : 1,
            selectedDeckIds,
            selectedPackIds,
            timedMode: gameMode === "party", // Only party mode is timed
        };

        trigger();
        onStart(validNames, settings, gameMode);
    };

    // Count total questions available
    const totalQuestions = selectedPackIds.reduce((sum, packId) => {
        const packDecks = getDecksByPack(packId);
        return sum + packDecks.reduce((deckSum, deck) => deckSum + getQuestionsByDeck(deck.id).length, 0);
    }, 0);

    const canStart = gameMode === "solo"
        ? selectedPackIds.length > 0
        : players.filter(n => n.trim()).length >= 2 && selectedPackIds.length > 0;

    return (
        <div className="w-full max-w-md mx-auto px-4 pb-8">
            {/* Header */}
            <div className="text-center pt-4 mb-6">
                <Link href="/games" className="inline-block mb-3">
                    <span className="text-white/40 text-sm hover:text-white/60 transition-colors">← Back</span>
                </Link>
                <h1 className="font-display font-bold text-2xl text-white">Quiz Quarter</h1>
                <p className="text-white/40 text-sm">Test your knowledge</p>
            </div>

            {/* MODE SELECTOR - Big beautiful cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Practice Mode (Solo) */}
                <button
                    onClick={() => { trigger(); setGameMode("solo"); }}
                    className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${gameMode === "solo"
                            ? "border-[#22C55E] bg-[#22C55E]/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${gameMode === "solo" ? "bg-[#22C55E]/20" : "bg-white/10"
                        }`}>
                        <User className={`w-6 h-6 ${gameMode === "solo" ? "text-[#22C55E]" : "text-white/50"}`} />
                    </div>
                    <h3 className={`font-display font-bold text-lg ${gameMode === "solo" ? "text-white" : "text-white/70"}`}>
                        Practice
                    </h3>
                    <p className="text-white/40 text-xs mt-1">
                        No timer • Learn at your pace
                    </p>
                    {gameMode === "solo" && (
                        <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                                <Check className="w-3 h-3 text-black" />
                            </div>
                        </div>
                    )}
                </button>

                {/* Question Master Mode (Party) */}
                <button
                    onClick={() => { trigger(); setGameMode("party"); }}
                    className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${gameMode === "party"
                            ? "border-[#ff006e] bg-[#ff006e]/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${gameMode === "party" ? "bg-[#ff006e]/20" : "bg-white/10"
                        }`}>
                        <Users2 className={`w-6 h-6 ${gameMode === "party" ? "text-[#ff006e]" : "text-white/50"}`} />
                    </div>
                    <h3 className={`font-display font-bold text-lg ${gameMode === "party" ? "text-white" : "text-white/70"}`}>
                        Challenge
                    </h3>
                    <p className="text-white/40 text-xs mt-1">
                        Timed • Compete with friends
                    </p>
                    {gameMode === "party" && (
                        <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 rounded-full bg-[#ff006e] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    )}
                </button>
            </div>

            {/* Party Mode: Player Setup */}
            {gameMode === "party" && (
                <button
                    onClick={() => setShowPlayersModal(true)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between mb-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#ff006e]/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#ff006e]" />
                        </div>
                        <div className="text-left">
                            <span className="text-white font-medium">{players.filter(n => n.trim()).length} Players</span>
                            <p className="text-white/40 text-xs">Tap to add players</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                </button>
            )}

            {/* CATEGORIES - Compact Pills */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Categories</span>
                    <button
                        onClick={toggleAllPacks}
                        className="text-[#22C55E] text-xs hover:underline"
                    >
                        {selectedPackIds.length === PACKS.length ? "Deselect All" : "Select All"}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {PACKS.map((pack) => {
                        const isSelected = selectedPackIds.includes(pack.id);
                        const PackIcon = PACK_ICONS[pack.icon] || Brain;

                        return (
                            <button
                                key={pack.id}
                                onClick={() => togglePack(pack.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${isSelected
                                        ? "bg-white/15 border border-white/30"
                                        : "bg-white/5 border border-white/10 opacity-50"
                                    }`}
                            >
                                <PackIcon
                                    className="w-4 h-4"
                                    style={{ color: isSelected ? pack.accentColor : "rgba(255,255,255,0.4)" }}
                                />
                                <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-white/50"}`}>
                                    {pack.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-white/30 text-xs mt-2">{totalQuestions} questions available</p>
            </div>

            {/* DIFFICULTY - Compact Row */}
            <div className="mb-8">
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3 block">Difficulty</span>
                <div className="flex gap-2">
                    {DIFFICULTY_OPTIONS.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => { trigger(); setDifficulty(opt.id); }}
                            className={`flex-1 py-3 rounded-xl border transition-all text-center ${difficulty === opt.id
                                    ? "border-white/30 bg-white/10"
                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                }`}
                            style={{ borderColor: difficulty === opt.id ? opt.color : undefined }}
                        >
                            <div
                                className="text-xs font-bold"
                                style={{ color: difficulty === opt.id ? opt.color : "rgba(255,255,255,0.6)" }}
                            >
                                {opt.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* START BUTTON */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                disabled={!canStart}
                className={`w-full py-4 rounded-xl text-white font-display font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2 ${gameMode === "solo" ? "bg-[#22C55E]" : "bg-[#ff006e]"
                    }`}
            >
                <Play className="w-5 h-5" />
                {gameMode === "solo" ? "Start Learning" : "Start Challenge"}
            </motion.button>

            {/* Hint */}
            {!canStart && (
                <p className="text-center text-white/30 text-xs mt-2">
                    {selectedPackIds.length === 0
                        ? "Select at least one category"
                        : "All players need names"
                    }
                </p>
            )}

            {/* PLAYERS MODAL (Party Mode) */}
            <AnimatePresence>
                {showPlayersModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPlayersModal(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-[#0a0015] border border-white/10 rounded-2xl p-5 shadow-2xl w-full max-w-sm pointer-events-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-[#ff006e]">
                                        <Users className="w-5 h-5" />
                                        <h3 className="font-display font-bold text-lg">Players</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowPlayersModal(false)}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                    {players.map((player, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg">
                                            <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white/50">{i + 1}</span>
                                            <input
                                                type="text"
                                                value={player}
                                                onChange={(e) => updatePlayerName(i, e.target.value)}
                                                className="flex-1 bg-transparent outline-none text-white text-sm"
                                                placeholder={`Player ${i + 1}`}
                                            />
                                            {players.length > 2 && (
                                                <button
                                                    onClick={() => removePlayer(i)}
                                                    className="p-1.5 text-white/20 hover:text-red-500"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {players.length < 8 && (
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={newPlayerName}
                                            onChange={(e) => setNewPlayerName(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                                            placeholder="Add player..."
                                            maxLength={15}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                        />
                                        <button
                                            onClick={addPlayer}
                                            disabled={!newPlayerName.trim()}
                                            className="px-4 bg-[#ff006e] text-white rounded-lg disabled:opacity-30"
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowPlayersModal(false)}
                                    className="w-full py-3 rounded-xl bg-[#ff006e] text-white font-bold"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
