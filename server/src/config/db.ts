import mongoose from 'mongoose';
import { config } from 'dotenv';
import { Restaurant } from '../models/Restaurant.model';
import { PRESET_RESTAURANTS } from '../data/presetRestaurants';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/random-restaurant';

export let isMongoConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Auto-seed preset restaurants if collection is empty
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding preset Wongnai restaurants into MongoDB...');
      await Restaurant.insertMany(PRESET_RESTAURANTS);
      console.log(`✅ Seeded ${PRESET_RESTAURANTS.length} restaurants into MongoDB!`);
    }
  } catch (error) {
    isMongoConnected = false;
    console.log('ℹ️ Local MongoDB not detected. Running seamlessly in embedded JSON mode with preloaded Wongnai restaurants!');
  }
};
