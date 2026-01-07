"use client";

import { motion } from "framer-motion";
import { Users, BarChart2, ShoppingBag, Globe, Trophy, Smartphone } from "lucide-react";

export function AuthBenefits() {
    const benefits = [
        {
            icon: Users,
            title: "Global Multiplayer",
            description: "Host and join games instantly with friends or worldwide.",
            color: "#ff006e"
        },
        {
            icon: BarChart2,
            title: "Track Your Stats",
            description: "Detailed history of your wins, losses, and best plays.",
            color: "#8338ec"
        },
        {
            icon: Trophy,
            title: "Rank Up",
            description: "Climb the leaderboards and earn exclusive badges.",
            color: "#00f5ff"
        },
        {
            icon: Smartphone,
            title: "Cross-Platform",
            description: "Seamless play on mobile, tablet, or desktop.",
            color: "#fb00ff"
        }
    ];

    return (
        <div className="hidden lg:flex flex-col justify-center h-full p-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />

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
                    {benefits.map((item, index) => (
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

                {/* Bottom Stats or Social Proof could go here */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4"
                >
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0a0015] grayscale opacity-50" />
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
