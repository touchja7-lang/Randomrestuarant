import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as authService from '../services/auth.service';

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const me = (req: AuthRequest, res: Response) => {
  const u = req.user!;
  res.json({
    success: true,
    data: { user: { id: u._id, name: u.name, email: u.email } },
  });
};
