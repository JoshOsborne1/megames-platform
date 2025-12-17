"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ChallengeThreeProps {
  onComplete: (answer: string | number) => void;
}

export function ChallengeThree({ onComplete }: ChallengeThreeProps) {
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
      className="w-full max-w-sm relative"
    >
      <div className="bg-black/60 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#00f5ff]/30 relative">
        <h3 className="font-display text-xl text-white mb-4 text-center relative z-10">
          Challenge 3
        </h3>
        <p className="text-gray-300 text-center mb-6">
          Crack this puzzle for the third digit
        </p>
        
        <div className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 bg-black/40 border-2 border-[#00f5ff]/40 rounded-xl text-white placeholder-gray-500 focus:border-[#00f5ff] focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#00f5ff] to-[#fb00ff] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#00f5ff]/50 transition-all"
          >
            Submit <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
