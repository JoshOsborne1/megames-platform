import { FORBIDDEN_CARDS } from "./data";
import { GameState, Player, Difficulty, Card } from "./types";

export const INITIAL_TIMER = 60;
export const CARDS_PER_ROUND = 5;
export const MAX_SKIPS = 3;

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
  const nextGuesser = (state.currentPlayerIndex + 1) % state.players.length;
  const nextClueGiver = state.currentPlayerIndex;

  const isNewRound = nextGuesser === 1; // back to the first sequence? or just check rounds
  
  const updatedRound = isNewRound ? state.currentRound + 1 : state.currentRound;

  if (updatedRound > state.maxRounds) {
      return {
          ...state,
          phase: "game-over"
      };
  }

  return {
    ...state,
    currentPlayerIndex: nextGuesser,
    clueGiverIndex: nextClueGiver,
    currentRound: updatedRound,
    timer: INITIAL_TIMER,
    phase: "instructions",
    roundScore: 0,
    skipsUsed: 0,
    cardsInRound: 0,
  };
}
