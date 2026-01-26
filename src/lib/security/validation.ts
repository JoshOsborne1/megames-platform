/**
 * Input Validation Utilities
 * Prevents XSS, injection, and ensures data integrity
 */

import { z } from "zod";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_CLUE_LENGTH = 50;
const MAX_PLAYER_NAME_LENGTH = 20;
const MIN_PLAYER_NAME_LENGTH = 1;
const ROOM_CODE_LENGTH = 5;

// =============================================================================
// SCHEMAS
// =============================================================================

/**
 * Room code validator - uppercase alphanumeric, no confusing chars
 */
export const roomCodeSchema = z
  .string()
  .length(ROOM_CODE_LENGTH)
  .regex(/^[A-HJ-NP-Z2-9]+$/, "Invalid room code format")
  .transform((val) => val.toUpperCase());

/**
 * Player display name validator
 */
export const playerNameSchema = z
  .string()
  .min(MIN_PLAYER_NAME_LENGTH, "Name is required")
  .max(MAX_PLAYER_NAME_LENGTH, `Name must be ${MAX_PLAYER_NAME_LENGTH} characters or less`)
  .regex(/^[a-zA-Z0-9\s_-]+$/, "Name contains invalid characters")
  .transform((val) => val.trim());

/**
 * Game clue validator - prevents color words, numbers, cheating
 */
export const clueSchema = z
  .string()
  .min(1, "Clue is required")
  .max(MAX_CLUE_LENGTH, `Clue must be ${MAX_CLUE_LENGTH} characters or less`)
  .refine((val) => !containsForbiddenWords(val), {
    message: "Clue cannot contain color names or numbers",
  })
  .transform((val) => sanitizeText(val));

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

const FORBIDDEN_WORDS = [
  // Colors
  "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown",
  "black", "white", "gray", "grey", "cyan", "magenta", "teal", "violet",
  "indigo", "maroon", "navy", "olive", "aqua", "lime", "coral", "salmon",
  "turquoise", "beige", "tan", "crimson", "scarlet", "azure", "gold",
  // Numbers and hex
  "rgb", "hsl", "hsv", "hex", "#",
];

const NUMBER_PATTERN = /\d+/;

function containsForbiddenWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check for color words
  for (const word of FORBIDDEN_WORDS) {
    if (lowerText.includes(word)) {
      return true;
    }
  }
  
  // Check for numbers
  if (NUMBER_PATTERN.test(text)) {
    return true;
  }
  
  return false;
}

/**
 * Sanitize text to prevent XSS
 */
function sanitizeText(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim();
}

// =============================================================================
// HELPER EXPORTS
// =============================================================================

export function validateRoomCode(code: string): { valid: boolean; error?: string; value?: string } {
  const result = roomCodeSchema.safeParse(code);
  if (result.success) {
    return { valid: true, value: result.data };
  }
  return { valid: false, error: result.error.issues[0]?.message };
}

export function validatePlayerName(name: string): { valid: boolean; error?: string; value?: string } {
  const result = playerNameSchema.safeParse(name);
  if (result.success) {
    return { valid: true, value: result.data };
  }
  return { valid: false, error: result.error.issues[0]?.message };
}

export function validateClue(clue: string): { valid: boolean; error?: string; value?: string } {
  const result = clueSchema.safeParse(clue);
  if (result.success) {
    return { valid: true, value: result.data };
  }
  return { valid: false, error: result.error.issues[0]?.message };
}
