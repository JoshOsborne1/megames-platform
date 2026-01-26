"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Home, RotateCcw } from "lucide-react";
import { Player, GameMode } from "@/lib/games/quiz-quarter/types";
import { calculateAccuracy } from "@/lib/games/quiz-quarter/gameLogic";
import { cn } from "@/lib/utils";

interface ResultsSummaryProps {
    players: Player[];
    gameMode: GameMode;
    onPlayAgain: () => void;
    onHome: () => void;
}

export function ResultsSummary({
    players,
    gameMode,
    onPlayAgain,
    onHome,
}: ResultsSummaryProps) {
    const winner = players[0];
    const isSolo = gameMode === "solo";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto h-dvh flex flex-col p-4 pt-14 pb-4"
        >
            <div className="flex-1 flex flex-col justify-center gap-5 py-2">
                {/* Header - Compressed */}
                <div className="text-center relative">
                    <motion.div
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative z-10"
                    >
                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
                    </motion.div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-400/10 blur-2xl rounded-full pointer-events-none" />

                    <h2 className="font-display font-black text-3xl text-white mb-1 tracking-tight">
                        {isSolo ? "SESSION DONE" : "VICTORY!"}
                    </h2>
                    {!isSolo && (
                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
                            {winner.name} rules the quarter!
                        </p>
                    )}
                </div>

                {/* Leaderboard - Tightened */}
                <div className="space-y-2">
                    {players.slice(0, 4).map((player, index) => {
                        const accuracy = calculateAccuracy(player);
                        const isWinner = index === 0;

                        return (
                            <motion.div
                                key={player.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "flex items-center justify-between p-3.5 rounded-2xl border relative overflow-hidden",
                                    isWinner ? "bg-yellow-400/10 border-yellow-400/30" : "bg-white/2 border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3.5 relative">
                                    <span className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-base border",
                                        isWinner ? "bg-yellow-400 text-black border-yellow-400/20" : "bg-white/5 text-white/20 border-white/5"
                                    )}>
                                        {index + 1}
                                    </span>
                                    <div>
                                        <span className={cn(
                                            "font-display font-black text-lg tracking-tight leading-none block",
                                            isWinner ? "text-white" : "text-white/60"
                                        )}>
                                            {player.name}
                                        </span>
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20">
                                            <span>{accuracy}% Success</span>
                                            <span className="flex items-center gap-1">
                                                <Flame className="w-3 h-3 text-warning/30" />
                                                {player.bestStreak}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className={cn("font-display font-black text-xl", isWinner ? "text-yellow-400" : "text-white/40")}>
                                    {player.score}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Solo Stats - Compact */}
                {isSolo && (
                    <div className="glass-panel p-5 rounded-2xl border-white/10 bg-white/2">
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="space-y-0.5">
                                <p className="font-display text-xl font-black text-emerald-400">{winner.correctAnswers}</p>
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">Correct</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-display text-xl font-black text-white/40">{winner.totalAnswers - winner.correctAnswers}</p>
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">Wrong</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-display text-xl font-black text-warning">{winner.bestStreak}</p>
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">Peak</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions - Bottom Anchored */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onPlayAgain}
                    className="group relative h-14 rounded-xl bg-emerald-500 text-white font-display font-black text-base flex items-center justify-center gap-2 overflow-hidden shadow-xl"
                >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    <RotateCcw className="w-4 h-4 relative" />
                    <span className="relative">RETRY</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onHome}
                    className="h-14 rounded-xl bg-white/5 border border-white/10 text-white font-display font-black text-base flex items-center justify-center gap-2"
                >
                    <Home className="w-4 h-4" />
                    HUB
                </motion.button>
            </div>
        </motion.div>
    );
}
