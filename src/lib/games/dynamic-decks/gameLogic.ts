import { getDeckCards, getDeckCardsByDifficulty, DYNAMIC_CARDS } from "./data";
import { GameState, Player, Difficulty, Card } from "./types";

export const INITIAL_TIMER = 60;
export const CARDS_PER_ROUND = 10;

// Score multipliers based on difficulty for Classic deck
// Difficulty affects: forbidden words shown AND point multiplier
// Easy: Show 2 forbidden words, 1x points
// Medium: Show 3 forbidden words, 1.5x points
// Hard: Show all 4 forbidden words, 2x points
export const DIFFICULTY_MULTIPLIERS: Record<string, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  random: 1.0, // Random uses the card's base points
};

// Number of forbidden words to show based on difficulty
export const FORBIDDEN_WORDS_COUNT: Record<string, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
  random: 4, // Random shows all
};

export function createInitialState(
  players: string[],
  difficulty: Difficulty,
  maxRounds: number = 3,
  deckId: string = "classic"
): GameState {
  const playerObjects: Player[] = players.map((name, index) => ({
    id: `p${index}`,
    name,
    score: 0,
  }));

  // For Classic deck: always get ALL cards, no difficulty filtering
  // For Rhymes deck: filter by difficulty
  const deckCards = deckId === "classic"
    ? getDeckCards(deckId)
    : getDeckCardsByDifficulty(deckId, difficulty);

  return {
    players: playerObjects,
    currentPlayerIndex: 1, // The player guessing
    clueGiverIndex: 0,    // The player before guessing player
    difficulty,
    currentRound: 1,
    maxRounds,
    score: 0,
    timer: INITIAL_TIMER,
    phase: "setup",
    cards: [...deckCards].sort(() => Math.random() - 0.5),
    usedCardIds: [],
    currentCard: null,
    roundScore: 0,
    skipsUsed: 0,
    cardsInRound: 0,
    maxCardsInRound: CARDS_PER_ROUND,
    deckId,
  };
}

export function drawNextCard(state: GameState, forceReload: boolean = false): GameState {
  let cards = state.cards;
  let usedCardIds = state.usedCardIds;

  // Reload cards if forced (e.g., difficulty changed) or if we run out
  if (forceReload || cards.length === 0 || cards.filter(c => !usedCardIds.includes(c.id)).length === 0) {
    // For Classic deck: always get ALL cards
    // For Rhymes deck: filter by difficulty
    const deckCards = state.deckId === "classic"
      ? getDeckCards(state.deckId)
      : getDeckCardsByDifficulty(state.deckId, state.difficulty);
    cards = [...deckCards].sort(() => Math.random() - 0.5);
    usedCardIds = []; // Reset used cards
  }

  const availableCards = cards.filter(c => !usedCardIds.includes(c.id));

  if (availableCards.length === 0) {
    // This shouldn't happen after the reload above, but just in case
    return state;
  }

  const nextCard = availableCards[availableCards.length > 1 ? Math.floor(Math.random() * availableCards.length) : 0];
  return {
    ...state,
    cards,
    usedCardIds: [...usedCardIds, nextCard.id],
    currentCard: nextCard,
  };
}

// Calculate points with difficulty multiplier
export function calculatePoints(card: Card, difficulty: Difficulty, deckId: string): number {
  // For "random" difficulty, use base points without multiplier
  if (difficulty === "random") {
    return card.points;
  }

  // Apply multiplier to the card's base points
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
  return Math.round(card.points * multiplier);
}

// Get forbidden words to display based on difficulty
export function getForbiddenWords(card: Card, difficulty: Difficulty): string[] {
  const count = FORBIDDEN_WORDS_COUNT[difficulty] || 4;
  // Return only the first N forbidden words based on difficulty
  return card.forbidden.slice(0, count);
}

export function handleCorrect(state: GameState): GameState {
  if (!state.currentCard) return state;

  const points = calculatePoints(state.currentCard, state.difficulty, state.deckId);
  const updatedPlayers = [...state.players];
  updatedPlayers[state.currentPlayerIndex].score += points;

  const nextState = {
    ...state,
    players: updatedPlayers,
    roundScore: state.roundScore + points,
    cardsInRound: state.cardsInRound + 1,
  };

  return drawNextCard(nextState);
}

export function handlePass(state: GameState): GameState {
  const nextState = {
    ...state,
    skipsUsed: state.skipsUsed + 1,
    cardsInRound: state.cardsInRound + 1,
  };

  return drawNextCard(nextState);
}

export function startNextTurn(state: GameState): GameState {
  const totalPlayers = state.players.length;

  // Calculate who goes next
  const nextGuesser = (state.currentPlayerIndex + 1) % totalPlayers;
  const nextClueGiver = state.currentPlayerIndex;

  // A round is complete when the clueGiver returns to the very first person (index 0)
  const isRoundComplete = nextClueGiver === totalPlayers - 1;
  const nextRoundNumber = isRoundComplete ? state.currentRound + 1 : state.currentRound;

  // Check if we have exceeded the max rounds
  if (isRoundComplete && state.currentRound >= state.maxRounds) {
    return {
      ...state,
      phase: "game-over",
      currentCard: null,
    };
  }

  return {
    ...state,
    currentPlayerIndex: nextGuesser,
    clueGiverIndex: nextClueGiver,
    currentRound: nextRoundNumber,
    timer: INITIAL_TIMER,
    phase: "instructions", // Show who is next before starting
    roundScore: 0,
    skipsUsed: 0,
    cardsInRound: 0,
    currentCard: null,
  };
}

/**
 * Transition from playing to turn-ended when timer hits 0.
 */
export function endTurn(state: GameState): GameState {
  return {
    ...state,
    phase: "round-summary",
    currentCard: null, // Stop showing the card so they can't guess after time
  };
}
