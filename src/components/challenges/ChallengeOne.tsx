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
  const [vowelAnswer, setVowelAnswer] = useState("");
  const [step, setStep] = useState(1);
  const [showError, setShowError] = useState(false);

  const handleRiddleSubmit = () => {
    const normalized = riddleAnswer.trim().toLowerCase();
    
    if (normalized === "echo") {
      setStep(2);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
  };

  const handleVowelSubmit = () => {
    const answer = vowelAnswer.trim();
    
    if (answer === "2") {
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
        <h3 className="font-display text-xl text-white mb-4 text-center relative z-10">
            Brain Teaser
          </h3>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-black/40 p-4 rounded-xl mb-6 border border-[#ff006e]/20">
                <p className="text-gray-300 text-sm italic">
                  "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?"
                </p>
              </div>

              <motion.div
                animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    value={riddleAnswer}
                    onChange={(e) => setRiddleAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className={`w-full px-4 py-3 bg-black/40 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                      showError 
                        ? 'border-red-500 shake' 
                        : 'border-[#ff006e]/40 focus:border-[#ff006e]'
                    }`}
                    onKeyDown={(e) => e.key === "Enter" && handleRiddleSubmit()}
                  />
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRiddleSubmit}
                    disabled={!riddleAnswer.trim()}
                    className="w-full py-3 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ff006e]/50 transition-all"
                  >
                    Submit <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-black/40 p-4 rounded-xl mb-4 border border-[#ff006e]/20">
                  <p className="text-gray-300 text-sm text-center mb-2">
                    Correct! The answer is: <span className="font-bold text-white">ECHO</span>
                  </p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-xl mb-6 border border-[#ff006e]/20">
                  <p className="text-gray-300 text-sm text-center">
                    Now, enter the number of vowels in the word!
                  </p>
                </div>

              <motion.div
                animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={vowelAnswer}
                      onChange={(e) => setVowelAnswer(e.target.value.replace(/[^0-9]/g, ''))}
                      inputMode="numeric"
                      placeholder="Enter number..."
                      autoFocus
                      className={`w-full px-4 py-3 bg-black/40 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${

                      showError 
                        ? 'border-red-500 shake' 
                        : 'border-[#ff006e]/40 focus:border-[#ff006e]'
                    }`}
                    onKeyDown={(e) => e.key === "Enter" && handleVowelSubmit()}
                  />
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVowelSubmit}
                    disabled={!vowelAnswer.trim()}
                    className="w-full py-3 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ff006e]/50 transition-all"
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
