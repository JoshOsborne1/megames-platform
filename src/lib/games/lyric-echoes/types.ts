export type CardType = "song" | "artist";

export interface LyricCard {
  id: string;
  type: CardType;
  echo: string;
  answer: string;
  artist?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  decade?: string;
  genre?: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  buzzTimestamp?: number;
  isClueGiver?: boolean;
}

export interface GameState {
  phase: "setup" | "playing" | "buzzing" | "reveal" | "leaderboard" | "finished";
  currentRound: number;
  totalRounds: number;
  currentCard: LyricCard | null;
  clueGiverIndex: number;
  timer: number;
  timerActive: boolean;
  buzzedPlayers: { playerId: string; timestamp: number }[];
  correctGuess: boolean;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  effect: "extra-time" | "skip-card" | "hint-letter" | "double-points";
  premium: boolean;
}
