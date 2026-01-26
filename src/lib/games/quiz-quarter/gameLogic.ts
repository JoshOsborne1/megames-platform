// Quiz Quarter - Game Logic
import {
    GameState,
    GameSettings,
    GameMode,
    Player,
    Question,
    AnswerResult,
    DIFFICULTY_POINTS,
    SPEED_BONUS,
    STREAK_MULTIPLIERS,
    GAME_CONFIG,
} from "./types";
import { getQuestionsByDeck, getDeckInfo } from "./data";

// =============================================================================
// GAME INITIALIZATION
// =============================================================================

export function createInitialState(
    playerNames: string[],
    settings: GameSettings,
    gameMode: GameMode = "solo"
): GameState {
    const players: Player[] = playerNames.map((name, index) => ({
        id: `player-${index}`,
        name,
        score: 0,
        streak: 0,
        bestStreak: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        totalSkips: 0,
        powerUps: [],
    }));

    // Build question pool from selected decks
    let availableQuestions: Question[] = [];

    // Support both simple deck IDs and pack:deck format
    for (const id of settings.selectedDeckIds) {
        const deckId = id.includes(':') ? id.split(':')[1] : id;
        let deckQuestions = getQuestionsByDeck(deckId);
        
        // Enforce limits for free users
        if (!settings.isPremium) {
            const deckInfo = getDeckInfo(deckId);
            const limit = deckInfo?.freeQuestionLimit || GAME_CONFIG.freeQuestionLimit;
            deckQuestions = deckQuestions.slice(0, limit);
        }

        availableQuestions = [...availableQuestions, ...deckQuestions];
    }

    // Filter by difficulty if not mixed
    if (settings.difficulty !== "mixed") {
        availableQuestions = availableQuestions.filter(
            q => q.difficulty === settings.difficulty
        );
    }

    // Shuffle the question pool
    availableQuestions = shuffleArray([...availableQuestions]);

    return {
        players,
        currentPlayerIndex: 0,
        gameMode,
        settings,
        currentRound: 1,
        currentQuestionNumber: 0,
        questionsInCurrentRound: 0,
        phase: "setup",
        currentQuestion: null,
        shuffledAnswers: [],
        selectedAnswer: null,
        isCorrect: null,
        timer: settings.timePerQuestion,
        timeRemaining: settings.timePerQuestion,
        usedQuestionIds: new Set(),
        availableQuestions,
        roundScore: 0,
        lastPointsEarned: 0,
        speedBonus: 0,
        streakBonus: 0,
        eliminatedAnswers: [],
        doublePointsActive: false,
        hintSkipState: {
            freeSkipsRemaining: GAME_CONFIG.freeSkipsPerSession,
            freeHintsRemaining: GAME_CONFIG.freeHintsPerSession,
            poolRemaining: settings.isPremium ? GAME_CONFIG.proWeeklySkips : 0,
            usedAdSkip: false,
            usedAdHint: false,
        },
    };
}

// =============================================================================
// QUESTION MANAGEMENT
// =============================================================================

export function drawNextQuestion(state: GameState): GameState {
    // Find an unused question
    const unusedQuestions = state.availableQuestions.filter(
        q => !state.usedQuestionIds.has(q.id)
    );

    if (unusedQuestions.length === 0) {
        // Reset pool if we've used all questions
        return {
            ...state,
            usedQuestionIds: new Set(),
            availableQuestions: shuffleArray([...state.availableQuestions]),
        };
    }

    // Pick a random question
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const question = unusedQuestions[randomIndex];

    // Shuffle the answers
    const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
    const shuffledAnswers = shuffleArray(allAnswers);

    const isTimeMode = state.settings.challengeMode === "time";
    const timer = isTimeMode ? 10 : state.settings.timePerQuestion;

    return {
        ...state,
        currentQuestion: question,
        shuffledAnswers,
        selectedAnswer: null,
        isCorrect: null,
        timeRemaining: timer,
        timer: timer,
        usedQuestionIds: new Set([...state.usedQuestionIds, question.id]),
        currentQuestionNumber: state.currentQuestionNumber + 1,
        questionsInCurrentRound: state.questionsInCurrentRound + 1,
        phase: "question",
        eliminatedAnswers: [],
        doublePointsActive: false,
        lastPointsEarned: 0,
        speedBonus: 0,
        streakBonus: 0,
    };
}

