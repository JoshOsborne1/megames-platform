"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Users2, Crown } from "lucide-react";

interface InfoButtonProps {
    title: string;
    content: string;
    icon?: React.ReactNode;
    accentColor?: string;
    defaultExpanded?: boolean;
}

export function InfoButton({
    title,
    content,
    icon,
    accentColor = "#00f5ff",
    defaultExpanded = false,
}: InfoButtonProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-3 rounded-xl border transition-all flex items-center justify-between"
                style={{
                    backgroundColor: isExpanded ? `${accentColor}15` : "rgba(255,255,255,0.05)",
                    borderColor: isExpanded ? `${accentColor}40` : "rgba(255,255,255,0.1)",
                }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${accentColor}20` }}
                    >
                        {icon || <HelpCircle className="w-4 h-4" style={{ color: accentColor }} />}
                    </div>
                    <span className="text-white font-medium text-sm">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-white/40" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div
                            className="p-3 pt-2 rounded-b-xl border-x border-b text-white/60 text-sm leading-relaxed"
                            style={{ borderColor: `${accentColor}40` }}
                        >
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Game mode info with expandable explanations
interface GameModeOption {
    id: string;
    label: string;
    shortDescription: string;
    fullDescription: string;
    icon: React.ReactNode;
}

interface GameModeSelectorProps {
    modes: GameModeOption[];
    selectedMode: string;
    onModeChange: (mode: string) => void;
    accentColor?: string;
}

export function GameModeSelector({
    modes,
    selectedMode,
    onModeChange,
    accentColor = "#8338ec",
}: GameModeSelectorProps) {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="mb-4">
            {/* Mode Toggle Row */}
            <div className="flex gap-2 mb-2">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id)}
                        className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${selectedMode === mode.id
                                ? "border-[#8338ec] text-[#8338ec]"
                                : "bg-white/5 border-white/10 text-white/50 hover:text-white/70"
                            }`}
                        style={{
                            backgroundColor: selectedMode === mode.id ? `${accentColor}20` : undefined,
                            borderColor: selectedMode === mode.id ? accentColor : undefined,
                            color: selectedMode === mode.id ? accentColor : undefined,
                        }}
                    >
                        {mode.icon}
                        <span className="font-bold text-sm">{mode.label}</span>
                        <span className="text-[10px] opacity-70">{mode.shortDescription}</span>
                    </button>
                ))}
            </div>

            {/* Info Toggle */}
            <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-white/40 hover:text-white/60 transition-colors text-xs"
            >
                <HelpCircle className="w-3 h-3" />
                <span>{showInfo ? "Hide mode info" : "What's the difference?"}</span>
                <motion.div
                    animate={{ rotate: showInfo ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-3 h-3" />
                </motion.div>
            </button>

            {/* Expandable Descriptions */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 gap-2 pt-2">
                            {modes.map((mode) => (
                                <div
                                    key={mode.id}
                                    className={`p-3 rounded-xl border text-sm ${selectedMode === mode.id
                                            ? "border-[#8338ec]/30 bg-[#8338ec]/10"
                                            : "border-white/10 bg-white/5"
                                        }`}
                                    style={{
                                        borderColor: selectedMode === mode.id ? `${accentColor}40` : undefined,
                                        backgroundColor: selectedMode === mode.id ? `${accentColor}15` : undefined,
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span style={{ color: selectedMode === mode.id ? accentColor : "rgba(255,255,255,0.7)" }}>
                                            {mode.icon}
                                        </span>
                                        <span className="font-bold text-white">{mode.label}</span>
                                    </div>
                                    <p className="text-white/50 text-xs leading-relaxed">{mode.fullDescription}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Pre-configured game mode options for reuse
export const STANDARD_GAME_MODES: GameModeOption[] = [
    {
        id: "classic",
        label: "Classic",
        shortDescription: "1v1 turns",
        fullDescription: "Players take turns in pairs. One player gives clues while another guesses, then swap. Fair and competitive!",
        icon: <Users2 className="w-5 h-5" />,
    },
    {
        id: "question-master",
        label: "Quiz Master",
        shortDescription: "1 vs all",
        fullDescription: "One player becomes the Quiz Master who gives clues to everyone else. Great for parties where one person wants to host!",
        icon: <Crown className="w-5 h-5" />,
    },
];

// Alias for QM mode
export const QM_MODE_ID = "question-master";
export const QM_MODE_LABEL = "Quiz Master";
