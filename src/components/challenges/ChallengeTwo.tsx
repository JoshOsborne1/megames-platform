"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ChallengeTwoProps {
  onComplete: (answer: string | number) => void;
  completedAnswers: (string | number)[];
}

export function ChallengeTwo({ onComplete, completedAnswers }: ChallengeTwoProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onComplete(Number(answer.trim()));
    }
  };

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
        
        <div className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            className="w-full px-4 py-3 bg-black/40 border-2 border-[#8338ec]/40 rounded-xl text-white placeholder-gray-500 focus:border-[#8338ec] focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#8338ec] to-[#00f5ff] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#8338ec]/50 transition-all"
          >
            Submit <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
