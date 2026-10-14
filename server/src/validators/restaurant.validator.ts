import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().default(''),
  address: z.string().optional().default(''),
  priceRange: z.enum(['cheap', 'medium', 'premium']).default('medium'),
  tags: z.array(z.string()).optional().default([]),
  menus: z.array(z.string()).optional().default([]),
  imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  googleMapsUrl: z.string().url().optional().or(z.literal('')).default(''),
  sourceUrl: z.string().url().optional().or(z.literal('')).default(''),
  lineManUrl: z.string().url().optional().or(z.literal('')).default(''),
  grabUrl: z.string().url().optional().or(z.literal('')).default(''),
  isOpen: z.boolean().optional().default(true),
  rating: z.number().min(0).max(5).optional().default(0),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export const restaurantQuerySchema = z.object({
  search: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  priceRange: z.enum(['cheap', 'medium', 'premium']).optional(),
  isOpen: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('20'),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
