"use client";

import { motion } from "framer-motion";
import { Users, BarChart2, Trophy, Smartphone } from "lucide-react";

interface AuthBenefitsProps {
    variant?: "full" | "inline";
}

export function AuthBenefits({ variant = "full" }: AuthBenefitsProps) {
    const benefits = [
        {
            icon: Users,
            title: "Multiplayer",
            color: "#ff006e"
        },
        {
            icon: BarChart2,
            title: "Stats",
            color: "#8338ec"
        },
        {
            icon: Trophy,
            title: "Leaderboards",
            color: "#00f5ff"
        },
        {
            icon: Smartphone,
            title: "Cross-Platform",
            color: "#fb00ff"
        }
    ];

    // Inline variant - compact single row for mobile
    if (variant === "inline") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center gap-4 mb-5"
            >
                {benefits.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.05 }}
                        className="flex flex-col items-center gap-1"
                    >
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
                                border: `1px solid ${item.color}25`,
                            }}
                        >
                            <item.icon
                                className="w-4 h-4"
                                style={{ color: item.color }}
                            />
                        </div>
                        <span className="text-white/50 text-[10px] font-medium">
                            {item.title}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    // Full version for desktop sidebar
    return (
        <div className="hidden lg:flex flex-col justify-center h-full p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-lg mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="font-display text-4xl font-bold mb-2">
                        <span className="text-white">Level Up Your</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff]">
                            Game Night
                        </span>
                    </h2>
                    <p className="text-white/60 mb-12 text-lg font-space">
                        Join the ultimate party game platform. Free to play, forever fun.
                    </p>
                </motion.div>

                <div className="grid gap-6">
                    {[
                        { ...benefits[0], description: "Host and join games instantly with friends or worldwide." },
                        { ...benefits[1], description: "Detailed history of your wins, losses, and best plays." },
                        { ...benefits[2], description: "Climb the leaderboards and earn exclusive badges." },
                        { ...benefits[3], description: "Seamless play on mobile, tablet, or desktop." },
                    ].map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-start gap-4 group"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                                style={{
                                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)`,
                                    border: `1px solid ${item.color}30`,
                                    boxShadow: `0 0 15px ${item.color}15`
                                }}
                            >
                                <item.icon
                                    className="w-6 h-6 transition-colors"
                                    style={{ color: item.color }}
                                />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-lg text-white group-hover:text-white/90 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-white/50 text-sm font-space leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4"
                >
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0a0a14] grayscale opacity-50" />
                        ))}
                    </div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
                        Join 10,000+ Players
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
