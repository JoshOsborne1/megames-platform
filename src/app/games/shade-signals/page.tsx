"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColorSpectrum } from "@/components/games/shade-signals/ColorSpectrum";
import { createInitialPlayers, InGameNav, type Player, WatchAdButton } from "@/components/games/shared";
import { X, Trophy, ArrowRight, Palette, Users, Droplet, ChevronRight, Plus, Trash2, Minus, Check, Users2, Crown } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import type { ColorWithPosition } from "@/lib/games/shade-signals/types";
import { generateColorOptions, calculateHSVDistance, calculateScore, hsvToPosition } from "@/lib/games/shade-signals/colorUtils";
import { FORBIDDEN_COLOR_WORDS } from "@/lib/games/shade-signals/clueWords";
import { useRoom } from "@/context/RoomContext";

type GamePhase = "setup" | "signal-pick" | "clue-1" | "guess-1" | "clue-2" | "guess-2" | "reveal" | "leaderboard" | "finished";
type GameMode = "classic" | "qm"; // Classic: giver -> single guesser, QM: giver -> all guess

interface GamePlayer {
  name: string;
  score: number;
  markers: ColorWithPosition[];
}

function validateClue(clue: string, type: "first" | "second"): { valid: boolean; error?: string } {
  const trimmed = clue.trim();
  if (type === "second" && trimmed === "") return { valid: true };
  if (trimmed === "") return { valid: false, error: "Please enter a clue or click Skip" };

  const words = trimmed.toLowerCase().split(/\s+/);
  if (type === "first" && words.length !== 1) return { valid: false, error: "First clue must be exactly 1 word" };

  for (const word of words) {
    if (FORBIDDEN_COLOR_WORDS.includes(word)) {
      return { valid: false, error: `"${word}" is a color word and not allowed!` };
    }
  }
  return { valid: true };
}

function ShadeSignalsContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const roomCode = searchParams.get("room");
  const router = useRouter();
  const { room } = useRoom();

  // Check if we're coming from a multiplayer room
  const isFromRoom = mode === "online" && roomCode && room.isActive;

  const [phase, setPhase] = useState<GamePhase>("setup");
  const [gameMode, setGameMode] = useState<GameMode>("qm");
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
  const [passPhoneTarget, setPassPhoneTarget] = useState("");
  const [nextAction, setNextAction] = useState<() => void>(() => { });
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  const playerCount = sharedPlayers.length;

  // In QM mode: all players except giver guess. In Classic: only one guesser per round
  const getGuesserIndex = (guesserIdx: number) => {
    if (gameMode === "qm") {
      return guesserIdx >= signalGiverIndex ? guesserIdx + 1 : guesserIdx;
    } else {
      // Classic: guesser is the next player after signal giver
      return (signalGiverIndex + 1) % playerCount;
    }
  };

  const getTotalGuessers = () => gameMode === "qm" ? playerCount - 1 : 1;

  const startGame = () => {
    const newPlayers = sharedPlayers.map(p => ({
      name: p.name,
      score: 0,
      markers: [] as ColorWithPosition[],
    }));
    setPlayers(newPlayers);
    setCurrentRound(1);
    setSignalGiverIndex(0);
    startRound(newPlayers, 0);
  };

  const startRound = (playerList = players, sigIdx = signalGiverIndex) => {
    const options = generateColorOptions(4);
    setColorOptions(options);
    setPhase("signal-pick");
    setFirstClue("");
    setSecondClue("");
    setShowTarget(false);
    setTargetColor(null);
    setPlayers(playerList.map(p => ({ ...p, markers: [] })));
    setCurrentGuesserIndex(0);
  };

  const triggerPassPhone = (targetName: string, action: () => void) => {
    setPassPhoneTarget(targetName);
    setNextAction(() => action);
    setShowPassPhone(true);
  };

  const submitFirstClue = () => {
    const result = validateClue(firstClue, "first");
    if (!result.valid) { setErrorMessage(result.error || "Invalid clue"); return; }

    const firstGuesserName = players[getGuesserIndex(0)]?.name || "Next Player";
    triggerPassPhone(firstGuesserName, () => {
      setPhase("guess-1");
      setCurrentGuesserIndex(0);
    });
  };

  const handleGuess = (color: ColorWithPosition) => {
    const actualIndex = getGuesserIndex(currentGuesserIndex);
    setPlayers(prev => {
      const updated = [...prev];
      if (updated[actualIndex]) {
        updated[actualIndex].markers.push(color);
      }
      return updated;
    });

    const nextGuesserIndex = currentGuesserIndex + 1;
    const totalGuessers = getTotalGuessers();

    if (nextGuesserIndex < totalGuessers) {
      const nextPlayerName = players[getGuesserIndex(nextGuesserIndex)]?.name || "Next Player";
      triggerPassPhone(nextPlayerName, () => setCurrentGuesserIndex(nextGuesserIndex));
    } else {
      if (phase === "guess-1") {
        triggerPassPhone(players[signalGiverIndex]?.name || "Signal Giver", () => {
          setPhase("clue-2");
          setCurrentGuesserIndex(0);
        });
      } else {
        revealResults();
      }
    }
  };

  const submitSecondClue = (skipClue = false) => {
    if (!skipClue) {
      const result = validateClue(secondClue, "second");
      if (!result.valid) { setErrorMessage(result.error || "Invalid clue"); return; }
    }
    const firstGuesserName = players[getGuesserIndex(0)]?.name || "Next Player";
    triggerPassPhone(firstGuesserName, () => {
      setPhase("guess-2");
      setCurrentGuesserIndex(0);
    });
  };

  const revealResults = () => {
    if (!targetColor) return;
    setPhase("reveal");
    setShowTarget(true);
    setPlayers(prev => prev.map((player, idx) => {
      if (idx === signalGiverIndex) return player;

      // Calculate scores for each guess
      const scores = player.markers.map(marker => {
        const distance = calculateHSVDistance(marker.hsv, targetColor.hsv);
        return calculateScore(distance);
      });

      // Average score (or single score if only one guess)
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      return { ...player, score: player.score + avgScore };
    }));
  };

  const handleContinueToNextRound = () => {
    if (currentRound < totalRounds) {
      const nextSignalIdx = (signalGiverIndex + 1) % playerCount;
      setCurrentRound(prev => prev + 1);
      setSignalGiverIndex(nextSignalIdx);
      triggerPassPhone(players[nextSignalIdx]?.name || "Next Player", () => startRound(players, nextSignalIdx));
    } else {
      setPhase("finished");
    }
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

  // SETUP SCREEN
  if (phase === "setup") {
    // If online mode without room, redirect to multiplayer
    if (mode === "online" && !isFromRoom) {
      router.push("/multiplayer?game=shade-signals");
      return null;
    }

    return (
      <div className="min-h-screen bg-[#0a0015] text-white">
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="text-center pt-4 mb-6">
            <Link href="/games" className="inline-block mb-3">
              <span className="text-white/40 text-sm hover:text-white/60 transition-colors">← Back</span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-white">Shade Signals</h1>
            <p className="text-white/40 text-sm">Guess the color from cryptic clues</p>
          </div>

          {/* Game Info */}
          <div className="p-4 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/30 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Palette className="w-5 h-5 text-[#00FFFF]" />
              <h4 className="font-display font-bold text-white">How to Play</h4>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              The Signal-Giver picks a secret color and gives word clues. Guessers try to match the exact shade on the color wheel!
            </p>
          </div>

          {/* Game Mode Selection */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Game Mode</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGameMode("qm")}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${gameMode === "qm" ? "bg-[#8338ec]/20 border-[#8338ec] text-[#8338ec]" : "bg-white/5 border-white/10 text-white/50"
                  }`}
              >
                <Crown className="w-5 h-5" />
                <span className="font-bold text-sm">QM Mode</span>
                <span className="text-[10px] opacity-70">All guess</span>
              </button>
              <button
                onClick={() => setGameMode("classic")}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${gameMode === "classic" ? "bg-[#8338ec]/20 border-[#8338ec] text-[#8338ec]" : "bg-white/5 border-white/10 text-white/50"
                  }`}
              >
                <Users2 className="w-5 h-5" />
                <span className="font-bold text-sm">Classic</span>
                <span className="text-[10px] opacity-70">1v1 turns</span>
              </button>
            </div>
          </div>

          {/* Players Button */}
          <button
            onClick={() => setShowPlayersModal(true)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00FFFF]" />
              <span className="text-sm text-white font-medium">{sharedPlayers.length} Players</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </button>

          {/* Rounds */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex items-center justify-between">
            <span className="text-white font-medium">Rounds</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setTotalRounds(Math.max(1, totalRounds - 1))} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-[#00FFFF]">{totalRounds}</span>
              <button onClick={() => setTotalRounds(Math.min(10, totalRounds + 1))} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <WatchAdButton
              variant="card"
              label="Boost Color Palette"
              description="Get +10% more color options instantly"
              onReward={() => {
                // Logic to set enhanced colors would go here
                // For now visual feedback is handled by button
              }}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={startGame}
            disabled={!canStart}
            className="w-full py-4 rounded-xl bg-[#00FFFF] text-black font-display font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Start Game <ChevronRight className="w-5 h-5" />
          </motion.button>

          {!canStart && <p className="text-center text-white/30 text-xs mt-2">Need at least 2 players with names</p>}
        </div>

        {/* Players Modal */}
        <AnimatePresence>
          {showPlayersModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPlayersModal(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed z-50"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'calc(100% - 2rem)',
                  maxWidth: '24rem',
                }}
              >
                <div className="bg-[#0a0015] border border-white/10 rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[#00FFFF]">
                      <Users className="w-5 h-5" />
                      <h3 className="font-display font-bold text-lg">Players</h3>
                    </div>
                    <button onClick={() => setShowPlayersModal(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {sharedPlayers.map((player, i) => (
                      <div key={player.id} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg">
                        <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white/50">{i + 1}</span>
                        <input type="text" value={player.name} onChange={(e) => updatePlayerName(player.id, e.target.value)} className="flex-1 bg-transparent outline-none text-white text-sm min-w-0" placeholder={`Player ${i + 1}`} />
                        <button onClick={() => removePlayer(player.id)} disabled={sharedPlayers.length <= 2} className="p-1.5 text-white/20 hover:text-red-500 disabled:opacity-0"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                  {sharedPlayers.length < 10 && (
                    <div className="flex gap-2 mb-4">
                      <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addPlayer()} placeholder="Add player..." maxLength={15} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                      <button onClick={addPlayer} disabled={!newPlayerName.trim()} className="px-3 bg-[#00FFFF]/20 text-[#00FFFF] hover:bg-[#00FFFF]/30 rounded-lg disabled:opacity-30"><Plus className="w-4 h-4" /></button>
                    </div>
                  )}
                  <button onClick={() => setShowPlayersModal(false)} className="w-full py-3 rounded-xl bg-[#00FFFF] text-black font-bold flex items-center justify-center gap-2">
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

  // GAME SCREENS
  const signalGiver = players[signalGiverIndex];
  const currentPlayer = phase.includes("guess") ? players[getGuesserIndex(currentGuesserIndex)] : null;

  return (
    <div className="min-h-screen bg-[#0a0015] text-white">
      <InGameNav gameName="Shade Signals" accentColor="#00FFFF" gameIcon={<Droplet className="w-full h-full" />} showConfirmation={phase !== "finished"} onConfirmLeave={() => { setSharedPlayers(createInitialPlayers()); setPhase("setup"); }} />

      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Round Info */}
        <div className="flex items-center justify-between py-4 mb-4">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Round {currentRound}/{totalRounds}</p>
            <p className="font-display font-bold text-white">Signal-Giver: <span className="text-[#00FFFF]">{signalGiver?.name}</span></p>
          </div>
          <div className="flex gap-1">
            {players.map((p, i) => (
              <div key={i} className={`px-2 py-1 rounded text-xs font-bold ${i === signalGiverIndex ? 'bg-[#00FFFF]/20 text-[#00FFFF]' : 'bg-white/5 text-white/50'}`}>{p.score}</div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* SIGNAL PICK */}
          {phase === "signal-pick" && (
            <motion.div key="signal-pick" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-center font-display font-bold text-xl text-white mb-6">Pick your secret color</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {colorOptions.map((color, i) => (
                  <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => setTargetColor(color)} className={`aspect-square rounded-xl border-4 transition-all ${targetColor?.hex === color.hex ? 'border-white scale-105' : 'border-white/20'}`} style={{ backgroundColor: color.hex }} />
                ))}
              </div>
              {targetColor && (
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.98 }} onClick={() => setPhase("clue-1")} className="w-full py-4 rounded-xl bg-[#00FFFF] text-black font-display font-bold">Confirm Selection</motion.button>
              )}
            </motion.div>
          )}

          {/* CLUE 1 */}
          {phase === "clue-1" && targetColor && (
            <motion.div key="clue-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <div className="w-12 h-12 rounded-lg border-2 border-white/30" style={{ backgroundColor: targetColor.hex }} />
                <div>
                  <p className="text-white/40 text-xs uppercase">Your Secret Color</p>
                  <p className="font-mono text-white font-bold">{targetColor.hex.toUpperCase()}</p>
                </div>
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-4">Give your 1-word clue</h2>
              <input type="text" value={firstClue} onChange={(e) => setFirstClue(e.target.value)} placeholder="e.g., ocean, fire, sunset..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00FFFF] mb-4" />
              <motion.button whileTap={{ scale: 0.98 }} onClick={submitFirstClue} disabled={!firstClue.trim()} className="w-full py-4 rounded-xl bg-[#00FFFF] text-black font-display font-bold disabled:opacity-50">Submit Clue</motion.button>
            </motion.div>
          )}

          {/* CLUE 2 */}
          {phase === "clue-2" && targetColor && (
            <motion.div key="clue-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <div className="w-12 h-12 rounded-lg border-2 border-white/30" style={{ backgroundColor: targetColor.hex }} />
                <div>
                  <p className="text-white/40 text-xs uppercase">First Clue</p>
                  <p className="font-bold text-[#00FFFF]">{firstClue}</p>
                </div>
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">Give a clarifying clue</h2>
              <p className="text-white/40 text-sm mb-4">Any words, or skip</p>
              <input type="text" value={secondClue} onChange={(e) => setSecondClue(e.target.value)} placeholder="e.g., deep ocean waves..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ff006e] mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => submitSecondClue(true)} className="py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold">Skip</button>
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => submitSecondClue(false)} className="py-3 rounded-xl bg-[#ff006e] text-white font-bold">Submit</motion.button>
              </div>
            </motion.div>
          )}

          {/* GUESS PHASES - Hide other markers during guessing */}
          {(phase === "guess-1" || phase === "guess-2") && currentPlayer && (
            <motion.div key="guess" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-4">
                <h2 className="font-display font-bold text-xl text-white mb-2">{currentPlayer.name}'s Turn</h2>
                <p className="text-white/50">
                  Clues: <span className="text-[#00FFFF] font-bold">{firstClue}</span>
                  {phase === "guess-2" && secondClue && <> • <span className="text-[#ff006e] font-bold">{secondClue}</span></>}
                </p>
              </div>
              <ColorSpectrum
                onColorSelect={handleGuess}
                markers={[]}
                showMarkers={false}
                targetColor={targetColor || undefined}
                showTarget={false}
                disabled={false}
              />
            </motion.div>
          )}

          {/* REVEAL - Enhanced layout */}
          {phase === "reveal" && targetColor && (
            <motion.div key="reveal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-6">
                <p className="text-[#00FFFF] text-xs uppercase tracking-wider mb-1">Round {currentRound} Complete</p>
                <h2 className="font-display font-black text-3xl text-white mb-2">The Reveal!</h2>
                <p className="text-white/50">
                  <span className="text-[#00FFFF] font-bold">{firstClue}</span>
                  {secondClue && <> • <span className="text-[#ff006e] font-bold">{secondClue}</span></>}
                </p>
              </div>

              {/* Target Color - Hero Display */}
              <div className="relative mb-8">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl mb-4"
                    style={{ backgroundColor: targetColor.hex }}
                  />
                  <p className="text-white/40 text-xs uppercase tracking-wider">Target Color</p>
                  <p className="font-mono font-bold text-xl text-white">{targetColor.hex.toUpperCase()}</p>
                </div>
              </div>

              {/* Player Guesses - Big cards for discussion */}
              <div className="space-y-4 mb-6">
                {players.map((p, i) => {
                  if (i === signalGiverIndex) return null;
                  const guess1 = p.markers[0];
                  const guess2 = p.markers[1];
                  const score1 = guess1 ? calculateScore(calculateHSVDistance(guess1.hsv, targetColor.hsv)) : 0;
                  const score2 = guess2 ? calculateScore(calculateHSVDistance(guess2.hsv, targetColor.hsv)) : 0;
                  const avgScore = guess2 ? Math.round((score1 + score2) / 2) : score1;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display font-bold text-lg text-white">{p.name}</span>
                        <div className="text-right">
                          <span className={`font-display font-black text-2xl ${avgScore >= 70 ? 'text-emerald-400' : avgScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{avgScore}</span>
                          <span className="text-white/30 text-sm">/100</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {/* Guess 1 */}
                        <div className="flex-1">
                          <p className="text-white/30 text-[10px] uppercase mb-1">Guess 1</p>
                          {guess1 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-12 rounded-lg border-2 border-white/30" style={{ backgroundColor: guess1.hex }} />
                              <div>
                                <p className="font-mono text-white text-xs">{guess1.hex.toUpperCase()}</p>
                                <p className={`text-sm font-bold ${score1 >= 70 ? 'text-emerald-400' : score1 >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {score1}/100
                                </p>
                              </div>
                            </div>
                          ) : <span className="text-white/20">-</span>}
                        </div>
                        {/* Guess 2 */}
                        <div className="flex-1">
                          <p className="text-white/30 text-[10px] uppercase mb-1">Guess 2</p>
                          {guess2 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-12 rounded-lg border-2 border-white/30" style={{ backgroundColor: guess2.hex }} />
                              <div>
                                <p className="font-mono text-white text-xs">{guess2.hex.toUpperCase()}</p>
                                <p className={`text-sm font-bold ${score2 >= 70 ? 'text-emerald-400' : score2 >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {score2}/100
                                </p>
                              </div>
                            </div>
                          ) : <span className="text-white/20">-</span>}
                        </div>
                      </div>
                      {avgScore >= 80 && (
                        <div className="mt-2 text-center text-emerald-400 text-xs font-bold">🎯 Excellent match!</div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setPhase("leaderboard")} className="w-full py-4 rounded-xl bg-white text-black font-display font-bold flex items-center justify-center gap-2">
                See Standings <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* LEADERBOARD */}
          {phase === "leaderboard" && (
            <motion.div key="leaderboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-6">
                <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                <h2 className="font-display font-bold text-xl text-white">Standings</h2>
                <p className="text-white/40 text-sm">After Round {currentRound}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 space-y-2">
                {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/50'}`}>{i + 1}</span>
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                    <span className={`font-display font-bold ${i === 0 ? 'text-yellow-500' : 'text-white/60'}`}>{p.score}</span>
                  </div>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.98 }} onClick={handleContinueToNextRound} className="w-full py-4 rounded-xl bg-[#00FFFF] text-black font-display font-bold flex items-center justify-center gap-2">
                {currentRound < totalRounds ? <>Next Round <ArrowRight className="w-5 h-5" /></> : <>Final Results <Trophy className="w-5 h-5" /></>}
              </motion.button>
            </motion.div>
          )}

          {/* FINISHED */}
          {phase === "finished" && (
            <motion.div key="finished" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-8 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="font-display font-black text-3xl text-white mb-2">Game Over!</h2>
              <p className="text-white/40 mb-6">The champion is...</p>
              <h1 className="font-display font-black text-4xl text-[#00FFFF] mb-8">{[...players].sort((a, b) => b.score - a.score)[0]?.name}</h1>
              <div className="space-y-2 mb-8">
                {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-lg ${i === 0 ? 'bg-yellow-500/10 border-2 border-yellow-500' : 'bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/50'}`}>{i + 1}</span>
                      <span className="font-display font-bold text-white">{p.name}</span>
                    </div>
                    <span className={`font-display font-black text-xl ${i === 0 ? 'text-yellow-500' : 'text-white/50'}`}>{p.score}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => { setSharedPlayers(createInitialPlayers()); setPhase("setup"); }} className="w-full py-4 rounded-xl bg-white text-black font-display font-bold">Play Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PASS PHONE MODAL */}
      <AnimatePresence>
        {showPassPhone && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(100% - 2rem)',
                maxWidth: '24rem',
              }}
            >
              <div className="bg-[#0a0015] border border-[#00FFFF]/30 rounded-2xl p-6 shadow-2xl text-center">
                <motion.div animate={{ rotateY: [0, 180, 0], x: [-10, 10, -10] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-16 h-24 mx-auto mb-4 rounded-xl border-4 border-[#00FFFF] bg-white/5" />
                <h2 className="font-display font-bold text-2xl text-white mb-2">Pass the <span className="text-[#00FFFF]">Phone</span></h2>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                  <p className="text-white/40 text-sm mb-1">Next up:</p>
                  <p className="font-display font-bold text-2xl text-[#00FFFF]">{passPhoneTarget}</p>
                </div>
                <p className="text-white/30 text-xs mb-6">Make sure no one else can see the screen!</p>
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setShowPassPhone(false); nextAction(); }} className="w-full py-4 rounded-xl bg-[#00FFFF] text-black font-display font-bold flex items-center justify-center gap-2">I'm Ready <ArrowRight className="w-5 h-5" /></motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ERROR MODAL */}
      <AnimatePresence>
        {errorMessage && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setErrorMessage(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(100% - 2rem)',
                maxWidth: '24rem',
              }}
            >
              <div className="bg-[#0a0015] border border-[#ff006e]/30 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#ff006e]/20 flex items-center justify-center"><X className="w-5 h-5 text-[#ff006e]" /></div>
                  <div><h3 className="font-display font-bold text-white">Oops!</h3><p className="text-white/60 text-sm">{errorMessage}</p></div>
                </div>
                <button onClick={() => setErrorMessage(null)} className="w-full py-3 rounded-xl bg-[#ff006e] text-white font-bold">Got it</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShadeSignalsGame() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0015] flex items-center justify-center text-white">Loading...</div>}>
      <ShadeSignalsContent />
    </Suspense>
  );
}
