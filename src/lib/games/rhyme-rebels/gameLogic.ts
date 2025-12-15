import { GameState, GameMode, Team, Player, RhymePair, Guess } from './types';
import { shuffleDeck, allRhymes } from './rhymeDeck';

export function createInitialState(
  players: Player[],
  mode: 'online' | 'local',
  gameId: string
): GameState {
  const teams = createTeams(players);
  const shuffledDeck = shuffleDeck(allRhymes);
  const rhymePairs = generateRhymePairs();

  return {
    gameId,
    mode,
    phase: 'dice-roll',
    teams,
    currentTeamIndex: 0,
    currentClueGiverId: teams[0]?.players[0]?.id || '',
    currentRound: 1,
    maxRounds: 10,
    targetScore: 15,
    currentCard: null,
    currentMode: null,
    timeLeft: 30,
    guesses: [],
    deck: shuffledDeck,
    rhymePairs,
    powerUps: [],
  };
}

export function createTeams(players: Player[]): Team[] {
  const teamColors = ['#00BFFF', '#FF4500', '#32CD32', '#9370DB'];
  const teamCount = Math.min(Math.ceil(players.length / 2), 4);
  const teams: Team[] = [];

  for (let i = 0; i < teamCount; i++) {
    teams.push({
      id: i,
      name: `Team ${i + 1}`,
      color: teamColors[i],
      score: 0,
      players: [],
    });
  }

  players.forEach((player, index) => {
    const teamIndex = index % teamCount;
    teams[teamIndex].players.push(player);
  });

  return teams;
}

export function generateRhymePairs(): RhymePair[] {
  const pairs: RhymePair[] = [];
  const usedRhymes = new Set<string>();
  
  const shuffled = shuffleDeck(allRhymes);
  
  for (let i = 0; i < 18 && i < shuffled.length; i++) {
    const card = shuffled[i];
    if (!usedRhymes.has(card.rhyme)) {
      pairs.push({
        id: `pair-${i}`,
        celebHalf: card.celeb,
        rhymeHalf: card.rhyme,
        isFlipped: false,
        isMatched: false,
      });
      usedRhymes.add(card.rhyme);
    }
  }
  
  return shuffleArray(pairs);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function rollDice(): GameMode {
  const modes: GameMode[] = ['describe', 'act', 'solve'];
  return modes[Math.floor(Math.random() * modes.length)];
}

export function drawCard(state: GameState): GameState {
  if (state.deck.length === 0) {
    return { ...state, deck: shuffleDeck(allRhymes), currentCard: null };
  }

  const [currentCard, ...remainingDeck] = state.deck;
  return {
    ...state,
    currentCard,
    deck: remainingDeck,
  };
}

export function submitGuess(
  state: GameState,
  playerId: string,
  playerName: string,
  teamId: number,
  guess: string
): { state: GameState; isCorrect: boolean } {
  if (!state.currentCard) {
    return { state, isCorrect: false };
  }

  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedPhrase = state.currentCard.phrase.toLowerCase().trim();
  const normalizedCeleb = state.currentCard.celeb.toLowerCase().trim();
  
  const isCorrect = 
    normalizedGuess === normalizedPhrase ||
    normalizedGuess === normalizedCeleb ||
    normalizedPhrase.includes(normalizedGuess) && normalizedGuess.length > 3;

  const newGuess: Guess = {
    playerId,
    playerName,
    teamId,
    guess,
    timestamp: Date.now(),
    isCorrect,
  };

  const updatedTeams = state.teams.map(team => {
    if (team.id === teamId) {
      if (isCorrect) {
        return { ...team, score: team.score + 1 };
      } else {
        return { ...team, score: Math.max(0, team.score - 0.33) };
      }
    }
    return team;
  });

  return {
    state: {
      ...state,
      guesses: [...state.guesses, newGuess],
      teams: updatedTeams,
    },
    isCorrect,
  };
}

export function matchPairs(
  state: GameState,
  firstIndex: number,
  secondIndex: number
): { state: GameState; isMatch: boolean; points: number } {
  const firstPair = state.rhymePairs[firstIndex];
  const secondPair = state.rhymePairs[secondIndex];

  if (!firstPair || !secondPair) {
    return { state, isMatch: false, points: 0 };
  }

  const isMatch = 
    (firstPair.celebHalf === secondPair.celebHalf && firstPair.rhymeHalf === secondPair.rhymeHalf) ||
    firstPair.id === secondPair.id;

  const updatedPairs = state.rhymePairs.map((pair, index) => {
    if (index === firstIndex || index === secondIndex) {
      return { ...pair, isFlipped: true, isMatched: isMatch };
    }
    return pair;
  });

  const points = isMatch ? 2 : 0;

  const updatedTeams = state.teams.map((team, index) => {
    if (index === state.currentTeamIndex && isMatch) {
      return { ...team, score: team.score + points };
    }
    return team;
  });

  return {
    state: {
      ...state,
      rhymePairs: updatedPairs,
      teams: updatedTeams,
    },
    isMatch,
    points,
  };
}

export function nextTurn(state: GameState): GameState {
  const currentTeam = state.teams[state.currentTeamIndex];
  const currentGiverIndex = currentTeam.players.findIndex(p => p.id === state.currentClueGiverId);
  const nextGiverIndex = (currentGiverIndex + 1) % currentTeam.players.length;
  
  let nextTeamIndex = state.currentTeamIndex;
  let nextRound = state.currentRound;
  let nextClueGiverId = currentTeam.players[nextGiverIndex].id;

  if (nextGiverIndex === 0) {
    nextTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
    if (nextTeamIndex === 0) {
      nextRound++;
    }
    const nextTeam = state.teams[nextTeamIndex];
    nextClueGiverId = nextTeam.players[0].id;
  }

  return {
    ...state,
    currentTeamIndex: nextTeamIndex,
    currentClueGiverId: nextClueGiverId,
    currentRound: nextRound,
    currentCard: null,
    currentMode: null,
    timeLeft: 30,
    guesses: [],
    phase: nextRound > state.maxRounds ? 'end' : 'dice-roll',
  };
}

export function checkWinCondition(state: GameState): { winner: Team | null; isGameOver: boolean } {
  const winner = state.teams.find(team => team.score >= state.targetScore);
  const isGameOver = winner !== undefined || state.currentRound > state.maxRounds;

  if (isGameOver && !winner) {
    const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
    return { winner: sortedTeams[0], isGameOver: true };
  }

  return { winner: winner || null, isGameOver };
}