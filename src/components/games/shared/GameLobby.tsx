"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";

interface GameLobbyProps {
    /** Game title displayed in header */
    title: string;
    /** Optional subtitle/tagline */
    subtitle?: string;
    /** Icon component to display next to title */
    icon?: ReactNode;
    /** Content to render inside the lobby card */
    children: ReactNode;
    /** Callback when start button is clicked */
    onStart: () => void;
    /** Text for start button (default: "Begin Game") */
    startButtonText?: string;
    /** Whether start button is disabled */
    startDisabled?: boolean;
    /** Optional back link URL (default: /games) */
    backUrl?: string;
    /** Optional color accent for the game (default: #ff006e) */
    accentColor?: string;
}

export function GameLobby({
    title,
    subtitle,
    icon,
    children,
    onStart,
    startButtonText = "Begin Game",
    startDisabled = false,
    backUrl = "/games",
    accentColor = "#ff006e",
}: GameLobbyProps) {
    return (
        <div className="flex items-center justify-center w-full min-h-[60vh] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-[#1a0f2e]/80 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-8 shadow-2xl"
            >
                {/* Back Link */}
                <Link
                    href={backUrl}
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 font-space text-sm uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                {/* Header */}
                <div className="text-center mb-10">
                    {icon && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className="inline-flex items-center justify-center mb-4"
                            style={{ color: accentColor }}
                        >
                            {icon}
                        </motion.div>
                    )}
                    <motion.h2
                        className="font-display font-black text-4xl md:text-5xl text-white mb-2 tracking-tight uppercase"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        {title}
                    </motion.h2>
                    {subtitle && (
                        <p className="text-white/50 font-space uppercase text-xs tracking-widest">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {children}

                    {/* Start Button */}
                    <motion.button
                        whileHover={!startDisabled ? { scale: 1.02 } : {}}
                        whileTap={!startDisabled ? { scale: 0.98 } : {}}
                        onClick={onStart}
                        disabled={startDisabled}
                        className={`w-full py-5 rounded-2xl font-display font-black text-xl text-white shadow-lg uppercase tracking-widest mt-4 flex items-center justify-center gap-3 transition-all ${startDisabled
                                ? "bg-white/10 text-white/30 cursor-not-allowed"
                                : ""
                            }`}
                        style={{
                            background: startDisabled
                                ? undefined
                                : `linear-gradient(135deg, ${accentColor} 0%, #8338ec 100%)`,
                            boxShadow: startDisabled
                                ? undefined
                                : `0 0 30px ${accentColor}40`,
                        }}
                    >
                        <Play className="w-6 h-6" />
                        {startButtonText}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
