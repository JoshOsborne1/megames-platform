"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Flame, Clock, ChevronRight, SkipForward, Trophy } from "lucide-react";
import { Question, GameMode } from "@/lib/games/quiz-quarter/types";
import { cn } from "@/lib/utils";

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md mx-auto h-dvh flex flex-col p-4 pt-14 pb-4"
        >
            <div className="flex-1 flex flex-col justify-center gap-4 py-2">
                {/* Result Header - Compressed Scale */}
                <div className="text-center relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={showCorrectFeedback ? "correct" : showWrongFeedback ? "wrong" : "skipped"}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className={cn(
                                "w-20 h-20 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden",
                                showSkipFeedback ? "bg-white/5 border border-white/10" :
                                showCorrectFeedback ? "bg-emerald-500 shadow-emerald-500/20" : "bg-red-500 shadow-red-500/20"
                            )}
                        >
                            <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent pointer-events-none" />
                            {showSkipFeedback ? (
                                <SkipForward className="w-10 h-10 text-white/50" />
                            ) : showCorrectFeedback ? (
                                <Check className="w-10 h-10 text-white" />
                            ) : (
                                <X className="w-10 h-10 text-white" />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <h2 className={cn(
                        "font-display font-black text-3xl mb-1 tracking-tight drop-shadow-sm",
                        showSkipFeedback ? "text-white/40" :
                        showCorrectFeedback ? "text-emerald-400" : "text-red-400"
                    )}>
                        {showSkipFeedback ? "SKIPPED" : showCorrectFeedback ? "AWESOME!" : "OH NO!"}
                    </h2>

                    {(showSkipFeedback || showWrongFeedback) && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/50 text-xs font-medium"
                        >
                            Answer: <span className="text-white font-black">{question.correctAnswer}</span>
                        </motion.p>
                    )}
                </div>

                {/* Points Breakdown - Tightened */}
                {timedMode && showCorrectFeedback && pointsEarned > 0 && (
                    <motion.div 
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="glass-panel p-4 rounded-2xl border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden group"
                    >
                        <div className="absolute -right-3 -bottom-3 opacity-5 scale-125 transform rotate-12">
                            <Trophy className="w-20 h-20 text-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Points</span>
                            <span className="font-display text-3xl font-black text-emerald-400 tracking-tighter">+{pointsEarned}</span>
                        </div>

                        <div className="flex gap-3 relative z-10">
                            {speedBonus > 0 && (
                                <div className="flex items-center gap-1.5 text-electric-cyan font-bold text-[10px] bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Speed +{speedBonus}</span>
                                </div>
                            )}
                            {streakBonus > 0 && (
                                <div className="flex items-center gap-1.5 text-warning font-bold text-[10px] bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                    <Flame className="w-3.5 h-3.5" />
                                    <span>Streak +{streakBonus}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Answers Review - Tightened */}
                <div className="glass-panel p-4 rounded-2xl border-white/10 bg-white/2">
                    <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-3 px-1">Review</p>
                    <div className="space-y-1.5">
                        {allAnswers.map((answer, index) => {
                            const isSelected = answer === selectedAnswer;
                            const isCorrectAnswer = answer === question.correctAnswer;

                            return (
                                <div
                                    key={answer}
                                    className={cn(
                                        "flex items-center gap-3 p-2.5 rounded-xl border transition-all",
                                        isCorrectAnswer ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.05)]" :
                                        isSelected ? "bg-red-500/10 border-red-500/30" : "bg-white/2 border-transparent opacity-30"
                                    )}
                                >
                                    <div className={cn(
                                        "w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-[10px] border",
                                        isCorrectAnswer ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                                        isSelected ? "bg-red-500/20 text-red-400 border-red-500/20" : "bg-white/5 text-white/20 border-white/5"
                                    )}>
                                        {answerLetters[index]}
                                    </div>
                                    <span className={cn(
                                        "flex-1 text-xs font-bold truncate",
                                        isCorrectAnswer ? "text-white" : isSelected ? "text-red-400" : "text-white/20"
                                    )}>
                                        {answer}
                                    </span>
                                    {isCorrectAnswer && <Check className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.2)]" />}
                                    {isSelected && !isCorrectAnswer && <X className="w-4 h-4 text-red-400 opacity-50" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Continue Action - Anchored Bottom */}
            <div className="mt-2">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onContinue}
                    className="group relative w-full py-4 rounded-xl text-white font-display font-black text-lg flex items-center justify-center gap-2 overflow-hidden shadow-2xl transition-all hover:brightness-110 active:scale-[0.97]"
                    style={{ backgroundColor: accentColor }}
                >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    <span className="relative">{timedMode ? "NEXT CHALLENGE" : "KEEP LEARNING"}</span>
                    <ChevronRight className="relative w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
            </div>
        </motion.div>
    );
}
