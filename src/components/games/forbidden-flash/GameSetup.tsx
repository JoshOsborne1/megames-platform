"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { GameLobby, PlayerManager, GameSettings, createInitialPlayers, type Player } from "../shared";

interface GameSetupProps {
  onStart: (players: string[], rounds: number) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [players, setPlayers] = useState<Player[]>(createInitialPlayers());
  const [rounds, setRounds] = useState(3);

  const handleStart = () => {
    const playerNames = players.map(p => p.name);
    onStart(playerNames, rounds);
  };

  return (
    <GameLobby
      title="Forbidden Flash"
      subtitle="Describe the word, avoid the forbidden"
      icon={<Zap className="w-12 h-12" />}
      onStart={handleStart}
      startButtonText="Start Game"
      startDisabled={players.length < 2 || players.some(p => !p.name.trim())}
      backUrl="/games"
      accentColor="#ff006e"
    >
      <PlayerManager
        players={players}
        onPlayersChange={setPlayers}
        minPlayers={2}
        maxPlayers={10}
        accentColor="#ff006e"
      />

      <GameSettings
        rounds={rounds}
        onRoundsChange={setRounds}
        minRounds={1}
        maxRounds={10}
        accentColor="#00f5ff"
      />
    </GameLobby>
  );
}
