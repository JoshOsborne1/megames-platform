"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ChallengeFourProps {
  onComplete: (answer: string | number) => void;
}

export function ChallengeFour({ onComplete }: ChallengeFourProps) {
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
      <div className="bg-black/60 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#fb00ff]/30 relative">
        <h3 className="font-display text-xl text-white mb-4 text-center relative z-10">
          Challenge 4
        </h3>
        <p className="text-gray-300 text-center mb-6">
          Final challenge! Unlock the last digit
        </p>
        
        <div className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 bg-black/40 border-2 border-[#fb00ff]/40 rounded-xl text-white placeholder-gray-500 focus:border-[#fb00ff] focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#fb00ff] to-[#ff006e] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#fb00ff]/50 transition-all"
          >
            Complete <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
