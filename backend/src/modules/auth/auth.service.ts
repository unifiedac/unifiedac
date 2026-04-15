import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../middleware/error-handler';

const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

export class AuthService {
  async register(payload: { email: string; password: string; name: string }) {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) throw new HttpError(409, 'Email is already registered');

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });

    const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    return { user, token };
  }

  async login(payload: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) throw new HttpError(401, 'Invalid email or password');

    const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValidPassword) throw new HttpError(401, 'Invalid email or password');

    const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }
}

export const authService = new AuthService();
