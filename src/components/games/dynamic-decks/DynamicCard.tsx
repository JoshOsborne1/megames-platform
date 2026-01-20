"use client";

import { motion } from "framer-motion";
import { Card, Difficulty } from "@/lib/games/dynamic-decks/types";
import { calculatePoints } from "@/lib/games/dynamic-decks/gameLogic";
import { Ban, Target, MessageCircleQuestion, Sparkles } from "lucide-react";

interface DynamicCardProps {
  card: Card;
  difficulty: Difficulty;
  deckId?: string;
}

export function DynamicCard({ card, difficulty }: DynamicCardProps) {
  const isRhymesCard = Boolean(card.clue && card.answer);
  const forbiddenCount = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;
  const activeForbidden = card.forbidden.slice(0, forbiddenCount);
  const actualPoints = calculatePoints(card, difficulty);

  const getCardDifficulty = (points: number): "easy" | "medium" | "hard" => {
    if (points <= 20) return "easy";
    if (points <= 30) return "medium";
    return "hard";
  };

  const cardDifficulty = getCardDifficulty(card.points);

  const difficultyColors = {
    easy: { primary: "#00f5ff", bg: "bg-[#00f5ff]/10", border: "border-[#00f5ff]/30", label: "Easy" },
    medium: { primary: "#ff9f1c", bg: "bg-[#ff9f1c]/10", border: "border-[#ff9f1c]/30", label: "Medium" },
    hard: { primary: "#ff006e", bg: "bg-[#ff006e]/10", border: "border-[#ff006e]/30", label: "Hard" }
  };

  const colors = difficultyColors[cardDifficulty];

  // RHYMES MODE
  if (isRhymesCard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full"
      >
        {/* Clue Card */}
        <div className={`${colors.bg} border ${colors.border} rounded-xl p-5 mb-3`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2" style={{ color: colors.primary }}>
              <MessageCircleQuestion className="w-4 h-4" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Read Aloud</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                {colors.label}
              </span>
              <span className="font-display font-bold" style={{ color: colors.primary }}>{actualPoints}pts</span>
            </div>
          </div>
          <p className="text-white text-center text-lg leading-relaxed py-3">&quot;{card.clue}&quot;</p>
          <p className="text-center text-[10px] text-white/40 uppercase tracking-wider">Read this clue to the guessers</p>
        </div>

        {/* Answer Section */}
        <div className="bg-white/5 border border-neon-purple/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-neon-purple">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-medium uppercase tracking-wider">The Answer</span>
            </div>
            <span className="text-[10px] text-neon-pink bg-neon-pink/10 px-2 py-0.5 rounded uppercase">Don&apos;t Say!</span>
          </div>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="py-3 px-4 bg-neon-purple/10 border border-neon-purple/20 rounded-lg"
          >
            <p className="font-display font-bold text-neon-purple text-xl text-center uppercase">{card.answer}</p>
          </motion.div>
          <p className="text-center text-[10px] text-white/30 mt-3 italic">This is what they&apos;re trying to guess</p>
        </div>
      </motion.div>
    );
  }

  // CLASSIC MODE - Forbidden words
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      {/* Target Word Card */}
      <div className={`${colors.bg} border ${colors.border} rounded-xl p-5 mb-3`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2" style={{ color: colors.primary }}>
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Target Word</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
              {colors.label}
            </span>
            <span className="font-display font-bold" style={{ color: colors.primary }}>{actualPoints}pts</span>
          </div>
        </div>
        <motion.h2
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`font-display font-bold text-white text-center py-4 ${card.word.length > 12 ? 'text-2xl' : card.word.length > 8 ? 'text-3xl' : 'text-4xl'
            }`}
        >
          {card.word.toUpperCase()}
        </motion.h2>
      </div>

      {/* Forbidden Words */}
      <div className="bg-white/5 border border-neon-pink/30 rounded-xl p-5">
        <div className="flex items-center gap-2 text-neon-pink mb-3">
          <Ban className="w-4 h-4" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Don&apos;t Say</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {activeForbidden.map((word, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              // Sorry, we haven't added help content for this mode yet!
              // Double check the implementation plan or ask the developer.
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="py-2 px-3 bg-neon-pink/10 border border-neon-pink/20 rounded-lg text-neon-pink text-sm font-medium text-center uppercase"
            >
              {word}
            </motion.div>
          ))}
        </div>
        {card.forbidden.length > activeForbidden.length && (
          <p className="text-center text-[10px] text-white/30 mt-3 italic">
            +{card.forbidden.length - activeForbidden.length} more in harder modes
          </p>
        )}
      </div>
    </motion.div>
  );
}
