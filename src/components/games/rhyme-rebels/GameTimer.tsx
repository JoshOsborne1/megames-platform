"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface GameTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

export function GameTimer({ initialTime, onTimeUp, isRunning }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const percentage = (timeLeft / initialTime) * 100;
  const isLowTime = timeLeft <= 10;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative w-32 h-32"
        animate={isLowTime ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
      >
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={isLowTime ? "#FF4500" : "#32CD32"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            style={{
              filter: `drop-shadow(0 0 10px ${isLowTime ? "#FF4500" : "#32CD32"})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock
            className={`w-8 h-8 mb-2 ${isLowTime ? "text-red-500" : "text-green-400"}`}
          />
          <span
            className={`font-display font-black text-4xl ${
              isLowTime ? "text-red-500" : "text-white"
            }`}
          >
            {timeLeft}
          </span>
          <span className="text-white/50 font-space text-xs mt-1">seconds</span>
        </div>
      </motion.div>

      <motion.div
        className="w-64 h-3 bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className={`h-full ${isLowTime ? "bg-red-500" : "bg-green-400"}`}
          style={{
            width: `${percentage}%`,
            boxShadow: `0 0 20px ${isLowTime ? "#FF4500" : "#32CD32"}`,
          }}
          animate={isLowTime ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
        />
      </motion.div>
    </div>
  );
}
