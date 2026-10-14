import mongoose from 'mongoose';
import { Restaurant } from '../models/Restaurant.model';
import { RandomHistory } from '../models/RandomHistory.model';
import { RandomRestaurantInput } from '../validators/random.validator';

/**
 * Tag matching strategy: "ANY" – restaurant must include at least one of the provided tags.
 */
export const pickRandomRestaurant = async (input: RandomRestaurantInput, userId?: string) => {
  const filter: mongoose.FilterQuery<typeof Restaurant> = {};

  // Filter by tags (ANY match)
  if (input.tags && input.tags.length > 0) {
    filter.tags = { $in: input.tags };
  }

  // Filter by priceRange
  if (input.priceRange) {
    filter.priceRange = input.priceRange;
  }

  // Filter by isOpen
  if (input.onlyOpenNow) {
    filter.isOpen = true;
  }

  // Exclude specific IDs
  if (input.excludeRestaurantIds && input.excludeRestaurantIds.length > 0) {
    filter._id = {
      $nin: input.excludeRestaurantIds.map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  const restaurants = await Restaurant.find(filter).lean();

  if (restaurants.length === 0) {
    throw { statusCode: 404, message: 'No restaurants found matching your filters' };
  }

  // Uniform random pick
  const picked = restaurants[Math.floor(Math.random() * restaurants.length)];

  // Save history (works with or without user)
  await RandomHistory.create({
    user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
    mode: 'restaurant',
    filters: input,
    result: {
      restaurantId: picked._id.toString(),
      snapshot: picked,
    },
  });

  return picked;
};
