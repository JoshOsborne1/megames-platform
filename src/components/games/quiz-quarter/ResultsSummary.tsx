"use client";

import { motion } from "framer-motion";
import { Trophy, Target, Flame, Home, RotateCcw } from "lucide-react";
import { Player, GameMode } from "@/lib/games/quiz-quarter/types";
import { calculateAccuracy } from "@/lib/games/quiz-quarter/gameLogic";

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
            className="w-full"
        >
            {/* Header */}
            <div className="text-center mb-8 pt-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                </motion.div>
                <h2 className="font-display font-black text-3xl text-white mb-2">
                    {isSolo ? "Quiz Complete!" : "Game Over!"}
                </h2>
                {!isSolo && (
                    <p className="text-white/50">
                        <span className="text-yellow-500 font-bold">{winner.name}</span> wins!
                    </p>
                )}
            </div>

            {/* Leaderboard - Like Dynamic Decks Game Over */}
            <div className="space-y-3 mb-8">
                {players.map((player, index) => {
                    const accuracy = calculateAccuracy(player);
                    const isWinner = index === 0;

                    return (
                        <motion.div
                            key={player.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-4 rounded-xl ${isWinner
                                    ? "bg-yellow-500/10 border-2 border-yellow-500"
                                    : "bg-white/5 border border-white/10"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold ${isWinner ? "bg-yellow-500 text-black" : "bg-white/10 text-white/50"
                                        }`}
                                >
                                    {index + 1}
                                </span>
                                <div>
                                    <span className="font-display font-bold text-lg text-white">{player.name}</span>
                                    <div className="flex items-center gap-3 text-[10px] text-white/40">
                                        <span className="flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            {accuracy}%
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Flame className="w-3 h-3 text-orange-400/60" />
                                            {player.bestStreak}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`font-display font-black text-xl ${isWinner ? "text-yellow-500" : "text-white/60"
                                    }`}
                            >
                                {player.score}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Solo Mode Stats */}
            {isSolo && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-3">Performance</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="font-display text-2xl font-bold text-emerald-400">
                                {winner.correctAnswers}
                            </p>
                            <p className="text-[10px] text-white/40">Correct</p>
                        </div>
                        <div>
                            <p className="font-display text-2xl font-bold text-white">
                                {winner.totalAnswers - winner.correctAnswers}
                            </p>
                            <p className="text-[10px] text-white/40">Wrong</p>
                        </div>
                        <div>
                            <p className="font-display text-2xl font-bold text-orange-400">
                                {winner.bestStreak}
                            </p>
                            <p className="text-[10px] text-white/40">Best Streak</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons - Like Dynamic Decks */}
            <div className="space-y-3">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onPlayAgain}
                    className="w-full py-4 rounded-xl bg-[#22C55E] text-white font-display font-bold text-lg flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onHome}
                    className="w-full py-4 rounded-xl bg-white/10 text-white font-display font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                >
                    <Home className="w-5 h-5" />
                    All Games
                </motion.button>
            </div>
        </motion.div>
    );
}
