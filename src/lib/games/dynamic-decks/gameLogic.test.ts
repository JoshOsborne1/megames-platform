/**
 * Unit Tests for Dynamic Decks Game Logic
 * Run with: npx tsx src/lib/games/dynamic-decks/gameLogic.test.ts
 */

import {
  createInitialState,
  calculatePoints,
  getForbiddenWords,
  handleCorrect,
  handleCorrectByPlayer,
  handlePass,
  startNextTurn,
  endTurn,
  INITIAL_TIMER,
  DIFFICULTY_MULTIPLIERS,
} from "./gameLogic";
import type { GameState, Card } from "./types";

// Simple test runner
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error}`);
    failed++;
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== "number" || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== "number" || actual > expected) {
        throw new Error(`Expected ${actual} to be <= ${expected}`);
      }
    },
    toHaveLength(expected: number) {
      if (!Array.isArray(actual) || actual.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${Array.isArray(actual) ? actual.length : "not an array"}`);
      }
    },
    toBeDefined() {
      if (actual === undefined || actual === null) {
        throw new Error(`Expected value to be defined`);
      }
    },
  };
}

// =============================================================================
// TESTS
// =============================================================================

console.log("\n🎮 Dynamic Decks Game Logic Tests\n");
console.log("=".repeat(50));

// Test: createInitialState
test("createInitialState creates correct number of players", () => {
  const state = createInitialState(["Alice", "Bob", "Charlie"], "easy", 3, "classic");
  expect(state.players.length).toBe(3);
});

test("createInitialState sets correct player names", () => {
  const state = createInitialState(["Alice", "Bob"], "easy", 3, "classic");
  expect(state.players[0].name).toBe("Alice");
  expect(state.players[1].name).toBe("Bob");
});

test("createInitialState initializes scores to 0", () => {
  const state = createInitialState(["Alice", "Bob"], "easy", 3, "classic");
  expect(state.players[0].score).toBe(0);
  expect(state.players[1].score).toBe(0);
});

test("createInitialState sets correct max rounds", () => {
  const state = createInitialState(["Alice", "Bob"], "easy", 5, "classic");
  expect(state.maxRounds).toBe(5);
});

test("createInitialState starts on round 1", () => {
  const state = createInitialState(["Alice", "Bob"], "easy", 3, "classic");
  expect(state.currentRound).toBe(1);
});

// Test: calculatePoints
test("calculatePoints applies easy multiplier (1.0x)", () => {
  const card: Card = { id: "test", word: "Test", forbiddenWords: [], category: "test", points: 10 };
  const points = calculatePoints(card, "easy");
  expect(points).toBe(10);
});

test("calculatePoints applies medium multiplier (1.5x)", () => {
  const card: Card = { id: "test", word: "Test", forbiddenWords: [], category: "test", points: 10 };
  const points = calculatePoints(card, "medium");
  expect(points).toBe(15);
});

test("calculatePoints applies hard multiplier (2.0x)", () => {
  const card: Card = { id: "test", word: "Test", forbiddenWords: [], category: "test", points: 10 };
  const points = calculatePoints(card, "hard");
  expect(points).toBe(20);
});

// Test: getForbiddenWords
test("getForbiddenWords returns 2 words for easy difficulty", () => {
  const card: Card = { 
    id: "test", 
    word: "Test", 
    forbiddenWords: ["a", "b", "c", "d"], 
    category: "test", 
    points: 10 
  };
  const words = getForbiddenWords(card, "easy");
  expect(words.length).toBe(2);
});

test("getForbiddenWords returns 3 words for medium difficulty", () => {
  const card: Card = { 
    id: "test", 
    word: "Test", 
    forbiddenWords: ["a", "b", "c", "d"], 
    category: "test", 
    points: 10 
  };
  const words = getForbiddenWords(card, "medium");
  expect(words.length).toBe(3);
});

// Test: handlePass
test("handlePass increments skipsUsed", () => {
  const state = createInitialState(["Alice", "Bob"], "easy", 3, "classic");
  state.phase = "playing";
  state.currentCard = { id: "test", word: "Test", forbiddenWords: [], category: "test", points: 10 };
  
  const newState = handlePass(state);
  expect(newState.skipsUsed).toBe(1);
});

// Test: endTurn
test("endTurn changes phase to round-summary", () => {
  const state = createInitialState(["Alice", "Bob"], "easy", 3, "classic");
  state.phase = "playing";
  
  const newState = endTurn(state);
  expect(newState.phase).toBe("round-summary");
});

// Test: Timer constant
test("INITIAL_TIMER is 60 seconds", () => {
  expect(INITIAL_TIMER).toBe(60);
});

// Test: Difficulty multipliers
test("DIFFICULTY_MULTIPLIERS has correct values", () => {
  expect(DIFFICULTY_MULTIPLIERS.easy).toBe(1.0);
  expect(DIFFICULTY_MULTIPLIERS.medium).toBe(1.5);
  expect(DIFFICULTY_MULTIPLIERS.hard).toBe(2.0);
});

// =============================================================================
// SUMMARY
// =============================================================================

console.log("\n" + "=".repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