export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// =============================================================================
// ANSWER HANDLING
// =============================================================================

export function handleAnswer(
    state: GameState,
    selectedAnswer: string,
    timeRemaining: number
): { state: GameState; result: AnswerResult } {
    if (!state.currentQuestion) {
        throw new Error("No current question");
    }

    const isCorrect = selectedAnswer === state.currentQuestion.correctAnswer;
    const currentPlayer = state.players[state.currentPlayerIndex];

    // Calculate points
    const basePoints = isCorrect ? DIFFICULTY_POINTS[state.currentQuestion.difficulty] : 0;

    // Speed bonus (percentage of time remaining)
    let speedMultiplier = 1.0;
    if (isCorrect) {
        const timePercent = timeRemaining / state.settings.timePerQuestion;
        if (timePercent >= SPEED_BONUS.quick.threshold) {
            speedMultiplier = SPEED_BONUS.quick.multiplier;
        } else if (timePercent >= SPEED_BONUS.fast.threshold) {
            speedMultiplier = SPEED_BONUS.fast.multiplier;
        }
    }
    const speedBonus = Math.round(basePoints * (speedMultiplier - 1));

    // Streak bonus
    const newStreak = isCorrect ? currentPlayer.streak + 1 : 0;
    let streakMultiplier = 1.0;
    for (const [threshold, mult] of Object.entries(STREAK_MULTIPLIERS).reverse()) {
        if (newStreak >= parseInt(threshold)) {
            streakMultiplier = mult;
            break;
        }
    }
    const streakBonus = isCorrect ? Math.round(basePoints * (streakMultiplier - 1)) : 0;

    // Double points power-up
    const doubleMultiplier = state.doublePointsActive ? 2 : 1;

    // Total points
    const totalPoints = (basePoints + speedBonus + streakBonus) * doubleMultiplier;

    // Update player
    const updatedPlayers = [...state.players];
    updatedPlayers[state.currentPlayerIndex] = {
        ...currentPlayer,
        score: currentPlayer.score + totalPoints,
        streak: newStreak,
        bestStreak: Math.max(currentPlayer.bestStreak, newStreak),
        correctAnswers: currentPlayer.correctAnswers + (isCorrect ? 1 : 0),
        totalAnswers: currentPlayer.totalAnswers + 1,
    };

    const result: AnswerResult = {
        isCorrect,
        correctAnswer: state.currentQuestion.correctAnswer,
        selectedAnswer,
        basePoints,
        speedBonus,
        streakBonus,
        totalPoints,
        newStreak,
        timeRemaining,
    };

    return {
        state: {
            ...state,
            players: updatedPlayers,
            selectedAnswer,
            isCorrect,
            timeRemaining,
            phase: "answer-reveal",
            roundScore: state.roundScore + totalPoints,
            lastPointsEarned: totalPoints,
            speedBonus,
            streakBonus,
        },
        result,
    };
}

export function handleTimeout(state: GameState): { state: GameState; result: AnswerResult } {
    return handleAnswer(state, "", 0);
}

// Skip question (no penalty, just move on)
export function handleSkip(state: GameState): GameState {
    if (!state.currentQuestion) return state;

    const currentPlayer = state.players[state.currentPlayerIndex];
    const updatedPlayers = [...state.players];
    updatedPlayers[state.currentPlayerIndex] = {
        ...currentPlayer,
        totalSkips: currentPlayer.totalSkips + 1,
        streak: 0, // Reset streak on skip
    };

    const newHintSkipState = { ...state.hintSkipState };
    if (state.settings.isPremium) {
        if (newHintSkipState.poolRemaining > 0) {
            newHintSkipState.poolRemaining -= 1;
        }
    } else {
        if (newHintSkipState.freeSkipsRemaining > 0) {
            newHintSkipState.freeSkipsRemaining -= 1;
        } else {
            // Used ad skip
            newHintSkipState.usedAdSkip = true;
        }
    }

    return {
        ...state,
        players: updatedPlayers,
        selectedAnswer: null,
        isCorrect: null,
        phase: "answer-reveal",
        lastPointsEarned: 0,
        speedBonus: 0,
        streakBonus: 0,
        hintSkipState: newHintSkipState,
    };
}

