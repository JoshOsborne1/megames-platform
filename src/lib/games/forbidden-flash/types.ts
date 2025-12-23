export type Difficulty = "easy" | "medium" | "hard";

export interface Card {
  id: string;
  word: string;
  forbidden: string[];
  points: number;
  color: "yellow" | "blue" | "green" | "red";
  // Random Rhymes specific fields
  clue?: string;    // The description to read aloud
  answer?: string;  // The rhyming answer phrase
}

export type DeckType = "forbidden" | "rhymes";


export interface DeckInfo {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  cardCount: number;
  accentColor: string;
  deckType: DeckType; // "forbidden" or "rhymes"
}

export interface Deck {
  info: DeckInfo;
  cards: Card[];
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
  phase: "setup" | "instructions" | "playing" | "round-summary" | "game-over" | "turn-ended";
  cards: Card[];
  usedCardIds: string[];
  currentCard: Card | null;
  roundScore: number;
  skipsUsed: number;
  cardsInRound: number;
  maxCardsInRound: number;
  deckId: string;
}
