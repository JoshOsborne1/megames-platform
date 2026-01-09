"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Users, Trash2, Users2, Crown, ChevronRight, X, Check, Settings } from "lucide-react";
import { createInitialPlayers, type Player, WatchAdButton } from "../shared";
import { DeckSelector } from "./DeckSelector";
import { GameMode } from "@/lib/games/dynamic-decks/types";
import Link from "next/link";

interface GameSetupProps {
  onStart: (players: string[], rounds: number, deckId: string, gameMode: GameMode) => void;
}

const GAME_MODES: { id: GameMode; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "classic", label: "Classic", icon: <Users2 className="w-4 h-4" />, description: "1v1 turns" },
  { id: "question-master", label: "QM Mode", icon: <Crown className="w-4 h-4" />, description: "1 vs all" },
];

export function GameSetup({ onStart }: GameSetupProps) {
  const [players, setPlayers] = useState<Player[]>(createInitialPlayers());
  const [rounds, setRounds] = useState(3);
  const [selectedDeckId, setSelectedDeckId] = useState("classic");
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>("classic");
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleStart = () => {
    const playerNames = players.map(p => p.name);
    onStart(playerNames, rounds, selectedDeckId, selectedGameMode);
  };

  const addPlayer = () => {
    if (!newPlayerName.trim() || players.length >= 8) return;
    setPlayers([...players, { id: `player-${Date.now()}`, name: newPlayerName.trim() }]);
    setNewPlayerName("");
  };

  const removePlayer = (id: string) => setPlayers(players.filter(p => p.id !== id));
  const updatePlayerName = (id: string, name: string) => setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  const canStart = players.length >= 2 && players.every(p => p.name.trim());

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-8">
      {/* Header */}
      <div className="text-center pt-4 mb-6">
        <Link href="/games" className="inline-block mb-3">
          <span className="text-white/40 text-sm hover:text-white/60 transition-colors">← Back</span>
        </Link>
        <h1 className="font-display font-bold text-2xl text-white">Dynamic Decks</h1>
        <p className="text-white/40 text-sm">Choose your deck to begin</p>
      </div>

      {/* DECK SELECTION - Main Focus */}
      <div className="mb-6">
        <DeckSelector
          selectedDeckId={selectedDeckId}
          onDeckChange={setSelectedDeckId}
          accentColor="#ff006e"
        />
      </div>

      {/* Settings Bar - Compact row */}
      <div className="flex items-center gap-2 mb-6">
        {/* Players Button - Opens Modal */}
        <button
          onClick={() => setShowPlayersModal(true)}
          className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#ff006e]" />
            <span className="text-sm text-white font-medium">{players.length} Players</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </button>

        {/* Game Mode Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {GAME_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSelectedGameMode(mode.id)}
              className={`px-3 py-3 flex items-center gap-1.5 transition-all ${selectedGameMode === mode.id
                ? "bg-[#8338ec]/20 text-[#8338ec]"
                : "bg-white/5 text-white/50 hover:text-white/70"
                }`}
              title={mode.description}
            >
              {mode.icon}
              <span className="text-xs font-medium hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Rounds Stepper */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setRounds(Math.max(1, rounds - 1))}
            disabled={rounds <= 1}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-sm font-bold text-[#00f5ff]">{rounds}</span>
          <button
            onClick={() => setRounds(Math.min(10, rounds + 1))}
            disabled={rounds >= 10}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <WatchAdButton
          variant="card"
          label="Bonus Decks"
          description="Add +10% more content to your deck"
          onReward={() => { }}
        />
      </div>

      {/* Start Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleStart}
        disabled={!canStart}
        className="w-full py-4 rounded-xl bg-[#ff006e] text-white font-display font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        Start Game <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Player count hint */}
      {!canStart && (
        <p className="text-center text-white/30 text-xs mt-2">
          {players.length < 2 ? "Need at least 2 players" : "All players need names"}
        </p>
      )}

      {/* PLAYERS MODAL */}
      <AnimatePresence>
        {showPlayersModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlayersModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-[#0a0015] border border-white/10 rounded-2xl p-5 shadow-2xl w-full max-w-sm pointer-events-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[#ff006e]">
                    <Users className="w-5 h-5" />
                    <h3 className="font-display font-bold text-lg">Players</h3>
                  </div>
                  <button
                    onClick={() => setShowPlayersModal(false)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Player List */}
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {players.map((player, i) => (
                    <div key={player.id} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg">
                      <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white/50">{i + 1}</span>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                        className="flex-1 bg-transparent outline-none text-white text-sm min-w-0"
                        placeholder={`Player ${i + 1}`}
                      />
                      <button
                        onClick={() => removePlayer(player.id)}
                        disabled={players.length <= 2}
                        className="p-1.5 text-white/20 hover:text-red-500 disabled:opacity-0 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Player */}
                {players.length < 8 && (
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                      placeholder="Add player..."
                      maxLength={15}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/20"
                    />
                    <button
                      onClick={addPlayer}
                      disabled={!newPlayerName.trim()}
                      className="px-3 bg-[#ff006e]/20 text-[#ff006e] hover:bg-[#ff006e]/30 rounded-lg disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Done Button */}
                <button
                  onClick={() => setShowPlayersModal(false)}
                  className="w-full py-3 rounded-xl bg-[#ff006e] text-white font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Done ({players.length} players)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
