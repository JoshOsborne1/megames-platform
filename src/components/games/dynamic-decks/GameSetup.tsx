"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Users, Users2, Crown, ChevronRight } from "lucide-react";
import { WatchAdButton, PlayersModal } from "../shared";
import { DeckSelector } from "./DeckSelector";
import { GameMode } from "@/lib/games/dynamic-decks/types";
import { usePlayerSetup } from "@/hooks/usePlayerSetup";
import Link from "next/link";

interface GameSetupProps {
  onStart: (players: string[], rounds: number, deckId: string, gameMode: GameMode) => void;
}

const GAME_MODES: { id: GameMode; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "classic", label: "Classic", icon: <Users2 className="w-4 h-4" />, description: "1v1 turns" },
  { id: "question-master", label: "QM Mode", icon: <Crown className="w-4 h-4" />, description: "1 vs all" },
];

export function GameSetup({ onStart }: GameSetupProps) {
  // Use shared player management hook
  const {
    players,
    newPlayerName,
    setNewPlayerName,
    addPlayer,
    removePlayer,
    updatePlayerName,
    canStart,
    canAddMore,
    canRemove,
  } = usePlayerSetup({ minPlayers: 2, maxPlayers: 8 });

  const [rounds, setRounds] = useState(3);
  const [selectedDeckId, setSelectedDeckId] = useState("classic");
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>("classic");
  const [showPlayersModal, setShowPlayersModal] = useState(false);

  const handleStart = () => {
    const playerNames = players.map(p => p.name);
    onStart(playerNames, rounds, selectedDeckId, selectedGameMode);
  };

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
      <PlayersModal
        isOpen={showPlayersModal}
        onClose={() => setShowPlayersModal(false)}
        players={players}
        newPlayerName={newPlayerName}
        onNewPlayerNameChange={setNewPlayerName}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onUpdatePlayerName={updatePlayerName}
        canAddMore={canAddMore}
        canRemove={canRemove}
        accentColor="#ff006e"
      />
    </div>
  );
}
