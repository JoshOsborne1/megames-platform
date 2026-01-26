"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCircle2, Circle, ChevronDown, LucideIcon } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";

// 3D flip consistency
const backfaceHidden = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

const preserve3d = {
  transformStyle: "preserve-3d",
  WebkitTransformStyle: "preserve-3d",
} as const;

interface Deck {
    id: string;
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
    decks: Deck[];
}

export function FlipPackCard({ 
    pack, 
    selectedDecks, 
    toggleDeck, 
    togglePack 
}: { 
    pack: Pack;
    selectedDecks: Set<string>;
    toggleDeck: (packId: string, deckId: string) => void;
    togglePack: (packId: string) => void;
}) {
    const { trigger } = useHaptic();
    const [isFlipped, setIsFlipped] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);

    const packSelectedCount = pack.decks.filter(d => selectedDecks.has(`${pack.id}:${d.id}`)).length;
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
            className="group relative w-full aspect-4/5 perspective-distant cursor-pointer"
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
                        onClick={(e) => { e.stopPropagation(); trigger(); togglePack(pack.id); }}
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
                                const isSelected = selectedDecks.has(`${pack.id}:${deck.id}`);
                                const DeckIcon = deck.icon;
                                return (
                                    <button
                                        key={deck.id}
                                        onClick={(e) => { e.stopPropagation(); toggleDeck(pack.id, deck.id); }}
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
