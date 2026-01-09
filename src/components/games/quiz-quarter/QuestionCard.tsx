"use client";

import { motion } from "framer-motion";
import { Flame, SkipForward, Play, Crown } from "lucide-react";
import { Question, Player, GameMode, GAME_CONFIG } from "@/lib/games/quiz-quarter/types";
import { useHaptic } from "@/hooks/useHaptic";
import { WatchAdButton } from "../shared";

interface QuestionCardProps {
    question: Question;
    shuffledAnswers: string[];
    timeRemaining: number;
    totalTime: number;
    currentPlayer: Player;
    questionNumber: number;
    totalQuestions: number;
    eliminatedAnswers: string[];
    gameMode: GameMode;
    timedMode: boolean;
    isPremium?: boolean;
    freeSkipsRemaining: number;
    onAnswer: (answer: string) => void;
    onSkip: () => void;
}

export function QuestionCard({
    question,
    shuffledAnswers,
    timeRemaining,
    totalTime,
    currentPlayer,
    questionNumber,
    totalQuestions,
    eliminatedAnswers,
    gameMode,
    timedMode,
    isPremium = false,
    freeSkipsRemaining,
    onAnswer,
    onSkip,
}: QuestionCardProps) {
    const { trigger } = useHaptic();
    const timePercent = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 100;
    const isRelaxedMode = !timedMode;

    // Difficulty badge color
    const getDifficultyColor = () => {
        switch (question.difficulty) {
            case "easy": return "#00f5ff";
            case "medium": return "#ff9f1c";
            case "hard": return "#ff006e";
        }
    };

    const answerLetters = ["A", "B", "C", "D"];
    const difficultyColor = getDifficultyColor();
    const accentColor = gameMode === "solo" ? "#22C55E" : "#ff006e";

    // Can skip for free?
    const canSkipFree = isPremium || freeSkipsRemaining > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
        >
            {/* HUD */}
            <div className="flex items-center justify-between mb-6">
                {/* Left: Score or Question Count */}
                <div>
                    {gameMode === "party" ? (
                        <>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Score</p>
                            <div className="flex items-center gap-2">
                                <p className="font-display font-bold text-xl" style={{ color: accentColor }}>{currentPlayer.score}</p>
                                {currentPlayer.streak >= 3 && (
                                    <div className="flex items-center gap-1 text-orange-400">
                                        <Flame className="w-3 h-3" />
                                        <span className="text-xs font-bold">{currentPlayer.streak}x</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Streak</p>
                            <div className="flex items-center gap-2">
                                <p className="font-display font-bold text-xl text-orange-400">{currentPlayer.streak}</p>
                                {currentPlayer.streak >= 3 && <Flame className="w-4 h-4 text-orange-400" />}
                            </div>
                        </>
                    )}
                </div>

                {/* Center: Timer (only in timed mode) or Question indicator */}
                {timedMode ? (
                    <div
                        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-display font-black text-2xl ${timePercent <= 33 ? 'border-red-500 text-red-500 animate-pulse' : 'border-white/20 text-white'
                            }`}
                    >
                        {Math.ceil(timeRemaining)}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="text-white/50 text-sm">Q</span>
                        <span className="font-display font-bold text-white">{questionNumber}</span>
                    </div>
                )}

                {/* Right: Question Progress or Accuracy */}
                <div className="text-right">
                    {gameMode === "party" ? (
                        <>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Question</p>
                            <p className="font-display font-bold text-xl text-white">{questionNumber}/{totalQuestions}</p>
                        </>
                    ) : (
                        <>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Correct</p>
                            <p className="font-display font-bold text-xl text-[#22C55E]">{currentPlayer.correctAnswers}</p>
                        </>
                    )}
                </div>
            </div>

            {/* Question Card */}
            <div
                className="rounded-xl p-5 mb-4"
                style={{
                    backgroundColor: `${difficultyColor}10`,
                    border: `1px solid ${difficultyColor}30`
                }}
            >
                <div className="flex items-center justify-between mb-3">
                    <span
                        className="text-[10px] px-2 py-0.5 rounded uppercase font-medium"
                        style={{ backgroundColor: `${difficultyColor}20`, color: difficultyColor }}
                    >
                        {question.difficulty}
                    </span>
                    {isRelaxedMode && (
                        <span className="text-[10px] text-white/30">Take your time</span>
                    )}
                </div>
                <p className="text-white text-center text-lg font-medium leading-relaxed py-3">
                    {question.question}
                </p>
            </div>

            {/* Answer Options */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-3">Select Answer</p>
                <div className="space-y-2">
                    {shuffledAnswers.map((answer, index) => {
                        const isEliminated = eliminatedAnswers.includes(answer);

                        return (
                            <motion.button
                                key={answer}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                    opacity: isEliminated ? 0.3 : 1,
                                    x: 0,
                                }}
                                transition={{ delay: index * 0.05 }}
                                whileTap={{ scale: isEliminated ? 1 : 0.98 }}
                                onClick={() => {
                                    if (!isEliminated) {
                                        trigger();
                                        onAnswer(answer);
                                    }
                                }}
                                disabled={isEliminated}
                                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                  ${isEliminated
                                        ? "bg-white/5 border border-white/5 cursor-not-allowed"
                                        : `bg-white/5 border border-white/10 hover:border-white/30`
                                    }
                `}
                                style={!isEliminated ? {
                                    borderColor: `${accentColor}30`,
                                    backgroundColor: `${accentColor}05`
                                } : undefined}
                            >
                                <div
                                    className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                    ${isEliminated ? "bg-white/5 text-white/20" : "bg-white/10 text-white/70"}
                  `}
                                    style={!isEliminated ? { backgroundColor: `${accentColor}20`, color: accentColor } : undefined}
                                >
                                    {answerLetters[index]}
                                </div>
                                <span className={`flex-1 text-sm font-medium ${isEliminated ? "text-white/30 line-through" : "text-white"}`}>
                                    {answer}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Skip Button - Only in Practice/Solo mode */}
            {isRelaxedMode && (
                <div className="space-y-2">
                    {canSkipFree ? (
                        <button
                            onClick={() => {
                                trigger();
                                onSkip();
                            }}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <SkipForward className="w-4 h-4" />
                            Skip Question
                            {!isPremium && freeSkipsRemaining > 0 && (
                                <span className="text-xs text-white/30">({freeSkipsRemaining} left)</span>
                            )}
                            {isPremium && (
                                <Crown className="w-3 h-3 text-yellow-500" />
                            )}
                        </button>
                    ) : (
                        <WatchAdButton
                            variant="inline"
                            label="Watch Ad to Skip"
                            onReward={onSkip}
                        />
                    )}
                </div>
            )}
        </motion.div>
    );
}
