/**
 * Simple in-memory rate limiter for server-side use.
 * Note: This works per-instance. For multi-instance deployments, use Redis.
 */

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

export function rateLimit(ip: string, limit: number, windowMs: number) {
    const now = Date.now();
    const key = `rl:${ip}`;

    if (!store[key] || store[key].resetTime < now) {
        store[key] = {
            count: 1,
            resetTime: now + windowMs,
        };
        return { success: true, count: 1, limit, reset: store[key].resetTime };
    }

    store[key].count++;

    if (store[key].count > limit) {
        return { success: false, count: store[key].count, limit, reset: store[key].resetTime };
    }

    return { success: true, count: store[key].count, limit, reset: store[key].resetTime };
}
