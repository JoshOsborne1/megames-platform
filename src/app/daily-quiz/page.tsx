"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useDailyQuiz } from "@/hooks/use-daily-quiz";
import { useHaptic } from "@/hooks/useHaptic";
import { 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Share2,
  Home
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import type { Question } from "@/lib/games/quiz-quarter/types";

type DailyQuizQuestion = Question & { shuffledAnswers: string[] };

export default function DailyQuizPage() {
  const { 
    currentQuestion, 
    currentQuestionIndex,
    correctAnswers, 
    isComplete, 
    streak, 
    isLoading,
    answerQuestion,
    nextQuestion 
  } = useDailyQuiz();
  
  const { trigger } = useHaptic();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Handle answer selection
  const handleAnswer = async (answer: string) => {
    if (showResult) return;
    
    trigger();
    setSelectedAnswer(answer);
    setShowResult(true);
    
    await answerQuestion(answer);
    
    // Wait then show next question
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      nextQuestion(); // Explicitly move to next question after result is cleared
    }, 1500);
  };

  // Confetti on completion
  useEffect(() => {
    if (isComplete && correctAnswers >= 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#F97316", "#EF4444", "#22C55E"],
      });
    }
  }, [isComplete, correctAnswers]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-white/50">Loading quiz...</div>
        </div>
      </AppShell>
    );
  }

  // Completion screen
  if (isComplete) {
    const percentage = (correctAnswers / 5) * 100;
    const emoji = percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : percentage >= 40 ? "👍" : "📚";
    
    return (
      <AppShell>
        <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
          <Link href="/" className="inline-block mb-6">
            <span className="text-white/40 text-sm hover:text-white/60 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Home
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="font-display font-bold text-3xl text-white mb-2">
              Quiz Complete!
            </h1>
            <p className="text-white/60 mb-6">
              You got {correctAnswers} out of 5 correct
            </p>

            {/* Score Display */}
            <div className="widget-card p-6 mb-6">
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-500">{correctAnswers}/5</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Score</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="w-6 h-6 text-orange-400" />
                    <span className="text-4xl font-bold text-orange-400">{streak}</span>
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Streak</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3.5 px-6 rounded-xl bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Home
                </motion.button>
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  trigger();
                  navigator.share?.({
                    title: "Daily Quiz",
                    text: `I got ${correctAnswers}/5 on today's Daily Quiz! 🔥 ${streak} day streak!`,
                    url: window.location.origin,
                  }).catch(() => {});
                }}
                className="py-3.5 px-6 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </motion.button>
            </div>

            <p className="text-xs text-white/30 mt-6">
              Come back tomorrow for new questions!
            </p>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  // Quiz screen
  return (
    <AppShell>
      <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <span className="text-white/40 text-sm hover:text-white/60 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Exit
            </span>
          </Link>
          
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/20 px-2.5 py-1 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-400">{streak}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/50 uppercase tracking-wider font-bold">
              Daily Quiz
            </span>
            <span className="text-xs text-white/50">
              Question {currentQuestionIndex + 1} of 5
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex) / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-6"
            >
              <div className="widget-card p-6 mb-6">
                <h2 className="font-display font-bold text-xl text-white text-center">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answers */}
              <div className="space-y-3">
                {(currentQuestion as DailyQuizQuestion).shuffledAnswers?.map((answer: string, index: number) => {
                  const isSelected = selectedAnswer === answer;
                  const isCorrectAnswer = answer === currentQuestion.correctAnswer;
                  
                  let bgColor = "bg-white/5 border-white/10";
                  if (showResult) {
                    if (isCorrectAnswer) {
                      bgColor = "bg-green-500/20 border-green-500/50";
                    } else if (isSelected && !isCorrectAnswer) {
                      bgColor = "bg-red-500/20 border-red-500/50";
                    }
                  } else if (isSelected) {
                    bgColor = "bg-amber-500/20 border-amber-500/50";
                  }
                  
                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                      onClick={() => handleAnswer(answer)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl border ${bgColor} text-left flex items-center justify-between group transition-colors`}
                    >
                      <span className="text-white font-medium">{answer}</span>
                      {showResult && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      {showResult && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current score */}
        <div className="text-center text-white/40 text-sm">
          {correctAnswers > 0 && (
            <span>{correctAnswers} correct so far</span>
          )}
        </div>
      </div>
    </AppShell>
  );
}
