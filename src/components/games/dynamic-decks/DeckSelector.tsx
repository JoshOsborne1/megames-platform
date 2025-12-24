"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { DeckInfo, Deck } from "@/lib/games/dynamic-decks/types";
import { getDeck, getAvailableDecks } from "@/lib/games/dynamic-decks/data";
import {
    Zap, Star, Film, Music, Gamepad2, PartyPopper,
    Brain, BookOpen, Sparkles, Crown, LucideIcon,
    ChevronLeft, ChevronRight, Layers, Target, Award
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

// Extended deck info for Master Cards - scoring uses colored indicators
const DECK_DETAILS: Record<string, { howToPlay: string; scoringHtml: React.ReactNode; tips: string }> = {
    classic: {
        howToPlay: "Describe the secret word to your teammates without using any of the forbidden words listed on the card!",
        scoringHtml: (
            <>
                <span style={{ color: "#39ff14" }}>●</span> 1x •
                <span style={{ color: "#ff9f1c" }}> ●</span> 1.5x •
                <span style={{ color: "#ff006e" }}> ●</span> 2x
            </>
        ),
        tips: "Use creative descriptions, act things out, or give examples!"
    },
    randomRhymes: {
        howToPlay: "Read the clue aloud and your team must guess the rhyming phrase that matches the description!",
        scoringHtml: (
            <>
                <span style={{ color: "#39ff14" }}>●</span> 1x •
                <span style={{ color: "#ff9f1c" }}> ●</span> 1.5x •
                <span style={{ color: "#ff006e" }}> ●</span> 2x
            </>
        ),
        tips: "Think celebrity names, animals, and common phrases that rhyme!"
    }
};

export function DeckSelector({
    selectedDeckId,
    onDeckChange,
    accentColor = "#ff006e"
}: DeckSelectorProps) {
    const decks = getAvailableDecks();
    const [currentIndex, setCurrentIndex] = useState(
        decks.findIndex(d => d.id === selectedDeckId) || 0
    );
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync currentIndex with selectedDeckId
    useEffect(() => {
        const idx = decks.findIndex(d => d.id === selectedDeckId);
        if (idx !== -1 && idx !== currentIndex) {
            setCurrentIndex(idx);
        }
    }, [selectedDeckId, decks, currentIndex]);

    const currentDeck = decks[currentIndex];
    const deckDetails = DECK_DETAILS[currentDeck.id] || DECK_DETAILS.classic;
    const IconComponent = ICON_MAP[currentDeck.icon] || Zap;

    const navigateTo = (index: number) => {
        const newIndex = Math.max(0, Math.min(decks.length - 1, index));
        setCurrentIndex(newIndex);
        onDeckChange(decks[newIndex].id);
    };

    const handlePrev = () => navigateTo(currentIndex - 1);
    const handleNext = () => navigateTo(currentIndex + 1);

    // Swipe handling
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x > threshold && currentIndex > 0) {
            handlePrev();
        } else if (info.offset.x < -threshold && currentIndex < decks.length - 1) {
            handleNext();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex]);

    return (
        <section className="w-full" ref={containerRef}>
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-3" style={{ color: accentColor }}>
                <Sparkles className="w-4 h-4" />
                <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                    Card Deck
                </h3>
            </div>

            <div className="flex gap-3">
                {/* Side Quick Select Icons */}
                <div className="flex flex-col gap-2">
                    {decks.map((deck, index) => {
                        const DeckIcon = ICON_MAP[deck.icon] || Zap;
                        const isActive = index === currentIndex;
                        return (
                            <button
                                key={deck.id}
                                onClick={() => navigateTo(index)}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isActive
                                    ? "bg-white/20 border-2"
                                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                                    }`}
                                style={{
                                    borderColor: isActive ? deck.accentColor : undefined,
                                    color: isActive ? deck.accentColor : "rgba(255,255,255,0.5)"
                                }}
                            >
                                <DeckIcon className="w-5 h-5" />
                            </button>
                        );
                    })}
                </div>

                {/* Master Card - Swipeable */}
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentDeck.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.2 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            className="bg-gradient-to-br from-white/10 to-white/5 border-2 rounded-2xl p-4 cursor-grab active:cursor-grabbing touch-pan-y"
                            style={{ borderColor: `${currentDeck.accentColor}40` }}
                        >
                            {/* Deck Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${currentDeck.accentColor}20`, color: currentDeck.accentColor }}
                                >
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-display font-bold text-white text-xl">
                                        {currentDeck.name}
                                    </h4>
                                    <p className="text-white/50 text-xs">
                                        {currentDeck.cardCount} cards • {currentDeck.deckType === "forbidden" ? "Word Guessing" : "Rhyme Guessing"}
                                    </p>
                                </div>
                            </div>

                            {/* Deck Description */}
                            <p className="text-white/70 text-sm mb-4 leading-relaxed">
                                {currentDeck.description}
                            </p>

                            {/* How to Play */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentDeck.accentColor }} />
                                    <div>
                                        <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-0.5">How to Play</span>
                                        <p className="text-white/80 text-xs leading-relaxed">{deckDetails.howToPlay}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Award className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentDeck.accentColor }} />
                                    <div>
                                        <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-0.5">Scoring</span>
                                        <p className="text-white/80 text-xs">{deckDetails.scoringHtml}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Swipe Indicator */}
                            <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-white/10">
                                {decks.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "w-6" : ""
                                            }`}
                                        style={{
                                            backgroundColor: idx === currentIndex ? currentDeck.accentColor : "rgba(255,255,255,0.2)"
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <div className="flex justify-between mt-3">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Prev</span>
                        </button>

                        <span className="text-white/30 text-xs self-center">
                            {currentIndex + 1} / {decks.length}
                        </span>

                        <button
                            onClick={handleNext}
                            disabled={currentIndex === decks.length - 1}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
