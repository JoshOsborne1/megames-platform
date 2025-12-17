"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

interface ChallengeOneProps {
  onComplete: (answer: string | number) => void;
  completedAnswers: (string | number)[];
}

export function ChallengeOne({ onComplete, completedAnswers }: ChallengeOneProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showContinue, setShowContinue] = useState(false);

  const handleSubmit = () => {
    const normalized = answer.trim().toLowerCase();
    
    if (normalized === "echo") {
      setIsCorrect(true);
      setShowHint(false);
      setShowContinue(true);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
  };

  const handleContinue = () => {
    onComplete(2);
  };

  const digitBoxes = [
    { value: 2, revealed: showContinue },
    { value: null, revealed: false },
    { value: null, revealed: false },
    { value: null, revealed: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm"
    >
      <div className="bg-gradient-to-br from-[#1a0f2e]/80 to-[#0a0015]/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#ff006e]/30">
        <h3 className="font-display text-xl text-white mb-4 text-center">
          The Festive Brain Teaser
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

        <div className="bg-black/40 p-4 rounded-xl mb-6 border border-[#ff006e]/20">
          <p className="text-gray-300 text-sm mb-3 italic">
            "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?"
          </p>
        </div>

        <AnimatePresence mode="wait">
          {showHint && (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/40 p-4 rounded-xl mb-6 border border-[#ff006e]/20"
            >
              <p className="text-gray-300 text-sm text-center">
                The answer is the number of vowels in the word!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="A: 2"
              disabled={showContinue}
              className={`w-full px-4 py-3 bg-black/40 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                showError 
                  ? 'border-red-500 shake' 
                  : 'border-[#ff006e]/40 focus:border-[#ff006e]'
              }`}
              onKeyDown={(e) => e.key === "Enter" && !showContinue && handleSubmit()}
            />
            
            {!showContinue ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="w-full py-3 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ff006e]/50 transition-all"
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
        </motion.div>
      </div>
    </motion.div>
  );
}
