import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { store } from '../services/store.service';

export const randomRestaurant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id ? req.user._id.toString() : undefined;
    const restaurant = await store.pickRandom(req.body, userId);
    res.json({ success: true, data: { restaurant } });
  } catch (err) {
    next(err);
  }
};
