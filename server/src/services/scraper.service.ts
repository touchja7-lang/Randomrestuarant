import https from 'https';
import http from 'http';
import { URL } from 'url';

export interface ScrapedRestaurantData {
  name: string;
  address: string;
  description: string;
  imageUrl: string;
  googleMapsUrl: string;
  sourceUrl: string;
  rating: number;
  priceRange: 'cheap' | 'medium' | 'premium';
  tags: string[];
}

function fetchWithRedirect(targetUrl: string, maxRedirects = 5): Promise<{ data: string; finalUrl: string }> {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) return reject(new Error('Too many redirects'));

    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(
      targetUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'th,en-US;q=0.7,en;q=0.3',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = new URL(res.headers.location, targetUrl).href;
          return resolve(fetchWithRedirect(next, maxRedirects - 1));
        }

        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ data: body, finalUrl: targetUrl }));
      }
    );

    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .trim();
}

export const scrapeRestaurantUrl = async (url: string): Promise<ScrapedRestaurantData> => {
  const normalizedUrl = url.trim();
  const { data, finalUrl } = await fetchWithRedirect(normalizedUrl);

  const isWongnai = normalizedUrl.includes('wongnai.com');
  const isGoogleMaps = normalizedUrl.includes('maps.app.goo.gl') || normalizedUrl.includes('google.com/maps');

  // Extract meta tags
  const ogTitleMatch =
    data.match(/property="og:title"\s+content="([^"]+)"/i) ||
    data.match(/content="([^"]+)"\s+property="og:title"/i);
  const ogDescMatch =
    data.match(/property="og:description"\s+content="([^"]+)"/i) ||
    data.match(/content="([^"]+)"\s+property="og:description"/i);
  const ogImageMatch =
    data.match(/property="og:image"\s+content="([^"]+)"/i) ||
    data.match(/content="([^"]+)"\s+property="og:image"/i);
  const titleMatch = data.match(/<title>([^<]+)<\/title>/i);

  let rawTitle = ogTitleMatch ? ogTitleMatch[1] : titleMatch ? titleMatch[1] : '';
  let name = rawTitle;

  if (isWongnai) {
    name = rawTitle
      .replace(/^\[รีวิว\]\s*ร้าน\s*/i, '')
      .split('|')[0]
      .trim();
  } else if (isGoogleMaps) {
    name = rawTitle.replace(/\s*-\s*Google Maps$/i, '').trim();
  }
  name = decodeHtmlEntities(name);

  // Address extraction
  const addressMatch =
    data.match(/"address":"([^"]+)"/i) ||
    data.match(/"streetAddress":"([^"]+)"/i);
  let address = decodeHtmlEntities(addressMatch ? addressMatch[1] : '');

  const description = decodeHtmlEntities(ogDescMatch ? ogDescMatch[1] : '');
  const imageUrl = ogImageMatch ? ogImageMatch[1] : '';

  // Rating
  const ratingMatch = data.match(/"ratingValue":\s*([0-9.]+)/i);
  const rating = ratingMatch ? Math.min(5, Math.max(0, parseFloat(ratingMatch[1]))) : 4.0;

  // Google Maps link
  let googleMapsUrl = '';
  if (isGoogleMaps) {
    googleMapsUrl = finalUrl;
  } else {
    googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name || address)}`;
  }

  // Tags auto-detection based on text and description
  const combinedText = `${name} ${description} ${data}`.toLowerCase();
  const detectedTags: string[] = [];

  const tagKeywords: Record<string, string[]> = {
    'Thai': ['ไทย', 'ส้มตำ', 'อาหารไทย', 'ข้าวต้ม', 'โจ๊ก', 'ก๋วยเตี๋ยว'],
    'Isaan': ['ส้มตำ', 'อีสาน', 'ลาบ', 'น้ำตก', 'ไก่ย่าง', 'ปลาร้า'],
    'Spicy': ['ส้มตำ', 'แซ่บ', 'เผ็ด', 'ยำ', 'ต้มยำ'],
    'Japanese': ['ญี่ปุ่น', 'sushi', 'ซูชิ', 'ราเมน', 'ramen', 'ชาบู'],
    'Hotpot': ['สุกี้', 'ชาบู', 'หม้อไฟ', 'hotpot', 'shabu'],
    'Buffet': ['บุฟเฟ่ต์', 'buffet', 'ไม่อั้น'],
    'Seafood': ['ซีฟู้ด', 'ทะเล', 'กุ้ง', 'ปู', 'ปลาหมึก', 'หอย'],
    'Rice': ['ข้าว', 'ข้าวมันไก่', 'ข้าวต้ม', 'โจ๊ก'],
    'Cafe': ['คาเฟ่', 'cafe', 'กาแฟ', 'coffee'],
    'Fast Food': ['จานด่วน', 'ตามสั่ง', 'โจ๊ก'],
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((k) => combinedText.includes(k))) {
      detectedTags.push(tag);
    }
  }

  // Determine Price Range
  let priceRange: 'cheap' | 'medium' | 'premium' = 'medium';
  if (combinedText.includes('บุฟเฟ่ต์') || combinedText.includes('โอมากาเสะ') || combinedText.includes('fine dining') || combinedText.includes('พรีเมียม')) {
    priceRange = 'premium';
  } else if (combinedText.includes('โจ๊ก') || combinedText.includes('ข้างทาง') || combinedText.includes('ส้มตำ') || combinedText.includes('ก๋วยเตี๋ยว') || combinedText.includes('ราคาประหยัด')) {
    priceRange = 'cheap';
  }

  return {
    name: name || 'ร้านอาหาร',
    address,
    description,
    imageUrl,
    googleMapsUrl,
    sourceUrl: normalizedUrl,
    rating,
    priceRange,
    tags: detectedTags.length > 0 ? detectedTags : ['Thai'],
  };
};
