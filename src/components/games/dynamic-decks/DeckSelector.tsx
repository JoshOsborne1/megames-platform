"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { getAvailableDecks } from "@/lib/games/dynamic-decks/data";
import {
    Zap, Star, Film, Music, Gamepad2, PartyPopper,
    Brain, BookOpen, Sparkles, Crown, LucideIcon,
    ChevronLeft, ChevronRight
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
    Zap, Star, Film, Music, Gamepad2, PartyPopper, Brain, BookOpen, Sparkles, Crown,
};

interface DeckSelectorProps {
    selectedDeckId: string;
    onDeckChange: (deckId: string) => void;
    accentColor?: string;
}

export function DeckSelector({ selectedDeckId, onDeckChange }: DeckSelectorProps) {
    const decks = getAvailableDecks();
    const [currentIndex, setCurrentIndex] = useState(
        decks.findIndex(d => d.id === selectedDeckId) || 0
    );

    useEffect(() => {
        const idx = decks.findIndex(d => d.id === selectedDeckId);
        if (idx !== -1) setCurrentIndex(idx);
        // Only sync when selectedDeckId changes externally, not when currentIndex changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeckId]);

    const currentDeck = decks[currentIndex];
    const IconComponent = ICON_MAP[currentDeck.icon] || Zap;

    const navigateTo = (index: number) => {
        const newIndex = Math.max(0, Math.min(decks.length - 1, index));
        setCurrentIndex(newIndex);
        onDeckChange(decks[newIndex].id);
    };

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x > 50 && currentIndex > 0) navigateTo(currentIndex - 1);
        else if (info.offset.x < -50 && currentIndex < decks.length - 1) navigateTo(currentIndex + 1);
    };

    return (
        <div className="w-full">
            {/* Deck Tabs */}
            <div className="flex gap-2 mb-4">
                {decks.map((deck, index) => {
                    const DeckIcon = ICON_MAP[deck.icon] || Zap;
                    const isActive = index === currentIndex;
                    return (
                        <button
                            key={deck.id}
                            onClick={() => navigateTo(index)}
                            className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all border ${isActive
                                ? "bg-white/10 border-white/30"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                            style={{ borderColor: isActive ? deck.accentColor : undefined }}
                        >
                            <DeckIcon className="w-5 h-5" style={{ color: isActive ? deck.accentColor : "rgba(255,255,255,0.5)" }} />
                            <span className={`text-xs font-medium ${isActive ? "text-white" : "text-white/50"}`}>
                                {deck.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Deck Card - Swipeable */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentDeck.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEnd}
                    className="p-4 rounded-xl border bg-white/5 cursor-grab active:cursor-grabbing"
                    style={{ borderColor: `${currentDeck.accentColor}30` }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${currentDeck.accentColor}20`, color: currentDeck.accentColor }}
                        >
                            <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-display font-bold text-white">{currentDeck.name}</h4>
                            <p className="text-white/40 text-xs">
                                {currentDeck.cardCount} cards • {currentDeck.deckType === "forbidden" ? "Word Guessing" : "Rhyme Guessing"}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 text-sm leading-relaxed mb-3">{currentDeck.description}</p>

                    {/* How to Play - Compact */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">How to Play</p>
                        <p className="text-white/70 text-xs leading-relaxed">
                            {currentDeck.deckType === "forbidden"
                                ? "Describe the word without using the forbidden words!"
                                : "Read the clue aloud. Your team guesses the rhyming answer!"}
                        </p>
                    </div>

                    {/* Swipe hint */}
                    <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-white/10">
                        <ChevronLeft className="w-3 h-3 text-white/20" />
                        {decks.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? "w-4" : "w-1.5"}`}
                                style={{ backgroundColor: idx === currentIndex ? currentDeck.accentColor : "rgba(255,255,255,0.2)" }}
                            />
                        ))}
                        <ChevronRight className="w-3 h-3 text-white/20" />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
