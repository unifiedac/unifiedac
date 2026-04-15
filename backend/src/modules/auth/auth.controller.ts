import type { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import { loginSchema, registerSchema } from './auth.validation';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = registerSchema.parse(req.body);
      const response = await authService.register(payload);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = loginSchema.parse(req.body);
      const response = await authService.login(payload);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  me(req: Request, res: Response) {
    res.json({ user: req.user });
  }
}

export const authController = new AuthController();
