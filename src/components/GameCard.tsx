"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Clock, Star, Sparkles } from "lucide-react";

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  players: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  color: string;
  comingSoon?: boolean;
}

export function GameCard({
  id,
  name,
  description,
  icon,
  players,
  duration,
  difficulty,
  color,
  comingSoon = false,
}: GameCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const difficultyColors = {
    Easy: "#32CD32",
    Medium: "#FFD700",
    Hard: "#FF4500",
  };

  return (
    <motion.div
      className="relative w-full h-80 cursor-pointer perspective-1000"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center backface-hidden"
          style={{
            background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
            border: `2px solid ${color}44`,
            boxShadow: `0 10px 40px ${color}22`,
          }}
        >
          {comingSoon && (
            <div className="absolute top-4 right-4 bg-[#9370DB] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Coming Soon
            </div>
          )}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${color}33` }}
          >
            <div style={{ color: color }} className="w-12 h-12">
              {icon}
            </div>
          </div>
          <h3 className="font-display text-xl font-bold text-white text-center mb-2">{name}</h3>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {players}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {duration}
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col backface-hidden"
          style={{
            background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
            border: `2px solid ${color}66`,
            boxShadow: `0 10px 40px ${color}33`,
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="font-display text-lg font-bold text-white mb-3">{name}</h3>
          <p className="text-gray-300 text-sm flex-1 mb-4">{description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Difficulty</span>
              <span
                className="font-medium flex items-center gap-1"
                style={{ color: difficultyColors[difficulty] }}
              >
                <Star className="w-4 h-4 fill-current" />
                {difficulty}
              </span>
            </div>
            
            {!comingSoon ? (
              <Link href={`/games/${id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold text-black transition-all"
                  style={{ backgroundColor: color }}
                >
                  Play Now
                </motion.button>
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-xl font-semibold text-gray-400 bg-white/10 cursor-not-allowed"
              >
                Notify Me
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
