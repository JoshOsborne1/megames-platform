/**
 * Rate Limiter Utility
 * Provides in-memory rate limiting for API routes and actions
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (consider Redis for production multi-instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMITS = {
  createRoom: { maxRequests: 5, windowMs: 60 * 1000 },      // 5 rooms per minute
  joinRoom: { maxRequests: 10, windowMs: 60 * 1000 },      // 10 joins per minute
  gameAction: { maxRequests: 100, windowMs: 10 * 1000 },   // 100 actions per 10 seconds
  sendClue: { maxRequests: 20, windowMs: 60 * 1000 },      // 20 clues per minute
} as const;

/**
 * Check if an action is rate limited
 * @param key Unique identifier (e.g., `userId:action`)
 * @param config Rate limit configuration
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    cleanupExpiredEntries();
  }

  if (!entry || now >= entry.resetAt) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return true;
  }

  if (entry.count >= config.maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get remaining requests for a key
 */
export function getRateLimitInfo(key: string, config: RateLimitConfig): {
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetAt) {
    return { remaining: config.maxRequests, resetIn: 0 };
  }

  return {
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetIn: entry.resetAt - now,
  };
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}
