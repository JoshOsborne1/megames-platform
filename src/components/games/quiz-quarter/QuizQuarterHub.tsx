"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Infinity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHaptic } from "@/hooks/useHaptic";

import { GameState, GameSettings, GameMode, GAME_CONFIG } from "@/lib/games/quiz-quarter/types";
import {
    createInitialState,
    drawNextQuestion,
    handleAnswer,
    handleTimeout,
    handleSkip,
    startGame,
    startQuestion,
    proceedAfterAnswer,
    startNextRound,
    getLeaderboard,
} from "@/lib/games/quiz-quarter/gameLogic";

import { InGameNav } from "../shared";
import { QuizGameSetup } from "./QuizGameSetup";
import { QuestionCard } from "./QuestionCard";
import { AnswerReveal } from "./AnswerReveal";
import { ResultsSummary } from "./ResultsSummary";

interface QuizQuarterHubProps {
    mode?: "local" | "online";
}

export function QuizQuarterHub({ mode = "local" }: QuizQuarterHubProps) {
    const router = useRouter();
    const { trigger } = useHaptic();

    const [gameState, setGameState] = useState<GameState | null>(null);
    const [countdown, setCountdown] = useState<number>(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [wasSkipped, setWasSkipped] = useState(false);
    const [freeSkipsRemaining, setFreeSkipsRemaining] = useState(GAME_CONFIG.freeSkipsPerSession);

    // TODO: Get this from user subscription context
    const isPremium = false;

    // Start new game
    const startNewGame = useCallback((
        playerNames: string[],
        settings: GameSettings,
        gameMode: GameMode
    ) => {
        trigger();
        const initialState = createInitialState(playerNames, settings, gameMode);
        const gameWithQuestion = startGame(initialState);
        setGameState(gameWithQuestion);
        setWasSkipped(false);

        // Only countdown in timed mode
        if (settings.timedMode) {
            setCountdown(GAME_CONFIG.countdownDuration);
        } else {
            // In relaxed mode, go straight to question
            setGameState(prev => prev ? startQuestion(prev) : prev);
        }
    }, [trigger]);

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
    }, [isTimerRunning, gameState?.phase, gameState?.timeRemaining, gameState?.settings.timedMode, trigger]);

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

        // Deduct free skip if not premium
        if (!isPremium && freeSkipsRemaining > 0) {
            setFreeSkipsRemaining(prev => prev - 1);
        }

        const newState = handleSkip(gameState);
        setGameState(newState);
    }, [gameState, trigger, isPremium, freeSkipsRemaining]);

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
        router.push("/games");
    }, [router, trigger]);

    // Play again with same settings
    const handlePlayAgain = useCallback(() => {
        if (!gameState) return;
        trigger();
        setFreeSkipsRemaining(GAME_CONFIG.freeSkipsPerSession);
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

    // Render based on phase
    const renderContent = () => {
        // Setup phase
        if (!gameState) {
            return (
                <div className="flex-1 flex items-center justify-center min-h-screen">
                    <QuizGameSetup
                        onStart={startNewGame}
                        onBack={handleLeave}
                    />
                </div>
            );
        }

        const isTimedMode = gameState.settings.timedMode;
        const accentColor = gameState.gameMode === "solo" ? "#22C55E" : "#ff006e";

        // Countdown phase (timed mode only)
        if (gameState.phase === "countdown" && countdown > 0 && isTimedMode) {
            return (
                <div className="flex-1 flex items-center justify-center min-h-screen">
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
                <div className="w-full max-w-lg mx-auto px-4 pb-8 pt-16">
                    <QuestionCard
                        question={gameState.currentQuestion}
                        shuffledAnswers={gameState.shuffledAnswers}
                        timeRemaining={gameState.timeRemaining}
                        totalTime={gameState.settings.timePerQuestion}
                        currentPlayer={gameState.players[gameState.currentPlayerIndex]}
                        questionNumber={gameState.currentQuestionNumber}
                        totalQuestions={isTimedMode ? gameState.settings.questionsPerRound * gameState.settings.totalRounds : 999}
                        eliminatedAnswers={gameState.eliminatedAnswers}
                        gameMode={gameState.gameMode}
                        timedMode={isTimedMode}
                        isPremium={isPremium}
                        freeSkipsRemaining={freeSkipsRemaining}
                        onAnswer={onAnswerSelect}
                        onSkip={onSkip}
                    />
                </div>
            );
        }

        // Answer reveal phase
        if (gameState.phase === "answer-reveal" && gameState.currentQuestion) {
            return (
                <div className="w-full max-w-lg mx-auto px-4 pb-8 pt-16">
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
                        timedMode={isTimedMode}
                        onContinue={onContinue}
                    />
                </div>
            );
        }

        // Round summary (mainly for party mode)
        if (gameState.phase === "round-summary") {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            return (
                <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
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
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
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
                            className="w-full py-4 rounded-xl text-white font-display font-bold text-lg"
                            style={{ backgroundColor: accentColor }}
                        >
                            {gameState.gameMode === "party" ? `Start Round ${gameState.currentRound}` : "Continue"}
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
            {/* InGameNav - Only show when game is active */}
            {gameState && (
                <InGameNav
                    gameName="Quiz Quarter"
                    accentColor={accentColor}
                    gameIcon={<Brain className="w-full h-full" />}
                    showConfirmation={gameState.phase !== "game-over"}
                    onConfirmLeave={() => setGameState(null)}
                />
            )}

            {/* Main Content */}
            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </div>
    );
}
