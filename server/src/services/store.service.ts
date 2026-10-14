import fs from 'fs';
import path from 'path';
import { PRESET_RESTAURANTS, PresetRestaurant } from '../data/presetRestaurants';
import { isMongoConnected } from '../config/db';
import { Restaurant } from '../models/Restaurant.model';
import { RandomHistory } from '../models/RandomHistory.model';
import { RandomRestaurantInput } from '../validators/random.validator';

const DATA_DIR = path.resolve(__dirname, '../../data');
const RESTAURANTS_FILE = path.join(DATA_DIR, 'restaurants.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory / file cache
let localRestaurants: PresetRestaurant[] = [];
let localHistory: any[] = [];

// Load or initialize local files
try {
  if (fs.existsSync(RESTAURANTS_FILE)) {
    const raw = fs.readFileSync(RESTAURANTS_FILE, 'utf-8');
    localRestaurants = JSON.parse(raw);
    if (!localRestaurants.length) {
      localRestaurants = [...PRESET_RESTAURANTS];
      fs.writeFileSync(RESTAURANTS_FILE, JSON.stringify(localRestaurants, null, 2), 'utf-8');
    }
  } else {
    localRestaurants = [...PRESET_RESTAURANTS];
    fs.writeFileSync(RESTAURANTS_FILE, JSON.stringify(localRestaurants, null, 2), 'utf-8');
  }
} catch (e) {
  localRestaurants = [...PRESET_RESTAURANTS];
}

try {
  if (fs.existsSync(HISTORY_FILE)) {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    localHistory = JSON.parse(raw);
  } else {
    localHistory = [];
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(localHistory, null, 2), 'utf-8');
  }
} catch (e) {
  localHistory = [];
}

