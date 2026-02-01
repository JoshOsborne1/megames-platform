"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Play, Users, ChevronRight } from "lucide-react";
import { usePlayerSetup } from "@/hooks/usePlayerSetup";
import { InfoButton, GameModeSelector } from "./InfoButton";
import { GameBackButton } from "./GameBackButton";

export interface GameModeOption {
  id: string;
  label: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ReactNode;
}

export interface GameStartConfig {
  players: { id: string; name: string }[];
  rounds: number;
  timer: number;
  mode: string;
}

export interface UniversalGameSetupProps {
  // Required
  gameName: string;
  gameId?: string;
  accentColor: string;
  onStartGame: (config: GameStartConfig) => void;

  // Player config
  minPlayers?: number;
  maxPlayers?: number;

  // Rounds config
  showRounds?: boolean;
  defaultRounds?: number;
  minRounds?: number;
  maxRounds?: number;

  // Timer config
  showTimer?: boolean;
  defaultTimer?: number;
  minTimer?: number;
  maxTimer?: number;

  // Game modes
  modes?: GameModeOption[];
  defaultMode?: string;

  // Extra content
  children?: ReactNode;
  rulesContent?: string;  // String content for InfoButton

  // Unique game parameter - for game-specific settings/data
  uniqueParam?: {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options?: { label: string; value: string | number }[];
  };

  // Navigation
  backUrl?: string;
}

export function UniversalGameSetup({
  gameName,
  accentColor,
  onStartGame,
  minPlayers = 2,
  maxPlayers = 10,
  showRounds = true,
  defaultRounds = 4,
  minRounds = 1,
  maxRounds = 10,
  showTimer = false,
  defaultTimer = 60,
  minTimer = 15,
  maxTimer = 120,
  modes,
  defaultMode,
  children,
  rulesContent,
  uniqueParam,
  backUrl = "/lobby",
}: UniversalGameSetupProps) {
  const {
    players,
    newPlayerName,
    setNewPlayerName,
    addPlayer,
    removePlayer,
    canStart,
    canAddMore,
    canRemove,
  } = usePlayerSetup({ minPlayers, maxPlayers });

  const [rounds, setRounds] = useState(defaultRounds);
  const [timer, setTimer] = useState(defaultTimer);
  const [selectedMode, setSelectedMode] = useState(defaultMode || modes?.[0]?.id || "classic");

  const handleStart = () => {
    if (!canStart) return;
    onStartGame({
      players: players.map(p => ({ id: p.id, name: p.name })),
      rounds,
      timer,
      mode: selectedMode,
    });
  };

  return (
    <div className="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] px-4 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Back Button - Uses router.back() by default */}
        <div className="flex justify-center mb-4">
          <GameBackButton />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className="font-display font-black text-3xl text-white mb-2"
            style={{ textShadow: `0 0 30px ${accentColor}40` }}
          >
            {gameName}
          </h1>
        </div>

        {/* Rules (if provided) */}
        {rulesContent && (
          <div className="mb-6">
            <InfoButton title="How to Play" content={rulesContent} accentColor={accentColor} />
          </div>
        )}

        {/* Players Button - Exact same style as Shade Signals */}
        <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: accentColor }} />
            <span className="text-sm text-white font-medium">{players.length} Players</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </div>

        {/* Add Player Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            placeholder="Add player..."
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/30"
            maxLength={20}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={addPlayer}
            disabled={!canAddMore || !newPlayerName.trim()}
            className="px-4 py-3 rounded-xl font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentColor }}
          >
            Add
          </motion.button>
        </div>

        {/* Active Players List - shown under the add player button */}
        <div className="space-y-2 mb-6">
          {players.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-2">
              Add at least {minPlayers} players to start
            </p>
          ) : (
            players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3"
              >
                <span className="text-white font-medium">
                  <span className="text-white/40 mr-2">{index + 1}.</span>
                  {player.name}
                </span>
                <button
                  onClick={() => removePlayer(player.id)}
                  disabled={!canRemove}
                  className="text-white/30 hover:text-red-400 transition-colors disabled:opacity-0"
                >
                  ✕
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Unique Game Parameter */}
        {uniqueParam && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-white font-medium">{uniqueParam.label}</span>
              {uniqueParam.options ? (
                <select
                  value={uniqueParam.value}
                  onChange={(e) => uniqueParam.onChange(e.target.value)}
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-white/30"
                >
                  {uniqueParam.options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#1a142e]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={uniqueParam.value}
                  onChange={(e) => uniqueParam.onChange(e.target.value)}
                  className="w-24 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-center outline-none focus:border-white/30"
                />
              )}
            </div>
          </div>
        )}

        {/* Settings Section */}
        {(showRounds || showTimer) && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4" style={{ color: accentColor }}>
              <span className="text-lg">⚙️</span>
              <h3 className="font-display font-bold text-lg uppercase tracking-wider">
                Settings
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {showRounds && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
                    Rounds
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRounds(Math.max(minRounds, rounds - 1))}
                      className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-display font-bold text-2xl text-white">
                      {rounds}
                    </span>
                    <button
                      onClick={() => setRounds(Math.min(maxRounds, rounds + 1))}
                      className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {showTimer && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
                    Timer (sec)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTimer(Math.max(minTimer, timer - 15))}
                      className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-display font-bold text-2xl text-white">
                      {timer}
                    </span>
                    <button
                      onClick={() => setTimer(Math.min(maxTimer, timer + 15))}
                      className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Game Modes */}
        {modes && modes.length > 1 && (
          <section className="mb-6">
            <GameModeSelector
              modes={modes}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              accentColor={accentColor}
            />
          </section>
        )}

        {/* Game-specific content */}
        {children && (
          <section className="mb-6">
            {children}
          </section>
        )}

        {/* Start Button */}
        <motion.button
          whileHover={canStart ? { scale: 1.02 } : {}}
          whileTap={canStart ? { scale: 0.98 } : {}}
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full py-5 rounded-2xl font-display font-black text-xl text-white shadow-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
            !canStart ? "bg-white/10 text-white/30 cursor-not-allowed" : ""
          }`}
          style={{
            background: canStart
              ? `linear-gradient(135deg, ${accentColor} 0%, #8338ec 100%)`
              : undefined,
            boxShadow: canStart ? `0 0 30px ${accentColor}40` : undefined,
          }}
        >
          <Play className="w-6 h-6" />
          Start Game
        </motion.button>
      </motion.div>
    </div>
  );
}
