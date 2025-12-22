"use client";

import { motion } from "framer-motion";
import { Card, Difficulty } from "@/lib/games/forbidden-flash/types";
import { Ban, Target } from "lucide-react";

interface ForbiddenCardProps {
  card: Card;
  difficulty: Difficulty;
}

export function ForbiddenCard({ card, difficulty }: ForbiddenCardProps) {
  const forbiddenCount = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;
  const activeForbidden = card.forbidden.slice(0, forbiddenCount);

  // Determine card difficulty based on points: 20=Easy, 30=Medium, 50=Hard
  const getCardDifficulty = (points: number): "easy" | "medium" | "hard" => {
    if (points <= 20) return "easy";
    if (points <= 30) return "medium";
    return "hard";
  };

  const cardDifficulty = getCardDifficulty(card.points);

  // Color theming based on card's point value
  const difficultyColors = {
    easy: {
      primary: "#39ff14",
      gradient: "from-[#39ff14]/20 to-[#00f5ff]/20",
      border: "border-[#39ff14]/40",
      shadow: "shadow-[0_0_30px_rgba(57,255,20,0.15)]",
      glow: "0 0 30px rgba(57,255,20,0.5), 0 0 60px rgba(57,255,20,0.3)",
      label: "Easy"
    },
    medium: {
      primary: "#ffaa00",
      gradient: "from-[#ffaa00]/20 to-[#ff6600]/20",
      border: "border-[#ffaa00]/40",
      shadow: "shadow-[0_0_30px_rgba(255,170,0,0.15)]",
      glow: "0 0 30px rgba(255,170,0,0.5), 0 0 60px rgba(255,170,0,0.3)",
      label: "Medium"
    },
    hard: {
      primary: "#ff006e",
      gradient: "from-[#ff006e]/20 to-[#ff0000]/20",
      border: "border-[#ff006e]/40",
      shadow: "shadow-[0_0_30px_rgba(255,0,110,0.15)]",
      glow: "0 0 30px rgba(255,0,110,0.5), 0 0 60px rgba(255,0,110,0.3)",
      label: "Hard"
    }
  };

  const colors = difficultyColors[cardDifficulty];

  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative w-full max-w-sm"
    >
      {/* Main Target Word Card */}
      <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-2xl p-6 mb-4 ${colors.shadow}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2" style={{ color: colors.primary }}>
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-pixel tracking-widest uppercase">Target Word</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-pixel tracking-wider uppercase px-2 py-0.5 rounded"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
            >
              {colors.label}
            </span>
            <span className="font-display font-black text-lg" style={{ color: colors.primary }}>
              {card.points}pts
            </span>
          </div>
        </div>

        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`font-display font-black text-white text-center py-4 ${card.word.length > 12 ? 'text-2xl' : card.word.length > 8 ? 'text-3xl' : 'text-4xl'
            }`}
          style={{
            wordBreak: 'break-word',
            textShadow: colors.glow
          }}
        >
          {card.word.toUpperCase()}
        </motion.h2>
      </div>

      {/* Forbidden Words Section */}
      <div className="bg-[#1a0f2e]/90 border-2 border-[#ff006e]/30 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-[#ff006e] mb-4">
          <Ban className="w-4 h-4" />
          <span className="text-[10px] font-pixel tracking-widest uppercase">Don't Say</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {activeForbidden.map((word, i) => (
            <motion.div
              key={i}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i }}
              className="py-2 px-3 bg-[#ff006e]/10 border border-[#ff006e]/20 rounded-lg font-space font-bold text-[#ff006e]/90 text-sm uppercase text-center"
            >
              {word}
            </motion.div>
          ))}
        </div>

        {card.forbidden.length > activeForbidden.length && (
          <p className="text-[10px] font-space text-white/30 text-center mt-3 italic">
            +{card.forbidden.length - activeForbidden.length} more in harder modes
          </p>
        )}
      </div>
    </motion.div>
  );
}
