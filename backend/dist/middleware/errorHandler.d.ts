import { Request, Response, NextFunction } from 'express';
export interface ApiError extends Error {
    status?: number;
    code?: string;
}
export declare function errorHandler(err: ApiError | Error, req: Request, res: Response, next: NextFunction): void;
export declare class ValidationError extends Error implements ApiError {
    status: number;
    code: string;
    constructor(message: string);
}
export declare class UnauthorizedError extends Error implements ApiError {
    status: number;
    code: string;
    constructor(message?: string);
}
export declare class ForbiddenError extends Error implements ApiError {
    status: number;
    code: string;
    constructor(message?: string);
}
export declare class NotFoundError extends Error implements ApiError {
    status: number;
    code: string;
    constructor(message?: string);
}
export declare class ConflictError extends Error implements ApiError {
    status: number;
    code: string;
    constructor(message?: string);
}
export declare class RateLimitError extends Error implements ApiError {
    status: number;
    code: string;
    constructor(message?: string);
}
//# sourceMappingURL=errorHandler.d.ts.map