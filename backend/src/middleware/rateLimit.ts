import { Request, Response, NextFunction } from 'express';

const requestCounts: Map<string, number[]> = new Map();

export function rateLimitMiddleware(windowMs: number, maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const key = ip;

    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const timestamps = requestCounts.get(key)!;
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

    if (validTimestamps.length >= maxRequests) {
      res.status(429).json({ error: 'Too many requests, please try again later' });
      return;
    }

    validTimestamps.push(now);
    requestCounts.set(key, validTimestamps);
    next();
  };
}

export function createRateLimiter(maxRequestsPerDay: number) {
  const userLimits: Map<string, { count: number; resetTime: number }> = new Map();

  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.userId;
    if (!userId) {
      next();
      return;
    }

    const now = Date.now();
    const limit = userLimits.get(userId);

    if (limit && limit.resetTime > now) {
      if (limit.count >= maxRequestsPerDay) {
        res.status(429).json({
          error: `Rate limit exceeded. You can make ${maxRequestsPerDay} requests per day.`,
          retryAfter: Math.ceil((limit.resetTime - now) / 1000),
        });
        return;
      }
      limit.count++;
    } else {
      userLimits.set(userId, {
        count: 1,
        resetTime: now + 24 * 60 * 60 * 1000,
      });
    }

    next();
  };
}
