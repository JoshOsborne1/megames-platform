export type Difficulty = "easy" | "medium" | "hard";

export interface Card {
  id: string;
  word: string;
  forbidden: string[];
  points: number;
  color: "yellow" | "blue" | "green" | "red";
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  clueGiverIndex: number;
  difficulty: Difficulty;
  currentRound: number;
  maxRounds: number;
  score: number;
  timer: number;
  phase: "setup" | "instructions" | "playing" | "round-summary" | "game-over";
  cards: Card[];
  usedCardIds: string[];
  currentCard: Card | null;
  roundScore: number;
  cardsInRound: number;
  maxCardsInRound: number;
}
