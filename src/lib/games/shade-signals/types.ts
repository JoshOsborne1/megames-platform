export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorWithPosition {
  hsv: HSVColor;
  rgb: RGBColor;
  hex: string;
  x: number;
  y: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isSignalGiver: boolean;
  markers: ColorWithPosition[];
}

export interface Clue {
  text: string;
  type: "first" | "second";
  timestamp: number;
}

export interface GameRound {
  roundNumber: number;
  signalGiverId: string;
  targetColor: ColorWithPosition;
  colorOptions: ColorWithPosition[];
  clues: Clue[];
  guesses: Record<string, ColorWithPosition[]>;
  scores: Record<string, number>;
  completed: boolean;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  effect: "double_points" | "steal_point" | "extra_clue" | "skip_turn";
}

export interface GameState {
  gameId: string;
  mode: "online" | "local";
  players: Player[];
  currentRound: GameRound | null;
  totalRounds: number;
  roundsCompleted: number;
  winner: Player | null;
  started: boolean;
  finished: boolean;
}

// ============================================
// MULTIPLAYER TYPES
// ============================================

// Multiplayer game modes
export type MultiplayerMode = "qm" | "pvp";

// Game phases for online play
export type OnlineGamePhase = 
  | "waiting"       // Pre-game lobby
  | "color-pick"    // QM: signal giver picks, PvP: all pick
  | "clue-1"        // QM: giver writes, PvP: all write clue
  | "guess-1"       // QM: all guess, PvP: all guess each other
  | "clue-2"        // Optional second clue
  | "guess-2"       // Second guess
  | "reveal"        // Show results
  | "leaderboard"   // Standings
  | "finished";     // Game over

// Online player with ready state
export interface OnlinePlayer {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}

// Track each player's round state for PvP mode
export interface PlayerRoundState {
  playerId: string;
  playerName: string;
  targetColor?: ColorWithPosition;
  firstClue?: string;
  secondClue?: string;
  guesses: Record<string, ColorWithPosition[]>; // targetPlayerId -> [guess1, guess2]
  hasSubmittedColor: boolean;
  hasSubmittedClue1: boolean;
  hasSubmittedClue2: boolean;
}

// Result of a single guess
export interface GuessResult {
  guesserId: string;
  guesserName: string;
  targetPlayerId: string;
  targetPlayerName: string;
  targetColor: ColorWithPosition;
  guess: ColorWithPosition;
  score: number;
}

// Round results for reveal phase
export interface RoundResult {
  playerId: string;
  playerName: string;
  targetColor: ColorWithPosition;
  clues: { first: string; second?: string };
  guessResults: GuessResult[];
  totalPointsEarned: number;
}

// Main online game state
export interface OnlineGameState {
  roomCode: string;
  gameMode: MultiplayerMode;
  phase: OnlineGamePhase;
  players: OnlinePlayer[];
  currentRound: number;
  totalRounds: number;
  // QM mode specific
  signalGiverIndex: number;
  colorOptions: ColorWithPosition[];
  targetColor?: ColorWithPosition;
  clues: { first: string; second?: string };
  qmGuesses: Record<string, ColorWithPosition[]>; // playerId -> [guess1, guess2]
  // PvP mode specific
  playerRoundStates: PlayerRoundState[];
  // Results shown during reveal
  results: RoundResult[];
}
