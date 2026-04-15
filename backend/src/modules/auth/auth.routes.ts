import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { authController } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', (req, res, next) => authController.register(req, res, next));
authRouter.post('/login', (req, res, next) => authController.login(req, res, next));
authRouter.get('/me', authMiddleware, (req, res) => authController.me(req, res));
