"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import { ChallengeOne } from "@/components/challenges/ChallengeOne";
import { ChallengeTwo } from "@/components/challenges/ChallengeTwo";
import { ChallengeThree } from "@/components/challenges/ChallengeThree";
import { ChallengeFour } from "@/components/challenges/ChallengeFour";
import { Snowfall } from "@/components/christmas/Snowfall";

type ChallengeAnswer = string | number;

export default function HiddenPage() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [answers, setAnswers] = useState<ChallengeAnswer[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<boolean[]>([false, false, false, false]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastUnlockedNumber, setLastUnlockedNumber] = useState<ChallengeAnswer | null>(null);

  const handleChallengeComplete = useCallback((answer: ChallengeAnswer) => {
    const newAnswers = [...answers, answer];
    const newCompleted = [...completedChallenges];
    newCompleted[currentChallenge] = true;
    
    setAnswers(newAnswers);
    setCompletedChallenges(newCompleted);
    setLastUnlockedNumber(answer);
    setShowSuccessModal(true);
  }, [answers, completedChallenges, currentChallenge]);

  useEffect(() => {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown"];
    let currentIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === sequence[currentIndex]) {
        currentIndex++;
        if (currentIndex === sequence.length) {
          const correctAnswers: ChallengeAnswer[] = [2, 4, 3, 7];
          handleChallengeComplete(correctAnswers[currentChallenge]);
          currentIndex = 0;
        }
      } else {
        currentIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChallenge, handleChallengeComplete]);

  const handleContinue = () => {
    setShowSuccessModal(false);
    if (currentChallenge < 3) {
      setCurrentChallenge(currentChallenge + 1);
    }
  };

  const finalCode = answers.join("");
  const allComplete = completedChallenges.every(c => c);

  const challenges = [
    { component: ChallengeOne, title: "Challenge 1", color: "#ff006e" },
    { component: ChallengeTwo, title: "Challenge 2", color: "#8338ec" },
    { component: ChallengeThree, title: "Challenge 3", color: "#00f5ff" },
    { component: ChallengeFour, title: "Challenge 4", color: "#fb00ff" },
  ];

  const CurrentChallengeComponent = challenges[currentChallenge].component;

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col overflow-hidden relative">
      <Snowfall />
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6 safe-area-inset relative z-20">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 relative"
        >
          <h1 className="font-display text-2xl font-bold text-white text-center mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            Hidden Challenge
          </h1>
          <div className="flex justify-center gap-2 mb-4">
            {challenges.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  completedChallenges[idx] 
                    ? 'w-12 bg-gradient-to-r from-[#ff006e] to-[#8338ec]' 
                    : idx === currentChallenge
                    ? 'w-12 bg-white/40'
                    : 'w-8 bg-white/10'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              />
            ))}
          </div>
          
          <div className="flex justify-center gap-3 mb-4">
            {[0, 1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-pixel border-2 transition-all ${
                  completedChallenges[idx]
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-white/5 border-white/20 text-white/40'
                }`}
              >
                {completedChallenges[idx] ? answers[idx] : '?'}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                className="bg-[#1a0f2e] border-2 border-white/10 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff006e] to-transparent" />
                
                <motion.div
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="mb-6 inline-block"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ff006e] to-[#8338ec] rounded-2xl flex items-center justify-center text-4xl font-pixel text-white shadow-[0_0_20px_rgba(255,0,110,0.5)]">
                    {lastUnlockedNumber}
                  </div>
                </motion.div>

                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Challenge Unlocked!
                </h2>
                <p className="text-gray-400 mb-8">
                  You've successfully completed Challenge {currentChallenge + 1}.
                </p>

                <button
                  onClick={handleContinue}
                  className="w-full py-4 bg-white text-[#0a0015] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors group"
                >
                  {currentChallenge === 3 ? "Show Final Code" : "Continue"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {allComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1]
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Trophy className="w-20 h-20 text-[#fb00ff] mb-4" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">
                Merry Christmas, you&apos;re in!
              </h2>
              <p className="text-gray-400 mb-8 text-center px-4">Here is your special security code:</p>
              <div className="text-6xl font-pixel tracking-wider text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] px-8 py-4 rounded-2xl bg-white/5 border-2 border-white/20 relative">
                <div className="relative z-10">{finalCode}</div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentChallenge}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex-1 flex flex-col"
            >
              <div 
                className="mb-4 p-4 rounded-2xl border-2 bg-black/60 relative"
                style={{ borderColor: `${challenges[currentChallenge].color}33` }}
              >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm text-white"
                    style={{ backgroundColor: challenges[currentChallenge].color }}
                  >
                    {currentChallenge + 1}
                  </div>
                  <h2 className="font-display text-lg font-bold text-white">
                    {challenges[currentChallenge].title}
                  </h2>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <CurrentChallengeComponent 
                  onComplete={handleChallengeComplete} 
                  completedAnswers={answers}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex justify-between items-center text-xs text-gray-500"
        >
          <span>Challenge {currentChallenge + 1}/4</span>
          <span>{completedChallenges.filter(Boolean).length} completed</span>
        </motion.div>
      </div>
    </div>
  );
}
