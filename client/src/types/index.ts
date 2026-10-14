// Shared types between client and server
export type PriceRange = 'cheap' | 'medium' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  owner?: { _id: string; name: string; email: string } | string;
  description: string;
  address: string;
  priceRange: PriceRange;
  tags: string[];
  menus?: string[];
  imageUrl: string;
  googleMapsUrl: string;
  sourceUrl?: string;
  lineManUrl?: string;
  grabUrl?: string;
  isOpen: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface RandomHistory {
  _id: string;
  user: string;
  mode: 'restaurant';
  filters: Record<string, unknown>;
  result: {
    restaurantId: string;
    snapshot: Restaurant;
  };
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RandomFilters {
  tags: string[];
  priceRange: PriceRange | null;
  onlyOpenNow: boolean;
  excludeRestaurantIds: string[];
}

export const AVAILABLE_TAGS = [
  'Thai',
  'Japanese',
  'Chinese',
  'Italian',
  'French',
  'Western',
  'Isaan',
  'Seafood',
  'Sushi',
  'Cafe',
  'Coffee',
  'Brunch',
  'Buffet',
  'Hotpot',
  'Fast Food',
  'Pizza',
  'Spicy',
  'Rice',
  'Fine Dining',
] as const;

export type AvailableTag = (typeof AVAILABLE_TAGS)[number];
