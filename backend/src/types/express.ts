import type { User } from '@prisma/client';

export type AuthUser = Pick<User, 'id' | 'email' | 'name' | 'createdAt' | 'updatedAt'>;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
