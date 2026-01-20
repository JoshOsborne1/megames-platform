"use client";

import { motion } from "framer-motion";
import { CardHistory } from "@/lib/games/dynamic-decks/types";
import { Check, X, Ban, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface RoundHistoryProps {
  history: CardHistory[];
  roundNumber: number;
}

export function RoundHistory({ history, roundNumber }: RoundHistoryProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  
  const correctCount = history.filter(h => h.wasCorrect).length;
  const skippedCount = history.filter(h => !h.wasCorrect).length;
  const totalPoints = history.filter(h => h.wasCorrect).reduce((sum, h) => sum + h.points, 0);

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-white">Round {roundNumber} History</h3>
          <p className="text-xs text-white/40">
            {correctCount} correct · {skippedCount} skipped · {totalPoints} points
          </p>
        </div>
      </div>
      
      {/* Cards */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-lg border ${
              card.wasCorrect 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            {/* Main row */}
            <button
              onClick={() => setExpandedCard(expandedCard === i ? null : i)}
              className="w-full flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-3">
                {/* Status icon */}
                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                  card.wasCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {card.wasCorrect 
                    ? <Check className="w-4 h-4 text-emerald-400" />
                    : <X className="w-4 h-4 text-red-400" />
                  }
                </div>
                
                {/* Word */}
                <span className="font-bold text-white uppercase">{card.word}</span>
                
                {/* Who got it */}
                {card.wasCorrect && card.answeredBy && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {card.answeredBy}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {card.wasCorrect && (
                  <span className="text-xs font-bold text-emerald-400">+{card.points}</span>
                )}
                {card.forbidden.length > 0 && (
                  expandedCard === i 
                    ? <ChevronUp className="w-4 h-4 text-white/30" />
                    : <ChevronDown className="w-4 h-4 text-white/30" />
                )}
              </div>
            </button>
            
            {/* Forbidden words (expanded) */}
            {expandedCard === i && card.forbidden.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-3 pb-3"
              >
                <div className="flex items-center gap-1.5 text-[10px] text-red-400 mb-2">
                  <Ban className="w-3 h-3" />
                  <span className="uppercase tracking-wider">Forbidden Words</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.forbidden.map((word, j) => (
                    <span 
                      key={j}
                      className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400 uppercase"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
        
        {history.length === 0 && (
          <p className="text-center text-white/30 py-4 text-sm">No cards played yet</p>
        )}
      </div>
    </div>
  );
}
