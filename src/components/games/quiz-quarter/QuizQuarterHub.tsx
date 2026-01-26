"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Brain, Infinity, Shuffle, Lightbulb, Calculator, ChevronLeft, ArrowRight, Sparkles, Music, Trophy, Clapperboard, FlaskConical, Globe, Ticket, Landmark,
    Zap, Flame, Timer, Users2, Building2, Flag, Languages, Calendar, User, Scroll, Castle, Medal, Dumbbell, Shield, Dna, Atom, Telescope, Mic2, Quote, Award, Disc3, Tv, Gamepad2, Star, MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useHaptic } from "@/hooks/useHaptic";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { GameState, GameSettings, GAME_CONFIG, ChallengeMode } from "@/lib/games/quiz-quarter/types";
import {
    createInitialState,
    drawNextQuestion,
    handleAnswer,
    handleTimeout,
    handleSkip,
    handleHint,
    startGame,
    startQuestion,
    proceedAfterAnswer,
    startNextRound,
    getLeaderboard,
} from "@/lib/games/quiz-quarter/gameLogic";
import { PACKS, DECKS } from "@/lib/games/quiz-quarter/data";

import { InGameNav } from "../shared";
import { QuestionCard } from "./QuestionCard";
import { AnswerReveal } from "./AnswerReveal";
import { ResultsSummary } from "./ResultsSummary";
import { FlipPackCard } from "./FlipPackCard";
import { useAppShell } from "@/components/AppShell";

