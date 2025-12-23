"use client";

import { motion } from "framer-motion";
import { DeckInfo } from "@/lib/games/forbidden-flash/types";
import { getAvailableDecks } from "@/lib/games/forbidden-flash/data";
import {
    Zap, Star, Film, Music, Gamepad2, PartyPopper,
    Brain, BookOpen, Sparkles, Crown, LucideIcon
} from "lucide-react";

// Map icon names to actual Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
    Zap,
    Star,
    Film,
    Music,
    Gamepad2,
    PartyPopper,
    Brain,
    BookOpen,
    Sparkles,
    Crown,
};

interface DeckSelectorProps {
    selectedDeckId: string;
    onDeckChange: (deckId: string) => void;
    accentColor?: string;
}

export function DeckSelector({
    selectedDeckId,
    onDeckChange,
    accentColor = "#ff006e"
}: DeckSelectorProps) {
    const decks = getAvailableDecks();

    return (
        <section className="w-full">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4" style={{ color: accentColor }}>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wider">
                    Card Deck
                </h3>
            </div>

            {/* Deck Grid */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {decks.map((deck) => {
                    const IconComponent = ICON_MAP[deck.icon] || Zap;
                    const isSelected = deck.id === selectedDeckId;

                    return (
                        <motion.button
                            key={deck.id}
                            onClick={() => onDeckChange(deck.id)}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all text-left touch-manipulation ${isSelected
                                    ? "border-white/40 bg-white/10"
                                    : "border-white/10 bg-white/5 active:border-white/30"
                                }`}
                            style={{
                                boxShadow: isSelected ? `0 0 20px ${deck.accentColor}30` : undefined,
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                {/* Icon - Touch-friendly size */}
                                <div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "bg-white/20" : "bg-white/10"
                                        }`}
                                    style={{ color: isSelected ? deck.accentColor : "white" }}
                                >
                                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                        <h4 className="font-display font-bold text-white text-base sm:text-lg">
                                            {deck.name}
                                        </h4>
                                        {isSelected && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${deck.accentColor}30`,
                                                    color: deck.accentColor,
                                                }}
                                            >
                                                Selected
                                            </motion.span>
                                        )}
                                    </div>
                                    <p className="text-white/50 text-xs sm:text-sm font-space line-clamp-2 sm:truncate mt-0.5">
                                        {deck.description}
                                    </p>
                                </div>

                                {/* Card Count */}
                                <div className="text-right flex-shrink-0">
                                    <div
                                        className="font-display font-black text-lg sm:text-xl"
                                        style={{ color: isSelected ? deck.accentColor : "white" }}
                                    >
                                        {deck.cardCount}
                                    </div>
                                    <div className="text-white/30 text-[8px] sm:text-[10px] font-pixel uppercase tracking-widest">
                                        Cards
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Coming Soon Indicator if only one deck */}
            {decks.length === 1 && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl border border-dashed border-white/20 text-center">
                    <p className="text-white/40 text-xs sm:text-sm font-space">
                        More decks coming soon! 🚀
                    </p>
                </div>
            )}
        </section>
    );
}
