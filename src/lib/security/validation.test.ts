/**
 * Unit Tests for Security Validation Utilities
 * Run with: npx tsx src/lib/security/validation.test.ts
 */

import {
  validateRoomCode,
  validatePlayerName,
  validateClue,
} from "./validation";

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
    toContain(expected: string) {
      if (typeof actual !== "string" || !actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
  };
}

// =============================================================================
// ROOM CODE VALIDATION TESTS
// =============================================================================

console.log("\n🔒 Security Validation Tests\n");
console.log("=".repeat(50));
console.log("\n📝 Room Code Validation\n");

test("validateRoomCode accepts valid 5-char code", () => {
  const result = validateRoomCode("ABC23");
  expect(result.valid).toBe(true);
});

test("validateRoomCode converts to uppercase", () => {
  const result = validateRoomCode("abc23");
  expect(result.valid).toBe(true);
  expect(result.value).toBe("ABC23");
});

test("validateRoomCode rejects codes that are too short", () => {
  const result = validateRoomCode("ABC");
  expect(result.valid).toBe(false);
});

test("validateRoomCode rejects codes that are too long", () => {
  const result = validateRoomCode("ABCDEFG");
  expect(result.valid).toBe(false);
});

test("validateRoomCode rejects confusing characters (0, O, 1, I, L)", () => {
  const result = validateRoomCode("0OI1L");
  expect(result.valid).toBe(false);
});

// =============================================================================
// PLAYER NAME VALIDATION TESTS
// =============================================================================

console.log("\n👤 Player Name Validation\n");

test("validatePlayerName accepts valid name", () => {
  const result = validatePlayerName("JohnDoe");
  expect(result.valid).toBe(true);
});

test("validatePlayerName accepts names with spaces", () => {
  const result = validatePlayerName("John Doe");
  expect(result.valid).toBe(true);
});

test("validatePlayerName accepts names with underscores", () => {
  const result = validatePlayerName("John_Doe");
  expect(result.valid).toBe(true);
});

test("validatePlayerName accepts names with hyphens", () => {
  const result = validatePlayerName("John-Doe");
  expect(result.valid).toBe(true);
});

test("validatePlayerName rejects empty names", () => {
  const result = validatePlayerName("");
  expect(result.valid).toBe(false);
});

test("validatePlayerName rejects names longer than 20 chars", () => {
  const result = validatePlayerName("ThisNameIsTooLongForTheSystem");
  expect(result.valid).toBe(false);
});

test("validatePlayerName rejects special characters", () => {
  const result = validatePlayerName("John<script>");
  expect(result.valid).toBe(false);
});

// =============================================================================
// CLUE VALIDATION TESTS
// =============================================================================

console.log("\n💬 Clue Validation\n");

test("validateClue accepts valid clue", () => {
  const result = validateClue("ocean");
  expect(result.valid).toBe(true);
});

test("validateClue rejects empty clues", () => {
  const result = validateClue("");
  expect(result.valid).toBe(false);
});

test("validateClue rejects clues with color words (red)", () => {
  const result = validateClue("blood red");
  expect(result.valid).toBe(false);
});

test("validateClue rejects clues with color words (blue)", () => {
  const result = validateClue("sky blue");
  expect(result.valid).toBe(false);
});

test("validateClue rejects clues with color words (green)", () => {
  const result = validateClue("forest green");
  expect(result.valid).toBe(false);
});

test("validateClue rejects clues with numbers", () => {
  const result = validateClue("color 255");
  expect(result.valid).toBe(false);
});

test("validateClue rejects clues with 'rgb'", () => {
  const result = validateClue("rgb value");
  expect(result.valid).toBe(false);
});

test("validateClue rejects clues with 'hex'", () => {
  const result = validateClue("hex code");
  expect(result.valid).toBe(false);
});

test("validateClue sanitizes HTML in output", () => {
  const result = validateClue("sunset");
  expect(result.valid).toBe(true);
});

test("validateClue rejects clues longer than 50 chars", () => {
  const longClue = "a".repeat(51);
  const result = validateClue(longClue);
  expect(result.valid).toBe(false);
});

// =============================================================================
// SUMMARY
// =============================================================================

console.log("\n" + "=".repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
