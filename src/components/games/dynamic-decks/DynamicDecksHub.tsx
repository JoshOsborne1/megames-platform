"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Difficulty, GameMode } from "@/lib/games/dynamic-decks/types";
import {
  createInitialState,
  drawNextCard,
  handleCorrect,
  handleCorrectByPlayer,
  handlePass,
  startNextTurn,
  endTurn,
  DIFFICULTY_MULTIPLIERS
} from "@/lib/games/dynamic-decks/gameLogic";

import { DynamicCard } from "./DynamicCard";
import { GameSetup } from "./GameSetup";
import { InGameNav } from "../shared";
import { Timer, Trophy, ArrowRight, Check, X, Info, Zap, ShieldAlert, Shuffle, Smile, Brain, Flame, Crown, Users2 } from "lucide-react";

const DIFFICULTY_OPTIONS: { id: Difficulty; label: string; icon: React.ReactNode; description: string; multiplier: string; color: string }[] = [
  { id: "easy", label: "Easy", icon: <Smile className="w-5 h-5" />, description: "2 forbidden words", multiplier: "1x", color: "#00f5ff" },
  { id: "medium", label: "Medium", icon: <Brain className="w-5 h-5" />, description: "3 forbidden words", multiplier: "1.5x", color: "#ff9f1c" },
  { id: "hard", label: "Hard", icon: <Flame className="w-5 h-5" />, description: "4 forbidden words", multiplier: "2x", color: "#ff006e" },
];

