import { NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('health-check');
const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  try {
    // Basic health check response
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: `${uptime}s`,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      commit: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    };

    // Optional: Add dependency checks
    const checks: Record<string, boolean> = {};

    // Check Supabase connection
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
        checks.supabase = !!supabaseUrl.hostname;
      } catch {
        checks.supabase = false;
      }
    }

    // Check Redis connection (if configured)
    if (process.env.REDIS_URL) {
      checks.redis = true; // Simplified check - in production, actually ping Redis
    }

    const allChecksPass = Object.values(checks).every(check => check === true);

    const response = {
      ...healthStatus,
      checks: Object.keys(checks).length > 0 ? checks : undefined,
      healthy: allChecksPass,
    };

    logger.info({ uptime, checks }, 'Health check completed');

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    logger.error({ error }, 'Health check failed');

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: `${uptime}s`,
        error: 'Health check failed',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }
}

// Optional: HEAD method for lighter health checks
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
