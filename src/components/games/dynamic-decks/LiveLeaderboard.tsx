"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/lib/games/dynamic-decks/types";
import { Trophy, Mic } from "lucide-react";

interface LiveLeaderboardProps {
  players: Player[];
  currentReaderId?: string;
  title?: string;
  compact?: boolean;
}

export function LiveLeaderboard({ 
  players, 
  currentReaderId,
  title = "Leaderboard",
  compact = false
}: LiveLeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  return (
    <div className={`rounded-xl bg-white/5 border border-white/10 ${compact ? 'p-3' : 'p-4'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 text-white/40 mb-3">
        <Trophy className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
      
      {/* Players */}
      <div className={`space-y-${compact ? '1.5' : '2'}`}>
        <AnimatePresence mode="popLayout">
          {sortedPlayers.map((player, i) => {
            const isReader = player.id === currentReaderId;
            const isFirst = i === 0;
            const isSecond = i === 1;
            const isThird = i === 2;
            
            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30,
                  layout: { type: "spring", stiffness: 300, damping: 25 }
                }}
                className={`flex items-center justify-between ${compact ? 'p-2' : 'p-3'} rounded-lg ${
                  isFirst 
                    ? 'bg-yellow-500/10 border border-yellow-500/30' 
                    : isSecond
                    ? 'bg-zinc-400/10 border border-zinc-400/20'
                    : isThird
                    ? 'bg-amber-700/10 border border-amber-700/20'
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Position */}
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                    isFirst 
                      ? 'bg-yellow-500 text-black' 
                      : isSecond
                      ? 'bg-zinc-400 text-black'
                      : isThird
                      ? 'bg-amber-700 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {i + 1}
                  </span>
                  
                  {/* Name */}
                  <span className={`font-medium ${compact ? 'text-sm' : ''} ${
                    isFirst ? 'text-white' : 'text-white/80'
                  }`}>
                    {player.name}
                  </span>
                  
                  {/* Reader badge */}
                  {isReader && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-pink/20 border border-neon-pink/30"
                    >
                      <Mic className="w-3 h-3 text-neon-pink" />
                      <span className="text-[10px] text-neon-pink font-medium uppercase">Reader</span>
                    </motion.div>
                  )}
                </div>
                
                {/* Score */}
                <motion.span 
                  key={player.score}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className={`font-display font-bold ${compact ? 'text-base' : 'text-lg'} ${
                    isFirst ? 'text-yellow-500' : 'text-white/60'
                  }`}
                >
                  {player.score}
                </motion.span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
