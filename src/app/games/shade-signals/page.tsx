"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorSpectrum } from "@/components/games/shade-signals/ColorSpectrum";
import { ArrowLeft, Users, Wifi, WifiOff, Play, Sparkles, X } from "lucide-react";
import Link from "next/link";
import type { ColorWithPosition } from "@/lib/games/shade-signals/types";
import { generateColorOptions, calculateHSVDistance, calculateScore } from "@/lib/games/shade-signals/colorUtils";
import { validateClue, suggestClueWords } from "@/lib/games/shade-signals/clueWords";

type GameMode = "select" | "local" | "online";
type GamePhase = "setup" | "signal-pick" | "clue-1" | "guess-1" | "clue-2" | "guess-2" | "reveal" | "finished";

export default function ShadeSignalsGame() {
  const [mode, setMode] = useState<GameMode>("select");
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<{ name: string; score: number; markers: ColorWithPosition[] }[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(4);
  const [signalGiverIndex, setSignalGiverIndex] = useState(0);
  const [colorOptions, setColorOptions] = useState<ColorWithPosition[]>([]);
  const [targetColor, setTargetColor] = useState<ColorWithPosition | null>(null);
  const [firstClue, setFirstClue] = useState("");
  const [secondClue, setSecondClue] = useState("");
  const [currentGuesserIndex, setCurrentGuesserIndex] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startGame = () => {
    const newPlayers = Array.from({ length: playerCount }, (_, i) => ({
      name: `Player ${i + 1}`,
      score: 0,
      markers: [],
    }));
    setPlayers(newPlayers);
    setTotalRounds(playerCount <= 6 ? playerCount * 2 : playerCount);
    setCurrentRound(1);
    setSignalGiverIndex(0);
    startRound();
  };

  const startRound = () => {
    const options = generateColorOptions(4);
    setColorOptions(options);
    setPhase("signal-pick");
    setFirstClue("");
    setSecondClue("");
    setShowTarget(false);
    setTargetColor(null);
    setPlayers(prev => prev.map(p => ({ ...p, markers: [] })));
    setCurrentGuesserIndex(0);
  };

  const handleColorOptionSelect = (color: ColorWithPosition) => {
    setTargetColor(color);
    setPhase("clue-1");
  };

  const submitFirstClue = () => {
    if (!validateClue(firstClue, "first")) {
      setErrorMessage("Invalid clue! Must be 1 word and no color names.");
      return;
    }
    setPhase("guess-1");
    setCurrentGuesserIndex(0);
  };

  const handleGuess = (color: ColorWithPosition) => {
    setPlayers(prev => {
      const updated = [...prev];
      const actualIndex = currentGuesserIndex >= signalGiverIndex ? currentGuesserIndex + 1 : currentGuesserIndex;
      if (updated[actualIndex]) {
        updated[actualIndex].markers.push(color);
      }
      return updated;
    });

    const nextGuesserIndex = currentGuesserIndex + 1;
    const totalGuessers = playerCount - 1;
    
    if (nextGuesserIndex < totalGuessers) {
      setCurrentGuesserIndex(nextGuesserIndex);
    } else {
      if (phase === "guess-1") {
        setPhase("clue-2");
        setCurrentGuesserIndex(0);
      } else {
        revealResults();
      }
    }
  };

  const submitSecondClue = () => {
    if (!validateClue(secondClue, "second")) {
      setErrorMessage("Invalid clue! Must be 2-3 words and no color names.");
      return;
    }
    setPhase("guess-2");
    setCurrentGuesserIndex(0);
  };

  const revealResults = () => {
    if (!targetColor) return;

    setPhase("reveal");
    setShowTarget(true);
    setPlayers(prev => prev.map((player, idx) => {
      if (idx === signalGiverIndex) return player;

      let roundScore = 0;
      player.markers.forEach(marker => {
        const distance = calculateHSVDistance(marker.hsv, targetColor.hsv);
        const points = calculateScore(distance);
        roundScore += points;
      });

      if (player.markers.length === 2 && player.markers.every(m => {
        const dist = calculateHSVDistance(m.hsv, targetColor.hsv);
        return calculateScore(dist) > 0;
      })) {
        roundScore += 1;
      }

      return { ...player, score: player.score + roundScore };
    }));

    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setSignalGiverIndex((prev + 1) % playerCount);
        startRound();
      } else {
        setPhase("finished");
      }
    }, 5000);
  };

  if (mode === "select") {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a14]">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/games" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-4 glitch">
                SHADE SIGNALS
              </h1>
              <p className="text-white/70 text-xl max-w-2xl mx-auto">
                Guess the shade with clever signals! Choose your play mode:
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setMode("local")}
                className="bg-gradient-to-br from-[#00f5ff]/20 to-[#00f5ff]/5 border-2 border-[#00f5ff]/40 rounded-3xl p-8 cursor-pointer hover:border-[#00f5ff] transition-all"
              >
                <WifiOff className="w-16 h-16 text-[#00f5ff] mb-4" />
                <h2 className="font-display text-3xl font-bold text-white mb-3">Local Swap & Play</h2>
                <p className="text-white/70">Pass one device around. Perfect for in-person fun!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-[#9370DB]/20 to-[#9370DB]/5 border-2 border-[#9370DB]/40 rounded-3xl p-8 cursor-not-allowed opacity-50"
              >
                <Wifi className="w-16 h-16 text-[#9370DB] mb-4" />
                <h2 className="font-display text-3xl font-bold text-white mb-3">Online Multiplayer</h2>
                <p className="text-white/70">Coming soon! Play with friends remotely.</p>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a14]">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#16162a] border border-white/10 rounded-3xl p-8">
              <h2 className="font-display text-3xl font-bold text-white mb-6">Game Setup</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-semibold">Number of Players (2-10)</label>
                  <Input
                    type="number"
                    min={2}
                    max={10}
                    value={playerCount}
                    onChange={(e) => setPlayerCount(Math.min(10, Math.max(2, parseInt(e.target.value) || 2)))}
                    className="bg-white/5 border-white/10 text-white text-lg"
                  />
                </div>

                <Button
                  onClick={startGame}
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-[#00f5ff] to-[#ff006e] hover:opacity-90"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Game!
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const signalGiver = players[signalGiverIndex];
  const currentPlayer = phase.includes("guess") ? players[currentGuesserIndex >= signalGiverIndex ? currentGuesserIndex + 1 : currentGuesserIndex] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a14]">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="text-white">
              <h2 className="font-display text-2xl font-bold">Round {currentRound}/{totalRounds}</h2>
              <p className="text-white/70">Signal-Giver: {signalGiver?.name}</p>
            </div>
            <div className="flex gap-4">
              {players.map((p, i) => (
                <div key={i} className={`px-4 py-2 rounded-lg ${i === signalGiverIndex ? 'bg-[#00f5ff]/20 border-2 border-[#00f5ff]' : 'bg-white/5'}`}>
                  <div className="text-white font-bold">{p.name}</div>
                  <div className="text-[#39ff14]">{p.score} pts</div>
                </div>
              ))}
            </div>
          </div>

          {phase === "signal-pick" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
              <h3 className="font-display text-4xl font-bold text-white mb-6">
                {signalGiver?.name}, pick your secret color:
              </h3>
              <div className="flex gap-6 justify-center flex-wrap">
                {colorOptions.map((color, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleColorOptionSelect(color)}
                    className="w-32 h-32 rounded-2xl cursor-pointer border-4 border-white/20 hover:border-[#39ff14] transition-all"
                    style={{ backgroundColor: color.hex, boxShadow: `0 0 30px ${color.hex}` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {(phase === "clue-1" || phase === "clue-2") && targetColor && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-4">
              <div className="flex items-center gap-4 bg-[#16162a] border border-white/10 rounded-2xl px-6 py-3">
                <span className="text-white/70 font-semibold">Your Color:</span>
                <div 
                  className="w-16 h-16 rounded-lg border-2 border-white/30"
                  style={{ backgroundColor: targetColor.hex, boxShadow: `0 0 20px ${targetColor.hex}` }}
                />
              </div>
            </motion.div>
          )}

          {phase === "clue-1" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto mb-8">
              <div className="bg-[#16162a] border border-white/10 rounded-3xl p-8">
                <h3 className="font-display text-3xl font-bold text-white mb-4">Give your 1-word clue:</h3>
                <div className="flex gap-4">
                  <Input
                    value={firstClue}
                    onChange={(e) => setFirstClue(e.target.value)}
                    placeholder="e.g., ocean, fire, sunset..."
                    className="bg-white/5 border-white/10 text-white text-xl flex-1"
                  />
                  <Button onClick={submitFirstClue} className="bg-[#00f5ff] hover:bg-[#00f5ff]/80 text-black font-bold px-8">
                    Submit
                  </Button>
                </div>
                <p className="text-white/50 text-sm mt-2">Suggestions: {suggestClueWords(5).join(", ")}</p>
              </div>
            </motion.div>
          )}

          {phase === "clue-2" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto mb-8">
              <div className="bg-[#16162a] border border-white/10 rounded-3xl p-8">
                <h3 className="font-display text-3xl font-bold text-white mb-4">Give your 2-3 word clarifying clue:</h3>
                <div className="flex gap-4">
                  <Input
                    value={secondClue}
                    onChange={(e) => setSecondClue(e.target.value)}
                    placeholder="e.g., deep ocean waves, fiery sunset glow..."
                    className="bg-white/5 border-white/10 text-white text-xl flex-1"
                  />
                  <Button onClick={submitSecondClue} className="bg-[#ff006e] hover:bg-[#ff006e]/80 text-white font-bold px-8">
                    Submit
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {(phase === "guess-1" || phase === "guess-2") && currentPlayer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
              <h3 className="font-display text-3xl font-bold text-white mb-2">
                {currentPlayer.name}'s Turn to Guess
              </h3>
              <p className="text-white/70 text-xl">
                Clue{phase === "guess-2" && "s"}: <span className="text-[#00f5ff] font-bold">{firstClue}</span>
                {phase === "guess-2" && <> • <span className="text-[#ff006e] font-bold">{secondClue}</span></>}
              </p>
            </motion.div>
          )}

          <ColorSpectrum
            onColorSelect={handleGuess}
            markers={players.flatMap(p => p.markers)}
            targetColor={targetColor || undefined}
            showTarget={showTarget}
            disabled={!phase.includes("guess")}
          />

          {phase === "finished" && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center mt-12">
              <h2 className="font-display text-5xl font-black text-white mb-8 glitch">GAME OVER!</h2>
              <div className="bg-[#16162a] border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-[#39ff14] mb-6">Final Scores:</h3>
                {players.sort((a, b) => b.score - a.score).map((p, i) => (
                  <div key={i} className={`flex justify-between items-center py-4 px-6 rounded-lg mb-2 ${i === 0 ? 'bg-[#39ff14]/20 border-2 border-[#39ff14]' : 'bg-white/5'}`}>
                    <span className="text-white font-bold text-xl">{i + 1}. {p.name}</span>
                    <span className="text-[#00f5ff] font-black text-2xl">{p.score} pts</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => { setMode("select"); setPhase("setup"); }} className="mt-8 bg-gradient-to-r from-[#00f5ff] to-[#ff006e] text-white font-bold px-12 py-6 text-xl">
                Play Again!
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setErrorMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#ff006e]/20 to-[#1a0f2e] border-2 border-[#ff006e] rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
              style={{ boxShadow: "0 0 60px rgba(255, 0, 110, 0.4)" }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Oops!</h3>
                  <p className="text-white/80">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <Button
                onClick={() => setErrorMessage(null)}
                className="w-full mt-6 bg-[#ff006e] hover:bg-[#ff006e]/80 text-white font-bold py-3"
              >
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}