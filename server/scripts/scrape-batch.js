const https = require('https');

const urls = [
  'https://www.wongnai.com/r/213057HF',
  'https://www.wongnai.com/r/177803HU',
  'https://www.wongnai.com/r/jaeo',
  'https://www.wongnai.com/r/jokesamyaan',
  'https://www.wongnai.com/r/7657GA',
];

function fetchWongnai(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) return reject(new Error('Too many redirects'));

    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'th,en-US;q=0.7,en;q=0.3',
      },
    };

    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, url).href;
        return resolve(fetchWongnai(nextUrl, maxRedirects - 1));
      }

      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const ogTitleMatch = data.match(/property="og:title"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:title"/i);
        const ogDescMatch = data.match(/property="og:description"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:description"/i);
        const ogImageMatch = data.match(/property="og:image"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:image"/i);

        let name = '';
        if (ogTitleMatch) {
          name = ogTitleMatch[1]
            .replace(/^\[รีวิว\]\s*ร้าน\s*/i, '')
            .split('|')[0]
            .trim();
        }

        const addressMatch = data.match(/"address":"([^"]+)"/i) || data.match(/"streetAddress":"([^"]+)"/i);
        const address = addressMatch ? addressMatch[1] : '';

        const desc = ogDescMatch ? ogDescMatch[1] : '';

        // Extract rating if present
        const ratingMatch = data.match(/"ratingValue":\s*([0-9.]+)/i);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 4.2;

        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name || address)}`;

        resolve({
          originalUrl: url,
          name,
          address,
          description: desc,
          imageUrl: ogImageMatch ? ogImageMatch[1] : '',
          googleMapsUrl,
          rating,
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const url of urls) {
    try {
      const data = await fetchWongnai(url);
      console.log('\n--- SUCCESS ---');
      console.log('URL:', url);
      console.log('Name:', data.name);
      console.log('Address:', data.address);
      console.log('Image:', data.imageUrl);
      console.log('Rating:', data.rating);
    } catch (err) {
      console.error('Error on', url, ':', err.message);
    }
  }
}

run();
