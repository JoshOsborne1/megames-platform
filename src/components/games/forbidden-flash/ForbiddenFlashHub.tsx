"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Difficulty } from "@/lib/games/forbidden-flash/types";
import {
  createInitialState,
  drawNextCard,
  handleCorrect,
  handlePass,
  startNextTurn,
  endTurn
} from "@/lib/games/forbidden-flash/gameLogic";

import { ForbiddenCard } from "./ForbiddenCard";
import { GameSetup } from "./GameSetup";
import { InGameNav } from "../shared";
import { Timer, Trophy, ArrowRight, Check, X, Info, Zap, ShieldAlert } from "lucide-react";

export function ForbiddenFlashHub() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");

  const startNewGame = (players: string[], rounds: number) => {
    const initialState = createInitialState(players, "medium", rounds);
    setGameState({ ...initialState, phase: "instructions" });
  };

  const beginRound = () => {
    if (!gameState) return;
    const stateWithCard = drawNextCard({
      ...gameState,
      difficulty: selectedDifficulty,
      phase: "playing",
      timer: 60,
      skipsUsed: 0,
      roundScore: 0,
      cardsInRound: 0
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

  // Timer logic - fixed to properly end game when timer hits 0
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState?.phase === "playing" && gameState.timer > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (!prev) return prev;
          const newTimer = prev.timer - 1;
          if (newTimer <= 0) {
            // Timer hit 0, end the game
            return endTurn(prev);
          }
          return { ...prev, timer: newTimer };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState?.phase, gameState?.timer]);

  // Dev shortcut: Up Up Down Down to set timer to 5s for quick testing
  useEffect(() => {
    const sequence: string[] = [];
    const targetSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown"];

    const handleKeyDown = (e: KeyboardEvent) => {
      sequence.push(e.key);
      // Keep only the last 4 keys
      if (sequence.length > 4) {
        sequence.shift();
      }
      // Check if sequence matches
      if (sequence.join(",") === targetSequence.join(",") && gameState?.phase === "playing") {
        setGameState(prev => prev ? { ...prev, timer: 5 } : prev);
        console.log("🎮 DEV MODE: Timer set to 5 seconds!");
        sequence.length = 0; // Reset sequence
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState?.phase]);

  if (!gameState) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <GameSetup onStart={startNewGame} />
      </div>
    );
  }

  const clueGiver = gameState.players[gameState.clueGiverIndex];
  const guesser = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* In-Game Navigation */}
      <InGameNav
        gameName="Forbidden Flash"
        accentColor="#ff006e"
        gameIcon={<ShieldAlert className="w-full h-full" />}
        showConfirmation={gameState.phase !== "game-over"}
        onConfirmLeave={() => setGameState(null)}
      />

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 text-left">
              <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-pixel text-white/30 uppercase tracking-[0.2em] block">Clue Giver</span>
                <div className="text-3xl font-display font-black text-[#ff006e] uppercase tracking-wider">{clueGiver.name}</div>
                <p className="text-white/60 font-space text-sm">Pass the phone to {clueGiver.name}. You see the word and the forbidden words!</p>
              </div>
              <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-pixel text-white/30 uppercase tracking-[0.2em] block">Guesser</span>
                <div className="text-3xl font-display font-black text-[#00f5ff] uppercase tracking-wider">{guesser.name}</div>
                <p className="text-white/60 font-space text-sm">{guesser.name}, your job is to guess the secret word as fast as possible!</p>
              </div>
            </div>

            {/* Local Leaderboard */}
            <div className="mb-10 text-left">
              <div className="flex items-center gap-2 mb-4 text-white/30">
                <Trophy className="w-4 h-4" />
                <h4 className="font-pixel text-[10px] uppercase tracking-widest">Current Leaderboard</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...gameState.players].sort((a, b) => b.score - a.score).map((p, i) => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-pixel text-[10px] text-white/20">{i + 1}</span>
                      <span className="font-space font-bold text-white text-sm uppercase">{p.name}</span>
                    </div>
                    <span className="font-display font-black text-[#00f5ff] text-sm">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-center gap-2 text-[#00f5ff]">
                <Zap className="w-5 h-5" />
                <h3 className="font-display font-bold text-xl uppercase tracking-wider">Select Difficulty</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`py-3 rounded-xl font-display font-black text-xs uppercase transition-all border-2 ${selectedDifficulty === d
                      ? "bg-[#00f5ff] text-[#1a0f2e] border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                      : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                      }`}
                  >
                    {d}
                  </button>
                ))}
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
            <div className="w-full grid grid-cols-3 items-center mb-10 px-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-pixel text-white/30 uppercase tracking-widest">Team Score</span>
                <span className="text-3xl font-display font-black text-[#ff006e]">{gameState.roundScore}</span>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center font-display font-black text-2xl transition-colors ${gameState.timer <= 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-[#00f5ff] text-[#00f5ff]'}`}>
                    {gameState.timer}
                  </div>
                  <Timer className={`absolute -bottom-1 -right-1 w-6 h-6 p-1 rounded-full bg-black border-2 transition-colors ${gameState.timer <= 10 ? 'border-red-500 text-red-500' : 'border-[#00f5ff] text-[#00f5ff]'}`} />
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-pixel text-white/30 uppercase tracking-widest">Answered</span>
                <span className="text-3xl font-display font-black text-[#8338ec]">{gameState.cardsInRound}</span>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <span className="font-pixel text-[10px] text-white/40 uppercase mr-2">Skips:</span>
                <span className="font-display font-black text-[#ff006e]">{gameState.skipsUsed}</span>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Round Result Header - Compact */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-full mb-3">
                <Check className="w-4 h-4 text-[#39ff14]" />
                <span className="text-[#39ff14] font-display font-bold text-sm">Round Complete</span>
              </div>
              <h3 className="font-display font-black text-2xl text-white">
                {guesser.name} scored <span className="text-[#ff006e]">+{gameState.roundScore}</span>
              </h3>
              <p className="text-white/40 text-sm font-space mt-1">
                {gameState.cardsInRound} cards completed
              </p>
            </div>

            {/* Leaderboard */}
            <div className="bg-[#1a0f2e]/80 border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 text-white/40 mb-3">
                <Trophy className="w-4 h-4" />
                <span className="text-[10px] font-pixel uppercase tracking-widest">Leaderboard</span>
              </div>

              <div className="space-y-2">
                {[...gameState.players].sort((a, b) => b.score - a.score).map((player, i) => {
                  const justScored = player.id === guesser.id;
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${i === 0
                          ? 'bg-yellow-500/10 border border-yellow-500/30'
                          : justScored
                            ? 'bg-[#ff006e]/10 border border-[#ff006e]/30'
                            : 'bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'
                          }`}>
                          {i + 1}
                        </span>
                        <span className="font-display font-bold text-white">{player.name}</span>
                        {justScored && (
                          <span className="text-[10px] font-pixel text-[#ff006e] bg-[#ff006e]/10 px-2 py-0.5 rounded">
                            +{gameState.roundScore}
                          </span>
                        )}
                      </div>
                      <span className={`font-display font-black ${i === 0 ? 'text-yellow-500' : 'text-[#00f5ff]'}`}>
                        {player.score}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Round Progress */}
            <div className="flex items-center justify-between text-sm text-white/40 mb-6 px-2">
              <span className="font-space">Round {gameState.currentRound}/{gameState.maxRounds}</span>
              <span className="font-space">Next: {gameState.players[(gameState.currentPlayerIndex + 1) % gameState.players.length]?.name}</span>
            </div>

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextTurnHandler}
              className="w-full py-4 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white rounded-xl font-display font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              Continue <ArrowRight className="w-5 h-5" />
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
              {[...gameState.players].sort((a, b) => b.score - a.score).map((player, i) => (
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
