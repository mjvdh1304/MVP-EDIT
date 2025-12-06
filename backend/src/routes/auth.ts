import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.js';
import { getUserByEmail, createUser } from '../db/queries.js';
import { ValidationError, ConflictError, UnauthorizedError } from '../middleware/errorHandler.js';
import type { AuthTokens, JwtPayload } from '../types/index.js';

const router = Router();

function generateTokens(userId: string, email: string, role: 'user' | 'admin' = 'user'): AuthTokens {
  const payload = { userId, email, role };
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as any);

  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  } as any);

  return { token, refreshToken };
}

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = registerSchema.parse(req.body);

    const existing = await getUserByEmail(validated.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const user = await createUser(validated.email, validated.name, validated.password);
    const tokens = generateTokens(user.id, user.email);

    res.status(201).json({
      userId: user.id,
      email: user.email,
      name: user.name,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await getUserByEmail(validated.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.isBanned) {
      throw new UnauthorizedError('Account has been banned');
    }

    const passwordMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = generateTokens(user.id, user.email);

    res.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validated = refreshTokenSchema.parse(req.body);

    const decoded = jwt.verify(validated.refreshToken, config.jwtRefreshSecret) as JwtPayload;
    const tokens = generateTokens(decoded.userId, decoded.email, decoded.role);

    res.json(tokens);
  } catch (error) {
    next(new UnauthorizedError('Invalid refresh token'));
  }
});

export default router;
