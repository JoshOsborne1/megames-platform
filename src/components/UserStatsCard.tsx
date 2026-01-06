"use client";

import { motion } from "framer-motion";
import { Trophy, Gamepad2, Target, TrendingUp } from "lucide-react";

interface UserStatsCardProps {
    gamesPlayed?: number;
    gamesWon?: number;
    totalPoints?: number;
    winRate?: number;
}

export function UserStatsCard({
    gamesPlayed = 0,
    gamesWon = 0,
    totalPoints = 0,
    winRate = 0,
}: UserStatsCardProps) {
    const stats = [
        { icon: Gamepad2, value: gamesPlayed, label: "Played", color: "#00BFFF" },
        { icon: Trophy, value: gamesWon, label: "Wins", color: "#FFD700" },
        { icon: Target, value: totalPoints, label: "Points", color: "#ff006e" },
        { icon: TrendingUp, value: `${winRate}%`, label: "Rate", color: "#39ff14" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 -mx-4 px-4"
        >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="flex-shrink-0 w-[80px] bg-[#16162a] border border-white/10 rounded-xl p-3 text-center"
                    >
                        <stat.icon
                            className="w-5 h-5 mx-auto mb-1"
                            style={{ color: stat.color }}
                        />
                        <p className="font-display text-lg font-bold text-white">
                            {stat.value}
                        </p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-wide">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
