import { config } from 'dotenv';
import mongoose from 'mongoose';
import { Restaurant } from '../src/models/Restaurant.model';
import { scrapeRestaurantUrl } from '../src/services/scraper.service';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/random-restaurant';

const WONGNAI_URLS = [
  'https://www.wongnai.com/r/213057HF',
  'https://www.wongnai.com/r/177803HU',
  'https://www.wongnai.com/r/jaeo',
  'https://www.wongnai.com/r/jokesamyaan',
  'https://www.wongnai.com/r/7657GA',
];

const run = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('🔌 Connected to MongoDB');

  for (const url of WONGNAI_URLS) {
    try {
      console.log(`\n⏳ Scraping: ${url}...`);
      const scraped = await scrapeRestaurantUrl(url);

      const existing = await Restaurant.findOne({
        $or: [{ sourceUrl: url }, { name: scraped.name }],
      });

      if (existing) {
        Object.assign(existing, scraped);
        await existing.save();
        console.log(`✓ Updated: ${scraped.name}`);
      } else {
        await Restaurant.create(scraped);
        console.log(`✓ Created: ${scraped.name}`);
      }
    } catch (err: unknown) {
      console.error(`✕ Failed to import ${url}:`, (err as Error).message);
    }
  }

  const total = await Restaurant.countDocuments();
  console.log(`\n🎉 Done! Total restaurants in database: ${total}`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
