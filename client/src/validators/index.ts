import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const restaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().default(''),
  address: z.string().optional().default(''),
  priceRange: z.enum(['cheap', 'medium', 'premium']).default('medium'),
  tags: z.array(z.string()).optional().default([]),
  menus: z.array(z.string()).optional().default([]),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
  googleMapsUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
  sourceUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
  isOpen: z.boolean().optional().default(true),
  rating: z.number().min(0).max(5).optional().default(0),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RestaurantFormData = z.infer<typeof restaurantSchema>;
