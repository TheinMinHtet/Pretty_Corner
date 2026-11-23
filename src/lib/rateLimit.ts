interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window cache per IP / key
const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale timestamps to prevent unbounded memory growth
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 15 * 60 * 1000);
  if (timer.unref) {
    timer.unref();
  }
}

/**
 * Checks and records a rate limit hit for a given identifier (e.g. client IP or composite key).
 * Uses a sliding window algorithm.
 *
 * @param key Unique key to rate limit (e.g. IP address)
 * @param limit Maximum allowed hits within the window (default: 10)
 * @param windowMs Time window in milliseconds (default: 10 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 10 * 60 * 1000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { timestamps: [] };

  // Filter timestamps within current rolling window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, oldest + windowMs - now),
    };
  }

  record.timestamps.push(now);
  rateLimitMap.set(key, record);

  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Reset rate limit for a specific key (useful in unit testing).
 */
export function resetRateLimit(key?: string): void {
  if (key) {
    rateLimitMap.delete(key);
  } else {
    rateLimitMap.clear();
  }
}
