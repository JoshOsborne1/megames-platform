import { RhymeCard } from './rhymeDeck';

export type GameMode = 'describe' | 'act' | 'solve';

export interface Player {
  id: string;
  name: string;
  teamId: number;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  score: number;
  players: Player[];
}

export interface RhymePair {
  id: string;
  celebHalf: string;
  rhymeHalf: string;
  displayHalf: string; // Pre-computed display text to avoid hydration issues
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  gameId: string;
  mode: 'online' | 'local';
  phase: 'lobby' | 'setup' | 'dice-roll' | 'playing' | 'guessing' | 'reveal' | 'pair-match' | 'end';
  teams: Team[];
  currentTeamIndex: number;
  currentClueGiverId: string;
  currentRound: number;
  maxRounds: number;
  targetScore: number;
  currentCard: RhymeCard | null;
  currentMode: GameMode | null;
  timeLeft: number;
  guesses: Guess[];
  deck: RhymeCard[];
  rhymePairs: RhymePair[];
  powerUps: PowerUp[];
}

export interface Guess {
  playerId: string;
  playerName: string;
  teamId: number;
  guess: string;
  timestamp: number;
  isCorrect: boolean;
}

export interface PowerUp {
  id: string;
  type: 'extra-time' | 'wild-guess' | 'skip-card' | 'double-points';
  teamId: number;
  used: boolean;
}

export interface DiceRollResult {
  mode: GameMode;
  animation: boolean;
}
