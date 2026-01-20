"use client";

import { motion } from "framer-motion";
import { GameState } from "@/lib/games/dynamic-decks/types";
import { LiveLeaderboard } from "./LiveLeaderboard";
import { Timer, Mic, Users } from "lucide-react";

interface SpectatorViewProps {
  gameState: GameState;
}

export function SpectatorView({ gameState }: SpectatorViewProps) {
  const reader = gameState.players[gameState.clueGiverIndex];
  const timerCritical = gameState.timer <= 10;
  
  return (
    <div className="w-full max-w-lg mx-auto px-4 pt-4">
      {/* Waiting message */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/30 mb-3">
          <Mic className="w-4 h-4 text-neon-pink" />
          <span className="text-sm font-medium text-neon-pink">
            {reader.name} is reading
          </span>
        </div>
        <p className="text-white/40 text-sm">Watch the leaderboard for live score updates!</p>
      </motion.div>

      {/* Big Timer */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="flex justify-center mb-8"
      >
        <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${
          timerCritical 
            ? 'border-red-500 bg-red-500/10' 
            : 'border-white/20 bg-white/5'
        }`}>
          <Timer className={`w-5 h-5 mb-1 ${timerCritical ? 'text-red-500' : 'text-white/40'}`} />
          <span className={`font-display font-black text-4xl ${
            timerCritical ? 'text-red-500 animate-pulse' : 'text-white'
          }`}>
            {gameState.timer}
          </span>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Round</p>
          <p className="font-display font-bold text-xl text-white">
            {gameState.currentRound}/{gameState.maxRounds}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Cards Done</p>
          <p className="font-display font-bold text-xl text-white">
            {gameState.cardsInRound}
          </p>
        </div>
      </div>

      {/* Live Leaderboard */}
      <LiveLeaderboard 
        players={gameState.players}
        currentReaderId={reader.id}
        title="Live Scores"
      />

      {/* Hint */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-white/20 text-xs mt-6"
      >
        <Users className="w-3 h-3 inline mr-1" />
        Scores update in real-time as cards are answered
      </motion.p>
    </div>
  );
}
