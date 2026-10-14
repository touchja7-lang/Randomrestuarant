import api from './client';
import { Restaurant, RandomHistory, ApiResponse, RandomFilters } from '../types';

export const randomApi = {
  spin: async (filters: RandomFilters) => {
    const res = await api.post<ApiResponse<{ restaurant: Restaurant }>>('/random/restaurant', {
      tags: filters.tags,
      priceRange: filters.priceRange,
      onlyOpenNow: filters.onlyOpenNow,
      excludeRestaurantIds: filters.excludeRestaurantIds,
      limit: 1,
    });
    return res.data.data!.restaurant;
  },
};

export const historyApi = {
  getHistory: async (page = 1, limit = 5) => {
    const res = await api.get<ApiResponse<{ history: RandomHistory[]; total: number }>>(
      `/history?page=${page}&limit=${limit}`
    );
    return res.data.data!;
  },
};
