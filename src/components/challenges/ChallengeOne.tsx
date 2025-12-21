"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

interface ChallengeOneProps {
  onComplete: (answer: string | number) => void;
  completedAnswers: (string | number)[];
}

export function ChallengeOne({ onComplete, completedAnswers }: ChallengeOneProps) {
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const [step, setStep] = useState(1);
  const [showError, setShowError] = useState(false);

  const handleRiddleSubmit = () => {
    const normalized = riddleAnswer.trim();
    
    if (normalized === "2") {
      setStep(3);
      setTimeout(() => onComplete(2), 800);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm relative"
    >
      <div className="bg-black/60 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#ff006e]/30 relative">
        <h3 className="font-display text-2xl text-white mb-6 text-center relative z-10 font-bold">
          Challenge 1: The Echo
        </h3>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white/5 p-6 rounded-2xl mb-8 border border-white/10 shadow-inner">
                <p className="text-white text-lg font-medium text-center leading-relaxed">
                  "I speak without a mouth and hear without ears. <br className="hidden sm:block" />
                  I have no body, but I come alive with the wind."
                </p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-[#ff006e] text-sm font-bold text-center uppercase tracking-wider">
                    How many vowels are in my name?
                  </p>
                </div>
              </div>

              <motion.div
                animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    value={riddleAnswer}
                    onChange={(e) => setRiddleAnswer(e.target.value.replace(/[^0-9]/g, ''))}
                    inputMode="numeric"
                    placeholder="Enter the digit..."
                    className={`w-full px-6 py-4 bg-black/40 border-2 rounded-xl text-white text-center text-2xl font-pixel placeholder:text-gray-600 focus:outline-none transition-all ${
                      showError 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-[#ff006e]/40 focus:border-[#ff006e] focus:bg-[#ff006e]/5'
                    }`}
                    onKeyDown={(e) => e.key === "Enter" && handleRiddleSubmit()}
                  />
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRiddleSubmit}
                    disabled={!riddleAnswer.trim()}
                    className="w-full py-4 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ff006e]/50 transition-all text-lg"
                  >
                    Submit <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Sparkles className="w-6 h-6" />
                <p className="font-display text-xl">Correct!</p>
                <Sparkles className="w-6 h-6" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
