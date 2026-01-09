"use client";

import { motion } from "framer-motion";
import { Check, X, Flame, Clock, ChevronRight, SkipForward, BookOpen } from "lucide-react";
import { Question, GameMode } from "@/lib/games/quiz-quarter/types";

interface AnswerRevealProps {
    question: Question;
    selectedAnswer: string | null;
    isCorrect: boolean | null;
    pointsEarned: number;
    speedBonus: number;
    streakBonus: number;
    currentStreak: number;
    wasSkipped?: boolean;
    gameMode: GameMode;
    timedMode: boolean;
    onContinue: () => void;
}

export function AnswerReveal({
    question,
    selectedAnswer,
    isCorrect,
    pointsEarned,
    speedBonus,
    streakBonus,
    currentStreak,
    wasSkipped = false,
    gameMode,
    timedMode,
    onContinue,
}: AnswerRevealProps) {
    const answerLetters = ["A", "B", "C", "D"];
    const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
    const accentColor = gameMode === "solo" ? "#22C55E" : "#ff006e";

    // Determine what to show based on state
    const showSkipFeedback = wasSkipped || (selectedAnswer === null);
    const showCorrectFeedback = !showSkipFeedback && isCorrect;
    const showWrongFeedback = !showSkipFeedback && !isCorrect;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
        >
            {/* Result Header */}
            <div className="text-center mb-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${showSkipFeedback ? "bg-white/10" :
                            showCorrectFeedback ? "bg-emerald-500" : "bg-red-500"
                        }`}
                >
                    {showSkipFeedback ? (
                        <SkipForward className="w-10 h-10 text-white/50" />
                    ) : showCorrectFeedback ? (
                        <Check className="w-10 h-10 text-white" />
                    ) : (
                        <X className="w-10 h-10 text-white" />
                    )}
                </motion.div>

                <h2 className={`font-display font-bold text-2xl mb-1 ${showSkipFeedback ? "text-white/60" :
                        showCorrectFeedback ? "text-emerald-400" : "text-red-400"
                    }`}>
                    {showSkipFeedback ? "Skipped" : showCorrectFeedback ? "Correct!" : "Wrong!"}
                </h2>

                {(showSkipFeedback || showWrongFeedback) && (
                    <p className="text-white/60 text-sm">
                        The answer was: <span className="text-white font-bold">{question.correctAnswer}</span>
                    </p>
                )}
            </div>

            {/* Points Breakdown (only in party/timed mode and if correct) */}
            {timedMode && showCorrectFeedback && pointsEarned > 0 && (
                <div className="p-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-white/60 text-sm">Points Earned</span>
                        <span className="font-display text-2xl font-bold text-[#22C55E]">+{pointsEarned}</span>
                    </div>

                    {/* Bonus Breakdown */}
                    <div className="space-y-2 text-sm">
                        {speedBonus > 0 && (
                            <div className="flex items-center justify-between text-[#00f5ff]">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Speed Bonus</span>
                                </div>
                                <span>+{speedBonus}</span>
                            </div>
                        )}
                        {streakBonus > 0 && (
                            <div className="flex items-center justify-between text-orange-400">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-4 h-4" />
                                    <span>Streak Bonus ({currentStreak}x)</span>
                                </div>
                                <span>+{streakBonus}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Streak Display (party mode) */}
            {timedMode && showCorrectFeedback && currentStreak >= 3 && (
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="font-display font-bold text-orange-400">{currentStreak} Streak!</span>
                    </div>
                </div>
            )}

            {/* Learning Note - Only in practice mode */}
            {!timedMode && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <div className="flex items-center gap-2 text-white/50 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Learn More</span>
                    </div>
                    <p className="text-white/70 text-sm">
                        <span className="font-bold text-white">{question.correctAnswer}</span> is the correct answer.
                    </p>
                </div>
            )}

            {/* Answer Review - Compact */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-3">All Answers</p>
                <div className="space-y-2">
                    {allAnswers.map((answer, index) => {
                        const isSelected = answer === selectedAnswer;
                        const isCorrectAnswer = answer === question.correctAnswer;

                        let bgColor = "bg-white/5";
                        let borderColor = "border-white/10";
                        let textColor = "text-white/50";

                        if (isCorrectAnswer) {
                            bgColor = "bg-emerald-500/10";
                            borderColor = "border-emerald-500/50";
                            textColor = "text-emerald-400";
                        } else if (isSelected && !isCorrectAnswer) {
                            bgColor = "bg-red-500/10";
                            borderColor = "border-red-500/50";
                            textColor = "text-red-400";
                        }

                        return (
                            <div
                                key={answer}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${bgColor} ${borderColor}`}
                            >
                                <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${textColor} bg-white/5`}>
                                    {answerLetters[index]}
                                </div>
                                <span className={`flex-1 text-sm ${textColor}`}>{answer}</span>
                                {isCorrectAnswer && <Check className="w-4 h-4 text-emerald-400" />}
                                {isSelected && !isCorrectAnswer && <X className="w-4 h-4 text-red-400" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Continue Button */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="w-full py-4 rounded-xl text-white font-display font-bold text-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: accentColor }}
            >
                {timedMode ? "Next Question" : "Continue Learning"} <ChevronRight className="w-5 h-5" />
            </motion.button>
        </motion.div>
    );
}
