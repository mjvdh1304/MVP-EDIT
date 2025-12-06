import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(err: ApiError | Error, req: Request, res: Response, next: NextFunction): void {
  console.error('[Error]', err);

  const status = (err as ApiError).status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
    code: (err as ApiError).code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  });
}

export class ValidationError extends Error implements ApiError {
  status = 400;
  code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error implements ApiError {
  status = 401;
  code = 'UNAUTHORIZED';

  constructor(message = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends Error implements ApiError {
  status = 403;
  code = 'FORBIDDEN';

  constructor(message = 'Forbidden') {
    super(message);
  }
}

export class NotFoundError extends Error implements ApiError {
  status = 404;
  code = 'NOT_FOUND';

  constructor(message = 'Not found') {
    super(message);
  }
}

export class ConflictError extends Error implements ApiError {
  status = 409;
  code = 'CONFLICT';

  constructor(message = 'Conflict') {
    super(message);
  }
}

export class RateLimitError extends Error implements ApiError {
  status = 429;
  code = 'RATE_LIMIT_EXCEEDED';

  constructor(message = 'Too many requests') {
    super(message);
  }
}
