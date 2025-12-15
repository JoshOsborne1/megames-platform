"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameMode } from "@/lib/games/rhyme-rebels/types";
import { Mic, Drama, Puzzle } from "lucide-react";

interface DiceRollerProps {
  onRollComplete: (mode: GameMode) => void;
  isRolling: boolean;
}

const modeIcons = {
  describe: { icon: Mic, color: "#32CD32", label: "DESCRIBE" },
  act: { icon: Drama, color: "#FFD700", label: "ACT" },
  solve: { icon: Puzzle, color: "#FF69B4", label: "SOLVE" },
};

export function DiceRoller({ onRollComplete, isRolling }: DiceRollerProps) {
  const modes: GameMode[] = ["describe", "act", "solve"];
  const [result, setResult] = useState<GameMode | null>(null);

  const handleRoll = () => {
    if (isRolling) return;

    const finalMode = modes[Math.floor(Math.random() * modes.length)];
    setResult(finalMode);

    setTimeout(() => {
      onRollComplete(finalMode);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <motion.div
        className="relative w-48 h-48"
        animate={isRolling ? { rotate: [0, 360, 720, 1080] } : {}}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {!isRolling && result && (
            <motion.div
              key={result}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl shadow-2xl"
              style={{
                backgroundColor: modeIcons[result].color,
                boxShadow: `0 0 40px ${modeIcons[result].color}`,
              }}
            >
              {(() => {
                const Icon = modeIcons[result].icon;
                return <Icon className="w-24 h-24 text-white" />;
              })()}
              <span className="mt-4 text-white font-display font-black text-xl">
                {modeIcons[result].label}
              </span>
            </motion.div>
          )}

          {!result && !isRolling && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl"
            >
              <span className="text-white font-display font-black text-4xl">?</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        onClick={handleRoll}
        disabled={isRolling}
        className="px-12 py-4 bg-gradient-to-r from-[#FF4500] to-[#FF6347] rounded-full font-display font-black text-white text-xl shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isRolling ? "ROLLING..." : "ROLL DICE"}
      </motion.button>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {modes.map((mode) => {
          const { icon: Icon, color, label } = modeIcons[mode];
          return (
            <div
              key={mode}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border-2 border-white/10"
            >
              <Icon className="w-8 h-8" style={{ color }} />
              <span className="text-white/70 font-space text-sm">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}