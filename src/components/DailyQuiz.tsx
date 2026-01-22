"use client";

import { motion } from "framer-motion";
import { Flame, Award, CheckCircle2, Play } from "lucide-react";
import Link from "next/link";
import { useDailyQuiz } from "@/hooks/use-daily-quiz";

export function DailyQuizWidget() {
  const { isComplete, streak, correctAnswers, isLoading, isLoggedIn } = useDailyQuiz();

  if (isLoading) {
    return (
      <div className="widget-card p-4 animate-pulse">
        <div className="h-16 bg-white/10 rounded-xl" />
      </div>
    );
  }

  return (
    <Link href="/daily-quiz">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="widget-card p-4 bg-linear-to-br from-amber-500/20 to-orange-500/10 border-amber-500/30 group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          {/* Left Side - Status */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              {isComplete ? (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              ) : (
                <Award className="w-6 h-6 text-amber-500" />
              )}
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">
                Daily Quiz
              </h4>
              <p className="text-xs text-white/60">
                {isComplete 
                  ? `${correctAnswers}/5 correct today!` 
                  : "5 questions • Earn streaks"
                }
              </p>
            </div>
          </div>

          {/* Right Side - Streak or Play */}
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/20 px-2.5 py-1.5 rounded-full">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-400">{streak}</span>
              </div>
            )}
            
            {!isComplete && (
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            )}
          </div>
        </div>

        {/* Login prompt for guests */}
        {!isLoggedIn && streak > 0 && (
          <p className="text-[10px] text-amber-500/70 mt-2 text-center">
            Sign in to save your streak across devices
          </p>
        )}
      </motion.div>
    </Link>
  );
}
