import { Router } from 'express';
import { randomRestaurant } from '../controllers/random.controller';
import { validate } from '../middleware/validate.middleware';
import { randomRestaurantSchema } from '../validators/random.validator';

export const randomRouter = Router();

// Public route: no auth required
randomRouter.post('/restaurant', validate(randomRestaurantSchema), randomRestaurant);
