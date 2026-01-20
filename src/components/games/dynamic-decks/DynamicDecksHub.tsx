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
} from "@/lib/games/dynamic-decks/gameLogic";

import { DynamicCard } from "./DynamicCard";
import { GameSetup } from "./GameSetup";
import { MultiplayerDynamicDecks } from "./MultiplayerDynamicDecks";
import { InGameNav } from "../shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoom } from "@/context/RoomContext";
import { Trophy, ArrowRight, Check, X, Zap, ShieldAlert, Smile, Brain, Flame, Crown, ChevronRight } from "lucide-react";
import { useAppShell } from "@/components/AppShell";

const DIFFICULTY_OPTIONS: { id: Difficulty; label: string; icon: React.ReactNode; multiplier: string; color: string }[] = [
  { id: "easy", label: "Easy", icon: <Smile className="w-5 h-5" />, multiplier: "1x", color: "#00f5ff" },
  { id: "medium", label: "Medium", icon: <Brain className="w-5 h-5" />, multiplier: "1.5x", color: "#ff9f1c" },
  { id: "hard", label: "Hard", icon: <Flame className="w-5 h-5" />, multiplier: "2x", color: "#ff006e" },
];

export function DynamicDecksHub({ mode = "local" }: { mode?: "local" | "online" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room");
  const { room } = useRoom();
  const { setFullscreen } = useAppShell();

  // Check if we're coming from a multiplayer room
  const isFromRoom = mode === "online" && roomCode && room.isActive;

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");

  // Control bottom nav visibility based on game state
  useEffect(() => {
    setFullscreen(!!gameState);
  }, [gameState, setFullscreen]);

  const startNewGame = (players: string[], rounds: number, deckId: string, gameMode: GameMode) => {
    const initialState = createInitialState(players, "easy", rounds, deckId, gameMode);
    setGameState({ ...initialState, phase: "instructions" });
  };

  const beginRound = () => {
    if (!gameState) return;
    const stateWithDifficulty = { ...gameState, difficulty: selectedDifficulty };
    const stateWithCard = drawNextCard({
      ...stateWithDifficulty,
      phase: "playing",
      timer: 60,
      skipsUsed: 0,
      roundScore: 0,
      cardsInRound: 0
    }, true);
    setGameState(stateWithCard);
  };

  const onCorrect = () => {
    if (!gameState) return;
    setGameState(handleCorrect(gameState));
  };

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

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState?.phase === "playing" && gameState.timer > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (!prev) return prev;
          const newTimer = prev.timer - 1;
          if (newTimer <= 0) return endTurn(prev);
          return { ...prev, timer: newTimer };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState?.phase, gameState?.timer]);

  // Handle leaving - if from room, go back to multiplayer


  if (!gameState) {
    // If online mode with room, use multiplayer component
    if (mode === "online" && isFromRoom && roomCode) {
      const deckId = searchParams.get("deck") || "classic";
      return <MultiplayerDynamicDecks roomCode={roomCode} deckId={deckId} />;
    }
    
    // If online mode without room, redirect to multiplayer
    if (mode === "online" && !isFromRoom) {
      router.push("/multiplayer?game=dynamic-decks");
      return null;
    }
    return (
      <div className="min-h-screen pb-24">
        <GameSetup onStart={startNewGame} />
      </div>
    );
  }

  const clueGiver = gameState.players[gameState.clueGiverIndex];
  const guesser = gameState.players[gameState.currentPlayerIndex];
  const isQMMode = gameState.gameMode === "question-master";

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-8">
      <InGameNav
        gameName="Dynamic Decks"
        accentColor="#ff006e"
        gameIcon={<ShieldAlert className="w-full h-full" />}
        showConfirmation={gameState.phase !== "game-over"}
        onConfirmLeave={() => setGameState(null)}
      />

      <AnimatePresence mode="wait">
        {/* INSTRUCTIONS / PRE-ROUND SCREEN */}
        {gameState.phase === "instructions" && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-4"
          >
            {/* Round Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-3">
                Round {gameState.currentRound} of {gameState.maxRounds}
              </div>
              <h2 className="font-display font-bold text-2xl text-white">
                {isQMMode ? "Question Master" : "Get Ready"}
              </h2>
            </div>

            {/* Player Cards */}
            <div className="space-y-3 mb-6">
              {isQMMode ? (
                <>
                  <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-neon-purple" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Question Master</p>
                        <p className="font-display font-bold text-lg text-white">{clueGiver.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-2">Guessers</p>
                    <div className="flex flex-wrap gap-2">
                      {gameState.players.filter(p => p.id !== clueGiver.id).map(p => (
                        <span key={p.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-medium">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-neon-pink/10 border border-neon-pink/30">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1">Clue Giver</p>
                    <p className="font-display font-bold text-lg text-neon-pink truncate">{clueGiver.name}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-electric-cyan/10 border border-electric-cyan/30">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1">Guesser</p>
                    <p className="font-display font-bold text-lg text-electric-cyan truncate">{guesser.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mini Leaderboard */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
              <div className="flex items-center gap-2 text-white/40 mb-3">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Standings</span>
              </div>
              <div className="space-y-2">
                {[...gameState.players].sort((a, b) => b.score - a.score).slice(0, 3).map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-white/40'}`}>{i + 1}</span>
                      <span className="text-sm text-white font-medium">{p.name}</span>
                    </div>
                    <span className={`font-display font-bold ${i === 0 ? 'text-yellow-500' : 'text-white/60'}`}>{p.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-white/50 mb-3">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Select Difficulty</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedDifficulty(opt.id)}
                    className={`p-3 rounded-xl border transition-all text-center ${selectedDifficulty === opt.id
                      ? 'border-white/30 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    style={{ borderColor: selectedDifficulty === opt.id ? opt.color : undefined }}
                  >
                    <div className="flex justify-center mb-1" style={{ color: selectedDifficulty === opt.id ? opt.color : 'rgba(255,255,255,0.4)' }}>
                      {opt.icon}
                    </div>
                    <div className="text-xs font-bold" style={{ color: selectedDifficulty === opt.id ? opt.color : 'white' }}>
                      {opt.label}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">{opt.multiplier}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={beginRound}
              className="w-full py-4 rounded-xl bg-neon-pink text-white font-display font-bold text-lg flex items-center justify-center gap-2"
            >
              Start Round <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* GAMEPLAY SCREEN */}
        {gameState.phase === "playing" && gameState.currentCard && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4"
          >
            {/* HUD */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">{isQMMode ? 'QM' : 'Score'}</p>
                <p className="font-display font-bold text-xl" style={{ color: isQMMode ? '#8338ec' : '#ff006e' }}>
                  {isQMMode ? clueGiver.name : gameState.roundScore}
                </p>
              </div>

              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-display font-black text-2xl ${gameState.timer <= 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-white/20 text-white'}`}>
                {gameState.timer}
              </div>

              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Cards</p>
                <p className="font-display font-bold text-xl text-white">{gameState.cardsInRound}</p>
              </div>
            </div>

            {/* Card */}
            <DynamicCard card={gameState.currentCard} difficulty={gameState.difficulty} deckId={gameState.deckId} />

            {/* Controls */}
            {isQMMode ? (
              <div className="mt-6 space-y-3">
                <p className="text-center text-xs text-white/40 uppercase tracking-wider mb-2">Who got it?</p>
                <div className="grid grid-cols-2 gap-2">
                  {gameState.players.filter(p => p.id !== clueGiver.id).map((player) => (
                    <motion.button
                      key={player.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCorrectPlayer(player.id)}
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
          </motion.div>
        )}

        {/* ROUND SUMMARY */}
        {gameState.phase === "round-summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-3">
                <Check className="w-3 h-3" /> Round Complete
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-1">
                {isQMMode ? `${gameState.cardsInRound} Cards` : `+${gameState.roundScore} Points`}
              </h2>
              <p className="text-white/40 text-sm">{isQMMode ? 'Check the leaderboard' : `${guesser.name}'s turn complete`}</p>
            </div>

            {/* Leaderboard */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
              <div className="flex items-center gap-2 text-white/40 mb-3">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Leaderboard</span>
              </div>
              <div className="space-y-2">
                {[...gameState.players].sort((a, b) => b.score - a.score).map((player, i) => (
                  <motion.div
                    key={player.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/50'}`}>{i + 1}</span>
                      <span className="font-medium text-white">{player.name}</span>
                      {player.id === clueGiver.id && isQMMode && (
                        <span className="text-[10px] bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded font-medium">QM</span>
                      )}
                    </div>
                    <span className={`font-display font-bold ${i === 0 ? 'text-yellow-500' : 'text-white/60'}`}>{player.score}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-white/40 mb-4">
              Round {gameState.currentRound}/{gameState.maxRounds}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={nextTurnHandler}
              className="w-full py-4 rounded-xl bg-neon-pink text-white font-display font-bold text-lg flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* GAME OVER */}
        {gameState.phase === "game-over" && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-8"
          >
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="font-display font-black text-3xl text-white mb-2">Game Over!</h2>
              <p className="text-white/50">Final Standings</p>
            </div>

            <div className="space-y-3 mb-8">
              {[...gameState.players].sort((a, b) => b.score - a.score).map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl ${i === 0
                    ? 'bg-yellow-500/10 border-2 border-yellow-500'
                    : 'bg-white/5 border border-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/50'
                      }`}>{i + 1}</span>
                    <span className="font-display font-bold text-lg text-white">{player.name}</span>
                  </div>
                  <span className={`font-display font-black text-xl ${i === 0 ? 'text-yellow-500' : 'text-white/60'}`}>
                    {player.score}
                  </span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 rounded-xl bg-white text-black font-display font-bold text-lg"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
