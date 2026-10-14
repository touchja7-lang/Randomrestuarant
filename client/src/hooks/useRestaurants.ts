import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantApi } from '../api/restaurant.api';
import { Restaurant } from '../types';
import { DEFAULT_PRESET_RESTAURANTS } from '../data/presetRestaurants';

interface RestaurantQuery {
  search?: string;
  tags?: string;
  priceRange?: string;
  isOpen?: boolean;
  page?: number;
  limit?: number;
}

export const useRestaurants = (query?: RestaurantQuery) =>
  useQuery({
    queryKey: ['restaurants', query],
    queryFn: async () => {
      try {
        const res = await restaurantApi.getAll(query);
        if (res && res.restaurants && res.restaurants.length > 0) {
          return res;
        }
        return {
          restaurants: DEFAULT_PRESET_RESTAURANTS,
          total: DEFAULT_PRESET_RESTAURANTS.length,
          page: 1,
          limit: 20,
        };
      } catch (err) {
        console.warn('Falling back to built-in Wongnai restaurants', err);
        let list = [...DEFAULT_PRESET_RESTAURANTS];
        if (query?.search) {
          const q = query.search.toLowerCase();
          list = list.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.address.toLowerCase().includes(q) ||
              r.description.toLowerCase().includes(q)
          );
        }
        if (query?.tags) {
          const tagList = query.tags.split(',').map((t) => t.trim().toLowerCase());
          list = list.filter((r) => r.tags.some((t) => tagList.includes(t.toLowerCase())));
        }
        if (query?.priceRange) {
          list = list.filter((r) => r.priceRange === query.priceRange);
        }
        if (query?.isOpen !== undefined) {
          list = list.filter((r) => r.isOpen === query.isOpen);
        }
        return { restaurants: list, total: list.length, page: 1, limit: 20 };
      }
    },
    initialData: () => ({
      restaurants: DEFAULT_PRESET_RESTAURANTS,
      total: DEFAULT_PRESET_RESTAURANTS.length,
      page: 1,
      limit: 20,
    }),
  });

export const useRestaurant = (id: string) =>
  useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      try {
        return await restaurantApi.getById(id);
      } catch (err) {
        const found = DEFAULT_PRESET_RESTAURANTS.find((r) => r._id === id);
        if (found) return found;
        throw err;
      }
    },
    initialData: () => DEFAULT_PRESET_RESTAURANTS.find((r) => r._id === id),
    enabled: !!id,
  });

export const useCreateRestaurant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Restaurant>) => restaurantApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants'] }),
  });
};

export const useUpdateRestaurant = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Restaurant>) => restaurantApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['restaurants'] });
      qc.invalidateQueries({ queryKey: ['restaurant', id] });
    },
  });
};

export const useDeleteRestaurant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restaurantApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants'] }),
  });
};
