import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/error.middleware';
import { store } from '../services/store.service';

export const getRestaurants = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { search, tags, priceRange, isOpen, page, limit } = req.query as Record<string, string>;
    const result = await store.getRestaurants({ search, tags, priceRange, isOpen, page, limit });
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const createRestaurant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const owner = req.user?._id || undefined;
    const restaurant = await store.createRestaurant({ ...req.body, owner });
    res.status(201).json({ success: true, data: { restaurant } });
  } catch (err) {
    next(err);
  }
};

export const getRestaurantById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const restaurant = await store.getRestaurantById(req.params.id);
    if (!restaurant) throw new AppError('Restaurant not found', 404);
    res.json({ success: true, data: { restaurant } });
  } catch (err) {
    next(err);
  }
};

export const updateRestaurant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const restaurant = await store.updateRestaurant(req.params.id, req.body);
    if (!restaurant) throw new AppError('Restaurant not found', 404);
    res.json({ success: true, data: { restaurant } });
  } catch (err) {
    next(err);
  }
};

export const deleteRestaurant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const restaurant = await store.deleteRestaurant(req.params.id);
    if (!restaurant) throw new AppError('Restaurant not found', 404);
    res.json({ success: true, message: 'Restaurant deleted' });
  } catch (err) {
    next(err);
  }
};

export const parseRestaurantUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url) {
      throw new AppError('URL is required', 400);
    }
    const { scrapeRestaurantUrl } = await import('../services/scraper.service');
    const data = await scrapeRestaurantUrl(url);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
