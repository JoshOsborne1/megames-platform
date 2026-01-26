"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain, Users, Check, ChevronRight, ChevronLeft, X, Users2, Zap, Sparkles,
    Globe, Landmark, Trophy, Music, User, Play, Clock
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { GameSettings, GameMode, MixedDifficulty, GAME_CONFIG, QuizType } from "@/lib/games/quiz-quarter/types";
import { PACKS, getDecksByPack, getQuestionsByDeck } from "@/lib/games/quiz-quarter/data";
import { useHaptic } from "@/hooks/useHaptic";
import { InfoButton } from "../shared";

// Icon mapping for packs
const PACK_ICONS: Record<string, LucideIcon> = {
    Globe, Landmark, Trophy, Music
};

interface QuizGameSetupProps {
    onStart: (playerNames: string[], settings: GameSettings, gameMode: GameMode) => void;
    onBack: () => void;
    selectedQuizType?: QuizType | null;
    selectedPackId?: string | null;
}

const DIFFICULTY_OPTIONS: { id: MixedDifficulty; label: string; color: string; icon: React.ReactNode }[] = [
    { id: "easy", label: "Easy", color: "#00f5ff", icon: <Sparkles className="w-3 h-3" /> },
    { id: "medium", label: "Medium", color: "#ff9f1c", icon: <Zap className="w-3 h-3" /> },
    { id: "hard", label: "Hard", color: "#ff006e", icon: <Brain className="w-3 h-3" /> },
    { id: "mixed", label: "All", color: "#8338ec", icon: <Sparkles className="w-3 h-3" /> },
];

