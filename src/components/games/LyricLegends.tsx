"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Play, SkipForward, Check, Mic2, X, Plus, Trash2, Users, ChevronRight } from "lucide-react";
import { LYRIC_WORDS } from "@/lib/games/lyric-legends/data";
import { createInitialPlayers, InGameNav, type Player as SharedPlayer, WatchAdButton } from "./shared";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useRoom } from "@/context/RoomContext";

type GameState = "setup" | "ready" | "countdown" | "round" | "winner-selection" | "leaderboard" | "game-over";

interface GamePlayer {
  id: string;
  name: string;
  score: number;
}

export default function LyricLegendsGame({ mode = "local" }: { mode?: "local" | "online" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room");
  const { room } = useRoom();

  // Check if we're coming from a multiplayer room
  const isFromRoom = mode === "online" && roomCode && room.isActive;

  const [gameState, setGameState] = useState<GameState>(isFromRoom ? "ready" : "setup");
  const [sharedPlayers, setSharedPlayers] = useState<SharedPlayer[]>(() => {
    // If from room, use room players
    if (isFromRoom && room.players.length > 0) {
      return room.players.map(p => ({ id: p.id, name: p.name }));
    }
    return createInitialPlayers();
  });
  const [players, setPlayers] = useState<GamePlayer[]>(() => {
    // If from room, initialize game players
    if (isFromRoom && room.players.length > 0) {
      return room.players.map(p => ({ id: p.id, name: p.name, score: 0 }));
    }
    return [];
  });
  const [currentWord, setCurrentWord] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [roundCount, setRoundCount] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  const MAX_ROUNDS = 10;
  const WINNING_SCORE = 100;

  const getNewWord = () => {
    let availableWords = LYRIC_WORDS.filter(w => !usedWords.has(w));
    if (availableWords.length === 0) {
      setUsedWords(new Set());
      availableWords = LYRIC_WORDS;
    }
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setUsedWords(prev => new Set(prev).add(word));
    return word;
  };

  const startGame = () => {
    if (sharedPlayers.length >= 2 && sharedPlayers.every(p => p.name.trim())) {
      const gamePlayers: GamePlayer[] = sharedPlayers.map(p => ({ id: p.id, name: p.name, score: 0 }));
      setPlayers(gamePlayers);
      setGameState("ready");
    }
  };

  const startRound = () => {
    setGameState("countdown");
    setCountdown(3);
  };

  const handleSkip = () => {
    setCountdown(3);
    setGameState("countdown");
  };

  useEffect(() => {
    if (gameState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "countdown" && countdown === 0) {
      setCurrentWord(getNewWord());
      setGameState("round");
    }
  }, [gameState, countdown]);

  const selectWinner = (playerId: string) => {
    const updatedPlayers = players.map(p => p.id === playerId ? { ...p, score: p.score + 10 } : p);
    setPlayers(updatedPlayers);
    const newRoundCount = roundCount + 1;
    setRoundCount(newRoundCount);

    const winner = updatedPlayers.find(p => p.score >= WINNING_SCORE);
    if (winner || newRoundCount >= MAX_ROUNDS) {
      setGameState("game-over");
      if (winner) confetti();
    } else {
      setGameState("leaderboard");
    }
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
    setRoundCount(0);
    setGameState("ready");
    setUsedWords(new Set());
  };

  // Player management
  const addPlayer = () => {
    if (!newPlayerName.trim() || sharedPlayers.length >= 10) return;
    setSharedPlayers([...sharedPlayers, { id: `player-${Date.now()}`, name: newPlayerName.trim() }]);
    setNewPlayerName("");
  };

  const removePlayer = (id: string) => setSharedPlayers(sharedPlayers.filter(p => p.id !== id));
  const updatePlayerName = (id: string, name: string) => setSharedPlayers(sharedPlayers.map(p => p.id === id ? { ...p, name } : p));
  const canStart = sharedPlayers.length >= 2 && sharedPlayers.every(p => p.name.trim());

  // Handle leaving - if from room, go back to multiplayer room, otherwise local setup
  const handleLeave = () => {
    if (isFromRoom) {
      router.push("/multiplayer");
    } else {
      setGameState("setup");
    }
  };

  // If online mode without a room, redirect to multiplayer to create one
  if (mode === "online" && !isFromRoom && gameState === "setup") {
    router.push("/multiplayer?game=lyric-legends");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0015] text-white">
      {/* In-Game Navigation */}
      {gameState !== "setup" && (
        <InGameNav
          gameName="Lyric Legends"
          accentColor="#FF00FF"
          gameIcon={<Mic2 className="w-full h-full" />}
          showConfirmation={gameState !== "game-over"}
          onConfirmLeave={handleLeave}
        />
      )}

      <div className="max-w-md mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {/* SETUP SCREEN */}
          {gameState === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-4"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <Link href="/games" className="inline-block mb-3">
                  <span className="text-white/40 text-sm hover:text-white/60 transition-colors">← Back</span>
                </Link>
                <h1 className="font-display font-bold text-2xl text-white">Lyric Legends</h1>
                <p className="text-white/40 text-sm">Be the fastest to sing a lyric!</p>
              </div>

              {/* Game Info Card */}
              <div className="p-4 rounded-xl bg-[#FF00FF]/10 border border-[#FF00FF]/30 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FF00FF]/20 flex items-center justify-center">
                    <Mic2 className="w-5 h-5 text-[#FF00FF]" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white">How to Play</h4>
                    <p className="text-white/40 text-xs">First to 100 points wins!</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  A word will appear on screen. Be the first to sing a real song lyric containing that word to score 10 points!
                </p>
              </div>

              {/* Players Button */}
              <button
                onClick={() => setShowPlayersModal(true)}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FF00FF]" />
                  <span className="text-sm text-white font-medium">{sharedPlayers.length} Players</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>

              <div className="mb-6">
                <WatchAdButton
                  variant="card"
                  label="More Words"
                  description="Unlock +10% more lyric challenges"
                  onReward={() => { }}
                />
              </div>

              {/* Start Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                disabled={!canStart}
                className="w-full py-4 rounded-xl bg-[#FF00FF] text-white font-display font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Start Game <ChevronRight className="w-5 h-5" />
              </motion.button>

              {!canStart && (
                <p className="text-center text-white/30 text-xs mt-2">Need at least 2 players with names</p>
              )}
            </motion.div>
          )}

          {/* READY SCREEN */}
          {gameState === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex flex-col items-center justify-center -mt-16"
            >
              <p className="text-white/40 text-sm uppercase tracking-wider mb-4">Ready to Rock?</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startRound}
                className="w-40 h-40 rounded-full bg-[#FF00FF] flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,0,255,0.4)]"
              >
                <Play className="w-12 h-12 text-white fill-white mb-1" />
                <span className="font-display font-bold text-sm uppercase">Start</span>
              </motion.button>
            </motion.div>
          )}

          {/* COUNTDOWN */}
          {gameState === "countdown" && (
            <motion.div
              key="countdown"
              className="min-h-screen flex items-center justify-center -mt-16"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-9xl font-display font-black text-[#FF00FF]"
              >
                {countdown === 0 ? "GO!" : countdown}
              </motion.div>
            </motion.div>
          )}

          {/* ROUND - The Word Display */}
          {gameState === "round" && (
            <motion.div
              key="round"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-screen flex flex-col items-center justify-center -mt-16 text-center"
            >
              <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Sing a lyric with...</p>
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl sm:text-7xl font-display font-black text-[#FF00FF] mb-8 uppercase"
                style={{ textShadow: "0 0 40px rgba(255,0,255,0.5)" }}
              >
                {currentWord}
              </motion.h1>

              <div className="flex gap-3 w-full max-w-sm">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold flex flex-col items-center gap-1"
                >
                  <SkipForward className="w-5 h-5" />
                  <span className="text-sm">Skip</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState("winner-selection")}
                  className="flex-[2] py-4 rounded-xl bg-emerald-500 text-white font-bold flex flex-col items-center gap-1"
                >
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Someone Sang!</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* WINNER SELECTION */}
          {gameState === "winner-selection" && (
            <motion.div
              key="winner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-20"
            >
              <h2 className="text-center text-white/50 text-sm uppercase tracking-wider mb-2">Who was fastest?</h2>
              <h3 className="text-center font-display font-bold text-xl text-white mb-6">Select the winner</h3>

              <div className="space-y-2 mb-4">
                {players.map(p => (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectWinner(p.id)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF00FF]/50 hover:bg-[#FF00FF]/10 transition-all flex items-center justify-between"
                  >
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-white/40 text-sm">{p.score} pts</span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setGameState("leaderboard")}
                className="w-full py-3 text-white/30 text-sm hover:text-white/50 transition-colors"
              >
                No one sang correctly...
              </button>
            </motion.div>
          )}

          {/* LEADERBOARD */}
          {gameState === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-20"
            >
              <div className="text-center mb-6">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h2 className="font-display font-bold text-xl text-white">Leaderboard</h2>
                <p className="text-white/40 text-sm">Round {roundCount}/{MAX_ROUNDS}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <div className="space-y-2">
                  {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/50'}`}>{i + 1}</span>
                        <span className="font-medium text-white">{p.name}</span>
                      </div>
                      <span className={`font-display font-bold ${i === 0 ? 'text-yellow-500' : 'text-white/60'}`}>{p.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startRound}
                className="w-full py-4 rounded-xl bg-[#FF00FF] text-white font-display font-bold text-lg flex items-center justify-center gap-2"
              >
                Next Round <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* GAME OVER */}
          {gameState === "game-over" && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-screen flex flex-col items-center justify-center -mt-16 text-center"
            >
              <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
              <h2 className="font-display font-black text-3xl text-white mb-2">Game Over!</h2>
              <p className="text-white/40 mb-6">The champion is...</p>
              <h1 className="font-display font-black text-4xl text-[#FF00FF] mb-8">
                {[...players].sort((a, b) => b.score - a.score)[0]?.name}
              </h1>

              <div className="w-full max-w-xs space-y-3">
                {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? 'bg-yellow-500/10 border border-yellow-500' : 'bg-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/50'}`}>{i + 1}</span>
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                    <span className={`font-bold ${i === 0 ? 'text-yellow-500' : 'text-white/50'}`}>{p.score}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={resetGame}
                className="mt-8 w-full max-w-xs py-4 rounded-xl bg-white text-black font-display font-bold"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PLAYERS MODAL */}
      <AnimatePresence>
        {showPlayersModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlayersModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm z-50"
            >
              <div className="bg-[#0a0015] border border-white/10 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[#FF00FF]">
                    <Users className="w-5 h-5" />
                    <h3 className="font-display font-bold text-lg">Players</h3>
                  </div>
                  <button onClick={() => setShowPlayersModal(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {sharedPlayers.map((player, i) => (
                    <div key={player.id} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg">
                      <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white/50">{i + 1}</span>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                        className="flex-1 bg-transparent outline-none text-white text-sm min-w-0"
                        placeholder={`Player ${i + 1}`}
                      />
                      <button
                        onClick={() => removePlayer(player.id)}
                        disabled={sharedPlayers.length <= 2}
                        className="p-1.5 text-white/20 hover:text-red-500 disabled:opacity-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {sharedPlayers.length < 10 && (
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                      placeholder="Add player..."
                      maxLength={15}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
                    />
                    <button
                      onClick={addPlayer}
                      disabled={!newPlayerName.trim()}
                      className="px-3 bg-[#FF00FF]/20 text-[#FF00FF] hover:bg-[#FF00FF]/30 rounded-lg disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowPlayersModal(false)}
                  className="w-full py-3 rounded-xl bg-[#FF00FF] text-white font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Done ({sharedPlayers.length} players)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