export function DynamicDecksHub() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");

  const startNewGame = (players: string[], rounds: number, deckId: string, gameMode: GameMode) => {
    // Start with easy difficulty, will be selected per-round
    const initialState = createInitialState(players, "easy", rounds, deckId, gameMode);
    setGameState({ ...initialState, phase: "instructions" });
  };

  const beginRound = () => {
    if (!gameState) return;
    // Apply the selected difficulty for this round
    const stateWithDifficulty = {
      ...gameState,
      difficulty: selectedDifficulty,
    };
    // Force reload cards to match the new difficulty
    const stateWithCard = drawNextCard({
      ...stateWithDifficulty,
      phase: "playing",
      timer: 60,
      skipsUsed: 0,
      roundScore: 0,
      cardsInRound: 0
    }, true); // forceReload = true
    setGameState(stateWithCard);
  };

  const onCorrect = () => {
    if (!gameState) return;
    setGameState(handleCorrect(gameState));
  };

  // QM Mode: Award points to the player who answered correctly
  const onCorrectPlayer = (playerId: string) => {
    if (!gameState) return;
    setGameState(handleCorrectByPlayer(gameState, playerId));
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
        gameName="Dynamic Decks"
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
            className="bg-[#1a0f2e]/80 backdrop-blur-xl border-2 border-[#00f5ff]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-full text-[#00f5ff] font-pixel text-[9px] sm:text-[10px] mb-4 sm:mb-6">
              {gameState.gameMode === "question-master" ? (
                <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Info className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {gameState.gameMode === "question-master" ? "QUESTION MASTER MODE" : "UP NEXT"}
            </div>

            {gameState.gameMode === "question-master" ? (
              /* QM Mode: Show QM and list of guessers */
              <div className="mb-4 sm:mb-6 text-left">
                <div className="p-3 sm:p-5 bg-white/5 rounded-xl border border-white/10 mb-3">
                  <span className="text-[8px] sm:text-[10px] font-pixel text-white/30 uppercase tracking-wider block">Question Master</span>
                  <div className="text-lg sm:text-2xl font-display font-black text-[#8338ec] uppercase tracking-wider truncate flex items-center gap-2">
                    <Crown className="w-5 h-5" /> {clueGiver.name}
                  </div>
                  <p className="text-white/60 font-space text-[10px] sm:text-xs">Pass the phone to {clueGiver.name}</p>
                </div>
                <div className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[8px] sm:text-[10px] font-pixel text-white/30 uppercase tracking-wider block mb-2">Guessers (Everyone Else)</span>
                  <div className="flex flex-wrap gap-2">
                    {gameState.players.filter(p => p.id !== clueGiver.id).map(p => (
                      <span key={p.id} className="px-2 py-1 bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-lg text-[#00f5ff] font-display font-bold text-xs uppercase">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Classic Mode: Show Clue Giver and Guesser */
              <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6 text-left">
                <div className="space-y-2 p-3 sm:p-5 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[8px] sm:text-[10px] font-pixel text-white/30 uppercase tracking-wider block">Clue Giver</span>
                  <div className="text-lg sm:text-2xl font-display font-black text-[#ff006e] uppercase tracking-wider truncate">{clueGiver.name}</div>
                  <p className="text-white/60 font-space text-[10px] sm:text-xs hidden sm:block">Pass the phone to {clueGiver.name}</p>
                </div>
                <div className="space-y-2 p-3 sm:p-5 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[8px] sm:text-[10px] font-pixel text-white/30 uppercase tracking-wider block">Guesser</span>
                  <div className="text-lg sm:text-2xl font-display font-black text-[#00f5ff] uppercase tracking-wider truncate">{guesser.name}</div>
                  <p className="text-white/60 font-space text-[10px] sm:text-xs hidden sm:block">Guess the word!</p>
                </div>
              </div>
            )}

            {/* Local Leaderboard */}
            <div className="mb-8 text-left">
              <div className="flex items-center gap-2 mb-3 text-white/30">
                <Trophy className="w-4 h-4" />
                <h4 className="font-pixel text-[10px] uppercase tracking-widest">Current Leaderboard</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[...gameState.players].sort((a, b) => b.score - a.score).map((p, i) => (
                  <div key={p.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-[10px] text-white/20">{i + 1}</span>
                      <span className="font-space font-bold text-white text-xs uppercase">{p.name}</span>
                    </div>
                    <span className="font-display font-black text-[#00f5ff] text-sm">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-Round Difficulty Selection */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 text-[#39ff14]">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="font-display font-bold text-sm sm:text-lg uppercase tracking-wider">Select Difficulty</h3>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xl mx-auto">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedDifficulty(option.id)}
                    className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all touch-manipulation ${selectedDifficulty === option.id
                      ? "border-white/40 bg-white/10"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}
                    style={{
                      borderColor: selectedDifficulty === option.id ? option.color : undefined,
                      boxShadow: selectedDifficulty === option.id ? `0 0 15px ${option.color}30` : undefined,
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <div
                      className="flex justify-center mb-1 sm:mb-2"
                      style={{ color: selectedDifficulty === option.id ? option.color : "rgba(255,255,255,0.5)" }}
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5">{option.icon}</div>
                    </div>
                    <div
                      className="font-bold text-[10px] sm:text-sm text-center"
                      style={{ color: selectedDifficulty === option.id ? option.color : "white" }}
                    >
                      {option.label}
                    </div>
                    <div className="hidden sm:block text-[9px] text-white/40 text-center mt-1">{option.description}</div>
                    <div
                      className="text-[9px] sm:text-xs font-bold text-center mt-1 sm:mt-2"
                      style={{ color: selectedDifficulty === option.id ? "#00f5ff" : "rgba(255,255,255,0.3)" }}
                    >
                      {option.multiplier}
                    </div>
                  </button>
                ))}
              </div>

              {/* Multiplier Explanation - Hidden on mobile for space */}
              <div className="hidden sm:block mt-3 p-2 bg-white/5 border border-white/10 rounded-lg max-w-sm mx-auto">
                <p className="text-white/60 text-[10px] text-center">
                  {selectedDifficulty === "easy" ? (
                    <>2 forbidden words, <span className="text-[#00f5ff] font-bold">×1</span> pts</>
                  ) : selectedDifficulty === "medium" ? (
                    <>3 forbidden words, <span className="text-[#ff9f1c] font-bold">×1.5</span> pts</>
                  ) : (
                    <>4 forbidden words, <span className="text-[#ff006e] font-bold">×2</span> pts</>
                  )}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={beginRound}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-[#00f5ff] text-[#1a0f2e] rounded-xl sm:rounded-2xl font-display font-black text-lg sm:text-2xl uppercase tracking-tighter shadow-[0_0_20px_rgba(0,245,255,0.4)] touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
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
            className="flex flex-col items-center w-full px-4 sm:px-0"
          >
            {/* HUD - Mobile optimized */}
            <div className="w-full grid grid-cols-3 items-center mb-6 sm:mb-10">
              <div className="flex flex-col">
                {gameState.gameMode === "question-master" ? (
                  /* QM Mode: Show QM indicator instead of cumulative score */
                  <>
                    <span className="text-[8px] sm:text-[10px] font-pixel text-white/30 uppercase tracking-widest">QM</span>
                    <span className="text-lg sm:text-xl font-display font-black text-[#8338ec] truncate">{clueGiver.name}</span>
                  </>
                ) : (
                  /* Classic Mode: Show cumulative score */
                  <>
                    <span className="text-[8px] sm:text-[10px] font-pixel text-white/30 uppercase tracking-widest">Score</span>
                    <span className="text-2xl sm:text-3xl font-display font-black text-[#ff006e]">{gameState.roundScore}</span>
                  </>
                )}
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] sm:border-4 flex items-center justify-center font-display font-black text-xl sm:text-2xl transition-colors ${gameState.timer <= 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-[#00f5ff] text-[#00f5ff]'}`}>
                    {gameState.timer}
                  </div>
                  <Timer className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 p-0.5 sm:p-1 rounded-full bg-black border-2 transition-colors ${gameState.timer <= 10 ? 'border-red-500 text-red-500' : 'border-[#00f5ff] text-[#00f5ff]'}`} />
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[8px] sm:text-[10px] font-pixel text-white/30 uppercase tracking-widest">Done</span>
                <span className="text-2xl sm:text-3xl font-display font-black text-[#8338ec]">{gameState.cardsInRound}</span>
              </div>
            </div>

            <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/5 border border-white/10 rounded-full">
                <span className="font-pixel text-[8px] sm:text-[10px] text-white/40 uppercase mr-1 sm:mr-2">Skips:</span>
                <span className="font-display font-black text-[#ff006e] text-sm sm:text-base">{gameState.skipsUsed}</span>
              </div>
            </div>

            <DynamicCard card={gameState.currentCard} difficulty={gameState.difficulty} deckId={gameState.deckId} />

            {/* Controls - Touch-friendly mobile buttons */}
            {gameState.gameMode === "question-master" ? (
              /* QM Mode: Pass button + Player name buttons */
              <div className="w-full mt-4 sm:mt-10 max-w-lg px-2">
                <div className="mb-2 sm:mb-3 text-center">
                  <span className="text-[10px] sm:text-xs font-pixel text-white/40 uppercase tracking-wider">Who got it right?</span>
                </div>
                <div className={`grid gap-2 sm:gap-3 mb-3 ${gameState.players.length <= 3 ? 'grid-cols-2' :
                    gameState.players.length <= 5 ? 'grid-cols-2 sm:grid-cols-3' :
                      'grid-cols-3 sm:grid-cols-4'
                  }`}>
                  {gameState.players.filter(p => p.id !== clueGiver.id).map((player) => (
                    <motion.button
                      key={player.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCorrectPlayer(player.id)}
                      className="group min-h-[56px] sm:min-h-[64px] py-2 sm:py-3 bg-[#00f5ff]/10 border-2 border-[#00f5ff]/40 active:bg-[#00f5ff]/30 rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all shadow-[0_0_15px_rgba(0,245,255,0.1)] touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Check className="w-4 h-4 text-[#00f5ff]" />
                      <span className="font-display font-bold text-[10px] sm:text-xs text-[#00f5ff] uppercase tracking-wider truncate max-w-full px-1">
                        {player.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onPass}
                  className="w-full py-3 sm:py-4 bg-white/5 border-2 border-white/10 active:border-white/30 rounded-xl flex items-center justify-center gap-2 transition-colors touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <X className="w-5 h-5 text-white/40" />
                  <span className="font-display font-bold text-sm text-white/60 uppercase tracking-wider">Pass / Skip</span>
                </motion.button>
              </div>
            ) : (
              /* Classic Mode: Pass and Correct buttons */
              <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full mt-6 sm:mt-10 max-w-md">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onPass}
                  className="group py-4 sm:py-5 bg-white/5 border-2 border-white/10 active:border-white/30 rounded-xl sm:rounded-2xl flex flex-col items-center gap-1.5 sm:gap-2 transition-colors touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/40 group-active:text-white" />
                  <span className="font-display font-bold text-sm sm:text-base text-white/60 group-active:text-white uppercase tracking-wider">Pass</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onCorrect}
                  className="group py-4 sm:py-5 bg-[#00f5ff]/10 border-2 border-[#00f5ff]/40 active:bg-[#00f5ff]/20 rounded-xl sm:rounded-2xl flex flex-col items-center gap-1.5 sm:gap-2 transition-all shadow-[0_0_20px_rgba(0,245,255,0.1)] touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#00f5ff]" />
                  <span className="font-display font-bold text-sm sm:text-base text-[#00f5ff] uppercase tracking-wider">Correct</span>
                </motion.button>
              </div>
            )}
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
                <span className="text-[#39ff14] font-display font-bold text-sm">
                  {gameState.gameMode === "question-master" ? `${clueGiver.name}'s Turn Complete` : "Round Complete"}
                </span>
              </div>
              {gameState.gameMode === "question-master" ? (
                /* QM Mode: Just show cards completed, no cumulative score */
                <>
                  <h3 className="font-display font-black text-2xl text-white">
                    <span className="text-[#00f5ff]">{gameState.cardsInRound}</span> Cards Completed
                  </h3>
                  <p className="text-white/40 text-sm font-space mt-1">
                    Check the leaderboard for individual scores
                  </p>
                </>
              ) : (
                /* Classic Mode: Show guesser's score */
                <>
                  <h3 className="font-display font-black text-2xl text-white">
                    {guesser.name} scored <span className="text-[#ff006e]">+{gameState.roundScore}</span>
                  </h3>
                  <p className="text-white/40 text-sm font-space mt-1">
                    {gameState.cardsInRound} cards completed
                  </p>
                </>
              )}
            </div>

            {/* Leaderboard */}
            <div className="bg-[#1a0f2e]/80 border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 text-white/40 mb-3">
                <Trophy className="w-4 h-4" />
                <span className="text-[10px] font-pixel uppercase tracking-widest">Leaderboard</span>
              </div>

              <div className="space-y-2">
                {[...gameState.players].sort((a, b) => b.score - a.score).map((player, i) => {
                  // In QM mode, highlight if player scored this round (not just guesser)
                  // For simplicity, we highlight the current guesser in classic mode
                  const justScored = gameState.gameMode === "question-master"
                    ? player.id !== clueGiver.id // In QM mode, all non-QM players could have scored
                    : player.id === guesser.id;
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${i === 0
                        ? 'bg-yellow-500/10 border border-yellow-500/30'
                        : 'bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'
                          }`}>
                          {i + 1}
                        </span>
                        <span className="font-display font-bold text-white">{player.name}</span>
                        {player.id === clueGiver.id && gameState.gameMode === "question-master" && (
                          <span className="text-[10px] font-pixel text-[#8338ec] bg-[#8338ec]/10 px-2 py-0.5 rounded">
                            QM
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
              <span className="font-space">
                {gameState.gameMode === "question-master"
                  ? `Next QM: ${gameState.players[(gameState.clueGiverIndex + 1) % gameState.players.length]?.name}`
                  : `Next: ${gameState.players[(gameState.currentPlayerIndex + 1) % gameState.players.length]?.name}`
                }
              </span>
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
            className="bg-[#1a0f2e]/80 backdrop-blur-xl border-2 border-[#ff006e]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center mx-4 sm:mx-0"
          >
            <Trophy className="w-16 h-16 sm:w-24 sm:h-24 text-yellow-500 mx-auto mb-4 sm:mb-8 animate-bounce" />
            <h2 className="font-display font-black text-3xl sm:text-5xl md:text-7xl text-white mb-4 sm:mb-8 tracking-tighter uppercase">Final Scores</h2>

            <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-12">
              {[...gameState.players].sort((a, b) => b.score - a.score).map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center justify-between p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 ${i === 0 ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'bg-white/5 border-white/10'}`}
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-display font-black text-sm sm:text-base ${i === 0 ? 'bg-yellow-500 text-[#1a0f2e]' : 'bg-white/10 text-white'}`}>
                      {i + 1}
                    </span>
                    <span className="text-base sm:text-2xl font-display font-bold text-white uppercase">{player.name}</span>
                  </div>
                  <span className={`text-lg sm:text-2xl font-display font-black ${i === 0 ? 'text-yellow-500' : 'text-[#00f5ff]'}`}>{player.score} PTS</span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white text-black font-display font-black text-base sm:text-xl rounded-xl sm:rounded-2xl uppercase tracking-widest active:scale-95 transition-transform touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
