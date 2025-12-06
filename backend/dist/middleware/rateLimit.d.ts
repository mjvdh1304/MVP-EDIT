import { Request, Response, NextFunction } from 'express';
export declare function rateLimitMiddleware(windowMs: number, maxRequests: number): (req: Request, res: Response, next: NextFunction) => void;
export declare function createRateLimiter(maxRequestsPerDay: number): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rateLimit.d.ts.map