// =============================================================================
// GAME FLOW
// =============================================================================

export function startGame(state: GameState): GameState {
    const newState = drawNextQuestion(state);
    return {
        ...newState,
        phase: "countdown",
    };
}

export function startQuestion(state: GameState): GameState {
    return {
        ...state,
        phase: "question",
    };
}

export function proceedAfterAnswer(state: GameState): GameState {
    const questionsPerRound = state.settings.questionsPerRound;
    const totalRounds = state.settings.totalRounds;
    
    // In streak mode, round is only complete on game over (handled by handleAnswer)
    // but we can just use a large number or check the mode specifically
    const isStreakMode = state.settings.challengeMode === "streak";
    
    // Check if round is complete
    if (state.questionsInCurrentRound >= questionsPerRound && !isStreakMode) {
        // Check if game is over
        if (state.currentRound >= totalRounds) {
            return {
                ...state,
                phase: "game-over",
            };
        }

        // In party mode, rotate to next player
        if (state.gameMode === "party") {
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            const isNewRound = nextPlayerIndex === 0;

            return {
                ...state,
                phase: "round-summary",
                currentPlayerIndex: nextPlayerIndex,
                currentRound: isNewRound ? state.currentRound + 1 : state.currentRound,
                questionsInCurrentRound: 0,
                roundScore: 0,
            };
        }

        // Solo mode - just increment round
        return {
            ...state,
            phase: "round-summary",
            currentRound: state.currentRound + 1,
            questionsInCurrentRound: 0,
            roundScore: 0,
        };
    }

    // Continue with next question
    return drawNextQuestion(state);
}

export function startNextRound(state: GameState): GameState {
    return drawNextQuestion({
        ...state,
        phase: "countdown",
    });
}
// Hint (50/50)
export function handleHint(state: GameState): GameState {
    if (!state.currentQuestion || state.phase !== "question") return state;

    // Randomly select 2 incorrect answers to eliminate
    const incorrectAnswers = state.shuffledAnswers.filter(
        a => a !== state.currentQuestion!.correctAnswer
    );
    const toEliminate = shuffleArray(incorrectAnswers).slice(0, 2);

    const newHintSkipState = { ...state.hintSkipState };
    if (state.settings.isPremium) {
        if (newHintSkipState.poolRemaining > 0) {
            newHintSkipState.poolRemaining -= 1;
        }
    } else {
        if (newHintSkipState.freeHintsRemaining > 0) {
            newHintSkipState.freeHintsRemaining -= 1;
        } else {
            // Used ad hint
            newHintSkipState.usedAdHint = true;
        }
    }

    return {
        ...state,
        eliminatedAnswers: toEliminate,
        hintSkipState: newHintSkipState,
    };
}

export function useExtraTime(state: GameState): GameState {
    return {
        ...state,
        timeRemaining: state.timeRemaining + 10,
    };
}

export function useDoublePoints(state: GameState): GameState {
    return {
        ...state,
        doublePointsActive: true,
    };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function getLeaderboard(state: GameState): Player[] {
    return [...state.players].sort((a, b) => b.score - a.score);
}

export function getCurrentPlayer(state: GameState): Player {
    return state.players[state.currentPlayerIndex];
}

export function getQuestionProgress(state: GameState): { current: number; total: number } {
    return {
        current: state.questionsInCurrentRound,
        total: state.settings.questionsPerRound,
    };
}

export function getRoundProgress(state: GameState): { current: number; total: number } {
    return {
        current: state.currentRound,
        total: state.settings.totalRounds,
    };
}

export function calculateAccuracy(player: Player): number {
    if (player.totalAnswers === 0) return 0;
    return Math.round((player.correctAnswers / player.totalAnswers) * 100);
}
