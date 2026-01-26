"use client";

import { useState, useRef, useEffect, useCallback } from "react";
// Adding custom styles for 3D flip consistency
const backfaceHidden = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

const preserve3d = {
  transformStyle: "preserve-3d",
  WebkitTransformStyle: "preserve-3d",
} as const;

import { motion, AnimatePresence } from "framer-motion";
import { 
    Check, Sparkles, X,
    Globe, Map, Flag, Landmark, Languages, // Geography
    History as LucideHistoryIcon, Calendar, User, MapPin, // History
    FlaskConical, Telescope, Dna, Atom, // Science
    Clapperboard, Music, Ticket, Mic2, Quote, Award, Disc3, // Music
    Trophy, Shield, Dumbbell, Flame, // Sports
    Tv, Gamepad2, Star, // Entertainment
    Zap, LucideIcon, ChevronLeft, Circle, CheckCircle2,
    Timer, Users2, ChevronDown, Loader2, RotateCcw, Play
} from "lucide-react";
import Link from "next/link";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";

// =============================================================================
// TYPES
// =============================================================================

interface DeckItem {
    name: string;
    icon: LucideIcon;
    description: string;
}

interface Pack {
    id: string;
    name: string;
    color: string;
    description: string;
    icon: LucideIcon;
    decks: DeckItem[];
}

type ChallengeMode = "standard" | "time" | "streak" | "pvp";

// Import real question data from QuizQuarter
import { ALL_QUESTIONS } from "@/lib/games/quiz-quarter/data";
import type { Question } from "@/lib/games/quiz-quarter/types";

// =============================================================================
// PROTOTYPE PACKS - Aligned with data.ts structure
// =============================================================================

