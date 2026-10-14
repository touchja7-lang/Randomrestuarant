import { Router } from 'express';
import {
  getRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  parseRestaurantUrl,
} from '../controllers/restaurant.controller';
import { validate } from '../middleware/validate.middleware';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from '../validators/restaurant.validator';

export const restaurantRouter = Router();

// All restaurant routes are open for personal use
restaurantRouter.get('/', getRestaurants);
restaurantRouter.post('/', validate(createRestaurantSchema), createRestaurant);
restaurantRouter.post('/parse-url', parseRestaurantUrl);
restaurantRouter.get('/:id', getRestaurantById);
restaurantRouter.patch('/:id', validate(updateRestaurantSchema), updateRestaurant);
restaurantRouter.delete('/:id', deleteRestaurant);
