import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { randomApi, historyApi } from '../api/random.api';
import { RandomFilters } from '../types';
import { DEFAULT_PRESET_RESTAURANTS } from '../data/presetRestaurants';

export const useSpinRandom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (filters: RandomFilters) => {
      try {
        return await randomApi.spin(filters);
      } catch (err) {
        console.warn('Backend spin failed, picking from built-in Wongnai restaurants', err);
        let candidates = [...DEFAULT_PRESET_RESTAURANTS];

        if (filters.tags && filters.tags.length > 0) {
          const lower = filters.tags.map((t) => t.toLowerCase());
          candidates = candidates.filter((r) =>
            r.tags.some((t) => lower.includes(t.toLowerCase()))
          );
        }

        if (filters.priceRange) {
          candidates = candidates.filter((r) => r.priceRange === filters.priceRange);
        }

        if (filters.onlyOpenNow) {
          candidates = candidates.filter((r) => r.isOpen);
        }

        if (filters.excludeRestaurantIds && filters.excludeRestaurantIds.length > 0) {
          candidates = candidates.filter((r) => !filters.excludeRestaurantIds?.includes(r._id));
        }

        if (candidates.length === 0) {
          throw new Error('ไม่พบร้านอาหารที่ตรงกับตัวกรองที่เลือก');
        }

        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        return picked;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['history'] });
    },
  });
};

export const useHistory = (page = 1, limit = 5) =>
  useQuery({
    queryKey: ['history', page, limit],
    queryFn: async () => {
      try {
        return await historyApi.getHistory(page, limit);
      } catch {
        return { history: [], total: 0, page, limit };
      }
    },
  });
