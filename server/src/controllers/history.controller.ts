import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { store } from '../services/store.service';

export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const userId = req.user?._id ? req.user._id.toString() : undefined;

    const result = await store.getHistory(page, limit, userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
