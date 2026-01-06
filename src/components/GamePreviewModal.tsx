"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2, Globe, Sparkles, Users, Clock, ChevronRight } from "lucide-react";
import { GameConfig } from "@/config/games";

interface GamePreviewModalProps {
    game: GameConfig | null;
    isOpen: boolean;
    onClose: () => void;
    onPlayLocal: () => void;
    onPlayOnline: () => void;
}

export function GamePreviewModal({
    game,
    isOpen,
    onClose,
    onPlayLocal,
    onPlayOnline,
}: GamePreviewModalProps) {
    if (!game) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 pointer-events-none p-4">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            className="bg-[#0a0015] border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl pointer-events-auto relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full z-20 active:scale-95 transition-all border border-white/10"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>

                            {/* Hero Section - Simple, clean icon display */}
                            <div className="relative pt-10 pb-6 flex flex-col items-center justify-center">
                                {/* Simple icon container - no excessive glow */}
                                <motion.div
                                    className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <game.icon
                                        className="w-12 h-12 sm:w-14 sm:h-14"
                                        style={{ color: game.color }}
                                    />
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="px-5 sm:px-6 pb-6 sm:pb-8">
                                {/* Drag Handle */}
                                <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-4" />

                                {/* Title */}
                                <h2 className="text-xl sm:text-2xl font-display font-bold text-center text-white mb-2">
                                    {game.name}
                                </h2>

                                {/* Tags */}
                                {game.tags && (
                                    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                                        {game.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/5 border border-white/10 text-white/50"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Meta Info */}
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    {game.playerCount && (
                                        <div className="flex items-center gap-1.5 text-white/40">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{game.playerCount} Players</span>
                                        </div>
                                    )}
                                    {game.duration && (
                                        <div className="flex items-center gap-1.5 text-white/40">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{game.duration}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-center text-white/50 text-sm mb-5 leading-relaxed">
                                    {game.fullDescription || game.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="space-y-2.5">
                                    {/* Play Local Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onPlayLocal}
                                        className="w-full p-3.5 rounded-xl border transition-all flex items-center justify-between group"
                                        style={{
                                            backgroundColor: `${game.color}10`,
                                            borderColor: `${game.color}30`
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{ backgroundColor: `${game.color}20`, color: game.color }}
                                            >
                                                <Gamepad2 className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white text-sm">Play Local</div>
                                                <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Pass & Play</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/30" />
                                    </motion.button>

                                    {/* Multiplayer Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onPlayOnline}
                                        className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-[#8338ec]/20 text-[#8338ec]">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white text-sm">Online Lobby</div>
                                                <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Create or Join</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5 text-[#8338ec]/60" />
                                            <ChevronRight className="w-4 h-4 text-white/30" />
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
