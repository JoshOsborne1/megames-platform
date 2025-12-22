import { FORBIDDEN_CARDS } from "./data";
import { GameState, Player, Difficulty, Card } from "./types";

export const INITIAL_TIMER = 15;
export const CARDS_PER_ROUND = 10;

export function createInitialState(players: string[], difficulty: Difficulty): GameState {
  const playerObjects: Player[] = players.map((name, index) => ({
    id: `p${index}`,
    name,
    score: 0,
  }));

  return {
    players: playerObjects,
    currentPlayerIndex: 1, // The player guessing
    clueGiverIndex: 0,    // The player before guessing player
    difficulty,
    currentRound: 1,
    maxRounds: playerObjects.length,
    score: 0,
    timer: INITIAL_TIMER,
    phase: "setup",
    cards: [...FORBIDDEN_CARDS].sort(() => Math.random() - 0.5),
    usedCardIds: [],
    currentCard: null,
    roundScore: 0,
    skipsUsed: 0,
    cardsInRound: 0,
    maxCardsInRound: CARDS_PER_ROUND,
  };
}

export function drawNextCard(state: GameState): GameState {
  const availableCards = state.cards.filter(c => !state.usedCardIds.includes(c.id));
  if (availableCards.length === 0) {
    // Reshuffle if we run out
    const reshuffled = [...FORBIDDEN_CARDS].sort(() => Math.random() - 0.5);
    return {
      ...state,
      cards: reshuffled,
      usedCardIds: [reshuffled[0].id],
      currentCard: reshuffled[0],
    };
  }

  const nextCard = availableCards[0];
  return {
    ...state,
    usedCardIds: [...state.usedCardIds, nextCard.id],
    currentCard: nextCard,
  };
}

export function handleCorrect(state: GameState): GameState {
  if (!state.currentCard) return state;

  const points = state.currentCard.points;
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
