import { z } from 'zod';

export const randomRestaurantSchema = z.object({
  tags: z.array(z.string()).optional().default([]),
  priceRange: z.enum(['cheap', 'medium', 'premium']).nullable().optional(),
  onlyOpenNow: z.boolean().optional().default(false),
  excludeRestaurantIds: z.array(z.string()).optional().default([]),
  limit: z.number().int().min(1).max(10).optional().default(1),
});

export type RandomRestaurantInput = z.infer<typeof randomRestaurantSchema>;