const saveLocalRestaurants = () => {
  try {
    fs.writeFileSync(RESTAURANTS_FILE, JSON.stringify(localRestaurants, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local restaurants:', err);
  }
};

const saveLocalHistory = () => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(localHistory, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local history:', err);
  }
};

export const store = {
  async getRestaurants(params: {
    search?: string;
    tags?: string;
    priceRange?: string;
    isOpen?: string;
    page?: number | string;
    limit?: number | string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 20);

    if (isMongoConnected) {
      const filter: any = {};
      if (params.search) filter.name = { $regex: params.search, $options: 'i' };
      if (params.tags) filter.tags = { $in: params.tags.split(',').map((t) => t.trim()) };
      if (params.priceRange) filter.priceRange = params.priceRange;
      if (params.isOpen !== undefined) filter.isOpen = params.isOpen === 'true';

      const skip = (page - 1) * limit;
      const [restaurants, total] = await Promise.all([
        Restaurant.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        Restaurant.countDocuments(filter),
      ]);
      return { restaurants, total, page, limit };
    }

    // Local in-memory filtering
    let filtered = [...localRestaurants];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    if (params.tags) {
      const tagList = params.tags.split(',').map((t) => t.trim().toLowerCase());
      filtered = filtered.filter((r) =>
        r.tags.some((t) => tagList.includes(t.toLowerCase()))
      );
    }

    if (params.priceRange) {
      filtered = filtered.filter((r) => r.priceRange === params.priceRange);
    }

    if (params.isOpen !== undefined) {
      const isOpenBool = params.isOpen === 'true';
      filtered = filtered.filter((r) => r.isOpen === isOpenBool);
    }

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return { restaurants: paginated, total, page, limit };
  },

  async getRestaurantById(id: string) {
    if (isMongoConnected) {
      return await Restaurant.findById(id).lean();
    }
    return localRestaurants.find((r) => r._id === id) || null;
  },

  async createRestaurant(data: any) {
    if (isMongoConnected) {
      return await Restaurant.create(data);
    }
    const newRestaurant: PresetRestaurant = {
      _id: 'rest-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: data.name,
      description: data.description || '',
      address: data.address || '',
      priceRange: data.priceRange || 'medium',
      tags: data.tags || ['Thai'],
      menus: data.menus || [],
      imageUrl: data.imageUrl || '',
      googleMapsUrl: data.googleMapsUrl || '',
      sourceUrl: data.sourceUrl || '',
      isOpen: data.isOpen !== undefined ? data.isOpen : true,
      rating: data.rating || 4.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localRestaurants.unshift(newRestaurant);
    saveLocalRestaurants();
    return newRestaurant;
  },

  async updateRestaurant(id: string, data: any) {
    if (isMongoConnected) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) return null;
      Object.assign(restaurant, data);
      await restaurant.save();
      return restaurant;
    }
    const idx = localRestaurants.findIndex((r) => r._id === id);
    if (idx === -1) return null;
    localRestaurants[idx] = {
      ...localRestaurants[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveLocalRestaurants();
    return localRestaurants[idx];
  },

  async deleteRestaurant(id: string) {
    if (isMongoConnected) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) return null;
      await restaurant.deleteOne();
      return restaurant;
    }
    const idx = localRestaurants.findIndex((r) => r._id === id);
    if (idx === -1) return null;
    const [deleted] = localRestaurants.splice(idx, 1);
    saveLocalRestaurants();
    return deleted;
  },

  async pickRandom(input: RandomRestaurantInput, userId?: string) {
    if (isMongoConnected) {
      const filter: any = {};
      if (input.tags && input.tags.length > 0) filter.tags = { $in: input.tags };
      if (input.priceRange) filter.priceRange = input.priceRange;
      if (input.onlyOpenNow) filter.isOpen = true;
      if (input.excludeRestaurantIds && input.excludeRestaurantIds.length > 0) {
        filter._id = { $nin: input.excludeRestaurantIds };
      }

      const restaurants = await Restaurant.find(filter).lean();
      if (restaurants.length === 0) {
        throw { statusCode: 404, message: 'ไม่พบร้านอาหารที่ตรงกับตัวกรองที่เลือก' };
      }

      const picked = restaurants[Math.floor(Math.random() * restaurants.length)];

      await RandomHistory.create({
        user: userId || undefined,
        mode: 'restaurant',
        filters: input,
        result: {
          restaurantId: picked._id.toString(),
          snapshot: picked,
        },
      });

      return picked;
    }

    // Local in-memory random selection
    let candidates = [...localRestaurants];

    if (input.tags && input.tags.length > 0) {
      const lowerTags = input.tags.map((t) => t.toLowerCase());
      candidates = candidates.filter((r) =>
        r.tags.some((t) => lowerTags.includes(t.toLowerCase()))
      );
    }

    if (input.priceRange) {
      candidates = candidates.filter((r) => r.priceRange === input.priceRange);
    }

    if (input.onlyOpenNow) {
      candidates = candidates.filter((r) => r.isOpen);
    }

    if (input.excludeRestaurantIds && input.excludeRestaurantIds.length > 0) {
      candidates = candidates.filter((r) => !input.excludeRestaurantIds?.includes(r._id));
    }

    if (candidates.length === 0) {
      throw { statusCode: 404, message: 'ไม่พบร้านอาหารที่ตรงกับตัวกรองที่เลือก' };
    }

    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    const historyRecord = {
      _id: 'hist-' + Date.now().toString(36),
      mode: 'restaurant',
      filters: input,
      result: {
        restaurantId: picked._id,
        snapshot: picked,
      },
      createdAt: new Date().toISOString(),
    };
    localHistory.unshift(historyRecord);
    saveLocalHistory();

    return picked;
  },

  async getHistory(page = 1, limit = 10, userId?: string) {
    if (isMongoConnected) {
      const query = userId ? { user: userId } : {};
      const skip = (page - 1) * limit;
      const [history, total] = await Promise.all([
        RandomHistory.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        RandomHistory.countDocuments(query),
      ]);
      return { history, total, page, limit };
    }

    const total = localHistory.length;
    const skip = (page - 1) * limit;
    const paginated = localHistory.slice(skip, skip + limit);
    return { history: paginated, total, page, limit };
  },
};
