"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { DiceRoller } from "@/components/games/rhyme-rebels/DiceRoller";
import { GameTimer } from "@/components/games/rhyme-rebels/GameTimer";
import { RhymeCard } from "@/components/games/rhyme-rebels/RhymeCard";
import { RhymingPairsGrid } from "@/components/games/rhyme-rebels/RhymingPairsGrid";
import { GameState, Player, GameMode } from "@/lib/games/rhyme-rebels/types";
import {
  createInitialState,
  rollDice,
  drawCard,
  submitGuess,
  matchPairs,
  nextTurn,
  checkWinCondition,
} from "@/lib/games/rhyme-rebels/gameLogic";
import { Trophy, Users, MessageCircle, Zap, ArrowRight, Play, Home } from "lucide-react";

export default function RhymeRebelsPage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [phase, setPhase] = useState<"mode-select" | "lobby" | "playing">("mode-select");
  const [gameMode, setGameMode] = useState<"online" | "local" | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [guessInput, setGuessInput] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  const [showPairs, setShowPairs] = useState(false);

  const startGame = (mode: "online" | "local") => {
    setGameMode(mode);
    setPhase("lobby");
  };

  const addPlayer = () => {
    if (!playerName.trim() || players.length >= 12) return;

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: playerName.trim(),
      teamId: players.length % 2,
    };

    setPlayers([...players, newPlayer]);
    setPlayerName("");
  };

  const startGameWithPlayers = () => {
    if (players.length < 2) {
      alert("Need at least 2 players to start!");
      return;
    }

    const initialState = createInitialState(players, gameMode || "local", `game-${Date.now()}`);
    setGameState(initialState);
    setPhase("playing");
  };

  const handleDiceRoll = (mode: GameMode) => {
    if (!gameState) return;

    setIsRolling(true);
    setTimeout(() => {
      const updatedState = {
        ...gameState,
        currentMode: mode,
        phase: 'playing' as const,
      };
      const stateWithCard = drawCard(updatedState);
      setGameState(stateWithCard);
      setIsRolling(false);
    }, 2000);
  };

  const handleGuessSubmit = () => {
    if (!gameState || !guessInput.trim()) return;

    const currentPlayer = players[0];
    const { state: newState, isCorrect } = submitGuess(
      gameState,
      currentPlayer.id,
      currentPlayer.name,
      currentPlayer.teamId,
      guessInput
    );

    setGameState(newState);
    setGuessInput("");

    if (isCorrect) {
      setTimeout(() => {
        setGameState({ ...newState, phase: 'pair-match' });
        setShowPairs(true);
      }, 1500);
    }
  };

  const handlePairMatch = (firstIndex: number, secondIndex: number) => {
    if (!gameState) return;

    const { state: newState } = matchPairs(gameState, firstIndex, secondIndex);
    setGameState(newState);
  };

  const handleNextTurn = () => {
    if (!gameState) return;

    const newState = nextTurn(gameState);
    const { isGameOver } = checkWinCondition(newState);

    if (isGameOver) {
      setGameState({ ...newState, phase: 'end' });
    } else {
      setGameState(newState);
      setShowPairs(false);
    }
  };

  const handleTimeUp = () => {
    if (!gameState) return;
    setGameState({ ...gameState, phase: 'reveal' });
  };

  if (phase === "mode-select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0f2e] via-[#2d1555] to-[#1a0f2e] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="font-display font-black text-7xl md:text-9xl text-white mb-4"
              animate={{
                textShadow: [
                  "0 0 20px #FF4500",
                  "0 0 40px #FF4500",
                  "0 0 20px #FF4500",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              RHYME REBELS
            </motion.h1>
            <p className="text-white/70 font-space text-xl">
              Chaotic rhyming charades party game
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.button
              onClick={() => startGame("online")}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#00BFFF] to-[#32CD32] shadow-2xl"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10">
                <Users className="w-16 h-16 text-white mb-4 mx-auto" />
                <h3 className="font-display font-black text-3xl text-white mb-2">
                  ONLINE MULTIPLAYER
                </h3>
                <p className="text-white/80 font-space">
                  Play with voice/chat - remote party mode!
                </p>
              </div>
            </motion.button>

            <motion.button
              onClick={() => startGame("local")}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#FF4500] to-[#9370DB] shadow-2xl"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10">
                <MessageCircle className="w-16 h-16 text-white mb-4 mx-auto" />
                <h3 className="font-display font-black text-3xl text-white mb-2">
                  SWAP & PLAY
                </h3>
                <p className="text-white/80 font-space">
                  Local hotseat - pass device for clues!
                </p>
              </div>
            </motion.button>
          </div>

          <motion.button
            onClick={() => router.push("/")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-space transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Games
          </motion.button>
        </div>
      </div>
    );
  }

  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0f2e] via-[#2d1555] to-[#1a0f2e] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/10"
        >
          <h2 className="font-display font-black text-5xl text-white mb-6 text-center">
            GAME LOBBY
          </h2>

          <div className="mb-6">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                placeholder="Enter player name..."
                className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-space placeholder-white/40 focus:outline-none focus:border-[#FF4500]"
                maxLength={20}
              />
              <motion.button
                onClick={addPlayer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF6347] rounded-xl font-display font-black text-white"
              >
                ADD
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg border border-white/10"
                >
                  <span className="text-white font-space font-bold">
                    {player.name}
                  </span>
                  <span className="ml-2 text-white/50 text-sm">
                    Team {player.teamId + 1}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="text-center text-white/60 font-space text-sm mb-4">
              {players.length} / 12 players (min 2 to start)
            </div>

            <motion.button
              onClick={startGameWithPlayers}
              disabled={players.length < 2}
              whileHover={players.length >= 2 ? { scale: 1.05 } : {}}
              whileTap={players.length >= 2 ? { scale: 0.95 } : {}}
              className="w-full py-4 bg-gradient-to-r from-[#32CD32] to-[#00BFFF] rounded-xl font-display font-black text-white text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              START GAME
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!gameState) return null;

  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const isClueGiver = players[0]?.id === gameState.currentClueGiverId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f2e] via-[#2d1555] to-[#1a0f2e] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-4xl text-white">
              ROUND {gameState.currentRound} / {gameState.maxRounds}
            </h2>
            <p className="text-white/70 font-space">
              Target: {gameState.targetScore} points
            </p>
          </div>

          <div className="flex gap-4">
            {gameState.teams.map((team) => (
              <motion.div
                key={team.id}
                className={`px-6 py-3 rounded-xl ${
                  team.id === currentTeam.id ? "ring-4 ring-white" : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, ${team.color} 0%, ${team.color}88 100%)`,
                }}
              >
                <div className="text-white font-display font-black text-2xl">
                  {team.score}
                </div>
                <div className="text-white/80 font-space text-sm">{team.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {gameState.phase === "dice-roll" && (
            <motion.div
              key="dice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[600px]"
            >
              <DiceRoller onRollComplete={handleDiceRoll} isRolling={isRolling} />
            </motion.div>
          )}

          {gameState.phase === "playing" && gameState.currentCard && gameState.currentMode && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-start gap-8">
                <div className="flex-1">
                  <RhymeCard
                    card={gameState.currentCard}
                    mode={gameState.currentMode}
                    isClueGiver={isClueGiver}
                  />
                </div>

                <div className="flex-shrink-0">
                  <GameTimer
                    initialTime={30}
                    onTimeUp={handleTimeUp}
                    isRunning={true}
                  />
                </div>
              </div>

              {!isClueGiver && (
                <div className="max-w-2xl mx-auto">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={guessInput}
                      onChange={(e) => setGuessInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleGuessSubmit()}
                      placeholder="Type your guess..."
                      className="flex-1 px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white font-space text-lg placeholder-white/40 focus:outline-none focus:border-[#32CD32]"
                    />
                    <motion.button
                      onClick={handleGuessSubmit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-[#32CD32] to-[#00BFFF] rounded-2xl font-display font-black text-white text-xl"
                    >
                      GUESS
                    </motion.button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {gameState.guesses.slice(-3).map((guess, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`px-4 py-2 rounded-lg ${
                          guess.isCorrect
                            ? "bg-green-500/20 border border-green-500/50"
                            : "bg-red-500/20 border border-red-500/50"
                        }`}
                      >
                        <span className="text-white font-space">
                          {guess.playerName}: {guess.guess}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {gameState.phase === "pair-match" && showPairs && (
            <motion.div
              key="pairs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <RhymingPairsGrid
                pairs={gameState.rhymePairs}
                onMatch={handlePairMatch}
                canInteract={true}
              />

              <div className="text-center">
                <motion.button
                  onClick={handleNextTurn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-gradient-to-r from-[#FF4500] to-[#9370DB] rounded-full font-display font-black text-white text-xl shadow-lg flex items-center gap-3 mx-auto"
                >
                  NEXT TURN
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState.phase === "end" && (
            <motion.div
              key="end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6" />
              <h2 className="font-display font-black text-7xl text-white mb-4">
                GAME OVER!
              </h2>
              <div className="space-y-4">
                {gameState.teams
                  .sort((a, b) => b.score - a.score)
                  .map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="px-8 py-4 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${team.color} 0%, ${team.color}88 100%)`,
                      }}
                    >
                      <div className="text-white font-display font-black text-4xl">
                        {index === 0 && "🏆 "}{team.name}: {team.score} pts
                      </div>
                    </motion.div>
                  ))}
              </div>

              <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-12 px-12 py-4 bg-gradient-to-r from-[#00BFFF] to-[#32CD32] rounded-full font-display font-black text-white text-xl"
              >
                BACK TO GAMES
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}