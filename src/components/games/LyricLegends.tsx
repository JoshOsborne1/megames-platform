"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Play, RotateCcw, SkipForward, Check, Mic2, Star, Menu, X, Home, LayoutGrid, AlertCircle } from "lucide-react";
import { LYRIC_WORDS } from "@/lib/games/lyric-legends/data";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { GameLobby, PlayerManager, createInitialPlayers, type Player as SharedPlayer } from "./shared";

type GameState = "setup" | "lobby" | "countdown" | "round" | "winner-selection" | "leaderboard" | "game-over";

interface GamePlayer {
  id: string;
  name: string;
  score: number;
}

export default function LyricLegendsGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>("setup");
  const [sharedPlayers, setSharedPlayers] = useState<SharedPlayer[]>(createInitialPlayers(2));
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [roundCount, setRoundCount] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navConfirmTarget, setNavConfirmTarget] = useState<string | null>(null);

  const MAX_ROUNDS = 10;
  const WINNING_SCORE = 100;

  const handleNavigate = (path: string) => {
    if (gameState !== "setup" && gameState !== "game-over") {
      setNavConfirmTarget(path);
      setIsSidebarOpen(false);
    } else {
      router.push(path);
    }
  };

  const confirmNavigation = () => {
    if (navConfirmTarget) {
      router.push(navConfirmTarget);
    }
  };

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
    if (sharedPlayers.length >= 2) {
      // Convert shared players to game players with score
      const gamePlayers: GamePlayer[] = sharedPlayers.map(p => ({
        id: p.id,
        name: p.name,
        score: 0,
      }));
      setPlayers(gamePlayers);
      setGameState("lobby");
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
      const word = getNewWord();
      setCurrentWord(word);
      setGameState("round");
    }
  }, [gameState, countdown]);

  const selectWinner = (playerId: string) => {
    const updatedPlayers = players.map(p =>
      p.id === playerId ? { ...p, score: p.score + 10 } : p
    );
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
    setGameState("lobby");
    setUsedWords(new Set());
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white flex flex-col p-4 font-space overflow-hidden select-none relative">
      {/* Header with Hamburger */}
      <div className="absolute top-4 right-4 z-[60]">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors shadow-lg"
        >
          <Menu className="w-6 h-6 text-[#00f5ff]" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-[#1a142e] border-l border-white/10 p-6 z-[80] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-[#00f5ff] text-xl">MENU</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleNavigate("/")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <Home className="w-6 h-6 text-[#00f5ff] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg">Home</span>
                </button>
                <button
                  onClick={() => handleNavigate("/games")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <LayoutGrid className="w-6 h-6 text-[#ff006e] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg">Games collection</span>
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Mic2 className="w-5 h-5 text-[#00f5ff]" />
                  <span className="font-black text-xs uppercase tracking-widest text-white/40">Active Game</span>
                </div>
                <p className="font-bold text-sm">Lyric Legends</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation Confirmation Modal */}
      <AnimatePresence>
        {navConfirmTarget && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[100]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNavConfirmTarget(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#1a142e] border-2 border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black mb-4 text-center">END GAME?</h2>
              <p className="text-white/60 text-center mb-8 font-medium">
                Leaving now will end the current session and all scores will be lost!
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setNavConfirmTarget(null)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmNavigation}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 rounded-xl font-bold transition-colors"
                >
                  Quit Game
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {gameState === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex items-center justify-center"
          >
            <GameLobby
              title="Lyric Legends"
              subtitle="Sing a song with the word"
              icon={<Mic2 className="w-12 h-12" />}
              onStart={startGame}
              startButtonText="Start Game"
              startDisabled={sharedPlayers.length < 2}
              backUrl="/games"
              accentColor="#00f5ff"
            >
              <PlayerManager
                players={sharedPlayers}
                onPlayersChange={setSharedPlayers}
                minPlayers={2}
                maxPlayers={10}
                accentColor="#00f5ff"
              />
            </GameLobby>
          </motion.div>
        )}

        {gameState === "lobby" && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl text-white/50 mb-4">READY TO ROCK?</h2>
            <button
              onClick={startRound}
              className="w-64 h-64 rounded-full bg-gradient-to-br from-[#ff006e] to-[#ff00a0] flex flex-col items-center justify-center border-8 border-white/20 shadow-[0_0_50px_rgba(255,0,110,0.5)] hover:scale-110 active:scale-95 transition-all group"
            >
              <Play className="w-20 h-20 text-white mb-2 fill-white" />
              <span className="font-black text-2xl group-hover:tracking-widest transition-all">START ROUND</span>
            </button>
          </motion.div>
        )}

        {gameState === "countdown" && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 3, opacity: 0 }}
              className="text-9xl font-black italic text-gradient-neon"
            >
              {countdown === 0 ? "GO!" : countdown}
            </motion.div>
          </motion.div>
        )}

        {gameState === "round" && (
          <motion.div
            key="round"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-4 text-center"
          >
            <span className="text-white/40 text-xl font-bold mb-4 tracking-widest uppercase">SING THE WORD</span>
            <motion.h2
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-7xl md:text-9xl font-black mb-12 text-[#00f5ff] drop-shadow-[0_0_30px_rgba(0,245,255,0.6)] uppercase italic"
            >
              {currentWord}
            </motion.h2>
            <div className="flex gap-4 w-full max-w-lg">
              <button
                onClick={handleSkip}
                className="flex-1 bg-white/10 hover:bg-white/20 py-6 rounded-2xl flex flex-col items-center gap-2 border border-white/10 transition-colors"
              >
                <SkipForward className="w-8 h-8" />
                <span className="font-bold">SKIP</span>
              </button>
              <button
                onClick={() => setGameState("winner-selection")}
                className="flex-[2] bg-[#39ff14] text-black py-6 rounded-2xl flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all"
              >
                <Check className="w-8 h-8 stroke-[4px]" />
                <span className="font-black text-xl">SUCCESS!</span>
              </button>
            </div>
            <p className="mt-8 text-white/40 font-bold italic animate-bounce">SNATCH IT FAST!</p>
          </motion.div>
        )}

        {gameState === "winner-selection" && (
          <motion.div
            key="winner-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col max-w-md mx-auto w-full pt-10"
          >
            <h2 className="text-3xl font-black mb-8 text-center text-gradient-neon uppercase">WHO WAS THE QUICKEST?</h2>
            <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 custom-scrollbar pb-10">
              {players.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectWinner(p.id)}
                  className="bg-white/5 border-2 border-white/10 hover:border-[#00f5ff] hover:bg-white/10 p-4 rounded-xl font-black text-xl transition-all flex justify-between items-center"
                >
                  <span>{p.name}</span>
                  <Star className="w-6 h-6 text-yellow-400 opacity-0 hover:opacity-100 transition-opacity" />
                </button>
              ))}
              <button
                onClick={() => setGameState("leaderboard")}
                className="mt-4 p-4 text-white/40 font-bold hover:text-white transition-colors"
              >
                No one sang correctly...
              </button>
            </div>
          </motion.div>
        )}

        {gameState === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col max-w-md mx-auto w-full pt-10"
          >
            <div className="flex items-center gap-3 mb-8 justify-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-black text-gradient-neon uppercase">Leaderboard</h2>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
              {[...players].sort((a, b) => b.score - a.score).map((p, idx) => (
                <div key={p.id} className={`flex justify-between items-center p-4 ${idx !== players.length - 1 ? 'border-b border-white/5' : ''} ${idx === 0 ? 'bg-[#00f5ff]/10' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-white/30 font-black">{idx + 1}</span>
                    <span className="font-black text-lg">{p.name}</span>
                  </div>
                  <span className="font-mono font-black text-[#00f5ff] text-xl">{p.score} PTS</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pb-4">
              <button
                onClick={startRound}
                className="w-full bg-[#ff006e] text-white py-6 rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(255,0,110,0.3)] hover:scale-105 transition-all"
              >
                NEXT ROUND ({roundCount}/{MAX_ROUNDS})
              </button>
            </div>
          </motion.div>
        )}

        {gameState === "game-over" && (
          <motion.div
            key="game-over"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-8">
              <Trophy className="w-32 h-32 text-yellow-400" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-yellow-400/30 rounded-full"
              />
            </div>
            <h1 className="text-5xl font-black mb-2 text-gradient-neon">GAME OVER!</h1>
            <p className="text-2xl font-bold mb-12 text-white/50">THE CHAMPION IS</p>
            <div className="text-7xl font-black italic mb-16 text-[#00f5ff] drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]">
              {[...players].sort((a, b) => b.score - a.score)[0].name}
            </div>
            <button
              onClick={resetGame}
              className="w-full max-w-xs bg-white text-black py-4 rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:scale-105 transition-all"
            >
              <RotateCcw className="w-6 h-6" />
              PLAY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .text-gradient-neon {
          background: linear-gradient(to right, #00f5ff, #8338ec, #ff006e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 245, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 245, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
