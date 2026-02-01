"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRoom } from "@/context/RoomContext";
import { createClient } from "@/lib/supabase/client";
import { useAppShell } from "@/components/AppShell";
import { MobileMenu, GameMenuButton } from "@/components/MobileMenu";
import { ColorSpectrum } from "./ColorSpectrum";
import { PvPView } from "./PvPView";
import { LiveLeaderboard } from "@/components/games/dynamic-decks/LiveLeaderboard";
import type { 
  OnlineGameState, 
  OnlinePlayer, 
  OnlineGamePhase,
  MultiplayerMode,
  ColorWithPosition,
  RoundResult,
  GuessResult 
} from "@/lib/games/shade-signals/types";
import { generateColorOptions, calculateHSVDistance, calculateScore } from "@/lib/games/shade-signals/colorUtils";
import { FORBIDDEN_COLOR_WORDS } from "@/lib/games/shade-signals/clueWords";
import { 
  Droplet, Crown, ChevronRight, Loader2, Trophy, ArrowRight, 
  Check, Mic, Users, Send, Clock, Palette, Eye
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface MultiplayerShadeSignalsProps {
  roomCode: string;
}

// Create initial online game state
function createInitialOnlineState(
  roomCode: string, 
  players: OnlinePlayer[], 
  mode: MultiplayerMode,
  totalRounds: number
): OnlineGameState {
  return {
    roomCode,
    gameMode: mode,
    phase: "waiting",
    players,
    currentRound: 1,
    totalRounds,
    signalGiverIndex: 0,
    colorOptions: [],
    clues: { first: "" },
    qmGuesses: {},
    playerRoundStates: players.map(p => ({
      playerId: p.id,
      playerName: p.name,
      guesses: {},
      hasSubmittedColor: false,
      hasSubmittedClue1: false,
      hasSubmittedClue2: false,
    })),
    results: [],
  };
}

// Validate clue
function validateClue(clue: string): { valid: boolean; error?: string } {
  const trimmed = clue.trim();
  if (trimmed === "") return { valid: false, error: "Please enter a clue" };
  
  const words = trimmed.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (FORBIDDEN_COLOR_WORDS.includes(word)) {
      return { valid: false, error: `"${word}" is a color word and not allowed!` };
    }
  }
  return { valid: true };
}

