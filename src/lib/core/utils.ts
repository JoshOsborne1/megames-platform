/**
 * Core Game Utilities
 * Shared functions used across all games
 */

// =============================================================================
// ROOM CODE GENERATION
// =============================================================================

// Characters that are easy to read (no 0/O, 1/I/L confusion)
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 5;

/**
 * Generate a random room code
 * @returns 5-character alphanumeric code (e.g., "A7KM3")
 */
export function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS.charAt(
      Math.floor(Math.random() * ROOM_CODE_CHARS.length)
    );
  }
  return code;
}

// =============================================================================
// PLAYER ID GENERATION
// =============================================================================

/**
 * Generate a unique player ID for anonymous/local players
 * For authenticated users, use their Supabase user ID instead
 */
export function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// =============================================================================
// SCORING UTILITIES
// =============================================================================

/**
 * Calculate color distance for Shade Signals scoring
 * Uses Euclidean distance in RGB space (0-100 scale)
 */
export function calculateColorDistance(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
): number {
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  // Max possible distance is sqrt(255^2 * 3) ≈ 441.67
  // Convert to 0-100 scale (inverted: 100 = perfect match)
  return Math.max(0, 100 - (distance / 441.67) * 100);
}

/**
 * Format a number with commas (e.g., 1000 -> "1,000")
 */
export function formatScore(score: number): string {
  return score.toLocaleString();
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// =============================================================================
// TIMER UTILITIES
// =============================================================================

/**
 * Format seconds into MM:SS display
 */
export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get timer color based on remaining time
 */
export function getTimerColor(seconds: number, totalSeconds: number): string {
  const ratio = seconds / totalSeconds;
  if (ratio > 0.5) return "#00f5ff"; // Cyan - plenty of time
  if (ratio > 0.25) return "#ff9f1c"; // Orange - getting low
  return "#ff006e"; // Pink/Red - critical
}

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Pick N random items from an array
 */
export function pickRandom<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}
