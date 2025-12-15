"use client";

import { motion } from "framer-motion";
import { RhymeCard as RhymeCardType } from "@/lib/games/rhyme-rebels/rhymeDeck";
import { GameMode } from "@/lib/games/rhyme-rebels/types";
import { Sparkles, Star, Brain } from "lucide-react";

interface RhymeCardProps {
  card: RhymeCardType;
  mode: GameMode;
  isClueGiver: boolean;
}

const modeDescriptions = {
  describe: "Describe WITHOUT saying the rhyme words!",
  act: "ACT IT OUT - no words allowed!",
  solve: "Solve this riddle!",
};

const modeColors = {
  describe: "#32CD32",
  act: "#FFD700",
  solve: "#FF69B4",
};

export function RhymeCard({ card, mode, isClueGiver }: RhymeCardProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <motion.div
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative w-full max-w-4xl"
      >
        <motion.div
          className="w-full min-h-[400px] rounded-3xl p-12 shadow-2xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${modeColors[mode]} 0%, ${modeColors[mode]}88 100%)`,
            boxShadow: `0 0 60px ${modeColors[mode]}`,
          }}
          animate={{
            boxShadow: [
              `0 0 40px ${modeColors[mode]}`,
              `0 0 60px ${modeColors[mode]}`,
              `0 0 40px ${modeColors[mode]}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4"
            >
              <Sparkles className="w-16 h-16 text-white" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-4 left-4"
            >
              <Star className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-8">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-space text-xs font-bold">
                {card.category.toUpperCase()}
              </span>
              <div className="flex gap-1">
                {[...Array(card.difficulty)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                ))}
              </div>
            </div>

            {isClueGiver || mode !== 'solve' ? (
              <div className="text-center flex-1 flex flex-col justify-center">
                <motion.h2
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="font-display font-black text-6xl md:text-7xl text-white mb-4 drop-shadow-lg"
                >
                  {card.phrase}
                </motion.h2>
                {mode !== 'solve' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/80 font-space text-xl"
                  >
                    {card.celeb} + {card.rhyme}
                  </motion.p>
                )}
              </div>
            ) : (
              <div className="text-center flex-1 flex flex-col justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mb-6"
                >
                  <Brain className="w-20 h-20 text-white mx-auto mb-4" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-display font-bold text-3xl md:text-4xl text-white mb-4 drop-shadow-lg px-4"
                >
                  {card.phrase}
                </motion.h2>
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-white font-space font-bold text-xl">
                {modeDescriptions[mode]}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: modeColors[mode],
            boxShadow: `0 0 30px ${modeColors[mode]}`,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <span className="font-display font-black text-white text-2xl">
            {mode === "describe" ? "🎤" : mode === "act" ? "🎭" : "🧩"}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}