export function MultiplayerShadeSignals({ roomCode }: MultiplayerShadeSignalsProps) {
  const router = useRouter();
  const { room } = useRoom();
  const { setFullscreen } = useAppShell();
  const supabase = createClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<OnlineGameState | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<MultiplayerMode>("qm");
  const totalRounds = 4;
  
  // Local input state
  const [clueInput, setClueInput] = useState("");
  const [clueError, setClueError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorWithPosition | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isHost = room.isHost;

  // Broadcast state (host only)
  const broadcastState = useCallback((state: OnlineGameState) => {
    if (!channel || !isHost) return;
    channel.send({
      type: "broadcast",
      event: "game_state",
      payload: { gameState: state },
    });
  }, [channel, isHost]);
  
  // Send player action (non-host)
  const sendPlayerAction = useCallback((action: string, data: unknown) => {
    if (!channel || !user) return;
    channel.send({
      type: "broadcast",
      event: "player_action",
      payload: { action, playerId: user.id, data },
    });
  }, [channel, user]);
  
  // Handle player actions (host processes these)
  const handlePlayerAction = useCallback((payload: { action: string; playerId: string; data: unknown }) => {
    if (!gameState) return;
    
    const { action, playerId, data } = payload;
    
    switch (action) {
      case "submit_color": {
        if (gameState.gameMode === "pvp") {
          const updated = { ...gameState };
          const playerState = updated.playerRoundStates.find(p => p.playerId === playerId);
          if (playerState) {
            playerState.targetColor = data as ColorWithPosition;
            playerState.hasSubmittedColor = true;
          }
          // Check if all players submitted
          if (updated.playerRoundStates.every(p => p.hasSubmittedColor)) {
            updated.phase = "clue-1";
          }
          setGameState(updated);
          broadcastState(updated);
        }
        break;
      }
      case "submit_clue": {
        if (gameState.gameMode === "pvp") {
          const updated = { ...gameState };
          const playerState = updated.playerRoundStates.find(p => p.playerId === playerId);
          const isFirstClue = updated.phase === "clue-1";
          if (playerState) {
            if (isFirstClue) {
              playerState.firstClue = data as string;
              playerState.hasSubmittedClue1 = true;
            } else {
              playerState.secondClue = data as string;
              playerState.hasSubmittedClue2 = true;
            }
          }
          // Check if all submitted
          const allSubmitted = isFirstClue 
            ? updated.playerRoundStates.every(p => p.hasSubmittedClue1)
            : updated.playerRoundStates.every(p => p.hasSubmittedClue2);
          if (allSubmitted) {
            updated.phase = isFirstClue ? "guess-1" : "guess-2";
          }
          setGameState(updated);
          broadcastState(updated);
        }
        break;
      }
      case "submit_guess": {
        const guessData = data as { targetPlayerId: string; color: ColorWithPosition };
        if (gameState.gameMode === "qm") {
          const updated = { ...gameState };
          if (!updated.qmGuesses[playerId]) {
            updated.qmGuesses[playerId] = [];
          }
          updated.qmGuesses[playerId].push(guessData.color);
          setGameState(updated);
          broadcastState(updated);
        } else {
          // PvP mode
          const updated = { ...gameState };
          const playerState = updated.playerRoundStates.find(p => p.playerId === playerId);
          if (playerState) {
            if (!playerState.guesses[guessData.targetPlayerId]) {
              playerState.guesses[guessData.targetPlayerId] = [];
            }
            playerState.guesses[guessData.targetPlayerId].push(guessData.color);
          }
          setGameState(updated);
          broadcastState(updated);
        }
        break;
      }
    }
  }, [gameState, broadcastState]);
  
  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then((response: { data: { user: User | null } }) => {
      const user = response.data.user;
      setUser(user);
      setIsLoading(false);
    });
  }, [supabase]);
  
  // Control fullscreen based on game state
  useEffect(() => {
    setFullscreen(!!gameState && gameState.phase !== "waiting");
  }, [gameState, setFullscreen]);
  
  // Ref for event handler to avoid reconnecting channel on state changes
  const handlePlayerActionRef = useRef<((payload: { action: string; playerId: string; data: unknown }) => void) | null>(null);

  useEffect(() => {
    handlePlayerActionRef.current = handlePlayerAction;
  }, [handlePlayerAction]);

  // Setup realtime channel
  useEffect(() => {
    if (!roomCode) return;
    
    const gameChannel = supabase
      .channel(`game:shade-signals:${roomCode}`)
      .on("broadcast", { event: "game_state" }, ({ payload }: { payload: { gameState: OnlineGameState } }) => {
        if (payload.gameState) {
          setGameState(payload.gameState);
        }
      })
      .on("broadcast", { event: "player_action" }, ({ payload }: { payload: { action: string; playerId: string; data: unknown } }) => {
        // Host handles player actions
        if (isHost && payload && handlePlayerActionRef.current) {
          handlePlayerActionRef.current(payload);
        }
      })
      .subscribe();
    
    setChannel(gameChannel);
    
    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [roomCode, supabase, isHost]);
  

  
  // ============================================
  // GAME ACTIONS (Host orchestrates)
  // ============================================
  
  const startGame = () => {
    if (!isHost) return;
    
    const onlinePlayers: OnlinePlayer[] = room.players.map(p => ({
      id: p.id,
      name: p.name,
      score: 0,
      isHost: p.isHost,
    }));
    
    const initialState = createInitialOnlineState(roomCode, onlinePlayers, selectedMode, totalRounds);
    
    // Generate color options for BOTH modes now
    initialState.colorOptions = generateColorOptions(4);
    
    initialState.phase = "color-pick";
    setGameState(initialState);
    broadcastState(initialState);
  };
  
  // Color selection is handled directly with setSelectedColor
  
  const confirmQMColorSelection = () => {
    if (!gameState || !isHost || !selectedColor) return;
    const updated = { ...gameState, targetColor: selectedColor, phase: "clue-1" as OnlineGamePhase };
    setGameState(updated);
    broadcastState(updated);
    setSelectedColor(null);
  };
  
  const submitQMClue = () => {
    if (!gameState || !isHost) return;
    
    const result = validateClue(clueInput);
    if (!result.valid) {
      setClueError(result.error || "Invalid clue");
      return;
    }
    
    const isFirstClue = gameState.phase === "clue-1";
    const updated = { ...gameState };
    
    if (isFirstClue) {
      updated.clues = { ...updated.clues, first: clueInput };
      updated.phase = "guess-1";
    } else {
      updated.clues = { ...updated.clues, second: clueInput };
      updated.phase = "guess-2";
    }
    
    setGameState(updated);
    broadcastState(updated);
    setClueInput("");
    setClueError(null);
  };
  
  const handleGuesserGuess = (color: ColorWithPosition) => {
    if (!gameState || !user) return;
    
    if (isHost) {
      // Host handles directly
      const updated = { ...gameState };
      if (!updated.qmGuesses[user.id]) {
        updated.qmGuesses[user.id] = [];
      }
      updated.qmGuesses[user.id].push(color);
      setGameState(updated);
      broadcastState(updated);
    } else {
      // Send to host
      sendPlayerAction("submit_guess", { targetPlayerId: "qm", color });
    }
  };
  
  const advanceToClue2 = () => {
    if (!gameState || !isHost) return;
    const updated = { ...gameState, phase: "clue-2" as OnlineGamePhase };
    setGameState(updated);
    broadcastState(updated);
  };
  
  const skipClue2AndReveal = () => {
    if (!gameState || !isHost) return;
    calculateAndShowResults();
  };
  
  const calculateAndShowResults = () => {
    if (!gameState || !isHost || !gameState.targetColor) return;
    
    const results: RoundResult[] = [];
    const signalGiver = gameState.players[gameState.signalGiverIndex];
    
    // Calculate scores for QM mode
    const guessResults: GuessResult[] = [];
    const updated = { ...gameState };
    
    for (const [playerId, guesses] of Object.entries(gameState.qmGuesses)) {
      const player = gameState.players.find(p => p.id === playerId);
      if (!player) continue;
      
      for (const guess of guesses) {
        const distance = calculateHSVDistance(guess.hsv, gameState.targetColor.hsv);
        const score = calculateScore(distance);
        
        guessResults.push({
          guesserId: playerId,
          guesserName: player.name,
          targetPlayerId: signalGiver.id,
          targetPlayerName: signalGiver.name,
          targetColor: gameState.targetColor,
          guess,
          score,
        });
        
        // Update player score - average of guesses
        const playerIdx = updated.players.findIndex(p => p.id === playerId);
        if (playerIdx !== -1) {
          updated.players[playerIdx].score += score;
        }
      }
    }
    
    results.push({
      playerId: signalGiver.id,
      playerName: signalGiver.name,
      targetColor: gameState.targetColor,
      clues: gameState.clues,
      guessResults,
      totalPointsEarned: 0, // Signal giver doesn't earn points in QM mode
    });
    
    updated.results = results;
    updated.phase = "reveal";
    setGameState(updated);
    broadcastState(updated);
  };
  
  const showLeaderboard = () => {
    if (!gameState || !isHost) return;
    const updated = { ...gameState, phase: "leaderboard" as OnlineGamePhase };
    setGameState(updated);
    broadcastState(updated);
  };
  
  const nextRound = () => {
    if (!gameState || !isHost) return;
    
    if (gameState.currentRound >= gameState.totalRounds) {
      const updated = { ...gameState, phase: "finished" as OnlineGamePhase };
      setGameState(updated);
      broadcastState(updated);
      return;
    }
    
    const updated: OnlineGameState = {
      ...gameState,
      currentRound: gameState.currentRound + 1,
      signalGiverIndex: (gameState.signalGiverIndex + 1) % gameState.players.length,
      colorOptions: generateColorOptions(4), // Regenerate for all rounds,
      targetColor: undefined,
      clues: { first: "" },
      qmGuesses: {},
      playerRoundStates: gameState.players.map(p => ({
        playerId: p.id,
        playerName: p.name,
        guesses: {},
        hasSubmittedColor: false,
        hasSubmittedClue1: false,
        hasSubmittedClue2: false,
      })),
      results: [],
      phase: "color-pick",
    };
    
    setGameState(updated);
    broadcastState(updated);
  };
  
  // ============================================
  // PVP MODE HANDLERS
  // ============================================
  
  const handlePvPSubmitColor = (color: ColorWithPosition) => {
    if (!gameState || !user) return;
    
    if (isHost) {
      // Host handles directly
      const updated = { ...gameState };
      const playerState = updated.playerRoundStates.find(p => p.playerId === user.id);
      if (playerState) {
        playerState.targetColor = color;
        playerState.hasSubmittedColor = true;
      }
      // Check if all submitted - auto-advance
      if (updated.playerRoundStates.every(p => p.hasSubmittedColor)) {
        updated.phase = "clue-1";
      }
      setGameState(updated);
      broadcastState(updated);
    } else {
      sendPlayerAction("submit_color", color);
    }
  };
  
  const handlePvPSubmitClue = (clue: string) => {
    if (!gameState || !user) return;
    
    const isFirstClue = gameState.phase === "clue-1";
    
    if (isHost) {
      const updated = { ...gameState };
      const playerState = updated.playerRoundStates.find(p => p.playerId === user.id);
      if (playerState) {
        if (isFirstClue) {
          playerState.firstClue = clue;
          playerState.hasSubmittedClue1 = true;
        } else {
          playerState.secondClue = clue;
          playerState.hasSubmittedClue2 = true;
        }
      }
      // Check if all submitted - auto-advance
      const allSubmitted = isFirstClue 
        ? updated.playerRoundStates.every(p => p.hasSubmittedClue1)
        : updated.playerRoundStates.every(p => p.hasSubmittedClue2);
      if (allSubmitted) {
        updated.phase = isFirstClue ? "guess-1" : "guess-2";
      }
      setGameState(updated);
      broadcastState(updated);
    } else {
      sendPlayerAction("submit_clue", clue);
    }
  };
  
  const handlePvPSubmitGuess = (targetPlayerId: string, color: ColorWithPosition) => {
    if (!gameState || !user) return;
    
    if (isHost) {
      const updated = { ...gameState };
      const playerState = updated.playerRoundStates.find(p => p.playerId === user.id);
      if (playerState) {
        if (!playerState.guesses[targetPlayerId]) {
          playerState.guesses[targetPlayerId] = [];
        }
        playerState.guesses[targetPlayerId].push(color);
      }
      setGameState(updated);
      broadcastState(updated);
    } else {
      sendPlayerAction("submit_guess", { targetPlayerId, color });
    }
  };
  
  const handlePvPAdvancePhase = () => {
    if (!gameState || !isHost) return;
    
    let nextPhase: OnlineGamePhase = gameState.phase;
    
    switch (gameState.phase) {
      case "color-pick":
        nextPhase = "clue-1";
        break;
      case "clue-1":
        nextPhase = "guess-1";
        break;
      case "guess-1":
        // Check if all guesses complete, then go to clue-2 or reveal
        nextPhase = "clue-2";
        break;
      case "clue-2":
        nextPhase = "guess-2";
        break;
      case "guess-2":
        // Calculate PvP results
        calculatePvPResults();
        return;
    }
    
    const updated = { ...gameState, phase: nextPhase };
    setGameState(updated);
    broadcastState(updated);
  };
  
  const calculatePvPResults = () => {
    if (!gameState || !isHost) return;
    
    const results: RoundResult[] = [];
    const updated = { ...gameState };
    
    // For each player, calculate scores for guesses made on their color
    for (const playerState of gameState.playerRoundStates) {
      if (!playerState.targetColor) continue;
      
      const guessResults: GuessResult[] = [];
      
      // Find all guesses made for this player's color
      for (const otherPlayer of gameState.playerRoundStates) {
        if (otherPlayer.playerId === playerState.playerId) continue;
        
        const guesses = otherPlayer.guesses[playerState.playerId] || [];
        for (const guess of guesses) {
          const distance = calculateHSVDistance(guess.hsv, playerState.targetColor.hsv);
          const score = calculateScore(distance);
          
          guessResults.push({
            guesserId: otherPlayer.playerId,
            guesserName: otherPlayer.playerName,
            targetPlayerId: playerState.playerId,
            targetPlayerName: playerState.playerName,
            targetColor: playerState.targetColor,
            guess,
            score,
          });
          
          // Award points to the guesser
          const playerIdx = updated.players.findIndex(p => p.id === otherPlayer.playerId);
          if (playerIdx !== -1) {
            updated.players[playerIdx].score += score;
          }
        }
      }
      
      results.push({
        playerId: playerState.playerId,
        playerName: playerState.playerName,
        targetColor: playerState.targetColor,
        clues: { first: playerState.firstClue || "", second: playerState.secondClue },
        guessResults,
        totalPointsEarned: guessResults.reduce((sum, r) => sum + r.score, 0),
      });
    }
    
    updated.results = results;
    updated.phase = "reveal";
    setGameState(updated);
    broadcastState(updated);
  };
  
  // ============================================
  // RENDER HELPERS
  // ============================================
  
  const isSignalGiver = useCallback(() => {
    if (!gameState || !user) return false;
    const signalGiver = gameState.players[gameState.signalGiverIndex];
    const currentPlayer = room.players.find(p => p.id === user.id);
    return currentPlayer?.name === signalGiver?.name;
  }, [gameState, user, room.players]);
  
  const hasSubmittedGuess = useCallback(() => {
    if (!gameState || !user) return false;
    const expectedGuesses = gameState.phase === "guess-1" ? 1 : 2;
    const currentGuesses = gameState.qmGuesses[user.id]?.length || 0;
    return currentGuesses >= expectedGuesses;
  }, [gameState, user]);
  
  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-electric-cyan" />
      </div>
    );
  }
  
  // Pre-game lobby
  if (!gameState || gameState.phase === "waiting") {
    return (
      <div className="w-full max-w-lg mx-auto px-4 pt-8 pb-24">
        <GameMenuButton
          onClick={() => setMenuOpen(true)}
          isOpen={menuOpen}
          accentColor="#00FFFF"
        />
        <MobileMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          isGameMode={true}
          gameName="Shade Signals"
          accentColor="#00FFFF"
          gameIcon={<Droplet className="w-full h-full" />}
          showConfirmation={true}
          onConfirmLeave={() => router.push("/lobby")}
        />
        
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-white mb-2">Shade Signals</h1>
          <p className="text-white/40 text-sm">Room: {roomCode}</p>
        </div>
        
        {/* Mode Selection */}
        {isHost && (
          <div className="mb-6">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Game Mode</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedMode("qm")}
                className={`p-4 rounded-xl border transition-all ${
                  selectedMode === "qm"
                    ? "border-electric-cyan bg-electric-cyan/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <Crown className={`w-6 h-6 mx-auto mb-2 ${selectedMode === "qm" ? "text-electric-cyan" : "text-white/40"}`} />
                <p className={`font-bold text-sm ${selectedMode === "qm" ? "text-electric-cyan" : "text-white"}`}>Quiz Master</p>
                <p className="text-[10px] text-white/40 mt-1">One gives clues, all guess</p>
              </button>
              <button
                onClick={() => setSelectedMode("pvp")}
                className={`p-4 rounded-xl border transition-all ${
                  selectedMode === "pvp"
                    ? "border-neon-pink bg-neon-pink/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <Users className={`w-6 h-6 mx-auto mb-2 ${selectedMode === "pvp" ? "text-neon-pink" : "text-white/40"}`} />
                <p className={`font-bold text-sm ${selectedMode === "pvp" ? "text-neon-pink" : "text-white"}`}>PvP</p>
                <p className="text-[10px] text-white/40 mt-1">Everyone plays at once</p>
              </button>
            </div>
          </div>
        )}
        
        {/* Players */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Players ({room.players.length})</p>
          <div className="space-y-2">
            {room.players.map(player => (
              <div key={player.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-electric-cyan to-neon-purple flex items-center justify-center text-white text-sm font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                {player.isHost && <Crown className="w-4 h-4 text-amber-400" />}
              </div>
            ))}
          </div>
        </div>
        
        {/* Start Button */}
        {isHost ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={startGame}
            disabled={room.players.length < 2}
            className="w-full py-4 rounded-xl bg-electric-cyan text-black font-display font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Game <ChevronRight className="w-5 h-5" />
          </motion.button>
        ) : (
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <Loader2 className="w-6 h-6 animate-spin text-white/40 mx-auto mb-2" />
            <p className="text-white/60">Waiting for host to start...</p>
          </div>
        )}
      </div>
    );
  }
  
  // ============================================
  // GAME SCREENS
  // ============================================
  
  const signalGiver = gameState.players[gameState.signalGiverIndex];
  const isQM = gameState.gameMode === "qm";
  
  // Convert online players to leaderboard format
  const leaderboardPlayers = gameState.players.map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
  }));
  
  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-8">
      <GameMenuButton
        onClick={() => setMenuOpen(true)}
        isOpen={menuOpen}
        accentColor="#00FFFF"
      />
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isGameMode={true}
        gameName="Shade Signals"
        accentColor="#00FFFF"
        gameIcon={<Droplet className="w-full h-full" />}
        showConfirmation={gameState.phase !== "finished"}
        onConfirmLeave={() => router.push("/lobby")}
      />
      
      {/* Round Info */}
      <div className="flex items-center justify-between py-4 mb-4">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider">Round {gameState.currentRound}/{gameState.totalRounds}</p>
          {isQM && (
            <p className="font-display font-bold text-white">
              Signal-Giver: <span className="text-electric-cyan">{signalGiver?.name}</span>
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {gameState.players.map((p, i) => (
            <div key={p.id} className={`px-2 py-1 rounded text-xs font-bold ${i === gameState.signalGiverIndex && isQM ? 'bg-electric-cyan/20 text-electric-cyan' : 'bg-white/5 text-white/50'}`}>
              {p.score}
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {/* PVP MODE - All players play simultaneously */}
        {!isQM && (gameState.phase === "color-pick" || gameState.phase === "clue-1" || gameState.phase === "clue-2" || gameState.phase === "guess-1" || gameState.phase === "guess-2") && user && (
          <motion.div key="pvp-mode" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <PvPView
              gameState={gameState}
              userId={user.id}
              isHost={isHost}
              colorOptions={gameState.colorOptions}
              onSubmitColor={handlePvPSubmitColor}
              onSubmitClue={handlePvPSubmitClue}
              onSubmitGuess={handlePvPSubmitGuess}
              onAdvancePhase={handlePvPAdvancePhase}
            />
          </motion.div>
        )}
        
        {/* QM MODE: COLOR PICK - Signal Giver picks */}
        {gameState.phase === "color-pick" && isQM && isSignalGiver() && (
          <motion.div key="qm-pick" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-center font-display font-bold text-xl text-white mb-4">Pick your secret color</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {gameState.colorOptions.map((color, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedColor(color)}
                  className={`aspect-square rounded-xl border-4 transition-all ${
                    selectedColor?.hex === color.hex ? 'border-white scale-105' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
            {selectedColor && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmQMColorSelection}
                className="w-full py-4 rounded-xl bg-electric-cyan text-black font-display font-bold"
              >
                Confirm Selection
              </motion.button>
            )}
          </motion.div>
        )}
        
        {/* QM MODE: COLOR PICK - Others wait */}
        {gameState.phase === "color-pick" && isQM && !isSignalGiver() && (
          <motion.div key="qm-wait-pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-electric-cyan" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">{signalGiver?.name} is picking a color</h2>
            <p className="text-white/40">Get ready to guess!</p>
          </motion.div>
        )}
        
        {/* QM MODE: CLUE PHASE - Signal Giver gives clue */}
        {(gameState.phase === "clue-1" || gameState.phase === "clue-2") && isQM && isSignalGiver() && gameState.targetColor && (
          <motion.div key="qm-clue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
              <div className="w-12 h-12 rounded-lg border-2 border-white/30" style={{ backgroundColor: gameState.targetColor.hex }} />
              <div>
                <p className="text-white/40 text-xs uppercase">Your Secret Color</p>
                <p className="font-mono text-white font-bold">{gameState.targetColor.hex.toUpperCase()}</p>
              </div>
            </div>
            
            <h2 className="font-display font-bold text-xl text-white mb-2">
              {gameState.phase === "clue-1" ? "Give your 1-word clue" : "Give a clarifying clue"}
            </h2>
            {gameState.phase === "clue-1" && (
              <p className="text-white/40 text-sm mb-4">Help players find your color!</p>
            )}
            {gameState.phase === "clue-2" && gameState.clues.first && (
              <p className="text-electric-cyan text-sm mb-4">First clue: &quot;{gameState.clues.first}&quot;</p>
            )}
            
            <input
              type="text"
              value={clueInput}
              onChange={(e) => { setClueInput(e.target.value); setClueError(null); }}
              placeholder={gameState.phase === "clue-1" ? "e.g., ocean, fire, sunset..." : "Additional hint..."}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-electric-cyan mb-2"
            />
            {clueError && <p className="text-red-400 text-sm mb-2">{clueError}</p>}
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={submitQMClue}
              disabled={!clueInput.trim()}
              className="w-full py-4 rounded-xl bg-electric-cyan text-black font-display font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> Submit Clue
            </motion.button>
          </motion.div>
        )}
        
        {/* QM MODE: CLUE PHASE - Others wait */}
        {(gameState.phase === "clue-1" || gameState.phase === "clue-2") && isQM && !isSignalGiver() && (
          <motion.div key="qm-wait-clue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-neon-purple" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">
              {signalGiver?.name} is writing a clue
            </h2>
            <p className="text-white/40">Get your guessing hat ready!</p>
          </motion.div>
        )}
        
        {/* QM MODE: GUESS PHASE - Signal Giver waits */}
        {(gameState.phase === "guess-1" || gameState.phase === "guess-2") && isQM && isSignalGiver() && gameState.targetColor && (
          <motion.div key="qm-wait-guess" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 mb-4">
                <Eye className="w-4 h-4 text-electric-cyan" />
                <span className="text-sm font-medium text-electric-cyan">Players are guessing</span>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                <div className="w-16 h-16 rounded-lg border-2 border-white/30" style={{ backgroundColor: gameState.targetColor.hex }} />
                <div className="text-left">
                  <p className="text-white/40 text-xs uppercase">Your Color</p>
                  <p className="font-mono text-white font-bold text-lg">{gameState.targetColor.hex.toUpperCase()}</p>
                  <p className="text-electric-cyan text-sm mt-1">Clue: &quot;{gameState.clues.first}&quot;</p>
                </div>
              </div>
            </div>
            
            {/* Live guess count */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Guesses Submitted</p>
              <div className="space-y-2">
                {gameState.players.filter(p => p.id !== signalGiver.id).map(p => {
                  const guessCount = gameState.qmGuesses[p.id]?.length || 0;
                  const expected = gameState.phase === "guess-1" ? 1 : 2;
                  const hasGuessed = guessCount >= expected;
                  return (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="text-white font-medium">{p.name}</span>
                      {hasGuessed ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-white/30 animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Check if all guessed */}
            {(() => {
              const nonSignalGivers = gameState.players.filter(p => p.id !== signalGiver.id);
              const expected = gameState.phase === "guess-1" ? 1 : 2;
              const allGuessed = nonSignalGivers.every(p => (gameState.qmGuesses[p.id]?.length || 0) >= expected);
              
              if (allGuessed && gameState.phase === "guess-1") {
                return (
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={skipClue2AndReveal} className="py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold">
                      Skip to Reveal
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={advanceToClue2} className="py-3 rounded-xl bg-neon-pink text-white font-bold">
                      Give 2nd Clue
                    </motion.button>
                  </div>
                );
              } else if (allGuessed && gameState.phase === "guess-2") {
                return (
                  <motion.button whileTap={{ scale: 0.98 }} onClick={calculateAndShowResults} className="w-full py-4 rounded-xl bg-electric-cyan text-black font-display font-bold flex items-center justify-center gap-2">
                    Show Results <ArrowRight className="w-5 h-5" />
                  </motion.button>
                );
              }
              return null;
            })()}
          </motion.div>
        )}
        
        {/* QM MODE: GUESS PHASE - Others guess */}
        {(gameState.phase === "guess-1" || gameState.phase === "guess-2") && isQM && !isSignalGiver() && (
          <motion.div key="qm-guess" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {hasSubmittedGuess() ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="font-display font-bold text-xl text-white mb-2">Guess Submitted!</h2>
                <p className="text-white/40">Waiting for other players...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="font-display font-bold text-xl text-white mb-2">
                    {gameState.phase === "guess-1" ? "First Guess" : "Second Guess"}
                  </h2>
                  <p className="text-white/50">
                    Clue: <span className="text-electric-cyan font-bold">{gameState.clues.first}</span>
                    {gameState.phase === "guess-2" && gameState.clues.second && (
                      <> + <span className="text-neon-pink font-bold">{gameState.clues.second}</span></>
                    )}
                  </p>
                </div>
                <ColorSpectrum
                  onColorSelect={handleGuesserGuess}
                  markers={[]}
                  showMarkers={false}
                  disabled={false}
                />
              </>
            )}
          </motion.div>
        )}
        
        {/* REVEAL PHASE - QM Mode */}
        {gameState.phase === "reveal" && isQM && gameState.targetColor && (
          <motion.div key="reveal-qm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-6">
              <p className="text-electric-cyan text-xs uppercase tracking-wider mb-1">Round {gameState.currentRound} Complete</p>
              <h2 className="font-display font-black text-3xl text-white mb-2">The Reveal!</h2>
              <p className="text-white/50">
                <span className="text-electric-cyan font-bold">{gameState.clues.first}</span>
                {gameState.clues.second && <> • <span className="text-neon-pink font-bold">{gameState.clues.second}</span></>}
              </p>
            </div>
            
            {/* Target Color */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl mb-4"
                style={{ backgroundColor: gameState.targetColor.hex }}
              />
              <p className="text-white/40 text-xs uppercase tracking-wider">Target Color</p>
              <p className="font-mono font-bold text-xl text-white">{gameState.targetColor.hex.toUpperCase()}</p>
            </div>
            
            {/* Player Results */}
            {gameState.results.length > 0 && gameState.results[0]?.guessResults && (
              <div className="space-y-3 mb-6">
                {gameState.results[0].guessResults.map((result, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-white">{result.guesserName}</span>
                      <span className={`font-display font-black text-xl ${
                        result.score >= 70 ? 'text-emerald-400' : 
                        result.score >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {result.score}<span className="text-white/30 text-sm">/100</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border-2 border-white/30" style={{ backgroundColor: result.guess.hex }} />
                      <div>
                        <p className="font-mono text-white text-sm">{result.guess.hex.toUpperCase()}</p>
                        {result.score >= 80 && <p className="text-emerald-400 text-xs">🎯 Excellent!</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {isHost && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={showLeaderboard}
                className="w-full py-4 rounded-xl bg-white text-black font-display font-bold flex items-center justify-center gap-2"
              >
                See Standings <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        )}
        
        {/* REVEAL PHASE - PvP Mode */}
        {gameState.phase === "reveal" && !isQM && gameState.results.length > 0 && (
          <motion.div key="reveal-pvp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-6">
              <p className="text-neon-pink text-xs uppercase tracking-wider mb-1">Round {gameState.currentRound} Complete</p>
              <h2 className="font-display font-black text-3xl text-white mb-2">PvP Results!</h2>
              <p className="text-white/40 text-sm">Everyone&apos;s colors revealed</p>
            </div>
            
            {/* Show each player's results */}
            <div className="space-y-6 mb-6">
              {gameState.results.map((result, playerIdx) => (
                <motion.div
                  key={result.playerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: playerIdx * 0.15 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  {/* Player color header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div
                      className="w-14 h-14 rounded-xl border-2 border-white/30"
                      style={{ backgroundColor: result.targetColor.hex }}
                    />
                    <div>
                      <p className="font-display font-bold text-white">{result.playerName}&apos;s Color</p>
                      <p className="text-electric-cyan text-sm">
                        Clue: &quot;{result.clues.first}&quot;
                        {result.clues.second && <> + &quot;{result.clues.second}&quot;</>}
                      </p>
                    </div>
                  </div>
                  
                  {/* Guesses on this player's color */}
                  <div className="space-y-2">
                    {result.guessResults.map((guess, guessIdx) => (
                      <div key={guessIdx} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg border border-white/20"
                            style={{ backgroundColor: guess.guess.hex }}
                          />
                          <span className="text-white/80 text-sm">{guess.guesserName}</span>
                        </div>
                        <span className={`font-bold ${
                          guess.score >= 70 ? 'text-emerald-400' : 
                          guess.score >= 40 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {guess.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {isHost && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={showLeaderboard}
                className="w-full py-4 rounded-xl bg-white text-black font-display font-bold flex items-center justify-center gap-2"
              >
                See Standings <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        )}
        
        {/* LEADERBOARD PHASE */}
        {gameState.phase === "leaderboard" && (
          <motion.div key="leaderboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-6">
              <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
              <h2 className="font-display font-bold text-xl text-white">Standings</h2>
              <p className="text-white/40 text-sm">After Round {gameState.currentRound}</p>
            </div>
            
            <LiveLeaderboard 
              players={leaderboardPlayers}
              title="Leaderboard"
            />
            
            {isHost && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={nextRound}
                className="w-full py-4 rounded-xl bg-electric-cyan text-black font-display font-bold flex items-center justify-center gap-2 mt-6"
              >
                {gameState.currentRound < gameState.totalRounds ? (
                  <>Next Round <ArrowRight className="w-5 h-5" /></>
                ) : (
                  <>Final Results <Trophy className="w-5 h-5" /></>
                )}
              </motion.button>
            )}
          </motion.div>
        )}
        
        {/* FINISHED PHASE */}
        {gameState.phase === "finished" && (
          <motion.div key="finished" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="font-display font-black text-3xl text-white mb-2">Game Over!</h2>
            <p className="text-white/40 mb-6">The champion is...</p>
            <h1 className="font-display font-black text-4xl text-electric-cyan mb-8">
              {[...gameState.players].sort((a, b) => b.score - a.score)[0]?.name}
            </h1>
            
            <LiveLeaderboard 
              players={leaderboardPlayers}
              title="Final Scores"
            />
            
            <button
              onClick={() => router.push("/lobby")}
              className="w-full py-4 rounded-xl bg-white text-black font-display font-bold mt-8"
            >
              Back to Lobby
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
