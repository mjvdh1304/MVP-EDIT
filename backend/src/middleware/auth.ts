import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import type { JwtPayload } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: 'user' | 'admin';
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Missing authorization token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.userRole !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    } catch (error) {
      // Token is invalid, continue without auth
    }
  }
  next();
}
