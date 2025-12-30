"use client";

import { useState } from "react";
import { Zap, Minus, Plus, Users, RotateCcw, Trash2, Users2, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { GameLobby, createInitialPlayers, type Player } from "../shared";
import { DeckSelector } from "./DeckSelector";
import { GameMode } from "@/lib/games/dynamic-decks/types";

interface GameSetupProps {
  onStart: (players: string[], rounds: number, deckId: string, gameMode: GameMode) => void;
}

const GAME_MODES: { id: GameMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "classic",
    label: "Classic",
    icon: <Users2 className="w-5 h-5" />,
    description: "1 reader, 1 guesser"
  },
  {
    id: "question-master",
    label: "Question Master",
    icon: <Crown className="w-5 h-5" />,
    description: "1 QM, everyone guesses"
  },
];

export function GameSetup({ onStart }: GameSetupProps) {
  const [players, setPlayers] = useState<Player[]>(createInitialPlayers());
  const [rounds, setRounds] = useState(3);
  const [selectedDeckId, setSelectedDeckId] = useState("classic");
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>("classic");
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleStart = () => {
    const playerNames = players.map(p => p.name);
    onStart(playerNames, rounds, selectedDeckId, selectedGameMode);
  };

  const addPlayer = () => {
    if (!newPlayerName.trim() || players.length >= 8) return;
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: newPlayerName.trim(),
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  return (
    <GameLobby
      title="Dynamic Decks"
      subtitle="Describe the word, avoid the forbidden"
      icon={<Zap className="w-10 h-10" />}
      onStart={handleStart}
      startButtonText="Start Game"
      startDisabled={players.length < 2 || players.some(p => !p.name.trim())}
      backUrl="/games"
      accentColor="#ff006e"
      wideLayout={true}
    >
      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Players + Rounds + Game Mode */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
          {/* Players Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2" style={{ color: "#ff006e" }}>
              <Users className="w-4 h-4" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                Players
              </h3>
            </div>
            <span className="text-white/40 text-xs">{players.length}/8</span>
          </div>

          {/* Player List - Compact */}
          <div className="space-y-2 max-h-[100px] overflow-y-auto">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg"
              >
                <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] text-white/50 flex-shrink-0">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayerName(player.id, e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm font-space min-w-0"
                  placeholder={`Player ${index + 1}`}
                />
                <button
                  onClick={() => removePlayer(player.id)}
                  disabled={players.length <= 2}
                  className="p-1 text-white/20 hover:text-red-500 transition-colors disabled:opacity-0 flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Player - Compact */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addPlayer()}
              placeholder="Add player..."
              maxLength={15}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
              disabled={players.length >= 8}
            />
            <button
              onClick={addPlayer}
              disabled={players.length >= 8 || !newPlayerName.trim()}
              className="px-3 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Game Mode Selector */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3" style={{ color: "#8338ec" }}>
              <Crown className="w-4 h-4" />
              <span className="font-display font-bold text-sm uppercase tracking-wider">Game Mode</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {GAME_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedGameMode(mode.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${selectedGameMode === mode.id
                      ? "border-[#8338ec] bg-[#8338ec]/10"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={selectedGameMode === mode.id ? "text-[#8338ec]" : "text-white/50"}>
                      {mode.icon}
                    </div>
                    <span className={`font-display font-bold text-sm ${selectedGameMode === mode.id ? "text-[#8338ec]" : "text-white"
                      }`}>
                      {mode.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40">{mode.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Rounds Selector - Inline under game mode */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2" style={{ color: "#00f5ff" }}>
                <RotateCcw className="w-4 h-4" />
                <span className="font-display font-bold text-sm uppercase tracking-wider">Rounds</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRounds(Math.max(1, rounds - 1))}
                  disabled={rounds <= 1}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white disabled:opacity-30 transition-all flex items-center justify-center touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="text-2xl font-display font-black text-[#00f5ff] w-8 text-center">
                  {rounds}
                </span>

                <button
                  onClick={() => setRounds(Math.min(10, rounds + 1))}
                  disabled={rounds >= 10}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white disabled:opacity-30 transition-all flex items-center justify-center touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deck Selection */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <DeckSelector
            selectedDeckId={selectedDeckId}
            onDeckChange={setSelectedDeckId}
            accentColor="#8338ec"
          />
        </div>
      </div>
    </GameLobby>
  );
}
