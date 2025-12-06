export function errorHandler(err, req, res, next) {
    console.error('[Error]', err);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({
        error: message,
        code: err.code || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
    });
}
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.code = 'VALIDATION_ERROR';
    }
}
export class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.status = 401;
        this.code = 'UNAUTHORIZED';
    }
}
export class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.status = 403;
        this.code = 'FORBIDDEN';
    }
}
export class NotFoundError extends Error {
    constructor(message = 'Not found') {
        super(message);
        this.status = 404;
        this.code = 'NOT_FOUND';
    }
}
export class ConflictError extends Error {
    constructor(message = 'Conflict') {
        super(message);
        this.status = 409;
        this.code = 'CONFLICT';
    }
}
export class RateLimitError extends Error {
    constructor(message = 'Too many requests') {
        super(message);
        this.status = 429;
        this.code = 'RATE_LIMIT_EXCEEDED';
    }
}
//# sourceMappingURL=errorHandler.js.map