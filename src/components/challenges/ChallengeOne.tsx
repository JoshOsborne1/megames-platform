"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ChallengeOneProps {
  onComplete: (answer: string | number) => void;
}

export function ChallengeOne({ onComplete }: ChallengeOneProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onComplete(answer.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm"
    >
      <div className="bg-gradient-to-br from-[#1a0f2e]/80 to-[#0a0015]/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#ff006e]/30">
        <h3 className="font-display text-xl text-white mb-4 text-center">
          Challenge 1
        </h3>
        <p className="text-gray-300 text-center mb-6">
          Enter your answer to unlock the first digit
        </p>
        
        <div className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 bg-black/40 border-2 border-[#ff006e]/40 rounded-xl text-white placeholder-gray-500 focus:border-[#ff006e] focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ff006e]/50 transition-all"
          >
            Submit <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
