import { config } from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.model';
import { Restaurant } from '../src/models/Restaurant.model';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/random-restaurant';

const seed = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('🔌 Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Restaurant.deleteMany({});
  console.log('🗑  Cleared existing data');

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@example.com',
    passwordHash,
  });
  console.log(`👤 Created user: ${user.email}`);

  // Create sample restaurants
  const restaurants = await Restaurant.insertMany([
    {
      name: 'ส้มตำนัว',
      owner: user._id,
      description: 'ร้านส้มตำแซ่บๆ แบบอีสานแท้ๆ',
      address: '123 ถ.สีลม กรุงเทพฯ',
      priceRange: 'cheap',
      tags: ['Thai', 'Isaan', 'Spicy'],
      imageUrl: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600',
      googleMapsUrl: 'https://maps.google.com',
      isOpen: true,
      rating: 4.5,
    },
    {
      name: 'Sakura Sushi',
      owner: user._id,
      description: 'Authentic Japanese sushi and sashimi',
      address: '456 ถ.สุขุมวิท กรุงเทพฯ',
      priceRange: 'premium',
      tags: ['Japanese', 'Sushi', 'Seafood'],
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600',
      googleMapsUrl: 'https://maps.google.com',
      isOpen: true,
      rating: 4.8,
    },
    {
      name: 'The Coffee Club',
      owner: user._id,
      description: 'Cozy cafe with great coffee and brunch',
      address: '789 ถ.พระราม4 กรุงเทพฯ',
      priceRange: 'medium',
      tags: ['Cafe', 'Coffee', 'Brunch', 'Western'],
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
      googleMapsUrl: 'https://maps.google.com',
      isOpen: true,
      rating: 4.2,
    },
    {
      name: 'MK Hotpot',
      owner: user._id,
      description: 'สุกี้บุฟเฟ่ต์ที่ดีที่สุด',
      address: '321 Central World กรุงเทพฯ',
      priceRange: 'medium',
      tags: ['Buffet', 'Thai', 'Hotpot', 'Seafood'],
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
      googleMapsUrl: 'https://maps.google.com',
      isOpen: false,
      rating: 4.0,
    },
    {
      name: 'Pizza Hut Express',
      owner: user._id,
      description: 'Classic Italian-American pizza',
      address: '654 ถ.ลาดพร้าว กรุงเทพฯ',
      priceRange: 'cheap',
      tags: ['Italian', 'Pizza', 'Fast Food', 'Western'],
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
      googleMapsUrl: 'https://maps.google.com',
      isOpen: true,
      rating: 3.8,
    },
    {
      name: 'เจ๊กเม้ง ข้าวมันไก่',
      owner: user._id,
      description: 'ข้าวมันไก่สูตรต้นตำรับ',
      address: '99 ถ.เยาวราช กรุงเทพฯ',
      priceRange: 'cheap',
      tags: ['Thai', 'Chinese', 'Rice'],
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600',
      googleMapsUrl: 'https://maps.google.com',
      isOpen: true,
      rating: 4.6,
    },
    {
      name: 'Siam Paragon Food Court',
      owner: user._id,
      description: 'Food court with variety of cuisines',
      address: 'Siam Paragon, กรุงเทพฯ',
      priceRange: 'medium',
      tags: ['Thai', 'Japanese', 'Chinese', 'Fast Food', 'Buffet'],
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
      googleMapsUrl: 'https://maps.google.com',
      isOpen: true,
      rating: 3.9,
    },
    {
      name: 'Le Normandie',
      owner: user._id,
      description: 'Fine dining French cuisine at Mandarin Oriental',
      address: 'Mandarin Oriental Bangkok',
      priceRange: 'premium',
      tags: ['French', 'Fine Dining', 'Western'],
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
      googleMapsUrl: 'https://maps.google.com',
      isOpen: true,
      rating: 4.9,
    },
    {
      name: 'เอี้ยวฮั้วสุกี้โบราณ 1955 จุฬาซอย12 สวนหลวงสแควร์',
      description: 'ร้านสุกี้โบราณเตาถ่านสูตรไหหลำแท้ๆ รสชาติเข้มข้น น้ำจิ้มเต้าหู้ยี้เด็ด',
      address: '59,59/1-2, ซอยจุฬา12 วังใหม่ ปทุมวัน กรุงเทพมหานคร',
      priceRange: 'medium',
      tags: ['Hotpot', 'Thai', 'Chinese'],
      imageUrl: 'https://img.wongnai.com/p/1920x0/2016/09/13/eb0bb01bd2ca41bb81d4c6e5150f1552.jpg',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%A7%E0%B8%AE%E0%B8%B1%E0%B9%89%E0%B8%A7%E0%B8%AA%E0%B8%B8%E0%B8%81%E0%B8%B5%E0%B9%89%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%B2%E0%B8%93%201955%20%E0%B8%88%E0%B8%B8%E0%B8%AC%E0%B8%B2%E0%B8%8B%E0%B8%AD%E0%B8%A212%20%E0%B8%AA%E0%B8%A7%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%A7%E0%B8%87%E0%B8%AA%E0%B9%81%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B9%8C',
      sourceUrl: 'https://www.wongnai.com/r/213057HF',
      isOpen: true,
      rating: 4.2,
    },
    {
      name: 'ชาบูแล็บ (Shabu Lab) สามย่าน-จุฬา',
      description: 'ชาบูห้องทดลอง บาร์เนื้อไม่อั้น น้ำซุปหลากหลายสไตล์ตามชอบ',
      address: "I'M Park B001, B010 ถนน เจริญเมือง วังใหม่ ปทุมวัน กรุงเทพมหานคร",
      priceRange: 'medium',
      tags: ['Buffet', 'Hotpot', 'Japanese'],
      imageUrl: 'https://img.wongnai.com/p/1920x0/2019/12/03/e505473072cf4d30a1a97d0776b56efd.jpg',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E0%B8%8A%E0%B8%B2%E0%B8%9A%E0%B8%B9%E0%B9%81%E0%B8%A5%E0%B9%87%E0%B8%9A%20Shabu%20Lab%20%E0%B8%AA%E0%B8%B2%E0%B8%A1%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%99-%E0%B8%88%E0%B8%B8%E0%B8%AC%E0%B8%B2',
      sourceUrl: 'https://www.wongnai.com/r/177803HU',
      isOpen: true,
      rating: 4.1,
    },
    {
      name: 'เจ๊โอว ข้าวต้มเป็ด',
      description: 'ร้านดังในตำนาน มาม่าต้มยำหมูกรอบ คอหมูทอด ยำแซลมอนแซ่บ',
      address: '113, ถนนจรัสเมือง รองเมือง ปทุมวัน กรุงเทพมหานคร',
      priceRange: 'medium',
      tags: ['Thai', 'Seafood', 'Rice', 'Spicy'],
      imageUrl: 'https://img.wongnai.com/p/1920x0/2017/05/18/ae59e464a2e444b7b01f4931fa837d16.jpg',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E0%B9%80%E0%B8%88%E0%B9%87%E0%B9%82%E0%B8%AD%E0%B8%A7%20%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%94',
      sourceUrl: 'https://www.wongnai.com/r/jaeo',
      isOpen: true,
      rating: 4.4,
    },
    {
      name: 'โจ๊กสามย่าน จุฬา ซอย11',
      description: 'โจ๊กหมูสับก้อนโตเนื้อเนียน นุ่ม อิ่มอร่อยระดับตำนาน',
      address: '241, ซอยจุฬาฯ 11 วังใหม่ ปทุมวัน กรุงเทพมหานคร',
      priceRange: 'cheap',
      tags: ['Thai', 'Rice', 'Fast Food'],
      imageUrl: 'https://img.wongnai.com/p/1920x0/2020/06/25/8d35251f79814a338745d2c0342c021d.jpg',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E0%B9%82%E0%B8%88%E0%B9%8A%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A1%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%99%20%E0%B8%88%E0%B8%B8%E0%B8%AC%E0%B8%B2%20%E0%B8%8B%E0%B8%AD%E0%B8%A211',
      sourceUrl: 'https://www.wongnai.com/r/jokesamyaan',
      isOpen: true,
      rating: 4.3,
    },
    {
      name: 'ส้มตำเจ๊แดงสามย่าน ต้นตำหรับ',
      description: 'คอหมูย่างข้าวคั่วในตำนาน ส้มตำแซ่บนัว ลาบหมูรสเด็ดมิชลินไกด์',
      address: '209, ซอยจุฬาฯ 48 วังใหม่ ปทุมวัน กรุงเทพมหานคร',
      priceRange: 'cheap',
      tags: ['Thai', 'Isaan', 'Spicy'],
      imageUrl: 'https://img.wongnai.com/p/1920x0/2022/01/17/56684034e5a74345b262412c6206bddd.jpg',
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('ส้มตำเจ๊แดงสามย่าน ต้นตำหรับ')}`,
      sourceUrl: 'https://www.wongnai.com/r/7657GA',
      isOpen: true,
      rating: 4.3,
    },
  ]);

  console.log(`🍽  Created ${restaurants.length} restaurants`);
  console.log('\n✅ Seed complete!');
  console.log('📧 Login: demo@example.com');
  console.log('🔑 Password: password123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
