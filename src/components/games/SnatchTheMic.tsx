"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Play, RotateCcw, SkipForward, Check, Mic2, Star } from "lucide-react";
import { SNATCH_WORDS } from "@/lib/games/snatch-the-mic/data";
import confetti from "canvas-confetti";

type GameState = "setup" | "lobby" | "countdown" | "round" | "winner-selection" | "leaderboard" | "game-over";

interface Player {
  id: string;
  name: string;
  score: number;
}

export default function SnatchTheMicGame() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [roundCount, setRoundCount] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const MAX_ROUNDS = 10;
  const WINNING_SCORE = 100;

  const getNewWord = () => {
    let availableWords = SNATCH_WORDS.filter(w => !usedWords.has(w));
    if (availableWords.length === 0) {
      setUsedWords(new Set());
      availableWords = SNATCH_WORDS;
    }
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setUsedWords(prev => new Set(prev).add(word));
    return word;
  };

  const addPlayer = () => {
    if (playerName.trim() && players.length < 10) {
      setPlayers([...players, { id: Math.random().toString(36).substr(2, 9), name: playerName.trim(), score: 0 }]);
      setPlayerName("");
    }
  };

  const startGame = () => {
    if (players.length >= 3) {
      setGameState("lobby");
    }
  };

  const startRound = () => {
    setGameState("countdown");
    setCountdown(3);
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
    <div className="min-h-screen bg-[#0f0a1e] text-white flex flex-col p-4 font-space overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {gameState === "setup" && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full"
          >
            <Mic2 className="w-16 h-16 text-[#00f5ff] mb-6 animate-pulse" />
            <h1 className="text-4xl font-black mb-8 text-center text-gradient-neon">SNATCH THE MIC</h1>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full mb-6">
              <label className="block text-sm font-bold mb-2 text-white/60">ADD PLAYERS (3-10)</label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  className="bg-white/10 border-2 border-white/20 rounded-xl px-4 py-2 flex-1 focus:border-[#00f5ff] outline-none transition-colors"
                  placeholder="Player name..."
                />
                <button 
                  onClick={addPlayer}
                  className="bg-[#00f5ff] text-black font-black px-6 rounded-xl hover:scale-105 transition-transform"
                >
                  ADD
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {players.map(p => (
                  <div key={p.id} className="bg-white/10 px-4 py-2 rounded-lg flex justify-between items-center">
                    <span className="font-bold">{p.name}</span>
                    <button onClick={() => setPlayers(players.filter(pl => pl.id !== p.id))} className="text-red-400">×</button>
                  </div>
                ))}
              </div>
            </div>
            <button 
              disabled={players.length < 3}
              onClick={startGame}
              className={`w-full py-4 rounded-xl font-black text-xl transition-all ${
                players.length >= 3 
                ? "bg-gradient-to-r from-[#00f5ff] to-[#00d2ff] text-black shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:scale-105" 
                : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              START GAME
            </button>
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
              animate={{ scale: [0.9, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-7xl md:text-9xl font-black mb-12 text-[#00f5ff] drop-shadow-[0_0_30px_rgba(0,245,255,0.6)] uppercase italic"
            >
              {currentWord}
            </motion.h2>
            <div className="flex gap-4 w-full max-w-lg">
              <button 
                onClick={() => setGameState("countdown")}
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
            <h2 className="text-3xl font-black mb-8 text-center text-gradient-neon">WHO SANG IT BEST?</h2>
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
              {[...players].sort((a,b) => b.score - a.score).map((p, idx) => (
                <div key={p.id} className={`flex justify-between items-center p-4 ${idx !== players.length-1 ? 'border-b border-white/5' : ''} ${idx === 0 ? 'bg-[#00f5ff]/10' : ''}`}>
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
              {[...players].sort((a,b) => b.score - a.score)[0].name}
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
