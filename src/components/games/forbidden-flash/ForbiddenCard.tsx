"use client";

import { motion } from "framer-motion";
import { Card, Difficulty } from "@/lib/games/forbidden-flash/types";
import { AlertCircle } from "lucide-react";

interface ForbiddenCardProps {
  card: Card;
  difficulty: Difficulty;
}

export function ForbiddenCard({ card, difficulty }: ForbiddenCardProps) {
  const forbiddenCount = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;
  const activeForbidden = card.forbidden.slice(0, forbiddenCount);

  const getColorClass = (color: string) => {
    switch (color) {
      case "yellow": return "border-yellow-400 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]";
      case "blue": return "border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]";
      case "green": return "border-green-400 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]";
      case "red": return "border-red-400 text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.3)]";
      default: return "border-[#00f5ff] text-[#00f5ff]";
    }
  };

  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`relative w-80 h-[450px] bg-[#1a0f2e] border-4 rounded-3xl p-8 flex flex-col items-center justify-between text-center overflow-hidden ${getColorClass(card.color)}`}
    >
      <div className="absolute top-4 right-4 font-display font-black text-xl opacity-50">
        {card.points}pts
      </div>

      <div className="mt-8 px-4 w-full">
        <span className="text-xs font-pixel tracking-widest opacity-50 block mb-2">GUESS THIS WORD</span>
        <h3 className={`font-display font-black uppercase tracking-tighter leading-tight mb-4 break-words ${
          card.word.length > 14 ? 'text-2xl' : card.word.length > 8 ? 'text-3xl' : 'text-4xl'
        }`}>
          {card.word}
        </h3>
      </div>

      <div className="w-full space-y-4">
        <div className="flex items-center justify-center gap-2 text-red-500 mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="font-pixel text-[10px] tracking-wider uppercase">Forbidden Words</span>
        </div>
        
        <div className="grid gap-2">
          {activeForbidden.map((word, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className="py-2 bg-white/5 border border-white/10 rounded-xl font-space font-bold text-white/90 text-lg uppercase"
            >
              {word}
            </motion.div>
          ))}
          {card.forbidden.length > activeForbidden.length && (
             <div className="text-[10px] font-space text-white/30 italic">
               +{card.forbidden.length - activeForbidden.length} more in harder modes
             </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[10px] font-pixel text-[#ff006e] animate-pulse">
           DO NOT USE THESE WORDS!
        </div>
      </div>
    </motion.div>
  );
}