const PROTOTYPE_PACKS: Pack[] = [
    {
        id: "geography",
        name: "Geography",
        color: "#22C55E",
        description: "Capitals, Flags, & Nations",
        icon: Globe,
        decks: [
            { name: "Capitals", icon: Landmark, description: "World cities" },
            { name: "Flags", icon: Flag, description: "Nations" },
            { name: "Countries", icon: Map, description: "Borders" },
            { name: "Languages", icon: Languages, description: "Tongues" }
        ]
    },
    {
        id: "history",
        name: "History",
        color: "#F59E0B",
        description: "Figures, Eras, & Events",
        icon: LucideHistoryIcon,
        decks: [
            { name: "Dates", icon: Calendar, description: "Famous years" },
            { name: "Famous Figures", icon: User, description: "Personalities" },
            { name: "Events", icon: Zap, description: "Major wars" },
            { name: "Locations", icon: MapPin, description: "Historic sites" }
        ]
    },
    {
        id: "science",
        name: "Science",
        color: "#3B82F6",
        description: "Bio, Physics, & Space",
        icon: FlaskConical,
        decks: [
            { name: "Biology", icon: Dna, description: "Life" },
            { name: "Physics", icon: Zap, description: "Forces" },
            { name: "Astronomy", icon: Telescope, description: "Universe" },
            { name: "Chemistry", icon: Atom, description: "Elements" }
        ]
    },
    {
        id: "music",
        name: "Music",
        color: "#A855F7",
        description: "Artists, Lyrics, & Hits",
        icon: Music,
        decks: [
            { name: "Artists", icon: Mic2, description: "Bands" },
            { name: "Lyrics", icon: Quote, description: "Song lines" },
            { name: "Awards", icon: Award, description: "Grammys" },
            { name: "Titles", icon: Disc3, description: "Albums" }
        ]
    },
    {
        id: "sports",
        name: "Sports",
        color: "#EF4444",
        description: "Teams, Athletes, & Wins",
        icon: Trophy,
        decks: [
            { name: "Athletes", icon: User, description: "Stars" },
            { name: "Teams", icon: Shield, description: "Clubs" },
            { name: "Terms", icon: Dumbbell, description: "Jargon" },
            { name: "Events", icon: Flame, description: "Cups" }
        ]
    },
    {
        id: "entertainment",
        name: "Entertainment",
        color: "#EC4899",
        description: "Movies, TV, & Gaming",
        icon: Ticket,
        decks: [
            { name: "Movies", icon: Clapperboard, description: "Cinema" },
            { name: "TV Shows", icon: Tv, description: "Serials" },
            { name: "Gaming", icon: Gamepad2, description: "Esports" },
            { name: "Pop Icons", icon: Star, description: "Celebrities" }
        ]
    }
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// =============================================================================
// GAME SESSION COMPONENT
// =============================================================================

function GameSession({ 
    mode, 
    selectedDecks,
    onExit 
}: { 
    mode: ChallengeMode;
    selectedDecks: Set<string>;
    onExit: () => void;
}) {
    const { trigger } = useHaptic();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(mode === "time" ? 10 : 0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Filter questions based on selected decks
    const filteredQuestions = ALL_QUESTIONS.filter((q: Question) => 
        selectedDecks.has(`${q.packId}:${q.deckId}`)
    );

    // Shuffle questions on mount and transform to include options array
    const [shuffledQuestions] = useState(() => {
        const shuffled = [...filteredQuestions].map(q => ({
            ...q,
            options: shuffleArray([q.correctAnswer, ...q.incorrectAnswers])
        }));
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    });

    const currentQuestion = shuffledQuestions[currentQuestionIndex % shuffledQuestions.length];

    // Timer logic for Time mode
    useEffect(() => {
        if (mode === "time" && !gameOver && isCorrect === null) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        // Time's up!
                        clearInterval(timerRef.current!);
                        handleTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, gameOver, currentQuestionIndex, isCorrect]);

    const handleTimeout = useCallback(() => {
        trigger("error");
        setIsCorrect(false);
        setStreak(0);
        
        if (mode === "streak") {
            setGameOver(true);
            toast.error("Time's up! Streak ended.");
        } else {
            toast.error("Too slow!");
            setTimeout(() => nextQuestion(), 1500);
        }
    }, [mode, trigger]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer !== null || gameOver) return;
        
        if (timerRef.current) clearInterval(timerRef.current);
        
        setSelectedAnswer(answer);
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            trigger("success");
            const points = mode === "time" ? 10 + timeRemaining : 10;
            setScore(prev => prev + points);
            setStreak(prev => {
                const newStreak = prev + 1;
                setBestStreak(best => Math.max(best, newStreak));
                return newStreak;
            });
            toast.success(mode === "time" ? `+${points} pts (${timeRemaining}s bonus!)` : "+10 pts!");
            setTimeout(() => nextQuestion(), 1200);
        } else {
            trigger("error");
            setStreak(0);
            
            if (mode === "streak") {
                setGameOver(true);
                toast.error(`Wrong! Your streak was ${streak}.`);
            } else {
                toast.error("Incorrect!");
                setTimeout(() => nextQuestion(), 1500);
            }
        }
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (mode === "time") setTimeRemaining(10);
    };

    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setStreak(0);
        setScore(0);
        setGameOver(false);
        if (mode === "time") setTimeRemaining(10);
    };

    const modeConfig = {
        time: { label: "10s Time", color: "#00f5ff", icon: Timer },
        streak: { label: "Streak", color: "#ff9f1c", icon: Flame },
        standard: { label: "Standard", color: "#ff006e", icon: Play },
        pvp: { label: "PvP", color: "#8338ec", icon: Users2 },
    };
    const config = modeConfig[mode];
    const ModeIcon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] bg-[#0a0612] flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
                <button onClick={onExit} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Exit</span>
                </button>
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: `${config.color}40`, backgroundColor: `${config.color}10` }}>
                    <ModeIcon className="w-4 h-4" style={{ color: config.color }} />
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: config.color }}>{config.label}</span>
                </div>

                <div className="text-right">
                    <div className="text-xs text-white/30 uppercase tracking-widest">Score</div>
                    <div className="text-lg font-display font-black text-white">{score}</div>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    {gameOver ? (
                        <motion.div
                            key="gameover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${config.color}20` }}>
                                <Trophy className="w-10 h-10" style={{ color: config.color }} />
                            </div>
                            <h2 className="font-display font-black text-3xl text-white mb-2">Game Over!</h2>
                            <p className="text-white/40 text-sm mb-6">
                                {mode === "streak" ? `Best Streak: ${bestStreak}` : `Final Score: ${score}`}
                            </p>
                            
                            <div className="flex gap-3 justify-center">
                                <button 
                                    onClick={restartGame}
                                    className="px-6 py-3 rounded-xl flex items-center gap-2 font-display font-bold text-sm uppercase tracking-widest transition-all"
                                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Play Again
                                </button>
                                <button 
                                    onClick={onExit}
                                    className="px-6 py-3 rounded-xl bg-white/10 text-white font-display font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
                                >
                                    Exit
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-md"
                        >
                            {/* Timer for Time Mode */}
                            {mode === "time" && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Timer className="w-5 h-5 text-electric-cyan" />
                                        <span className={cn(
                                            "text-3xl font-display font-black transition-colors",
                                            timeRemaining <= 3 ? "text-red-500 animate-pulse" : "text-electric-cyan"
                                        )}>
                                            {timeRemaining}s
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: timeRemaining <= 3 ? "#ef4444" : "#00f5ff" }}
                                            initial={{ width: "100%" }}
                                            animate={{ width: `${(timeRemaining / 10) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Streak Counter for Streak Mode */}
                            {mode === "streak" && (
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    <Flame className={cn("w-6 h-6 transition-all", streak > 0 ? "text-warning animate-pulse" : "text-white/20")} />
                                    <span className="text-2xl font-display font-black text-warning">{streak}</span>
                                    <span className="text-xs text-white/30 uppercase tracking-widest">Streak</span>
                                </div>
                            )}

                            {/* Question */}
                            <div className="glass-panel rounded-2xl p-6 mb-6 text-center">
                                <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Question {currentQuestionIndex + 1}</p>
                                <h3 className="text-xl font-display font-bold text-white leading-tight">
                                    {currentQuestion.question}
                                </h3>
                            </div>

                            {/* Answers */}
                            <div className="grid grid-cols-2 gap-3">
                                {currentQuestion.options.map((option) => {
                                    const isSelected = selectedAnswer === option;
                                    const isCorrectAnswer = option === currentQuestion.correctAnswer;
                                    const showResult = selectedAnswer !== null;
                                    
                                    let bgColor = "bg-white/5 hover:bg-white/10";
                                    let borderColor = "border-white/10";
                                    
                                    if (showResult) {
                                        if (isCorrectAnswer) {
                                            bgColor = "bg-emerald-500/20";
                                            borderColor = "border-emerald-500/50";
                                        } else if (isSelected) {
                                            bgColor = "bg-red-500/20";
                                            borderColor = "border-red-500/50";
                                        }
                                    }

                                    return (
                                        <motion.button
                                            key={option}
                                            whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
                                            onClick={() => handleAnswer(option)}
                                            disabled={selectedAnswer !== null}
                                            className={cn(
                                                "p-4 rounded-xl border transition-all text-left",
                                                bgColor, borderColor,
                                                selectedAnswer === null && "active:scale-95"
                                            )}
                                        >
                                            <span className={cn(
                                                "text-sm font-bold",
                                                showResult && isCorrectAnswer ? "text-emerald-400" : 
                                                showResult && isSelected ? "text-red-400" : "text-white"
                                            )}>
                                                {option}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest">Decks</div>
                        <div className="text-sm font-bold text-white">{selectedDecks.size}</div>
                    </div>
                    {mode === "streak" && (
                        <div>
                            <div className="text-[10px] text-white/30 uppercase tracking-widest">Best</div>
                            <div className="text-sm font-bold text-warning">{bestStreak}</div>
                        </div>
                    )}
                </div>
                <div className="text-[10px] text-white/20 uppercase tracking-widest">
                    Q{currentQuestionIndex + 1}
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// FLIP PACK CARD COMPONENT
// =============================================================================

function FlipPackCard({ 
    pack, 
    selectedDecks, 
    toggleDeck, 
    togglePack 
}: { 
    pack: Pack;
    selectedDecks: Set<string>;
    toggleDeck: (packId: string, deckName: string) => void;
    togglePack: (pack: Pack) => void;
}) {
    const { trigger } = useHaptic();
    const [isFlipped, setIsFlipped] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);

    const packSelectedCount = pack.decks.filter(d => selectedDecks.has(`${pack.id}:${d.name}`)).length;
    const isPackFullySelected = packSelectedCount === pack.decks.length;
    const isPackPartiallySelected = packSelectedCount > 0 && packSelectedCount < pack.decks.length;

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            setCanScrollDown(scrollTop + clientHeight < scrollHeight - 5);
        }
    };

    useEffect(() => {
        if (isFlipped) {
            setTimeout(checkScroll, 300);
        }
    }, [isFlipped]);

    const handleFlip = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.stop-propagation')) return;
        trigger();
        setIsFlipped(!isFlipped);
    };

    const PackIcon = pack.icon;

    return (
        <div 
            className="group relative w-full aspect-[4/5] perspective-distant cursor-pointer"
            onClick={handleFlip}
        >
            <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 25, mass: 0.5 }}
                style={preserve3d}
            >
                {/* FRONT FACE */}
                <div 
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-4 text-center shadow-xl border border-white/10 bg-white/5 backdrop-blur-xl group-hover:bg-white/10 transition-colors overflow-hidden"
                    style={backfaceHidden}
                >
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-current opacity-[0.05] blur-3xl pointer-events-none" style={{ color: pack.color }} />

                     {/* Selection Circle */}
                     <button 
                        onClick={(e) => { e.stopPropagation(); trigger(); togglePack(pack); }}
                        className="stop-propagation absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all z-20 group/sel"
                        style={{ 
                            backgroundColor: isPackFullySelected || isPackPartiallySelected ? `${pack.color}20` : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isPackFullySelected || isPackPartiallySelected ? `${pack.color}40` : 'rgba(255,255,255,0.1)'}`
                        }}
                     >
                        {isPackFullySelected ? (
                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: pack.color }} />
                        ) : isPackPartiallySelected ? (
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pack.color }} />
                        ) : (
                            <Circle className="w-3.5 h-3.5 text-white/10 group-hover/sel:text-white/20" />
                        )}
                     </button>

                     <div className="relative mb-4">
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-inner"
                            style={{ backgroundColor: `${pack.color}15`, color: pack.color }}
                        >
                            <PackIcon className="w-6 h-6" />
                        </div>
                     </div>

                    <h3 className="font-display font-bold text-lg text-white mb-1 tracking-tight truncate w-full px-2">{pack.name}</h3>
                    <p className="text-white/40 text-[11px] leading-tight line-clamp-2 px-2">{pack.description}</p>
                    
                    <div 
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full opacity-60"
                        style={{ backgroundColor: pack.color, boxShadow: `0 0 10px ${pack.color}` }}
                    />
                </div>

                {/* BACK FACE */}
                <div 
                    className="absolute inset-0 rounded-2xl flex flex-col p-3 bg-[#0d091a]/95 border-2 shadow-2xl overflow-hidden backdrop-blur-2xl"
                    style={{ 
                        transform: "rotateY(180deg)",
                        borderColor: `${pack.color}40`,
                        ...backfaceHidden
                    }}
                >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5 shrink-0">
                        <span className="text-[9px] text-white/40 uppercase font-black tracking-widest pl-1">Configuration</span>
                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-tighter pr-1">
                            {packSelectedCount}/{pack.decks.length}
                        </div>
                    </div>

                    <div className="relative flex-1 min-h-0">
                        <div 
                            ref={scrollRef}
                            onScroll={checkScroll}
                            className="h-full space-y-1 overflow-y-auto no-scrollbar pb-6 mask-fade-bottom"
                        >
                            {pack.decks.map((deck) => {
                                const isSelected = selectedDecks.has(`${pack.id}:${deck.name}`);
                                const DeckIcon = deck.icon;
                                return (
                                    <button
                                        key={deck.name}
                                        onClick={(e) => { e.stopPropagation(); toggleDeck(pack.id, deck.name); }}
                                        className={cn(
                                            "stop-propagation w-full flex items-center gap-2 p-2 rounded-lg border transition-all text-left group/btn",
                                            isSelected 
                                                ? "bg-white/10 border-white/20 shadow-lg" 
                                                : "bg-white/5 border-transparent hover:bg-white/10"
                                        )}
                                    >
                                        <div 
                                            className={cn(
                                                "w-7 h-7 rounded-md flex items-center justify-center shrink-0 border transition-colors",
                                                isSelected ? "border-white/20" : "border-white/5"
                                            )}
                                            style={{ 
                                                backgroundColor: isSelected ? `${pack.color}20` : "rgba(255,255,255,0.02)",
                                                color: isSelected ? pack.color : "rgba(255,255,255,0.15)"
                                            }}
                                        >
                                            <DeckIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={cn(
                                            "text-[11px] font-bold leading-none truncate flex-1",
                                            isSelected ? "text-white" : "text-white/20"
                                        )}>
                                            {deck.name}
                                        </span>
                                        {isSelected && <Check className="w-3 h-3 shrink-0" style={{ color: pack.color }} />}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <AnimatePresence>
                            {canScrollDown && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none"
                                >
                                    <ChevronDown className="w-4 h-4 text-white/20 animate-bounce" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function TestPage() {
    const { trigger } = useHaptic();
    const [selectedDecks, setSelectedDecks] = useState<Set<string>>(new Set());
    const [showChallengeModes, setShowChallengeModes] = useState(false);
    const [activeGame, setActiveGame] = useState<ChallengeMode | null>(null);

    const totalSelected = selectedDecks.size;
    const allPacksCount = PROTOTYPE_PACKS.reduce((acc, p) => acc + p.decks.length, 0);
    const isAllSelected = totalSelected === allPacksCount;

    const toggleDeck = (packId: string, deckName: string) => {
        trigger();
        setSelectedDecks(prev => {
            const next = new Set(prev);
            const key = `${packId}:${deckName}`;
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const togglePack = (pack: Pack) => {
        const packKeys = pack.decks.map(d => `${pack.id}:${d.name}`);
        const allInPackSelected = packKeys.every(k => selectedDecks.has(k));

        setSelectedDecks(prev => {
            const next = new Set(prev);
            if (allInPackSelected) {
                packKeys.forEach(k => next.delete(k));
            } else {
                packKeys.forEach(k => next.add(k));
            }
            return next;
        });
    };

    const toggleAllQuestions = () => {
        trigger();
        if (isAllSelected) {
            setSelectedDecks(new Set());
        } else {
            const next = new Set<string>();
            PROTOTYPE_PACKS.forEach(p => {
                p.decks.forEach(d => next.add(`${p.id}:${d.name}`));
            });
            setSelectedDecks(next);
        }
    };

    const handleStart = (mode: ChallengeMode) => {
        trigger("heavy");
        
        if (mode === "pvp") {
            toast.info("PvP Lobby coming soon!", { description: "Multiplayer is under development." });
            return;
        }
        
        setActiveGame(mode);
    };

    // If a game is active, render the game session
    if (activeGame) {
        return (
            <GameSession 
                mode={activeGame} 
                selectedDecks={selectedDecks}
                onExit={() => setActiveGame(null)} 
            />
        );
    }

    return (
        <AppShell hideNav={false}>
            <div className="w-full max-w-lg mx-auto px-4 pt-6 pb-44 relative z-10 flex flex-col min-h-[500px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                    <Link href="/shop" className="group/back inline-flex items-center gap-1.5">
                        <ChevronLeft className="w-3 h-3 text-white/30 group-hover/back:text-white transition-colors" />
                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest group-hover/back:text-white transition-colors">Store</span>
                    </Link>
                    <button 
                        onClick={toggleAllQuestions}
                        className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-neon-pink transition-all border border-white/5 bg-white/5 py-1 px-3 rounded-full"
                    >
                        {isAllSelected ? "Clear All" : "Select All Questions"}
                    </button>
                </div>

                <div className="text-center mb-6 shrink-0">
                    <h1 className="font-display font-bold text-3xl text-white tracking-tight leading-none mb-1">Knowledge</h1>
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Build your ultimate pool</p>
                </div>

                {/* Info Box */}
                <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-neon-purple/20 flex items-center justify-center shrink-0 border border-neon-purple/20 shadow-glow-purple/20">
                        <Zap className="w-4 h-4 text-neon-purple" />
                    </div>
                    <div>
                         <p className="text-[11px] text-white/60 leading-tight font-bold">
                            Select categories to begin.
                        </p>
                        <p className="text-[10px] text-white/30 leading-tight mt-0.5">
                            Everything fits on one screen for reachability.
                        </p>
                    </div>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 gap-4 flex-1 pb-4">
                    {PROTOTYPE_PACKS.map((pack) => (
                        <FlipPackCard 
                            key={pack.id} 
                            pack={pack} 
                            selectedDecks={selectedDecks}
                            toggleDeck={toggleDeck}
                            togglePack={togglePack}
                        />
                    ))}
                </div>

                {/* Action Bar */}
                <AnimatePresence>
                    {totalSelected > 0 && (
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-0 right-0 z-50 pointer-events-none flex justify-center px-4"
                        >
                            <div className="max-w-xs w-full pointer-events-auto">
                                <motion.div 
                                    layout
                                    className="glass-panel border-white/10 rounded-full p-1.5 shadow-2xl relative backdrop-blur-3xl ring-1 ring-white/10 overflow-hidden flex flex-col items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        {/* Deck Count Badge */}
                                        <div className="w-10 h-10 rounded-full bg-neon-pink/15 border border-neon-pink/30 flex items-center justify-center shrink-0">
                                            <span className="text-sm font-display font-black text-neon-pink">{totalSelected}</span>
                                        </div>

                                        {/* Primary Start Action */}
                                        <button 
                                            onClick={() => handleStart("standard")}
                                            className="h-10 px-8 rounded-full bg-linear-to-r from-neon-pink to-neon-purple text-white font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-neon-pink/20 transition-all flex items-center justify-center relative overflow-hidden active:scale-95 active:brightness-110"
                                        >
                                            <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                                            Start
                                        </button>

                                        {/* Challenge Mode Toggle */}
                                        <button 
                                            onClick={() => { trigger(); setShowChallengeModes(!showChallengeModes); }}
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all border shrink-0",
                                                showChallengeModes 
                                                    ? "bg-white/20 text-white border-white/40 shadow-glow-white/10" 
                                                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            <Zap className={cn("w-4 h-4 transition-transform", showChallengeModes ? "scale-110 fill-current" : "")} />
                                        </button>
                                    </div>

                                    {/* Vertical Expansion for Challenge Modes */}
                                    <AnimatePresence>
                                        {showChallengeModes && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden w-full"
                                            >
                                                <div className="grid grid-cols-3 gap-2 pt-2 mt-1.5 border-t border-white/5 px-2 pb-1.5">
                                                    {[
                                                        { label: "10s", icon: Timer, color: "text-electric-cyan", mode: "time" as ChallengeMode },
                                                        { label: "Streak", icon: Flame, color: "text-warning", mode: "streak" as ChallengeMode },
                                                        { label: "PvP", icon: Users2, color: "text-neon-purple", mode: "pvp" as ChallengeMode }
                                                    ].map((m) => (
                                                        <button 
                                                            key={m.label}
                                                            onClick={() => handleStart(m.mode)}
                                                            className="flex flex-col items-center justify-center py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 group"
                                                        >
                                                            <m.icon className={cn("w-5 h-5 mb-1 transition-transform group-hover:scale-110", m.color)} />
                                                            <span className="text-[7.5px] font-black text-white/30 uppercase tracking-wider group-hover:text-white">{m.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle Overlay */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-1" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            </div>
            
            <style jsx global>{`
                .mask-fade-bottom {
                    mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
                }
            `}</style>
        </AppShell>
    );
}
