"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ColorSpectrum } from "./ColorSpectrum";
import type { 
  OnlineGameState, 
  ColorWithPosition 
} from "@/lib/games/shade-signals/types";
import { FORBIDDEN_COLOR_WORDS } from "@/lib/games/shade-signals/clueWords";
import { Check, Clock, Send, Mic, Eye, ChevronRight, Users } from "lucide-react";
import { useState } from "react";

interface PvPViewProps {
  gameState: OnlineGameState;
  userId: string;
  isHost: boolean;
  onSubmitColor: (color: ColorWithPosition) => void;
  onSubmitClue: (clue: string) => void;
  onSubmitGuess: (targetPlayerId: string, color: ColorWithPosition) => void;
  onAdvancePhase: () => void;
}

// Validate clue
function validateClue(clue: string): { valid: boolean; error?: string } {
  const trimmed = clue.trim();
  if (trimmed === "") return { valid: false, error: "Please enter a clue" };
  
  const words = trimmed.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (FORBIDDEN_COLOR_WORDS.includes(word)) {
      return { valid: false, error: `"${word}" is a color word!` };
    }
  }
  return { valid: true };
}

export function PvPView({
  gameState,
  userId,
  isHost,
  onSubmitColor,
  onSubmitClue,
  onSubmitGuess,
  onAdvancePhase,
}: PvPViewProps) {
  const [selectedColor, setSelectedColor] = useState<ColorWithPosition | null>(null);
  const [clueInput, setClueInput] = useState("");
  const [clueError, setClueError] = useState<string | null>(null);
  const [currentGuessTarget, setCurrentGuessTarget] = useState<number>(0);
  
  const myState = gameState.playerRoundStates.find(p => p.playerId === userId);
  const otherPlayers = gameState.playerRoundStates.filter(p => p.playerId !== userId);
  
  // Check if all players have completed current phase
  const allSubmittedColors = gameState.playerRoundStates.every(p => p.hasSubmittedColor);
  const allSubmittedClue1 = gameState.playerRoundStates.every(p => p.hasSubmittedClue1);
  const allSubmittedClue2 = gameState.playerRoundStates.every(p => p.hasSubmittedClue2);
  
  const handleConfirmColor = () => {
    if (selectedColor) {
      onSubmitColor(selectedColor);
      setSelectedColor(null);
    }
  };
  
  const handleSubmitClue = () => {
    const result = validateClue(clueInput);
    if (!result.valid) {
      setClueError(result.error || "Invalid clue");
      return;
    }
    onSubmitClue(clueInput);
    setClueInput("");
    setClueError(null);
  };
  
  const handleGuess = (color: ColorWithPosition) => {
    const targetPlayer = otherPlayers[currentGuessTarget];
    if (targetPlayer) {
      onSubmitGuess(targetPlayer.playerId, color);
      // Move to next player to guess
      if (currentGuessTarget < otherPlayers.length - 1) {
        setCurrentGuessTarget(prev => prev + 1);
      }
    }
  };
  
  // Count how many guesses I've made this phase
  const getMyGuessCount = () => {
    if (!myState) return 0;
    let count = 0;
    for (const targetId of Object.keys(myState.guesses)) {
      const guesses = myState.guesses[targetId];
      if (gameState.phase === "guess-1") {
        count += guesses.length >= 1 ? 1 : 0;
      } else {
        count += guesses.length >= 2 ? 1 : 0;
      }
    }
    return count;
  };
  
  const hasCompletedAllGuesses = getMyGuessCount() >= otherPlayers.length;
  
  return (
    <AnimatePresence mode="wait">
      {/* COLOR PICK PHASE */}
      {gameState.phase === "color-pick" && (
        <motion.div key="pvp-pick" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {myState?.hasSubmittedColor ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">Color Selected!</h2>
              <p className="text-white/40 mb-6">Waiting for others...</p>
              
              {/* Who has submitted */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-xs mx-auto">
                <div className="space-y-2">
                  {gameState.playerRoundStates.map(p => (
                    <div key={p.playerId} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="text-white font-medium text-sm">{p.playerName}</span>
                      {p.hasSubmittedColor ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-white/30 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {isHost && allSubmittedColors && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onAdvancePhase}
                  className="mt-6 px-6 py-3 rounded-xl bg-electric-cyan text-black font-display font-bold"
                >
                  Continue to Clues <ChevronRight className="w-5 h-5 inline" />
                </motion.button>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-medium mb-3">
                  <Users className="w-3 h-3" /> Everyone picks at once!
                </div>
                <h2 className="font-display font-bold text-xl text-white">Pick Your Secret Color</h2>
                <p className="text-white/40 text-sm">Others will try to guess it!</p>
              </div>
              
              <ColorSpectrum
                onColorSelect={(color) => setSelectedColor(color)}
                markers={selectedColor ? [selectedColor] : []}
                showMarkers={true}
                disabled={false}
              />
              
              {selectedColor && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmColor}
                  className="w-full py-4 rounded-xl bg-neon-pink text-white font-display font-bold mt-4 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Lock In Color
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      )}
      
      {/* CLUE PHASE */}
      {(gameState.phase === "clue-1" || gameState.phase === "clue-2") && (
        <motion.div key="pvp-clue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {(gameState.phase === "clue-1" ? myState?.hasSubmittedClue1 : myState?.hasSubmittedClue2) ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">Clue Submitted!</h2>
              <p className="text-white/40 mb-6">Waiting for others...</p>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-xs mx-auto">
                <div className="space-y-2">
                  {gameState.playerRoundStates.map(p => {
                    const hasSubmitted = gameState.phase === "clue-1" ? p.hasSubmittedClue1 : p.hasSubmittedClue2;
                    return (
                      <div key={p.playerId} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-white font-medium text-sm">{p.playerName}</span>
                        {hasSubmitted ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-white/30 animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {isHost && (gameState.phase === "clue-1" ? allSubmittedClue1 : allSubmittedClue2) && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onAdvancePhase}
                  className="mt-6 px-6 py-3 rounded-xl bg-electric-cyan text-black font-display font-bold"
                >
                  Start Guessing <ChevronRight className="w-5 h-5 inline" />
                </motion.button>
              )}
            </div>
          ) : (
            <>
              {/* Show my color */}
              {myState?.targetColor && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                  <div className="w-12 h-12 rounded-lg border-2 border-white/30" style={{ backgroundColor: myState.targetColor.hex }} />
                  <div>
                    <p className="text-white/40 text-xs uppercase">Your Color</p>
                    <p className="font-mono text-white font-bold">{myState.targetColor.hex.toUpperCase()}</p>
                  </div>
                </div>
              )}
              
              <h2 className="font-display font-bold text-xl text-white mb-2">
                {gameState.phase === "clue-1" ? "Give a Clue for Your Color" : "Give Another Clue"}
              </h2>
              <p className="text-white/40 text-sm mb-4">
                {gameState.phase === "clue-1" 
                  ? "One word to help others find your shade!"
                  : "A second hint to help narrow it down"}
              </p>
              
              <input
                type="text"
                value={clueInput}
                onChange={(e) => { setClueInput(e.target.value); setClueError(null); }}
                placeholder="e.g., ocean, sunset, forest..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-pink mb-2"
              />
              {clueError && <p className="text-red-400 text-sm mb-2">{clueError}</p>}
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitClue}
                disabled={!clueInput.trim()}
                className="w-full py-4 rounded-xl bg-neon-pink text-white font-display font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Submit Clue
              </motion.button>
            </>
          )}
        </motion.div>
      )}
      
      {/* GUESS PHASE */}
      {(gameState.phase === "guess-1" || gameState.phase === "guess-2") && (
        <motion.div key="pvp-guess" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {hasCompletedAllGuesses ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">All Guesses In!</h2>
              <p className="text-white/40">Waiting for others to finish...</p>
            </div>
          ) : (
            <>
              {/* Current target player */}
              {otherPlayers[currentGuessTarget] && (
                <>
                  <div className="text-center mb-4">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                      Guess {currentGuessTarget + 1} of {otherPlayers.length}
                    </p>
                    <h2 className="font-display font-bold text-xl text-white mb-2">
                      Guess {otherPlayers[currentGuessTarget].playerName}&apos;s Color
                    </h2>
                    <p className="text-white/50">
                      Clue: <span className="text-electric-cyan font-bold">
                        {otherPlayers[currentGuessTarget].firstClue || "..."}
                      </span>
                      {gameState.phase === "guess-2" && otherPlayers[currentGuessTarget].secondClue && (
                        <> + <span className="text-neon-pink font-bold">{otherPlayers[currentGuessTarget].secondClue}</span></>
                      )}
                    </p>
                  </div>
                  
                  <ColorSpectrum
                    onColorSelect={handleGuess}
                    markers={[]}
                    showMarkers={false}
                    disabled={false}
                  />
                </>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
