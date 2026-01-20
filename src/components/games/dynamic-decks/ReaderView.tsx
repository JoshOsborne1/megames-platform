"use client";

import { motion } from "framer-motion";
import { GameState } from "@/lib/games/dynamic-decks/types";
import { DynamicCard } from "./DynamicCard";
import { Check, X } from "lucide-react";

interface ReaderViewProps {
  gameState: GameState;
  onCorrect: () => void;
  onCorrectPlayer?: (playerId: string) => void;
  onPass: () => void;
}

export function ReaderView({ gameState, onCorrect, onCorrectPlayer, onPass }: ReaderViewProps) {
  const isQMMode = gameState.gameMode === "question-master";
  const clueGiver = gameState.players[gameState.clueGiverIndex];
  const timerCritical = gameState.timer <= 10;
  
  if (!gameState.currentCard) return null;
  
  return (
    <div className="w-full max-w-lg mx-auto px-4 pt-4">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            {isQMMode ? 'QM' : 'Score'}
          </p>
          <p className={`font-display font-bold text-xl ${isQMMode ? 'text-neon-purple' : 'text-neon-pink'}`}>
            {isQMMode ? clueGiver.name : gameState.roundScore}
          </p>
        </div>

        <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-display font-black text-2xl ${
          timerCritical 
            ? 'border-red-500 text-red-500 animate-pulse' 
            : 'border-white/20 text-white'
        }`}>
          {gameState.timer}
        </div>

        <div className="text-right">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Cards</p>
          <p className="font-display font-bold text-xl text-white">{gameState.cardsInRound}</p>
        </div>
      </div>

      {/* Card */}
      <DynamicCard 
        card={gameState.currentCard} 
        difficulty={gameState.difficulty} 
        deckId={gameState.deckId} 
      />

      {/* Controls */}
      {isQMMode ? (
        <div className="mt-6 space-y-3">
          <p className="text-center text-xs text-white/40 uppercase tracking-wider mb-2">Who got it?</p>
          <div className="grid grid-cols-2 gap-2">
            {gameState.players.filter(p => p.id !== clueGiver.id).map((player) => (
              <motion.button
                key={player.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCorrectPlayer?.(player.id)}
                className="py-3 rounded-xl bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan font-bold text-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> {player.name}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPass}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-sm flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Skip
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPass}
            className="py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold flex flex-col items-center gap-1"
          >
            <X className="w-5 h-5" />
            <span>Skip</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCorrect}
            className="py-4 rounded-xl bg-electric-cyan/10 border border-electric-cyan/40 text-electric-cyan font-bold flex flex-col items-center gap-1"
          >
            <Check className="w-5 h-5" />
            <span>Correct</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
