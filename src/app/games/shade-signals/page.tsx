"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColorSpectrum } from "@/components/games/shade-signals/ColorSpectrum";
import { MultiplayerShadeSignals } from "@/components/games/shade-signals/MultiplayerShadeSignals";
import { InGameNav, WatchAdButton, PlayersModal, InfoButton, GameModeSelector, Modal, GameErrorBoundary } from "@/components/games/shared";
import { usePlayerSetup } from "@/hooks/usePlayerSetup";
import { X, Trophy, ArrowRight, Palette, Users, Droplet, ChevronRight, Plus, Minus, Users2, Crown, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import type { ColorWithPosition } from "@/lib/games/shade-signals/types";
import { generateColorOptions, calculateHSVDistance, calculateScore } from "@/lib/games/shade-signals/colorUtils";
import { FORBIDDEN_COLOR_WORDS } from "@/lib/games/shade-signals/clueWords";
import { useRoom } from "@/context/RoomContext";
import { useAppShell, AppShell } from "@/components/AppShell";

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
  const { setFullscreen } = useAppShell();

  // Check if we're coming from a multiplayer room
  const isFromRoom = mode === "online" && roomCode && room.isActive;

  // Use shared player management hook
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
  } = usePlayerSetup({ minPlayers: 2, maxPlayers: 10 });

  const [phase, setPhase] = useState<GamePhase>("setup");
  const [gameMode, setGameMode] = useState<GameMode>("qm");
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(4);
  const [signalGiverIndex, setSignalGiverIndex] = useState(0);
  const [colorOptions, setColorOptions] = useState<ColorWithPosition[]>([]);
  const [targetColor, setTargetColor] = useState<ColorWithPosition | null>(null);
  const [firstClue, setFirstClue] = useState("");
  const [secondClue, setSecondClue] = useState("");
  const [currentGuesserIndex, setCurrentGuesserIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassPhone, setShowPassPhone] = useState(false);
  const [passPhoneTarget, setPassPhoneTarget] = useState("");
  const [nextAction, setNextAction] = useState<() => void>(() => { });
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [freeRerollsRemaining, setFreeRerollsRemaining] = useState(1);
  const [adRerollAvailable, setAdRerollAvailable] = useState(true);

  const playerCount = sharedPlayers.length;

  // Control bottom nav visibility based on phase
  useEffect(() => {
    setFullscreen(phase !== "setup");
  }, [phase, setFullscreen]);

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
    startRound(newPlayers);
  };

  const startRound = (playerList = players) => {
    const options = generateColorOptions(4);
    setColorOptions(options);
    setPhase("signal-pick");
    setFirstClue("");
    setSecondClue("");
    setTargetColor(null);
    setPlayers(playerList.map(p => ({ ...p, markers: [] })));
    setCurrentGuesserIndex(0);
    setFreeRerollsRemaining(1); // Reset free reroll for new round
    setAdRerollAvailable(true);
  };

  const handleReroll = () => {
    if (freeRerollsRemaining > 0) {
      setColorOptions(generateColorOptions(4));
      setTargetColor(null);
      setFreeRerollsRemaining(prev => prev - 1);
    }
  };

  const handleAdReroll = () => {
    // This would trigger an ad in production
    setColorOptions(generateColorOptions(4));
    setTargetColor(null);
    setAdRerollAvailable(false);
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
      triggerPassPhone(players[nextSignalIdx]?.name || "Next Player", () => startRound(players));
    } else {
      setPhase("finished");
    }
  };

  // SETUP SCREEN
  if (phase === "setup") {
    // If online mode with room, use multiplayer component
    if (mode === "online" && isFromRoom && roomCode) {
      return (
        <GameErrorBoundary gameName="Shade Signals" fallbackUrl="/multiplayer">
          <MultiplayerShadeSignals roomCode={roomCode} />
        </GameErrorBoundary>
      );
    }

    // If online mode without room, redirect to multiplayer
    if (mode === "online" && !isFromRoom) {
      router.push("/multiplayer?game=shade-signals");
      return null;
    }

    return (
      <div className="min-h-screen text-white pb-24">
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="text-center pt-4 mb-6">
            <Link href="/games" className="inline-block mb-3">
              <span className="text-white/40 text-sm hover:text-white/60 transition-colors">← Back</span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-white">Shade Signals</h1>
            <p className="text-white/40 text-sm">Guess the color from cryptic clues</p>
          </div>

          {/* How to Play - Collapsible */}
          <InfoButton
            title="How to Play"
            content="The Signal-Giver picks a secret color and gives word clues. Guessers try to match the exact shade on the color wheel!"
            icon={<Palette className="w-4 h-4 text-[#00FFFF]" />}
            accentColor="#00FFFF"
          />

          {/* Game Mode Selection with Info */}
          <GameModeSelector
            modes={[
              {
                id: "qm",
                label: "Quiz Master",
                shortDescription: "All guess",
                fullDescription: "One player gives clues and everyone else guesses. Great for larger groups where one person wants to host!",
                icon: <Crown className="w-5 h-5" />,
              },
              {
                id: "classic",
                label: "Classic",
                shortDescription: "1v1 turns",
                fullDescription: "Players take turns giving clues and guessing in pairs. More balanced and competitive!",
                icon: <Users2 className="w-5 h-5" />,
              },
            ]}
            selectedMode={gameMode}
            onModeChange={(mode) => setGameMode(mode as GameMode)}
            accentColor="#8338ec"
          />

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
          accentColor="#00FFFF"
        />
      </div>
    );
  }

  // GAME SCREENS
  const signalGiver = players[signalGiverIndex];
  const currentPlayer = phase.includes("guess") ? players[getGuesserIndex(currentGuesserIndex)] : null;

  return (
    <div className="min-h-screen text-white">
      <InGameNav gameName="Shade Signals" accentColor="#00FFFF" gameIcon={<Droplet className="w-full h-full" />} showConfirmation={phase !== "finished"} onConfirmLeave={() => { setSharedPlayers([]); setPhase("setup"); }} />

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
              <h2 className="text-center font-display font-bold text-xl text-white mb-4">Pick your secret color</h2>

              {/* Reroll Buttons */}
              <div className="flex gap-2 justify-center mb-4">
                {freeRerollsRemaining > 0 ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReroll}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Free Reroll ({freeRerollsRemaining})
                  </motion.button>
                ) : adRerollAvailable ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdReroll}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-neon-purple/30 to-neon-pink/30 border border-neon-purple/40 text-white text-sm font-medium hover:from-neon-purple/40 hover:to-neon-pink/40 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Watch Ad to Reroll
                  </motion.button>
                ) : (
                  <span className="text-white/30 text-xs">No rerolls remaining</span>
                )}
              </div>

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
              <input type="text" value={secondClue} onChange={(e) => setSecondClue(e.target.value)} placeholder="e.g., deep ocean waves..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-pink mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => submitSecondClue(true)} className="py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold">Skip</button>
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => submitSecondClue(false)} className="py-3 rounded-xl bg-neon-pink text-white font-bold">Submit</motion.button>
              </div>
            </motion.div>
          )}

          {/* GUESS PHASES - Hide other markers during guessing */}
          {(phase === "guess-1" || phase === "guess-2") && currentPlayer && (
            <motion.div key="guess" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-4">
                <h2 className="font-display font-bold text-xl text-white mb-2">{currentPlayer.name}&apos;s Turn</h2>
                <p className="text-white/50">
                  Clues: <span className="text-electric-cyan font-bold">{firstClue}</span>
                  {phase === "guess-2" && secondClue && <> • <span className="text-neon-pink font-bold">{secondClue}</span></>}
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
                  <span className="text-electric-cyan font-bold">{firstClue}</span>
                  {secondClue && <> • <span className="text-neon-pink font-bold">{secondClue}</span></>}
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
              <button onClick={() => { setSharedPlayers([]); setPhase("setup"); }} className="w-full py-4 rounded-xl bg-white text-black font-display font-bold">Play Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PASS PHONE MODAL */}
      <Modal isOpen={showPassPhone} onClose={() => { setShowPassPhone(false); nextAction(); }} closeOnBackdropClick={false}>
        <div className="p-6 text-center border border-[#00FFFF]/30 rounded-2xl">
          <motion.div animate={{ rotateY: [0, 180, 0], x: [-10, 10, -10] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-16 h-24 mx-auto mb-4 rounded-xl border-4 border-[#00FFFF] bg-white/5" />
          <h2 className="font-display font-bold text-2xl text-white mb-2">Pass the <span className="text-[#00FFFF]">Phone</span></h2>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
            <p className="text-white/40 text-sm mb-1">Next up:</p>
            <p className="font-display font-bold text-2xl text-[#00FFFF]">{passPhoneTarget}</p>
          </div>
          <p className="text-white/30 text-xs mb-6">Make sure no one else can see the screen!</p>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setShowPassPhone(false); nextAction(); }} className="w-full py-4 rounded-xl bg-[#00FFFF] text-black font-display font-bold flex items-center justify-center gap-2">I&apos;m Ready <ArrowRight className="w-5 h-5" /></motion.button>
        </div>
      </Modal>

      {/* ERROR MODAL */}
      <Modal isOpen={!!errorMessage} onClose={() => setErrorMessage(null)}>
        <div className="p-5 border border-neon-pink/30 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-neon-pink/20 flex items-center justify-center"><X className="w-5 h-5 text-neon-pink" /></div>
            <div><h3 className="font-display font-bold text-white">Oops!</h3><p className="text-white/60 text-sm">{errorMessage}</p></div>
          </div>
          <button onClick={() => setErrorMessage(null)} className="w-full py-3 rounded-xl bg-neon-pink text-white font-bold">Got it</button>
        </div>
      </Modal>
    </div>
  );
}

export default function ShadeSignalsGame() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <AppShell>
        <ShadeSignalsContent />
      </AppShell>
    </Suspense>
  );
}
