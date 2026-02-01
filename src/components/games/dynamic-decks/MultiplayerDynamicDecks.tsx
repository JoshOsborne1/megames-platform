"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { GameState, Difficulty, GameMode } from "@/lib/games/dynamic-decks/types";
import {
  createInitialState,
  drawNextCard,
  handleCorrect,
  handleCorrectByPlayer,
  handlePass,
  startNextTurn,
  endTurn,
  INITIAL_TIMER,
} from "@/lib/games/dynamic-decks/gameLogic";
import { useRoom } from "@/context/RoomContext";
import { createClient } from "@/lib/supabase/client";
import { ReaderView } from "./ReaderView";
import { SpectatorView } from "./SpectatorView";
import { LiveLeaderboard } from "./LiveLeaderboard";
import { RoundHistory } from "./RoundHistory";
import { MobileMenu, GameMenuButton } from "@/components/MobileMenu";
import { useAppShell } from "@/components/AppShell";
import { 
  ShieldAlert, Trophy, ArrowRight, Check, Crown, 
  ChevronRight, Zap, Smile, Brain, Flame, Loader2 
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { RealtimeChannel } from "@supabase/supabase-js";

const DIFFICULTY_OPTIONS: { id: Difficulty; label: string; icon: React.ReactNode; multiplier: string; color: string }[] = [
  { id: "easy", label: "Easy", icon: <Smile className="w-5 h-5" />, multiplier: "1x", color: "#00f5ff" },
  { id: "medium", label: "Medium", icon: <Brain className="w-5 h-5" />, multiplier: "1.5x", color: "#ff9f1c" },
  { id: "hard", label: "Hard", icon: <Flame className="w-5 h-5" />, multiplier: "2x", color: "#ff006e" },
];

interface MultiplayerDynamicDecksProps {
  roomCode: string;
  deckId?: string;
  gameMode?: GameMode;
}

export function MultiplayerDynamicDecks({ 
  roomCode, 
  deckId = "classic",
  gameMode = "question-master" // Default to QM mode for multiplayer
}: MultiplayerDynamicDecksProps) {
  const router = useRouter();
  const { room, setReady } = useRoom();
  const { setFullscreen } = useAppShell();
  const supabase = createClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Use ref for game state to access it in event listeners without re-subscribing
  const gameStateRef = useRef<GameState | null>(null);
  
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then((response: { data: { user: User | null } }) => {
      const user = response.data.user;
      setUser(user);
      setIsLoading(false);
    });
  }, [supabase]);
  
  // Determine if current user is the reader (clue giver)
  const isReader = useCallback(() => {
    if (!gameState || !user) return false;
    const readerPlayer = gameState.players[gameState.clueGiverIndex];
    // Match by name since local players don't have user IDs
    const currentPlayer = room.players.find(p => p.id === user.id);
    return currentPlayer?.name === readerPlayer?.name;
  }, [gameState, user, room.players]);
  
  // Determine if current user is the host (controls game state)
  const isHost = room.isHost;
  
  // Control bottom nav visibility
  useEffect(() => {
    setFullscreen(!!gameState);
  }, [gameState, setFullscreen]);
  
  // Set up realtime channel for game state sync
  useEffect(() => {
    if (!roomCode) return;
    
    // Define channel but don't subscribe yet in chain to allow saving reference
    const gameChannel = supabase.channel(`game:${roomCode}`);
    
    gameChannel
      .on("broadcast", { event: "game_state" }, ({ payload }: { payload: { gameState: GameState } }) => {
        console.log("Received game state update:", payload.gameState.phase);
        if (payload.gameState) {
          setGameState(payload.gameState);
        }
      })
      .on("broadcast", { event: "request_state" }, () => {
        // If we are host and have a game state, broadcast it
        // Use ref to avoid re-subscribing when state changes
        if (isHost && gameStateRef.current) {
          console.log("Received state request, broadcasting current state");
          gameChannel.send({
            type: "broadcast",
            event: "game_state",
            payload: { gameState: gameStateRef.current },
          });
        }
      })
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          console.log("Channel subscribed");
          // If we're not host, ask for current state immediately
          if (!isHost) {
            console.log("Requesting initial game state");
            gameChannel.send({
              type: "broadcast",
              event: "request_state",
              payload: {},
            });
          }
        }
      });
    
    setChannel(gameChannel);
    
    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [roomCode, supabase, isHost]); // Removed gameState from deps
  
  // Broadcast game state when it changes (host only)
  const broadcastState = useCallback((state: GameState) => {
    if (!channel || !isHost) return;
    channel.send({
      type: "broadcast",
      event: "game_state",
      payload: { gameState: state },
    });
  }, [channel, isHost]);
  
  // Game actions (host handles these)
  const startGame = () => {
    if (!isHost) return;
    
    const playerNames = room.players.map(p => p.name);
    const initialState = createInitialState(
      playerNames, 
      "easy", 
      3, // rounds
      deckId, 
      gameMode
    );
    const stateWithPhase = { ...initialState, phase: "instructions" as const };
    setGameState(stateWithPhase);
    broadcastState(stateWithPhase);
  };
  
  const beginRound = () => {
    if (!gameState || !isHost) return;
    
    const stateWithDifficulty = { ...gameState, difficulty: selectedDifficulty };
    const stateWithCard = drawNextCard({
      ...stateWithDifficulty,
      phase: "playing",
      timer: INITIAL_TIMER,
      skipsUsed: 0,
      roundScore: 0,
      cardsInRound: 0,
      roundHistory: [],
    }, true);
    
    setGameState(stateWithCard);
    broadcastState(stateWithCard);
  };
  
  const onCorrect = () => {
    if (!gameState || !isHost) return;
    const newState = handleCorrect(gameState);
    setGameState(newState);
    broadcastState(newState);
  };
  
  const onCorrectPlayer = (playerId: string) => {
    if (!gameState || !isHost) return;
    const newState = handleCorrectByPlayer(gameState, playerId);
    setGameState(newState);
    broadcastState(newState);
  };
  
  const onPass = () => {
    if (!gameState || !isHost) return;
    const newState = handlePass(gameState);
    setGameState(newState);
    broadcastState(newState);
  };
  
  const nextTurnHandler = () => {
    if (!gameState || !isHost) return;
    const newState = startNextTurn(gameState);
    setGameState(newState);
    broadcastState(newState);
  };
  
  // Timer (host only)
  useEffect(() => {
    if (!isHost) return;
    
    let interval: NodeJS.Timeout;
    if (gameState?.phase === "playing" && gameState.timer > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (!prev) return prev;
          const newTimer = prev.timer - 1;
          if (newTimer <= 0) {
            const endedState = endTurn(prev);
            broadcastState(endedState);
            return endedState;
          }
          const timerState = { ...prev, timer: newTimer };
          broadcastState(timerState);
          return timerState;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState?.phase, gameState?.timer, isHost, broadcastState]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-pink" />
      </div>
    );
  }
  
  // Pre-game: waiting for host to start
  if (!gameState) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 pt-8 pb-24">
        <GameMenuButton
          onClick={() => setMenuOpen(true)}
          isOpen={menuOpen}
          accentColor="#ff006e"
        />
        <MobileMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          isGameMode={true}
          gameName="Dynamic Decks"
          accentColor="#ff006e"
          gameIcon={<ShieldAlert className="w-full h-full" />}
          showConfirmation={true}
          onConfirmLeave={() => router.push("/lobby")}
        />
        
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-white mb-2">Dynamic Decks</h1>
          <p className="text-white/40 text-sm">Room: {roomCode}</p>
        </div>
        
        {/* Players in room */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Players ({room.players.length})</p>
          <div className="space-y-2">
            {room.players.map(player => (
              <div key={player.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-neon-purple to-neon-pink flex items-center justify-center text-white text-sm font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{player.name}</span>
                  {player.isReady && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                      Ready
                    </span>
                  )}
                </div>
                {player.isHost && <Crown className="w-4 h-4 text-amber-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Ready Up Button (Non-Host) */}
        {!isHost && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setReady(!room.players.find(p => p.id === user?.id)?.isReady)}
            className={`w-full py-4 rounded-xl font-display font-bold text-lg mb-6 flex items-center justify-center gap-2 transition-colors ${
              room.players.find(p => p.id === user?.id)?.isReady
                ? 'bg-emerald-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {room.players.find(p => p.id === user?.id)?.isReady ? (
              <>
                <Check className="w-5 h-5" /> Ready!
              </>
            ) : (
              "Ready Up"
            )}
          </motion.button>
        )}
        
        {/* Deck selection info */}
        <div className="p-4 rounded-xl bg-neon-pink/10 border border-neon-pink/30 mb-6">
          <p className="text-xs text-neon-pink uppercase tracking-wider mb-1">Selected Deck</p>
          <p className="font-bold text-white capitalize">{deckId.replace("-", " ")}</p>
        </div>
        
        {/* Start button (host only) */}
        {isHost ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={startGame}
            disabled={room.players.length < 2}
            className="w-full py-4 rounded-xl bg-neon-pink text-white font-display font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
  
  const clueGiver = gameState.players[gameState.clueGiverIndex];
  const isQMMode = gameState.gameMode === "question-master";
  
  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-8">
      <GameMenuButton
        onClick={() => setMenuOpen(true)}
        isOpen={menuOpen}
        accentColor="#ff006e"
      />
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isGameMode={true}
        gameName="Dynamic Decks"
        accentColor="#ff006e"
        gameIcon={<ShieldAlert className="w-full h-full" />}
        showConfirmation={gameState.phase !== "game-over"}
        onConfirmLeave={() => router.push("/lobby")}
      />
      
      <AnimatePresence mode="wait">
        {/* INSTRUCTIONS / PRE-ROUND SCREEN */}
        {gameState.phase === "instructions" && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-4"
          >
            {/* Round Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-3">
                Round {gameState.currentRound} of {gameState.maxRounds}
              </div>
              <h2 className="font-display font-bold text-2xl text-white">
                {isQMMode ? "Question Master" : "Get Ready"}
              </h2>
            </div>

            {/* Current Reader */}
            <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-neon-purple" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
                    {isReader() ? "Your Turn to Read!" : "Reader"}
                  </p>
                  <p className="font-display font-bold text-lg text-white">{clueGiver.name}</p>
                </div>
              </div>
            </div>

            {/* Mini Leaderboard */}
            <LiveLeaderboard 
              players={gameState.players}
              currentReaderId={clueGiver.id}
              title="Standings"
              compact
            />

            {/* Difficulty Selection (host/reader only) */}
            {isHost && isReader() && (
              <div className="my-6">
                <div className="flex items-center gap-2 text-white/50 mb-3">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Select Difficulty</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedDifficulty(opt.id)}
                      className={`p-3 rounded-xl border transition-all text-center ${
                        selectedDifficulty === opt.id
                          ? 'border-white/30 bg-white/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                      style={{ borderColor: selectedDifficulty === opt.id ? opt.color : undefined }}
                    >
                      <div className="flex justify-center mb-1" style={{ color: selectedDifficulty === opt.id ? opt.color : 'rgba(255,255,255,0.4)' }}>
                        {opt.icon}
                      </div>
                      <div className="text-xs font-bold" style={{ color: selectedDifficulty === opt.id ? opt.color : 'white' }}>
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">{opt.multiplier}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start button (host only) or waiting message */}
            {isHost ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={beginRound}
                className="w-full py-4 rounded-xl bg-neon-pink text-white font-display font-bold text-lg flex items-center justify-center gap-2 mt-6"
              >
                Start Round <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 mt-6">
                <p className="text-white/60 text-sm">Waiting for {clueGiver.name} to start...</p>
              </div>
            )}
          </motion.div>
        )}

        {/* GAMEPLAY SCREEN - Role-based rendering */}
        {gameState.phase === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isReader() ? (
              <ReaderView
                gameState={gameState}
                onCorrect={onCorrect}
                onCorrectPlayer={onCorrectPlayer}
                onPass={onPass}
              />
            ) : (
              <SpectatorView gameState={gameState} />
            )}
          </motion.div>
        )}

        {/* ROUND SUMMARY - Everyone sees this */}
        {gameState.phase === "round-summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-3">
                <Check className="w-3 h-3" /> Round Complete
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-1">
                {gameState.cardsInRound} Cards
              </h2>
              <p className="text-white/40 text-sm">{clueGiver.name}&apos;s turn complete</p>
            </div>

            {/* Round History */}
            <RoundHistory 
              history={gameState.roundHistory} 
              roundNumber={gameState.currentRound}
            />

            {/* Leaderboard */}
            <div className="mt-4">
              <LiveLeaderboard 
                players={gameState.players}
                title="Leaderboard"
              />
            </div>

            <div className="text-center text-sm text-white/40 my-4">
              Round {gameState.currentRound}/{gameState.maxRounds}
            </div>

            {isHost ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={nextTurnHandler}
                className="w-full py-4 rounded-xl bg-neon-pink text-white font-display font-bold text-lg flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-sm">Waiting for host to continue...</p>
              </div>
            )}
          </motion.div>
        )}

        {/* GAME OVER */}
        {gameState.phase === "game-over" && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-8"
          >
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="font-display font-black text-3xl text-white mb-2">Game Over!</h2>
              <p className="text-white/50">Final Standings</p>
            </div>

            <LiveLeaderboard 
              players={gameState.players}
              title="Final Scores"
            />

            <button
              onClick={() => router.push("/lobby")}
              className="w-full py-4 rounded-xl bg-white text-black font-display font-bold text-lg mt-8"
            >
              Back to Lobby
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