export function QuizQuarterHub() {
    const router = useRouter();
    const { trigger } = useHaptic();
    const { setFullscreen } = useAppShell();

    // Selection State
    const [selectedDecks, setSelectedDecks] = useState<Set<string>>(new Set());
    const [showChallengeModes, setShowChallengeModes] = useState(false);
    const [gameState, setGameState] = useState<GameState | null>(null);

    const [countdown, setCountdown] = useState<number>(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [wasSkipped, setWasSkipped] = useState(false);

    // Control bottom nav visibility based on game state
    useEffect(() => {
        setFullscreen(!!gameState);
    }, [gameState, setFullscreen]);

    // TODO: Get this from user subscription context
    const isPremium = false;

    const totalSelected = selectedDecks.size;
    const allPacksCount = DECKS.length;
    const isAllSelected = totalSelected === allPacksCount;

    const toggleDeck = (packId: string, deckId: string) => {
        trigger();
        setSelectedDecks(prev => {
            const next = new Set(prev);
            const key = `${packId}:${deckId}`;
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const togglePack = (packId: string) => {
        const pack = PACKS.find(p => p.id === packId);
        if (!pack) return;
        
        const packKeys = pack.deckIds.map((id: string) => `${pack.id}:${id}`);
        const allInPackSelected = packKeys.every((k: string) => selectedDecks.has(k));

        setSelectedDecks(prev => {
            const next = new Set(prev);
            if (allInPackSelected) {
                packKeys.forEach((k: string) => next.delete(k));
            } else {
                packKeys.forEach((k: string) => next.add(k));
            }
            return next;
        });
    };

    const toggleAllQuestions = () => {
        trigger();
        if (isAllSelected) {
            setSelectedDecks(new Set());
        } else {
            const next = new Set<string>();
            PACKS.forEach(p => {
                p.deckIds.forEach(id => next.add(`${p.id}:${id}`));
            });
            setSelectedDecks(next);
        }
    };

    // Handle Back Navigation
    const handleBack = () => {
        trigger();
        router.push("/lobby");
    };

    // Start new game
    const startNewGame = useCallback((
        mode: ChallengeMode
    ) => {
        trigger("heavy");
        
        if (mode === "pvp") {
            toast.info("PvP Lobby coming soon!", { description: "Multiplayer is under development." });
            return;
        }

        const settings: GameSettings = {
            quizType: "mixed", // Generic as we are using custom decks
            difficulty: "mixed",
            timePerQuestion: 15,
            questionsPerRound: mode === "streak" ? 9999 : 10,
            totalRounds: 1,
            challengeMode: mode,
            selectedDeckIds: Array.from(selectedDecks),
            selectedPackIds: [], // Not used in this mode
            timedMode: mode !== "standard",
            isPremium: false,
        };

        const initialState = createInitialState(["Player 1"], settings, "solo");
        const gameWithQuestion = startGame(initialState);
        setGameState(gameWithQuestion);
        setWasSkipped(false);

        // Only countdown in timed/streak mode
        if (mode === "time" || mode === "streak") {
            setCountdown(GAME_CONFIG.countdownDuration);
        } else {
            // In relaxed mode, go straight to question
            setGameState(prev => prev ? startQuestion(prev) : prev);
        }
    }, [trigger, selectedDecks]);

    // Countdown before question (only in timed mode)
    useEffect(() => {
        if (!gameState?.settings.timedMode) return;

        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && gameState?.phase === "countdown") {
            setGameState(prev => prev ? startQuestion(prev) : prev);
            setIsTimerRunning(true);
        }
    }, [countdown, gameState?.phase, gameState?.settings.timedMode]);

    // Question timer (only in timed mode)
    useEffect(() => {
        if (!gameState?.settings.timedMode) return;
        if (!isTimerRunning || !gameState || gameState.phase !== "question") return;

        if (gameState.timeRemaining <= 0) {
            trigger();
            const { state } = handleTimeout(gameState);
            setGameState(state);
            setIsTimerRunning(false);
            setWasSkipped(false);
            return;
        }

        const timer = setInterval(() => {
            setGameState(prev => {
                if (!prev) return prev;
                return { ...prev, timeRemaining: prev.timeRemaining - 0.1 };
            });
        }, 100);

        return () => clearInterval(timer);
    }, [isTimerRunning, gameState?.phase, gameState?.timeRemaining, gameState?.settings.timedMode, trigger, gameState]);

    // Handle answer selection
    const onAnswerSelect = useCallback((answer: string) => {
        if (!gameState || gameState.phase !== "question") return;

        trigger();
        setIsTimerRunning(false);
        setWasSkipped(false);
        const { state } = handleAnswer(gameState, answer, gameState.timeRemaining);
        setGameState(state);
    }, [gameState, trigger]);

    // Handle skip (relaxed mode only)
    const onSkip = useCallback(() => {
        if (!gameState || gameState.phase !== "question") return;

        trigger();
        setWasSkipped(true);

        const nextState = handleSkip(gameState);
        setGameState(nextState);
        setIsTimerRunning(false);
    }, [gameState, trigger]);

    // Use hint
    const onHint = useCallback(() => {
        if (!gameState || gameState.phase !== "question") return;
        trigger();
        const nextState = handleHint(gameState);
        setGameState(nextState);
    }, [gameState, trigger]);

    // Proceed to next question
    const onContinue = useCallback(() => {
        if (!gameState) return;

        trigger();
        setWasSkipped(false);
        const nextState = proceedAfterAnswer(gameState);

        if (nextState.phase === "countdown" || nextState.phase === "question") {
            const withQuestion = drawNextQuestion(nextState);
            setGameState(withQuestion);

            if (gameState.settings.timedMode) {
                setCountdown(GAME_CONFIG.countdownDuration);
            } else {
                // Relaxed mode: go straight to question
                setGameState(prev => prev ? startQuestion(prev) : prev);
            }
        } else if (nextState.phase === "round-summary") {
            setGameState(nextState);
        } else {
            setGameState(nextState);
        }
    }, [gameState, trigger]);

    // Start next round from summary
    const onStartNextRound = useCallback(() => {
        if (!gameState) return;

        trigger();
        const nextState = startNextRound(gameState);
        setGameState(nextState);

        if (gameState.settings.timedMode) {
            setCountdown(GAME_CONFIG.countdownDuration);
        } else {
            setGameState(prev => prev ? startQuestion(prev) : prev);
        }
    }, [gameState, trigger]);

    // Leave game
    const handleLeave = useCallback(() => {
        trigger();
        router.push("/lobby");
    }, [router, trigger]);

    // Play again with same settings
    const handlePlayAgain = useCallback(() => {
        if (!gameState) return;
        trigger();
        const newState = createInitialState(
            gameState.players.map(p => p.name),
            gameState.settings,
            gameState.gameMode
        );
        const gameWithQuestion = startGame(newState);
        setGameState(gameWithQuestion);

        if (gameState.settings.timedMode) {
            setCountdown(GAME_CONFIG.countdownDuration);
        } else {
            setGameState(prev => prev ? startQuestion(prev) : prev);
        }
    }, [gameState, trigger]);

    // Icon mapping
    const ICON_MAP: Record<string, import("lucide-react").LucideIcon> = {
        Brain, Shuffle, Lightbulb, Calculator, Infinity, Music, Trophy, Clapperboard, FlaskConical, Globe, Ticket, Landmark,
        Zap, Flame, Timer, Users2, Building2, Flag, Languages, Calendar, User, Scroll, Castle, Medal, Dumbbell, Shield, Dna, Atom, Telescope, Mic2, Quote, Award, Disc3, Tv, Gamepad2, Star,
        MapPin // Added for Geography
    };

    // Render based on phase
    const renderContent = () => {
        // Selection phase
        if (!gameState) {
            return (
                <div className="w-full max-w-lg mx-auto px-4 pt-6 pb-44 relative z-10 flex flex-col min-h-[500px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                        <Link href="/lobby" className="group/back inline-flex items-center gap-1.5">
                            <ChevronLeft className="w-3 h-3 text-white/30 group-hover/back:text-white transition-colors" />
                            <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest group-hover/back:text-white transition-colors">Lobby</span>
                        </Link>
                        <button 
                            onClick={toggleAllQuestions}
                            className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-neon-pink transition-all border border-white/5 bg-white/5 py-1 px-3 rounded-full"
                        >
                            {isAllSelected ? "Clear All" : "Select All Questions"}
                        </button>
                    </div>

                    <div className="text-center mb-6 shrink-0">
                        <h1 className="font-display font-bold text-3xl text-white tracking-tight leading-none mb-1">Knowledge</h1>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Build your ultimate pool</p>
                    </div>

                    {/* Info Box */}
                    <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-neon-purple/20 flex items-center justify-center shrink-0 border border-neon-purple/20 shadow-glow-purple/20">
                            <Zap className="w-4 h-4 text-neon-purple" />
                        </div>
                        <div>
                             <p className="text-[11px] text-white/60 leading-tight font-bold">
                                Select categories to begin.
                            </p>
                            <p className="text-[10px] text-white/30 leading-tight mt-0.5">
                                Simple, fast, and interactive.
                            </p>
                        </div>
                    </div>

                    {/* 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-4 flex-1 pb-4">
                        {PACKS.map((pack) => {
                            const Icon = ICON_MAP[pack.icon] || Brain;
                            const packDecks = DECKS.filter(d => d.packId === pack.id);
                            
                            // Transform to match FlipPackCard props
                            const cardPack = {
                                id: pack.id,
                                name: pack.name,
                                color: pack.accentColor,
                                description: pack.description,
                                icon: Icon,
                                decks: packDecks.map(d => ({
                                    id: d.id,
                                    name: d.name,
                                    icon: ICON_MAP[d.icon] || Globe,
                                    description: d.description
                                }))
                            };

                            return (
                                <FlipPackCard 
                                    key={pack.id} 
                                    pack={cardPack} 
                                    selectedDecks={selectedDecks}
                                    toggleDeck={toggleDeck}
                                    togglePack={togglePack}
                                />
                            );
                        })}
                    </div>

                    {/* Action Bar */}
                    <AnimatePresence>
                        {totalSelected > 0 && (
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-0 right-0 z-50 pointer-events-none flex justify-center px-4"
                            >
                                <div className="max-w-xs w-full pointer-events-auto">
                                    <motion.div 
                                        layout
                                        className="glass-panel border-white/10 rounded-full p-1.5 shadow-2xl relative backdrop-blur-3xl ring-1 ring-white/10 overflow-hidden flex flex-col items-center"
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* Deck Count Badge */}
                                            <div className="w-10 h-10 rounded-full bg-neon-pink/15 border border-neon-pink/30 flex items-center justify-center shrink-0">
                                                <span className="text-sm font-display font-black text-neon-pink">{totalSelected}</span>
                                            </div>

                                            {/* Primary Start Action */}
                                            <button 
                                                onClick={() => startNewGame("standard")}
                                                className="h-10 px-8 rounded-full bg-linear-to-r from-neon-pink to-neon-purple text-white font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-neon-pink/20 transition-all flex items-center justify-center relative overflow-hidden active:scale-95 active:brightness-110"
                                            >
                                                <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                                                Start
                                            </button>

                                            {/* Challenge Mode Toggle */}
                                            <button 
                                                onClick={() => { trigger(); setShowChallengeModes(!showChallengeModes); }}
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all border shrink-0",
                                                    showChallengeModes 
                                                        ? "bg-white/20 text-white border-white/40 shadow-glow-white/10" 
                                                        : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                <Zap className={cn("w-4 h-4 transition-transform", showChallengeModes ? "scale-110 fill-current" : "")} />
                                            </button>
                                        </div>

                                        {/* Vertical Expansion for Challenge Modes */}
                                        <AnimatePresence>
                                            {showChallengeModes && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden w-full"
                                                >
                                                    <div className="grid grid-cols-3 gap-2 pt-2 mt-1.5 border-t border-white/5 px-2 pb-1.5">
                                                        {[
                                                            { label: "10s", icon: Timer, color: "text-electric-cyan", mode: "time" as ChallengeMode },
                                                            { label: "Streak", icon: Flame, color: "text-warning", mode: "streak" as ChallengeMode },
                                                            { label: "PvP", icon: Users2, color: "text-neon-purple", mode: "pvp" as ChallengeMode }
                                                        ].map((m) => (
                                                            <button 
                                                                key={m.label}
                                                                onClick={() => startNewGame(m.mode)}
                                                                className="flex flex-col items-center justify-center py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 group"
                                                            >
                                                                <m.icon className={cn("w-5 h-5 mb-1 transition-transform group-hover:scale-110", m.color)} />
                                                                <span className="text-[7.5px] font-black text-white/30 uppercase tracking-wider group-hover:text-white">{m.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Subtle Overlay */}
                    <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-1" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                </div>
            );
        }

        const accentColor = gameState.gameMode === "solo" ? "#22C55E" : "#ff006e";

        // Countdown phase (timed/streak mode only)
        if (gameState.phase === "countdown" && countdown > 0) {
            return (
                <div className="flex-1 flex items-center justify-center min-h-screen pt-16">
                    <motion.div
                        key={countdown}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="text-8xl font-display font-bold"
                        style={{ color: accentColor }}
                    >
                        {countdown}
                    </motion.div>
                </div>
            );
        }

        // Question phase
        if (gameState.phase === "question" && gameState.currentQuestion) {
            return (
                <div className="w-full max-w-md mx-auto px-4 pb-8 pt-16">
                    <QuestionCard
                        question={gameState.currentQuestion}
                        shuffledAnswers={gameState.shuffledAnswers}
                        timeRemaining={gameState.timeRemaining}
                        totalTime={gameState.settings.timePerQuestion}
                        currentPlayer={gameState.players[gameState.currentPlayerIndex]}
                        questionNumber={gameState.currentQuestionNumber}
                        totalQuestions={gameState.settings.timedMode ? gameState.settings.questionsPerRound * gameState.settings.totalRounds : 999}
                        eliminatedAnswers={gameState.eliminatedAnswers}
                        gameMode={gameState.gameMode}
                        timedMode={gameState.settings.timedMode}
                        isPremium={isPremium}
                        hintSkipState={gameState.hintSkipState}
                        onAnswer={onAnswerSelect}
                        onSkip={onSkip}
                        onHint={onHint}
                    />
                </div>
            );
        }

        // Answer reveal phase
        if (gameState.phase === "answer-reveal" && gameState.currentQuestion) {
            return (
                <div className="w-full max-w-md mx-auto px-4 pb-8 pt-16">
                    <AnswerReveal
                        question={gameState.currentQuestion}
                        selectedAnswer={gameState.selectedAnswer}
                        isCorrect={gameState.isCorrect}
                        pointsEarned={gameState.lastPointsEarned}
                        speedBonus={gameState.speedBonus}
                        streakBonus={gameState.streakBonus}
                        currentStreak={gameState.players[gameState.currentPlayerIndex].streak}
                        wasSkipped={wasSkipped}
                        gameMode={gameState.gameMode}
                        timedMode={gameState.settings.timedMode}
                        onContinue={onContinue}
                    />
                </div>
            );
        }

        // Round summary (mainly for party mode)
        if (gameState.phase === "round-summary") {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            return (
                <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen pt-16">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-sm"
                    >
                        <div className="text-center mb-6">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
                                style={{ backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}
                            >
                                <Sparkles className="w-3 h-3" />
                                Round Complete
                            </div>
                            <h2 className="font-display font-bold text-2xl text-white mb-1">
                                {gameState.gameMode === "party" ? `Round ${gameState.currentRound - 1} Complete!` : "Great Progress!"}
                            </h2>
                            {gameState.gameMode === "party" && (
                                <p className="text-white/40 text-sm">
                                    Up next: <span style={{ color: accentColor }} className="font-bold">{currentPlayer.name}</span>
                                </p>
                            )}
                        </div>

                        {/* Mini Leaderboard */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                            <div className="space-y-2">
                                {[...gameState.players].sort((a, b) => b.score - a.score).slice(0, 4).map((player, i) => (
                                    <div key={player.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-white/40'}`}>{i + 1}</span>
                                            <span className="text-sm text-white font-medium">{player.name}</span>
                                        </div>
                                        <span className={`font-display font-bold ${i === 0 ? 'text-yellow-500' : 'text-white/60'}`}>{player.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={onStartNextRound}
                            className="w-full py-4 rounded-xl text-white font-display font-bold text-lg shadow-lg relative overflow-hidden group"
                            style={{ backgroundColor: accentColor }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {gameState.gameMode === "party" ? `Start Round ${gameState.currentRound}` : "Continue"}
                                <ArrowRight className="w-5 h-5" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>
                    </motion.div>
                </div>
            );
        }

        // Game over
        if (gameState.phase === "game-over") {
            return (
                <div className="w-full max-w-lg mx-auto px-4 pb-8 pt-16">
                    <ResultsSummary
                        players={getLeaderboard(gameState)}
                        gameMode={gameState.gameMode}
                        onPlayAgain={handlePlayAgain}
                        onHome={handleLeave}
                    />
                </div>
            );
        }

        return null;
    };

    const accentColor = gameState?.gameMode === "solo" ? "#22C55E" : "#ff006e";

    return (
        <div className="min-h-screen text-white flex flex-col">
            {/* Background is provided by AppShell/global CSS */}

            {/* InGameNav - Only show when game is active or in selection */}
            <InGameNav
                gameName="Quiz Quarter"
                accentColor={accentColor}
                gameIcon={<Brain className="w-full h-full" />}
                showConfirmation={!!gameState && gameState.phase !== "game-over"}
                onConfirmLeave={() => {
                    if (gameState) {
                        setGameState(null);
                    } else {
                        handleBack();
                    }
                }}
            />

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <div className="relative z-10 w-full">
                    {renderContent()}
                </div>
            </AnimatePresence>
        </div>
    );
}
