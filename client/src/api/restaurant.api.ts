import api from './client';
import { Restaurant, ApiResponse } from '../types';

interface RestaurantListData {
  restaurants: Restaurant[];
  total: number;
  page: number;
  limit: number;
}

interface RestaurantQuery {
  search?: string;
  tags?: string;
  priceRange?: string;
  isOpen?: boolean;
  page?: number;
  limit?: number;
}

export const restaurantApi = {
  getAll: async (query?: RestaurantQuery) => {
    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.tags) params.set('tags', query.tags);
    if (query?.priceRange) params.set('priceRange', query.priceRange);
    if (query?.isOpen !== undefined) params.set('isOpen', String(query.isOpen));
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));
    const res = await api.get<ApiResponse<RestaurantListData>>(`/restaurants?${params}`);
    return res.data.data!;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<{ restaurant: Restaurant }>>(`/restaurants/${id}`);
    return res.data.data!.restaurant;
  },

  create: async (data: Partial<Restaurant>) => {
    const res = await api.post<ApiResponse<{ restaurant: Restaurant }>>('/restaurants', data);
    return res.data.data!.restaurant;
  },

  update: async (id: string, data: Partial<Restaurant>) => {
    const res = await api.patch<ApiResponse<{ restaurant: Restaurant }>>(`/restaurants/${id}`, data);
    return res.data.data!.restaurant;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/restaurants/${id}`);
    return res.data;
  },

  parseUrl: async (url: string) => {
    const res = await api.post<ApiResponse<Partial<Restaurant>>>('/restaurants/parse-url', { url });
    return res.data.data!;
  },
};
