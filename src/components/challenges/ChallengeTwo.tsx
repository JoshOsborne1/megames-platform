"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

interface ChallengeTwoProps {
  onComplete: (answer: string | number) => void;
  completedAnswers: (string | number)[];
}

export function ChallengeTwo({ onComplete, completedAnswers }: ChallengeTwoProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(true);
  const [showContinue, setShowContinue] = useState(false);

  const handleSubmit = () => {
    if (answer.trim()) {
      setShowHint(false);
      setShowContinue(true);
    }
  };

  const handleContinue = () => {
    onComplete(Number(answer.trim()));
  };

  const digitBoxes = [
    { value: completedAnswers[0], revealed: completedAnswers.length >= 1 },
    { value: answer.trim() ? Number(answer.trim()) : null, revealed: showContinue },
    { value: null, revealed: false },
    { value: null, revealed: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm"
    >
      <div className="bg-gradient-to-br from-[#1a0f2e]/80 to-[#0a0015]/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#8338ec]/30">
        <h3 className="font-display text-xl text-white mb-4 text-center">
          Challenge 2
        </h3>

        <div className="flex justify-center gap-3 mb-6">
          {digitBoxes.map((box, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-pixel border-2 transition-all ${
                box.revealed
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-red-500/20 border-red-500 text-red-400'
              }`}
            >
              {box.revealed ? box.value : '?'}
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {showHint && (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/40 p-4 rounded-xl mb-6 border border-[#8338ec]/20"
            >
              <p className="text-gray-300 text-sm text-center">
                The answer is the number of vowels in the word!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="A: 2"
            disabled={showContinue}
            className="w-full px-4 py-3 bg-black/40 border-2 border-[#8338ec]/40 rounded-xl text-white placeholder-gray-500 focus:border-[#8338ec] focus:outline-none transition-colors disabled:opacity-50"
            onKeyDown={(e) => e.key === "Enter" && !showContinue && handleSubmit()}
          />
          
          {!showContinue ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="w-full py-3 bg-gradient-to-r from-[#8338ec] to-[#00f5ff] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#8338ec]/50 transition-all"
            >
              Submit <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-display rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
