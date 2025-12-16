"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

interface ChallengeOneProps {
  onComplete: (answer: string | number) => void;
}

export function ChallengeOne({ onComplete }: ChallengeOneProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    const normalized = answer.trim().toLowerCase();
    
    if (normalized === "echo") {
      setIsCorrect(true);
      setShowSuccess(true);
      
      setTimeout(() => {
        onComplete(2);
      }, 2500);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm"
    >
      <div className="bg-gradient-to-br from-[#1a0f2e]/80 to-[#0a0015]/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#ff006e]/30 relative overflow-hidden">
        <AnimatePresence>
          {showSuccess && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-10"
              />
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: 50,
                    x: Math.random() * 100 - 50,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    y: [-20, -150],
                    x: [Math.random() * 100 - 50, Math.random() * 150 - 75],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute left-1/2 top-1/2 pointer-events-none z-20"
                  style={{
                    width: Math.random() * 8 + 4,
                    height: Math.random() * 8 + 4,
                  }}
                >
                  <div className="w-full h-full bg-white rounded-full" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.div
          animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <h3 className="font-display text-xl text-white mb-4 text-center">
            The Festive Brain Teaser
          </h3>
          
          <div className="bg-black/40 p-4 rounded-xl mb-6 border border-[#ff006e]/20">
            <p className="text-gray-300 text-sm mb-3 italic">
              "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?"
            </p>
          </div>

          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-3"
              >
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Sparkles className="w-6 h-6" />
                  <p className="font-display text-xl">Great start!</p>
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-gray-300 text-sm">
                  Your first digit is the number of vowels in the answer (E-O = <span className="font-pixel text-2xl text-[#ff006e]">2</span>)
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4" key="input">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  disabled={isCorrect}
                  className={`w-full px-4 py-3 bg-black/40 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    showError 
                      ? 'border-red-500 shake' 
                      : 'border-[#ff006e]/40 focus:border-[#ff006e]'
                  }`}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isCorrect}
                  className="w-full py-3 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ff006e]/50 transition-all"
                >
                  Submit <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
