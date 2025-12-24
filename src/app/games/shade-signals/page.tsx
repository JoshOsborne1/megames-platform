"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ColorSpectrum } from "@/components/games/shade-signals/ColorSpectrum";
import { GameLobby, PlayerManager, GameSettings, createInitialPlayers, InGameNav, type Player } from "@/components/games/shared";
import { Sparkles, X, Trophy, ArrowRight, Palette, Users, Droplet } from "lucide-react";
import Link from "next/link";
import type { ColorWithPosition } from "@/lib/games/shade-signals/types";
import { generateColorOptions, calculateHSVDistance, calculateScore } from "@/lib/games/shade-signals/colorUtils";
import { validateClue, suggestClueWords } from "@/lib/games/shade-signals/clueWords";

type GamePhase = "setup" | "signal-pick" | "clue-1" | "guess-1" | "clue-2" | "guess-2" | "reveal" | "leaderboard" | "finished";

interface GamePlayer {
  name: string;
  score: number;
  markers: ColorWithPosition[];
}

export default function ShadeSignalsGame() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [sharedPlayers, setSharedPlayers] = useState<Player[]>(createInitialPlayers());
  const [players, setPlayers] = useState<GamePlayer[]>([]);
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
  const [showPassPhone, setShowPassPhone] = useState(false);
  const [nextAction, setNextAction] = useState<() => void>(() => { });

  const playerCount = sharedPlayers.length;

  const changePhase = (newPhase: GamePhase) => {
    setPhase(newPhase);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startGame = () => {
    const newPlayers = sharedPlayers.map(p => ({
      name: p.name,
      score: 0,
      markers: [] as ColorWithPosition[],
    }));
    setPlayers(newPlayers);
    setCurrentRound(1);
    setSignalGiverIndex(0);
    startRound();
  };

  const startRound = () => {
    const options = generateColorOptions(4);
    setColorOptions(options);
    changePhase("signal-pick");
    setFirstClue("");
    setSecondClue("");
    setShowTarget(false);
    setTargetColor(null);
    setPlayers(prev => prev.map(p => ({ ...p, markers: [] })));
    setCurrentGuesserIndex(0);
  };

  const handleColorOptionSelect = (color: ColorWithPosition) => {
    setTargetColor(color);
    changePhase("clue-1");
  };

  const submitFirstClue = () => {
    if (!validateClue(firstClue, "first")) {
      setErrorMessage("Invalid clue! Must be 1 word and no color names.");
      return;
    }

    setNextAction(() => () => changePhase("guess-1"));
    setShowPassPhone(true);
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
      setNextAction(() => () => { }); // No phase change, just continue
      setShowPassPhone(true);
    } else {
      if (phase === "guess-1") {
        setNextAction(() => () => changePhase("clue-2"));
        setShowPassPhone(true);
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
    setNextAction(() => () => changePhase("guess-2"));
    setShowPassPhone(true);
    setCurrentGuesserIndex(0);
  };

  const revealResults = () => {
    if (!targetColor) return;

    changePhase("reveal");
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
  };

  const handleContinueToNextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setSignalGiverIndex((signalGiverIndex + 1) % playerCount);
      startRound();
    } else {
      setPhase("finished");
    }
  };

  if (phase === "setup") {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a14]">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center">
          <GameLobby
            title="Shade Signals"
            subtitle="Guess the color from cryptic clues"
            icon={<Palette className="w-12 h-12" />}
            onStart={startGame}
            startButtonText="Start Game"
            startDisabled={sharedPlayers.length < 2 || sharedPlayers.some(p => !p.name.trim())}
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

            <GameSettings
              rounds={totalRounds}
              onRoundsChange={setTotalRounds}
              minRounds={1}
              maxRounds={10}
              accentColor="#ff006e"
            />
          </GameLobby>
        </main>
        <Footer />
      </div>
    );
  }

  const signalGiver = players[signalGiverIndex];
  const currentPlayer = phase.includes("guess") ? players[currentGuesserIndex >= signalGiverIndex ? currentGuesserIndex + 1 : currentGuesserIndex] : null;
  const nextSignalGiver = players[(signalGiverIndex + 1) % playerCount];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a14]">
      {/* In-Game Navigation - replaces Header during gameplay */}
      <InGameNav
        gameName="Shade Signals"
        accentColor="#00f5ff"
        gameIcon={<Droplet className="w-full h-full" />}
        showConfirmation={phase !== "finished"}
        onConfirmLeave={() => { setSharedPlayers(createInitialPlayers()); setPhase("setup"); }}
      />

      <main className="flex-1 pt-8 pb-16 px-4">
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
              <div className="flex gap-6 justify-center flex-wrap mb-10">
                {colorOptions.map((color, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setTargetColor(color)}
                    className={`w-32 h-32 rounded-2xl cursor-pointer border-4 transition-all ${targetColor?.hex === color.hex ? 'border-[#00f5ff] scale-110' : 'border-white/20'
                      }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              {targetColor && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Button
                    onClick={() => changePhase("clue-1")}
                    className="bg-gradient-to-r from-[#00f5ff] to-[#39ff14] text-[#0a0a14] font-black px-12 py-8 text-2xl rounded-2xl shadow-[0_10px_30px_rgba(0,245,255,0.3)]"
                  >
                    CONFIRM SECRET COLOR
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {(phase === "clue-1" || phase === "clue-2") && targetColor && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-4">
              <div className="flex items-center gap-4 bg-[#16162a] border border-white/10 rounded-2xl px-6 py-3">
                <span className="text-white/70 font-semibold">Your Color:</span>
                <div
                  className="w-16 h-16 rounded-lg border-2 border-white/30"
                  style={{ backgroundColor: targetColor.hex }}
                />
              </div>
            </motion.div>
          )}

          {phase === "clue-1" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto mb-8">
              <div className="bg-[#16162a] border border-white/10 rounded-3xl p-8">
                <h3 className="font-display text-3xl font-bold text-white mb-4">Give your 1-word clue:</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={firstClue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstClue(e.target.value)}
                    placeholder="e.g., ocean, fire, sunset..."
                    className="bg-white/5 border border-white/10 text-white text-xl flex-1 rounded-xl px-4 py-3 outline-none focus:border-[#00f5ff]"
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
                  <input
                    type="text"
                    value={secondClue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecondClue(e.target.value)}
                    placeholder="e.g., deep ocean waves, fiery sunset glow..."
                    className="bg-white/5 border border-white/10 text-white text-xl flex-1 rounded-xl px-4 py-3 outline-none focus:border-[#ff006e]"
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

          {phase === "leaderboard" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0a0a14] border-2 border-[#00f5ff]/40 rounded-3xl p-8 shadow-2xl mb-8" style={{ boxShadow: "0 0 60px rgba(0, 245, 255, 0.3)" }}>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-[#39ff14]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-[#39ff14]">
                    <Trophy className="w-10 h-10 text-[#39ff14]" />
                  </div>
                  <h2 className="font-display text-4xl font-black text-white mb-2">Current Standings</h2>
                  <p className="text-white/50">After Round {currentRound} of {totalRounds}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {players
                    .map((p, idx) => ({ ...p, originalIndex: idx }))
                    .sort((a, b) => b.score - a.score)
                    .map((p, i) => (
                      <motion.div
                        key={p.originalIndex}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex justify-between items-center py-4 px-6 rounded-xl ${i === 0
                          ? 'bg-gradient-to-r from-[#39ff14]/30 to-[#39ff14]/10 border-2 border-[#39ff14]'
                          : 'bg-white/5 border border-white/10'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`font-display text-3xl font-bold ${i === 0 ? 'text-[#39ff14]' : 'text-white/50'}`}>
                            {i + 1}
                          </span>
                          <div>
                            <span className="text-white font-bold text-xl">{p.name}</span>
                          </div>
                        </div>
                        <span className="text-[#00f5ff] font-black text-2xl">{p.score} pts</span>
                      </motion.div>
                    ))}
                </div>

                {currentRound < totalRounds ? (
                  <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6 mb-6">
                    <h3 className="text-white/50 font-bold text-sm uppercase tracking-widest mb-2">Up Next:</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#ff006e]/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#ff006e]" />
                      </div>
                      <p className="text-white text-xl">
                        <span className="font-black text-[#ff006e]">{nextSignalGiver?.name}</span> will be the Signal-Giver
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-2xl p-6 mb-6 text-center">
                    <p className="text-[#39ff14] font-black text-xl italic">The game has concluded!</p>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setNextAction(() => handleContinueToNextRound);
                    setShowPassPhone(true);
                  }}
                  className="w-full bg-gradient-to-r from-[#00f5ff] to-[#ff006e] hover:opacity-90 text-white font-black py-8 text-2xl rounded-2xl"
                >
                  {currentRound < totalRounds ? (
                    <>
                      READY FOR ROUND {currentRound + 1}
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </>
                  ) : (
                    <>
                      SEE GRAND CHAMPION
                      <Trophy className="w-6 h-6 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {phase === "reveal" && targetColor && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
              <div className="bg-[#16162a] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(57,255,20,0.1)]">
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="inline-block px-6 py-2 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-sm font-black uppercase tracking-widest mb-4"
                  >
                    Round {currentRound} Results
                  </motion.div>
                  <h2 className="font-display text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                    THE <span className="text-[#39ff14]">REVEAL</span>
                  </h2>
                  <div className="flex items-center justify-center gap-4 text-white/50 text-xl">
                    <span className="font-bold text-[#00f5ff]">{firstClue}</span>
                    <span className="opacity-20">•</span>
                    <span className="font-bold text-[#ff006e]">{secondClue}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
                  {/* Left Side: The Target */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-white/20 blur-2xl rounded-full group-hover:bg-[#39ff14]/20 transition-all duration-500" />
                      <div
                        className="relative w-48 h-48 md:w-64 md:h-64 rounded-[3rem] border-8 border-white shadow-2xl transition-transform duration-500 hover:scale-105"
                        style={{ backgroundColor: targetColor.hex }}
                      />
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#0a0a14]">
                        <Sparkles className="w-8 h-8 text-[#0a0a14]" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white/50 font-bold uppercase tracking-widest text-sm mb-1">Target Color</p>
                      <p className="text-white font-mono text-3xl font-black">{targetColor.hex.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Right Side: Guesses Comparison */}
                  <div className="space-y-6">
                    {players.map((p, i) => (
                      i !== signalGiverIndex && (
                        <motion.div
                          key={i}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-white font-black text-xl">{p.name}</span>
                            <div className="flex gap-2">
                              {p.markers.map((m, mi) => (
                                <div key={mi} className="flex flex-col items-center gap-1">
                                  <div
                                    className="w-12 h-12 rounded-xl border-2 border-white/30"
                                    style={{ backgroundColor: m.hex }}
                                  />
                                  <span className="text-[10px] text-white/40 font-mono">
                                    {Math.round((1 - calculateHSVDistance(m.hsv, targetColor.hsv)) * 100)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(...p.markers.map(m => (1 - calculateHSVDistance(m.hsv, targetColor.hsv)) * 100))}%` }}
                              className="h-full bg-gradient-to-r from-[#00f5ff] to-[#39ff14]"
                            />
                          </div>
                        </motion.div>
                      )
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    onClick={() => changePhase("leaderboard")}
                    className="flex-1 py-10 text-2xl font-black bg-white text-[#0a0a14] hover:bg-white/90 rounded-[2rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group"
                  >
                    CONTINUE TO STANDINGS
                    <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Mini Spectrum for Spatial Reference */}
              <div className="mt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                <ColorSpectrum
                  onColorSelect={() => { }}
                  markers={players.flatMap(p => p.markers)}
                  targetColor={targetColor}
                  showTarget={true}
                  disabled={true}
                />
              </div>
            </motion.div>
          )}

          {phase.includes("guess") && (
            <ColorSpectrum
              onColorSelect={handleGuess}
              markers={players.flatMap(p => p.markers)}
              targetColor={targetColor || undefined}
              showTarget={showTarget}
              disabled={!phase.includes("guess")}
            />
          )}

          {phase === "finished" && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-12 max-w-4xl mx-auto">
              <div className="relative mb-12">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block"
                >
                  <Trophy className="w-32 h-32 text-[#39ff14] drop-shadow-[0_0_30px_rgba(57,255,20,0.5)]" />
                </motion.div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center -z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-64 h-64 border-4 border-dashed border-[#00f5ff]/20 rounded-full"
                  />
                </div>
              </div>

              <h2 className="font-display text-7xl md:text-9xl font-black text-white mb-4 tracking-tighter italic">
                VICTORY!
              </h2>

              <div className="bg-[#16162a]/80 backdrop-blur-xl border-2 border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00f5ff] via-[#ff006e] to-[#39ff14]" />

                <h3 className="text-3xl font-bold text-white/50 mb-10 uppercase tracking-widest">Final Leaderboard</h3>

                <div className="space-y-4 mb-12">
                  {players.sort((a, b) => b.score - a.score).map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className={`flex justify-between items-center py-6 px-10 rounded-2xl ${i === 0
                        ? 'bg-gradient-to-r from-[#39ff14]/30 to-[#39ff14]/10 border-2 border-[#39ff14] scale-105 shadow-[0_0_40px_rgba(57,255,20,0.2)]'
                        : 'bg-white/5 border border-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-6">
                        <span className={`font-display text-4xl font-black ${i === 0 ? 'text-[#39ff14]' : 'text-white/40'}`}>
                          #{i + 1}
                        </span>
                        <span className="text-white font-black text-3xl">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#00f5ff] font-black text-4xl block">{p.score}</span>
                        <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Points</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => { setSharedPlayers(createInitialPlayers()); setPhase("setup"); }}
                    className="bg-white text-[#0a0a14] hover:bg-white/90 font-black px-12 py-10 text-2xl rounded-[2rem] transition-all hover:scale-105 active:scale-95"
                  >
                    PLAY AGAIN
                  </Button>
                  <Link href="/games" className="w-full">
                    <Button
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black px-12 py-10 text-2xl rounded-[2rem] transition-all hover:scale-105 active:scale-95"
                    >
                      HOME
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {showPassPhone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a14]/fb backdrop-blur-3xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-[#16162a] to-[#0a0a14] border-2 border-[#00f5ff]/50 rounded-[2.5rem] p-12 max-w-lg w-full text-center shadow-[0_0_80px_rgba(0,245,255,0.2)]"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{
                    rotateY: [0, 180, 0],
                    x: [-20, 20, -20]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-40 mx-auto rounded-2xl border-4 border-[#00f5ff] bg-[#1a0f2e] flex items-center justify-center p-2 shadow-[0_0_30px_rgba(0,245,255,0.3)]"
                >
                  <div className="w-full h-1 bg-[#00f5ff]/30 rounded-full" />
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border-2 border-dashed border-[#00f5ff]/20 rounded-full"
                  />
                </div>
              </div>

              <h2 className="font-display text-4xl font-black text-white mb-4 tracking-tighter">
                PASS THE <span className="text-[#00f5ff]">PHONE</span>
              </h2>

              <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                <p className="text-white/70 text-lg mb-2">Next up:</p>
                <p className="text-3xl font-black text-[#39ff14] glow-text">
                  {(() => {
                    // Determine who is next based on phase
                    if (phase === "clue-1" || phase === "clue-2") {
                      // After submitting clue, first guesser is up
                      // Calculate actual player index: skip the signal giver
                      const firstGuesserActualIndex = 0 >= signalGiverIndex ? 1 : 0;
                      return players[firstGuesserActualIndex]?.name || "Next Player";
                    } else if (phase === "guess-1" || phase === "guess-2") {
                      // During guessing, show who guesses next
                      const nextGuesserIndex = currentGuesserIndex + 1;
                      const totalGuessers = playerCount - 1;
                      if (nextGuesserIndex < totalGuessers) {
                        // More guessers remaining
                        const actualNextIndex = nextGuesserIndex >= signalGiverIndex ? nextGuesserIndex + 1 : nextGuesserIndex;
                        return players[actualNextIndex]?.name || "Next Player";
                      } else if (phase === "guess-1") {
                        // After all guess-1, signal giver gives clue 2
                        return signalGiver?.name || "Signal Giver";
                      } else {
                        // After guess-2, going to reveal (no specific player)
                        return "Everyone";
                      }
                    } else if (phase === "leaderboard") {
                      // After leaderboard, next signal giver takes over
                      return nextSignalGiver?.name || "Next Player";
                    }
                    return nextSignalGiver?.name || "Next Player";
                  })()}
                </p>
              </div>

              <p className="text-white/40 text-sm mb-10 leading-relaxed">
                Make sure the previous player can't see the screen! <br />
                Tap the button when you're ready to start.
              </p>

              <Button
                onClick={() => {
                  setShowPassPhone(false);
                  nextAction();
                }}
                className="w-full py-8 text-2xl font-black bg-gradient-to-r from-[#00f5ff] to-[#39ff14] hover:opacity-90 text-[#0a0a14] rounded-2xl shadow-[0_10px_40px_rgba(0,245,255,0.3)] group"
              >
                I AM READY
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        )}

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
