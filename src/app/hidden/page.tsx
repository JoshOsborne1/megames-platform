"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, CheckCircle2, Trophy } from "lucide-react";
import { ChallengeOne } from "@/components/challenges/ChallengeOne";
import { ChallengeTwo } from "@/components/challenges/ChallengeTwo";
import { ChallengeThree } from "@/components/challenges/ChallengeThree";
import { ChallengeFour } from "@/components/challenges/ChallengeFour";
import { Snowflakes } from "@/components/christmas/Snowflakes";
import { WinterBackground } from "@/components/christmas/WinterBackground";
import { ChristmasLights } from "@/components/christmas/ChristmasLights";
import { SnowPile } from "@/components/christmas/SnowPile";

type ChallengeAnswer = string | number;

export default function HiddenPage() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [answers, setAnswers] = useState<ChallengeAnswer[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<boolean[]>([false, false, false, false]);

  const handleChallengeComplete = (answer: ChallengeAnswer) => {
    const newAnswers = [...answers, answer];
    const newCompleted = [...completedChallenges];
    newCompleted[currentChallenge] = true;
    
    setAnswers(newAnswers);
    setCompletedChallenges(newCompleted);
    
    if (currentChallenge < 3) {
      setTimeout(() => setCurrentChallenge(currentChallenge + 1), 800);
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
      <WinterBackground />
      <Snowflakes />
      <ChristmasLights />
      
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6 safe-area-inset relative z-20">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display text-2xl font-bold text-white text-center mb-2 neon-text-pink">
            Challenge Sequence
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
        </motion.div>

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
                Complete!
              </h2>
              <p className="text-gray-400 mb-8">Your 4-digit code is:</p>
              <div className="relative">
                <div className="text-6xl font-pixel tracking-wider text-white neon-glow-pink px-8 py-4 rounded-2xl bg-white/5 border-2 border-[#ff006e]/50 relative overflow-hidden">
                  <SnowPile />
                  <div className="relative z-10">{finalCode}</div>
                </div>
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
                className="mb-4 p-4 rounded-2xl border-2 bg-black/40 relative overflow-hidden"
                style={{ borderColor: `${challenges[currentChallenge].color}40` }}
              >
                <SnowPile />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm"
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
                <CurrentChallengeComponent onComplete={handleChallengeComplete} />
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
