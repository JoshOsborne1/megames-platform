// Quiz Quarter - Type Definitions
// Following the established patterns from Dynamic Decks

// =============================================================================
// DIFFICULTY & SCORING
// =============================================================================

export type Difficulty = "easy" | "medium" | "hard";
export type MixedDifficulty = Difficulty | "mixed";

// Base points by difficulty
export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
    easy: 10,
    medium: 20,
    hard: 30,
};

// Speed bonus thresholds (percentage of time remaining)
export const SPEED_BONUS = {
    quick: { threshold: 0.7, multiplier: 1.5 },   // >70% time left
    fast: { threshold: 0.5, multiplier: 1.25 },   // >50% time left
    normal: { threshold: 0, multiplier: 1.0 },    // Any answer
};

// Streak bonuses
export const STREAK_MULTIPLIERS: Record<number, number> = {
    0: 1.0,
    3: 1.2,   // 3 in a row
    5: 1.5,   // 5 in a row
    7: 1.75,  // 7 in a row
    10: 2.0,  // 10+ in a row
};

// =============================================================================
// QUESTION STRUCTURE
// =============================================================================

export interface Question {
    id: string;
    question: string;
    correctAnswer: string;
    incorrectAnswers: [string, string, string];  // Exactly 3 distractors
    difficulty: Difficulty;
    deckId: string;
    packId: string;
}

// =============================================================================
// DECK & PACK STRUCTURE
// =============================================================================

export interface DeckInfo {
    id: string;
    name: string;
    description: string;
    icon: string;           // Lucide icon name
    accentColor: string;
    packId: string;
    questionCount: number;
    isPremium: boolean;
    freeQuestionLimit: number;  // 50 for free tier
}

export interface PackInfo {
    id: string;
    name: string;
    description: string;
    icon: string;
    accentColor: string;
    deckIds: string[];
    price: number;          // Display price (e.g., 2.99)
    priceId?: string;       // For in-app purchase integration
}

export interface Deck {
    info: DeckInfo;
    questions: Question[];
}

export interface Pack {
    info: PackInfo;
    decks: Deck[];
}

// =============================================================================
// POWER-UPS (Phase 2)
// =============================================================================

export type PowerUpType = "fifty_fifty" | "skip" | "extra_time" | "double_points";

export interface PowerUp {
    type: PowerUpType;
    remaining: number;
}

export const POWER_UP_INFO: Record<PowerUpType, { name: string; description: string; icon: string }> = {
    fifty_fifty: {
        name: "50/50",
        description: "Remove two wrong answers",
        icon: "Divide",
    },
    skip: {
        name: "Skip",
        description: "Skip to next question (no penalty)",
        icon: "SkipForward",
    },
    extra_time: {
        name: "+10s",
        description: "Add 10 seconds to timer",
        icon: "Clock",
    },
    double_points: {
        name: "2x Points",
        description: "Double points for this question",
        icon: "Sparkles",
    },
};

// =============================================================================
// PLAYER STATE
// =============================================================================

export interface Player {
    id: string;
    name: string;
    score: number;
    streak: number;
    bestStreak: number;
    correctAnswers: number;
    totalAnswers: number;
    totalSkips: number;
    powerUps: PowerUp[];
}

// =============================================================================
// GAME STATE
// =============================================================================

export type GamePhase =
    | "setup"           // Selecting packs, difficulty, players
    | "countdown"       // 3-2-1 before question
    | "question"        // Showing question, timer running
    | "answer-reveal"   // Showing correct/incorrect
    | "round-summary"   // Between player turns (party mode)
    | "game-over";      // Final results

export type GameMode = "solo" | "party";

export interface GameSettings {
    difficulty: MixedDifficulty;
    timePerQuestion: number;  // Only used in party mode
    questionsPerRound: number;
    totalRounds: number;
    selectedDeckIds: string[];
    selectedPackIds: string[];
    timedMode: boolean;  // false for solo (relaxed), true for party
}

export interface GameState {
    // Players
    players: Player[];
    currentPlayerIndex: number;

    // Game settings
    gameMode: GameMode;
    settings: GameSettings;

    // Progress tracking
    currentRound: number;
    currentQuestionNumber: number;
    questionsInCurrentRound: number;

    // Current question state
    phase: GamePhase;
    currentQuestion: Question | null;
    shuffledAnswers: string[];
    selectedAnswer: string | null;
    isCorrect: boolean | null;
    timer: number;
    timeRemaining: number;

    // Question pool management
    usedQuestionIds: Set<string>;
    availableQuestions: Question[];

    // Round scoring
    roundScore: number;
    lastPointsEarned: number;
    speedBonus: number;
    streakBonus: number;

    // Power-up state (Phase 2)
    eliminatedAnswers: string[];
    doublePointsActive: boolean;
}

// =============================================================================
// GAME CONFIGURATION
// =============================================================================

export const GAME_CONFIG = {
    defaultTimePerQuestion: 15,
    minTimePerQuestion: 10,
    maxTimePerQuestion: 30,
    questionsPerRound: 10,
    defaultRounds: 1,
    freeQuestionLimit: 50,
    countdownDuration: 3,
    freeSkipsPerSession: 3,  // Free users get 3 skips before needing to watch ads
};

// =============================================================================
// ANSWER RESULT
// =============================================================================

export interface AnswerResult {
    isCorrect: boolean;
    correctAnswer: string;
    selectedAnswer: string;
    basePoints: number;
    speedBonus: number;
    streakBonus: number;
    totalPoints: number;
    newStreak: number;
    timeRemaining: number;
}
