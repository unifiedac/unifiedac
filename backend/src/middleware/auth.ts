import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { HttpError } from './error-handler';

const getToken = (header?: string): string | null => {
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = getToken(req.headers.authorization);
    if (!token) {
      throw new HttpError(401, 'Missing or malformed authorization token');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret') as { sub: string };
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new HttpError(401, 'Session is invalid');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
