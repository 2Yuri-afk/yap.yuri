/* eslint-disable @typescript-eslint/no-explicit-any */
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';

// Create Redis client if REDIS_URL is available, otherwise use memory
let rateLimiter: RateLimiterMemory | RateLimiterRedis;

if (process.env.REDIS_URL) {
  const redisClient = new Redis(process.env.REDIS_URL);

  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rate_limit',
    points: 5, // Number of requests
    duration: 900, // Per 15 minutes
    blockDuration: 900, // Block for 15 minutes after limit reached
  });
} else {
  // Fallback to memory storage (not recommended for production with multiple instances)
  rateLimiter = new RateLimiterMemory({
    points: 5, // Number of requests
    duration: 900, // Per 15 minutes
    blockDuration: 900, // Block for 15 minutes after limit reached
  });
}

export async function rateLimit(
  req: NextRequest
): Promise<NextResponse | null> {
  try {
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    await rateLimiter.consume(ip);
    return null; // Request allowed
  } catch (rejRes: any) {
    const retryAfter = Math.round(rejRes.msBeforeNext / 1000) || 900;

    return NextResponse.json(
      {
        error: 'Too many attempts. Please try again later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(rateLimiter.points),
          'X-RateLimit-Remaining': String(rejRes.remainingPoints || 0),
          'X-RateLimit-Reset': new Date(
            Date.now() + rejRes.msBeforeNext
          ).toISOString(),
        },
      }
    );
  }
}

// Stricter rate limiter for login attempts
export const loginRateLimiter = process.env.REDIS_URL
  ? new RateLimiterRedis({
      storeClient: new Redis(process.env.REDIS_URL),
      keyPrefix: 'login_attempt',
      points: 3, // Only 3 login attempts
      duration: 900, // Per 15 minutes
      blockDuration: 1800, // Block for 30 minutes after limit reached
    })
  : new RateLimiterMemory({
      points: 3,
      duration: 900,
      blockDuration: 1800,
    });

export async function rateLimitLogin(
  identifier: string
): Promise<{ success: boolean; retryAfter?: number }> {
  try {
    await loginRateLimiter.consume(identifier);
    return { success: true };
  } catch (rejRes: any) {
    const retryAfter = Math.round(rejRes.msBeforeNext / 1000) || 1800;
    return { success: false, retryAfter };
  }
}
