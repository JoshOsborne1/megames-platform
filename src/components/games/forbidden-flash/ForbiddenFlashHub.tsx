"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Difficulty } from "@/lib/games/forbidden-flash/types";
import { 
  createInitialState, 
  drawNextCard, 
  handleCorrect, 
  handlePass,
  startNextTurn 
} from "@/lib/games/forbidden-flash/gameLogic";
import { ForbiddenCard } from "./ForbiddenCard";
import { GameSetup } from "./GameSetup";
import { Timer, Trophy, ArrowRight, Check, X, Info } from "lucide-react";

export function ForbiddenFlashHub() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startNewGame = (players: string[], difficulty: Difficulty) => {
    const initialState = createInitialState(players, difficulty);
    setGameState({ ...initialState, phase: "instructions" });
  };

  const beginRound = () => {
    if (!gameState) return;
    const stateWithCard = drawNextCard({
       ...gameState,
       phase: "playing",
       timer: 60
    });
    setGameState(stateWithCard);
  };

  const onCorrect = () => {
    if (!gameState) return;
    setGameState(handleCorrect(gameState));
  };

  const onPass = () => {
    if (!gameState) return;
    setGameState(handlePass(gameState));
  };

  const nextTurnHandler = () => {
     if (!gameState) return;
     setGameState(startNextTurn(gameState));
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState?.phase === "playing" && gameState.timer > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev && prev.timer > 0) {
            return { ...prev, timer: prev.timer - 1 };
          }
          if (prev && prev.timer === 0) {
             return { ...prev, phase: "round-summary" };
          }
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState?.phase, gameState?.timer]);

  if (!gameState) {
    return <GameSetup onStart={startNewGame} />;
  }

  const clueGiver = gameState.players[gameState.clueGiverIndex];
  const guesser = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {gameState.phase === "instructions" && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="bg-[#1a0f2e]/80 backdrop-blur-xl border-2 border-[#00f5ff]/20 rounded-3xl p-10 text-center shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-full text-[#00f5ff] font-pixel text-[10px] mb-8">
              <Info className="w-4 h-4" />
              UP NEXT
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="space-y-4">
                <span className="text-[10px] font-pixel text-white/30 uppercase tracking-[0.2em] block">Clue Giver</span>
                <div className="text-4xl font-display font-black text-[#ff006e] uppercase tracking-wider">{clueGiver.name}</div>
                <p className="text-white/60 font-space text-sm px-4">Pass the phone to {clueGiver.name}. You see the word and the forbidden words!</p>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-pixel text-white/30 uppercase tracking-[0.2em] block">Guesser</span>
                <div className="text-4xl font-display font-black text-[#00f5ff] uppercase tracking-wider">{guesser.name}</div>
                <p className="text-white/60 font-space text-sm px-4">{guesser.name}, your job is to guess the secret word as fast as possible!</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={beginRound}
              className="px-12 py-5 bg-[#00f5ff] text-[#1a0f2e] rounded-2xl font-display font-black text-2xl uppercase tracking-tighter shadow-[0_0_30px_rgba(0,245,255,0.4)]"
            >
              Start Round
            </motion.button>
          </motion.div>
        )}

        {gameState.phase === "playing" && gameState.currentCard && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            {/* HUD */}
            <div className="w-full flex justify-between items-center mb-10 px-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-pixel text-white/30 uppercase tracking-widest">Team Score</span>
                <span className="text-3xl font-display font-black text-[#ff006e]">{gameState.roundScore}</span>
              </div>
              
              <div className="relative">
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center font-display font-black text-2xl transition-colors ${gameState.timer <= 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-[#00f5ff] text-[#00f5ff]'}`}>
                  {gameState.timer}
                </div>
                <Timer className={`absolute -bottom-1 -right-1 w-6 h-6 p-1 rounded-full bg-black border-2 transition-colors ${gameState.timer <= 10 ? 'border-red-500 text-red-500' : 'border-[#00f5ff] text-[#00f5ff]'}`} />
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-pixel text-white/30 uppercase tracking-widest">Cards</span>
                <span className="text-3xl font-display font-black text-[#8338ec]">{gameState.cardsInRound + 1}/{gameState.maxCardsInRound}</span>
              </div>
            </div>

            <ForbiddenCard card={gameState.currentCard} difficulty={gameState.difficulty} />

            {/* Controls */}
            <div className="grid grid-cols-2 gap-6 w-full mt-10 max-w-md">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPass}
                className="group py-5 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-2xl flex flex-col items-center gap-2 transition-colors"
              >
                <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                <span className="font-display font-bold text-white/60 group-hover:text-white uppercase tracking-wider">Pass</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCorrect}
                className="group py-5 bg-[#00f5ff]/10 border-2 border-[#00f5ff]/40 hover:bg-[#00f5ff]/20 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,245,255,0.1)]"
              >
                <Check className="w-6 h-6 text-[#00f5ff]" />
                <span className="font-display font-bold text-[#00f5ff] uppercase tracking-wider">Correct</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {gameState.phase === "round-summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a0f2e]/80 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-10 text-center shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff]" />
            
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="font-display font-black text-5xl text-white mb-2 uppercase tracking-tighter">Round Results</h2>
            <p className="text-white/40 font-space text-sm mb-10 uppercase tracking-[0.3em]">Performance Summary</p>

            <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/5">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <span className="text-[10px] font-pixel text-white/30 uppercase block mb-1">Guesser</span>
                  <div className="text-2xl font-display font-black text-[#00f5ff]">{guesser.name}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-pixel text-white/30 uppercase block mb-1">Earned</span>
                  <div className="text-2xl font-display font-black text-[#ff006e]">+{gameState.roundScore} PTS</div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTurnHandler}
              className="w-full py-5 bg-white text-[#1a0f2e] rounded-2xl font-display font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3"
            >
              Continue <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}

        {gameState.phase === "game-over" && (
           <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a0f2e]/80 backdrop-blur-xl border-2 border-[#ff006e]/30 rounded-3xl p-12 text-center"
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-8 animate-bounce" />
            <h2 className="font-display font-black text-7xl text-white mb-8 tracking-tighter uppercase glitch">Final Scores</h2>
            
            <div className="space-y-4 mb-12">
               {[...gameState.players].sort((a,b) => b.score - a.score).map((player, i) => (
                 <motion.div
                  key={player.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 ${i === 0 ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'bg-white/5 border-white/10'}`}
                 >
                   <div className="flex items-center gap-4">
                     <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black ${i === 0 ? 'bg-yellow-500 text-[#1a0f2e]' : 'bg-white/10 text-white'}`}>
                       {i + 1}
                     </span>
                     <span className="text-2xl font-display font-bold text-white uppercase">{player.name}</span>
                   </div>
                   <span className={`text-2xl font-display font-black ${i === 0 ? 'text-yellow-500' : 'text-[#00f5ff]'}`}>{player.score} PTS</span>
                 </motion.div>
               ))}
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="px-12 py-5 bg-white text-black font-display font-black text-xl rounded-2xl uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
