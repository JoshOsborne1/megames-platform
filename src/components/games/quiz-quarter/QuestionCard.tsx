"use client";

import { motion } from "framer-motion";
import { Flame, SkipForward, Lightbulb } from "lucide-react";
import { Question, Player, GameMode, HintSkipState } from "@/lib/games/quiz-quarter/types";
import { useHaptic } from "@/hooks/useHaptic";
import { WatchAdButton } from "../shared";
import { cn } from "@/lib/utils";

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
    hintSkipState: HintSkipState;
    onAnswer: (answer: string) => void;
    onSkip: () => void;
    onHint: () => void;
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
    hintSkipState,
    onAnswer,
    onSkip,
    onHint,
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

    // Resource checks
    const hasFreeSkip = !isPremium && hintSkipState.freeSkipsRemaining > 0;
    const hasFreeHint = !isPremium && hintSkipState.freeHintsRemaining > 0;
    const hasPoolResource = isPremium && hintSkipState.poolRemaining > 0;
    
    const canSkip = isPremium ? hasPoolResource : hasFreeSkip;
    const canHint = (isPremium ? hasPoolResource : hasFreeHint) && eliminatedAnswers.length === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-dvh flex flex-col p-4 pt-14 pb-4"
        >
            <div className="flex-1 flex flex-col justify-center gap-5">
                {/* HUD - Compact */}
                <div className="flex items-center justify-between px-1">
                    {/* Left: Score or Streak */}
                    <div className="space-y-0.5 text-left">
                        <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">
                            {gameMode === "party" ? "Score" : "Streak"}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-xl tracking-tight" style={{ color: gameMode === "party" ? accentColor : "#FF9F1C" }}>
                                {gameMode === "party" ? currentPlayer.score : currentPlayer.streak}
                            </span>
                            {currentPlayer.streak >= 3 && (
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <Flame className="w-4 h-4 text-orange-400" />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Center: Progress Indicator */}
                    <div className="relative">
                        {timedMode ? (
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-white/5" />
                                    <motion.circle
                                        cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" fill="transparent"
                                        strokeDasharray="125.6"
                                        initial={{ strokeDashoffset: 125.6 }}
                                        animate={{ strokeDashoffset: 125.6 - (125.6 * timePercent) / 100 }}
                                        className={cn("transition-colors duration-500", timePercent <= 33 ? "text-red-500" : "text-white/40")}
                                    />
                                </svg>
                                <span className={cn("absolute font-display font-black text-lg", timePercent <= 33 ? "text-red-500" : "text-white")}>
                                    {Math.ceil(timeRemaining)}
                                </span>
                            </div>
                        ) : (
                            <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                <span className="text-white/20 font-black text-[9px] uppercase tracking-widest mr-1.5 text-center">Step</span>
                                <span className="font-display font-black text-lg text-white">{questionNumber}</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Progress */}
                    <div className="text-right space-y-0.5">
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                            {gameMode === "party" ? "Question" : "Correct"}
                        </p>
                        <span className="font-display font-black text-xl text-white">
                            {gameMode === "party" ? `${questionNumber}/${totalQuestions}` : currentPlayer.correctAnswers}
                        </span>
                    </div>
                </div>

                {/* Question Card - Tightened */}
                <div className="relative group p-0.5">
                    <div className="glass-panel rounded-2xl p-6 border-white/10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3">
                            <span
                                className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border"
                                style={{ backgroundColor: `${difficultyColor}15`, color: difficultyColor, borderColor: `${difficultyColor}30` }}
                            >
                                {question.difficulty}
                            </span>
                        </div>
                        <p className="text-white text-center text-xl font-display font-bold leading-tight py-2">
                            {question.question}
                        </p>
                    </div>
                </div>

                {/* Answer Options - Tightened */}
                <div className="space-y-2">
                    {shuffledAnswers.map((answer, index) => {
                        const isEliminated = eliminatedAnswers.includes(answer);

                        return (
                            <motion.button
                                key={answer}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: isEliminated ? 0.2 : 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileTap={{ scale: isEliminated ? 1 : 0.98 }}
                                onClick={() => { if (!isEliminated) { trigger(); onAnswer(answer); } }}
                                disabled={isEliminated}
                                className={cn(
                                    "group/ans w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left relative overflow-hidden",
                                    isEliminated ? "bg-white/5 border-transparent cursor-not-allowed" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-xs border",
                                    isEliminated ? "bg-white/5 text-white/10 border-transparent" : "bg-white/10 text-white/50 border-white/10"
                                )} style={!isEliminated ? { color: accentColor, borderColor: `${accentColor}20` } : undefined}>
                                    {answerLetters[index]}
                                </div>
                                <span className={cn("flex-1 text-sm font-bold", isEliminated ? "text-white/20 line-through" : "text-white/90")}>
                                    {answer}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Tools (Hints/Skips) - Only in Practice/Solo mode */}
            {isRelaxedMode && (
                <div className="grid grid-cols-2 gap-2">
                    {/* Hint Button */}
                    <div className="flex-1">
                        {canHint ? (
                            <button
                                onClick={() => { trigger(); onHint(); }}
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                            >
                                <Lightbulb className="w-4 h-4 text-yellow-400" />
                                Hint (50/50)
                                {isPremium ? (
                                    <span className="text-xs text-white/30">({hintSkipState.poolRemaining})</span>
                                ) : (
                                    <span className="text-xs text-white/30">({hintSkipState.freeHintsRemaining})</span>
                                )}
                            </button>
                        ) : eliminatedAnswers.length > 0 ? (
                            <div className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/20 font-medium flex items-center justify-center gap-2 opacity-50">
                                <Lightbulb className="w-4 h-4" />
                                Hint Used
                            </div>
                        ) : (
                            <WatchAdButton
                                variant="compact"
                                label="Hint for Ad"
                                onReward={onHint}
                            />
                        )}
                    </div>

                    {/* Skip Button */}
                    <div className="flex-1">
                        {canSkip ? (
                            <button
                                onClick={() => { trigger(); onSkip(); }}
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                            >
                                <SkipForward className="w-4 h-4" />
                                Skip
                                {isPremium ? (
                                    <span className="text-xs text-white/30">({hintSkipState.poolRemaining})</span>
                                ) : (
                                    <span className="text-xs text-white/30">({hintSkipState.freeSkipsRemaining})</span>
                                )}
                            </button>
                        ) : (
                            <WatchAdButton
                                variant="compact"
                                label="Skip for Ad"
                                onReward={onSkip}
                            />
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
