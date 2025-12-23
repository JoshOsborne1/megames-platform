"use client";

import { motion } from "framer-motion";
import { Card, Difficulty } from "@/lib/games/forbidden-flash/types";
import { Ban, Target, MessageCircleQuestion, Sparkles } from "lucide-react";

interface ForbiddenCardProps {
  card: Card;
  difficulty: Difficulty;
}

export function ForbiddenCard({ card, difficulty }: ForbiddenCardProps) {
  // Check if this is a rhymes card (has clue and answer)
  const isRhymesCard = Boolean(card.clue && card.answer);

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
      shadow: "shadow-[0_0_20px_rgba(57,255,20,0.15)]",
      glow: "0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.3)",
      label: "Easy"
    },
    medium: {
      primary: "#ffaa00",
      gradient: "from-[#ffaa00]/20 to-[#ff6600]/20",
      border: "border-[#ffaa00]/40",
      shadow: "shadow-[0_0_20px_rgba(255,170,0,0.15)]",
      glow: "0 0 20px rgba(255,170,0,0.5), 0 0 40px rgba(255,170,0,0.3)",
      label: "Medium"
    },
    hard: {
      primary: "#ff006e",
      gradient: "from-[#ff006e]/20 to-[#ff0000]/20",
      border: "border-[#ff006e]/40",
      shadow: "shadow-[0_0_20px_rgba(255,0,110,0.15)]",
      glow: "0 0 20px rgba(255,0,110,0.5), 0 0 40px rgba(255,0,110,0.3)",
      label: "Hard"
    }
  };

  const colors = difficultyColors[cardDifficulty];

  // RHYMES MODE - Different layout for rhyming cards (Mobile Optimized)
  if (isRhymesCard) {
    return (
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -90, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative w-full max-w-md px-2 sm:px-0"
      >
        {/* Clue Card - READ THIS ALOUD */}
        <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4 ${colors.shadow}`}>
          {/* Header - Responsive sizing */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2" style={{ color: colors.primary }}>
              <MessageCircleQuestion className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[9px] sm:text-[10px] font-pixel tracking-widest uppercase">Read Aloud</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className="text-[9px] sm:text-[10px] font-pixel tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded"
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
              >
                {colors.label}
              </span>
              <span className="font-display font-black text-base sm:text-lg" style={{ color: colors.primary }}>
                {card.points}pts
              </span>
            </div>
          </div>

          {/* The Clue/Question - Responsive text sizing */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-space text-white text-center text-base sm:text-lg leading-relaxed py-3 sm:py-4"
            style={{
              lineHeight: 1.5,
            }}
          >
            "{card.clue}"
          </motion.p>

          <div className="flex justify-center mt-1.5 sm:mt-2">
            <span className="text-[8px] sm:text-[10px] font-pixel text-white/40 uppercase tracking-widest">
              Read this clue to the guessers
            </span>
          </div>
        </div>

        {/* Answer Section - THEY GUESS THIS */}
        <div className="bg-[#1a0f2e]/90 border-2 border-[#8338ec]/40 rounded-xl sm:rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#8338ec]">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[9px] sm:text-[10px] font-pixel tracking-widest uppercase">The Answer</span>
            </div>
            <span className="text-[8px] sm:text-[10px] font-pixel text-[#ff006e] uppercase tracking-wider bg-[#ff006e]/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              Don't Say!
            </span>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="py-2.5 sm:py-3 px-3 sm:px-4 bg-[#8338ec]/10 border border-[#8338ec]/30 rounded-lg sm:rounded-xl"
          >
            <p className="font-display font-black text-[#8338ec] text-lg sm:text-xl text-center uppercase leading-tight">
              {card.answer}
            </p>
          </motion.div>

          <p className="text-[8px] sm:text-[10px] font-space text-white/30 text-center mt-2 sm:mt-3 italic">
            This is what they're trying to guess
          </p>
        </div>
      </motion.div>
    );
  }

  // CLASSIC MODE - Original forbidden words layout (Mobile Optimized)
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative w-full max-w-sm px-2 sm:px-0"
    >
      {/* Main Target Word Card */}
      <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4 ${colors.shadow}`}>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2" style={{ color: colors.primary }}>
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[9px] sm:text-[10px] font-pixel tracking-widest uppercase">Target Word</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="text-[9px] sm:text-[10px] font-pixel tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
            >
              {colors.label}
            </span>
            <span className="font-display font-black text-base sm:text-lg" style={{ color: colors.primary }}>
              {card.points}pts
            </span>
          </div>
        </div>

        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`font-display font-black text-white text-center py-3 sm:py-4 ${card.word.length > 12 ? 'text-xl sm:text-2xl' :
              card.word.length > 8 ? 'text-2xl sm:text-3xl' :
                'text-3xl sm:text-4xl'
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
      <div className="bg-[#1a0f2e]/90 border-2 border-[#ff006e]/30 rounded-xl sm:rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[#ff006e] mb-3 sm:mb-4">
          <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-[9px] sm:text-[10px] font-pixel tracking-widest uppercase">Don't Say</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {activeForbidden.map((word, i) => (
            <motion.div
              key={i}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i }}
              className="py-1.5 sm:py-2 px-2 sm:px-3 bg-[#ff006e]/10 border border-[#ff006e]/20 rounded-lg font-space font-bold text-[#ff006e]/90 text-xs sm:text-sm uppercase text-center"
            >
              {word}
            </motion.div>
          ))}
        </div>

        {card.forbidden.length > activeForbidden.length && (
          <p className="text-[8px] sm:text-[10px] font-space text-white/30 text-center mt-2 sm:mt-3 italic">
            +{card.forbidden.length - activeForbidden.length} more in harder modes
          </p>
        )}
      </div>
    </motion.div>
  );
}