export function QuizGameSetup({ onStart, onBack, selectedQuizType, selectedPackId }: QuizGameSetupProps) {
    const { trigger } = useHaptic();

    // Filter packs based on selection
    const availablePacks = selectedPackId 
        ? PACKS.filter(p => p.id === selectedPackId)
        : selectedQuizType === "mixed"
            ? PACKS.filter(p => p.type === "knowledge") // Mixed quiz uses all knowledge packs for now
            : selectedQuizType 
                ? PACKS.filter(p => p.type === selectedQuizType)
                : PACKS;

    // Determine if we need to show pack selector
    // If a specific pack was passed in, we don't show selector
    // If it's a mixed quiz, we select all implicitly (no selector needed usually, or maybe visual indication)
    const showPackSelector = !selectedPackId && selectedQuizType !== "mixed";

    // Game mode - default to solo for minimal friction
    const [gameMode, setGameMode] = useState<GameMode>("solo");

    // Settings
    const [difficulty, setDifficulty] = useState<MixedDifficulty>("mixed");

    // Pack selection - all selected by default for minimal setup
    const [selectedPackIds, setSelectedPackIds] = useState<string[]>(availablePacks.map(p => p.id));

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
        if (selectedPackIds.length === availablePacks.length) {
            // If all selected, just keep first one
            setSelectedPackIds([availablePacks[0].id]);
        } else {
            // Select all
            setSelectedPackIds(availablePacks.map(p => p.id));
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
            quizType: selectedQuizType || "mixed",
            packId: selectedPackId || undefined,
            isPremium: false,
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
        <div className="w-full max-w-md mx-auto px-4 pb-8 pt-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <button onClick={onBack} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="font-display font-bold text-2xl text-white">Game Setup</h2>
                    <p className="text-white/40 text-sm">Customize your session</p>
                </div>
            </div>

            {/* How to Play - Collapsible */}
            <InfoButton
                title="How to Play"
                content="Answer trivia questions from various categories. In Practice mode, learn at your own pace. In Challenge mode, compete against friends with timed rounds!"
                icon={<Brain className="w-4 h-4 text-[#22C55E]" />}
                accentColor="#22C55E"
            />

            {/* MODE SELECTOR - Big beautiful cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {/* Practice Mode (Solo) */}
                <button
                    onClick={() => { trigger(); setGameMode("solo"); }}
                    className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${gameMode === "solo"
                        ? "border-[#22C55E] bg-[#22C55E]/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${gameMode === "solo" ? "bg-[#22C55E]/20" : "bg-white/10"
                        }`}>
                        <User className={`w-6 h-6 ${gameMode === "solo" ? "text-[#22C55E]" : "text-white/50"}`} />
                    </div>
                    <h3 className={`font-display font-bold text-lg ${gameMode === "solo" ? "text-white" : "text-white/70"}`}>
                        Practice
                    </h3>
                    <p className="text-white/40 text-xs mt-1">
                        Relaxed • No Timer
                    </p>
                    {gameMode === "solo" && (
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                        >
                            <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center shadow-lg shadow-[#22C55E]/20">
                                <Check className="w-3 h-3 text-black" />
                            </div>
                        </motion.div>
                    )}
                </button>

                {/* Challenge Mode (Party) */}
                <button
                    onClick={() => { trigger(); setGameMode("party"); }}
                    className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${gameMode === "party"
                        ? "border-neon-pink bg-neon-pink/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${gameMode === "party" ? "bg-neon-pink/20" : "bg-white/10"
                        }`}>
                        <Users2 className={`w-6 h-6 ${gameMode === "party" ? "text-neon-pink" : "text-white/50"}`} />
                    </div>
                    <h3 className={`font-display font-bold text-lg ${gameMode === "party" ? "text-white" : "text-white/70"}`}>
                        Challenge
                    </h3>
                    <p className="text-white/40 text-xs mt-1">
                        Timed • Multiplayer
                    </p>
                    {gameMode === "party" && (
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                        >
                            <div className="w-5 h-5 rounded-full bg-neon-pink flex items-center justify-center shadow-lg shadow-neon-pink/20">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </motion.div>
                    )}
                </button>
            </div>

            {/* Party Mode: Player Setup */}
            <AnimatePresence>
                {gameMode === "party" && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <button
                            onClick={() => setShowPlayersModal(true)}
                            className="w-full p-4 rounded-xl bg-linear-to-r from-neon-pink/10 to-transparent border border-neon-pink/20 hover:border-neon-pink/40 transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-neon-pink/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="w-5 h-5 text-neon-pink" />
                                </div>
                                <div className="text-left">
                                    <span className="text-white font-medium block">{players.filter(n => n.trim()).length} Players Joined</span>
                                    <span className="text-neon-pink text-xs">Tap to manage</span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neon-pink/50 group-hover:text-neon-pink transition-colors" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DIFFICULTY - Compact Row */}
            <div className="mb-8">
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3 block">Difficulty</span>
                <div className="flex gap-2">
                    {DIFFICULTY_OPTIONS.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => { trigger(); setDifficulty(opt.id); }}
                            className={`flex-1 py-3 rounded-xl border transition-all text-center relative overflow-hidden ${difficulty === opt.id
                                ? "border-white/30 bg-white/10 shadow-lg"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                                }`}
                            style={{ 
                                borderColor: difficulty === opt.id ? opt.color : undefined,
                                boxShadow: difficulty === opt.id ? `0 0 15px -5px ${opt.color}40` : "none"
                            }}
                        >
                            <div
                                className="text-xs font-bold relative z-10 flex flex-col items-center justify-center gap-1"
                                style={{ color: difficulty === opt.id ? opt.color : "rgba(255,255,255,0.6)" }}
                            >
                                {opt.icon}
                                {opt.label}
                            </div>
                            {difficulty === opt.id && (
                                <div 
                                    className="absolute inset-0 opacity-10"
                                    style={{ backgroundColor: opt.color }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* CATEGORIES - Compact Pills (Only show if multiple packs available and not one already picked) */}
            {showPackSelector && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Active Categories</span>
                        <button
                            onClick={toggleAllPacks}
                            className="text-[#22C55E] text-xs hover:underline"
                        >
                            {selectedPackIds.length === availablePacks.length ? "Deselect All" : "Select All"}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {availablePacks.map((pack) => {
                            const isSelected = selectedPackIds.includes(pack.id);
                            const PackIcon = PACK_ICONS[pack.icon] || Brain;

                            return (
                                <button
                                    key={pack.id}
                                    onClick={() => togglePack(pack.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all border ${isSelected
                                        ? "bg-white/15 border-white/30"
                                        : "bg-white/5 border-white/10 opacity-50"
                                        }`}
                                >
                                    <PackIcon
                                        className="w-3.5 h-3.5"
                                        style={{ color: isSelected ? pack.accentColor : "rgba(255,255,255,0.4)" }}
                                    />
                                    <span className={`text-xs font-medium ${isSelected ? "text-white" : "text-white/50"}`}>
                                        {pack.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-white/30 text-xs mt-2 text-right">{totalQuestions} questions in pool</p>
                </div>
            )}

            {/* START BUTTON */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                disabled={!canStart}
                className={`w-full py-4 rounded-xl text-white font-display font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl ${gameMode === "solo" ? "bg-[#22C55E] shadow-[#22C55E]/20" : "bg-neon-pink shadow-neon-pink/20"
                    }`}
            >
                {gameMode === "solo" ? <Play className="w-5 h-5 fill-current" /> : <Clock className="w-5 h-5" />}
                {gameMode === "solo" ? "Start Practice" : "Start Challenge"}
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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-[#0a0015] border border-white/10 rounded-2xl p-5 shadow-2xl w-full max-w-sm pointer-events-auto ring-1 ring-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-neon-pink">
                                        <Users className="w-5 h-5" />
                                        <h3 className="font-display font-bold text-lg">Manage Players</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowPlayersModal(false)}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                    {players.map((player, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg group">
                                            <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white/50">{i + 1}</span>
                                            <input
                                                type="text"
                                                value={player}
                                                onChange={(e) => updatePlayerName(i, e.target.value)}
                                                className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/20"
                                                placeholder={`Player ${i + 1}`}
                                            />
                                            {players.length > 2 && (
                                                <button
                                                    onClick={() => removePlayer(i)}
                                                    className="p-1.5 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
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
                                            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                                            placeholder="Enter name..."
                                            maxLength={15}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-neon-pink/50 transition-colors"
                                        />
                                        <button
                                            onClick={addPlayer}
                                            disabled={!newPlayerName.trim()}
                                            className="px-4 bg-neon-pink text-white rounded-lg disabled:opacity-30 hover:bg-neon-pink/90 font-medium text-sm transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowPlayersModal(false)}
                                    className="w-full py-3 rounded-xl bg-neon-pink text-white font-bold hover:bg-neon-pink/90 transition-colors"
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
