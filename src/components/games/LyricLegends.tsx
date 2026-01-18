"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Play, SkipForward, Check, Mic2, Users, ChevronRight } from "lucide-react";
import { LYRIC_WORDS } from "@/lib/games/lyric-legends/data";
import { InGameNav, WatchAdButton, PlayersModal, InfoButton, UniversalGameSetup, type GameStartConfig } from "./shared";
import { usePlayerSetup } from "@/hooks/usePlayerSetup";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useRoom } from "@/context/RoomContext";
import { useAppShell } from "@/components/AppShell";

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
  const { setFullscreen } = useAppShell();

  // Check if we're coming from a multiplayer room
  const isFromRoom = mode === "online" && roomCode && room.isActive;

  // Use shared player management hook with room-based initial players
  const initialPlayers = isFromRoom && room.players.length > 0
    ? room.players.map(p => ({ id: p.id, name: p.name }))
    : [];

  const {
    players: sharedPlayers,
    newPlayerName,
    setNewPlayerName,
    addPlayer,
    removePlayer,
    updatePlayerName,
    canStart,
    canAddMore,
    canRemove,
    setPlayers: setSharedPlayers,
  } = usePlayerSetup({ minPlayers: 2, maxPlayers: 10, initialPlayers });

  const [gameState, setGameState] = useState<GameState>(isFromRoom ? "ready" : "setup");
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

  const MAX_ROUNDS = 10;
  const WINNING_SCORE = 100;

  // Control bottom nav visibility based on game state
  useEffect(() => {
    setFullscreen(gameState !== "setup");
  }, [gameState, setFullscreen]);

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
    <div className={`min-h-screen text-white ${gameState === "setup" ? "pb-24" : ""}`}>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UniversalGameSetup
                gameName="Lyric Legends"
                gameId="lyric-legends"
                accentColor="#FF00FF"
                minPlayers={2}
                maxPlayers={10}
                showRounds={false}
                showTimer={false}
                rulesContent="A word will appear on screen. Be the first to sing a real song lyric containing that word to score 10 points! First to 100 points wins."
                onStartGame={(config) => {
                  const gamePlayers: GamePlayer[] = config.players.map(p => ({ 
                    id: p.id, 
                    name: p.name, 
                    score: 0 
                  }));
                  setPlayers(gamePlayers);
                  setSharedPlayers(config.players);
                  setGameState("ready");
                }}
              >
                <WatchAdButton
                  variant="card"
                  label="More Words"
                  description="Unlock +10% more lyric challenges"
                  onReward={() => { }}
                />
              </UniversalGameSetup>
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
      <PlayersModal
        isOpen={showPlayersModal}
        onClose={() => setShowPlayersModal(false)}
        players={sharedPlayers}
        newPlayerName={newPlayerName}
        onNewPlayerNameChange={setNewPlayerName}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onUpdatePlayerName={updatePlayerName}
        canAddMore={canAddMore}
        canRemove={canRemove}
        accentColor="#FF00FF"
      />
    </div>
  );
}
