const https = require('https');

const options = {
  hostname: 'www.wongnai.com',
  path: '/restaurants/213057HF',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'th,en-US;q=0.7,en;q=0.3',
  },
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    // 1. OG Meta tags
    const ogTitleMatch = data.match(/property="og:title"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:title"/i);
    const ogDescMatch = data.match(/property="og:description"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:description"/i);
    const ogImageMatch = data.match(/property="og:image"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:image"/i);

    console.log('=== EXTRACTED METADATA ===');
    console.log('og:title:', ogTitleMatch ? ogTitleMatch[1] : null);
    console.log('og:description:', ogDescMatch ? ogDescMatch[1] : null);
    console.log('og:image:', ogImageMatch ? ogImageMatch[1] : null);

    // Parse clean restaurant name from og:title
    // Format: "[รีวิว] ร้าน เอี้ยวฮั้วสุกี้โบราณ 1955 จุฬาซอย12 สวนหลวงสแควร์ | เมนูแนะนำ รูปภาพ ราคา on wongnai.com"
    if (ogTitleMatch) {
      const cleanName = ogTitleMatch[1]
        .replace(/^\[รีวิว\]\s*ร้าน\s*/i, '')
        .split('|')[0]
        .trim();
      console.log('Clean Restaurant Name:', cleanName);
    }

    // Check for latitude and longitude in scripts
    const latLng = data.match(/([0-9]{1,2}\.[0-9]{4,8}),\s*([0-9]{2,3}\.[0-9]{4,8})/);
    if (latLng) {
      console.log('Found coordinates:', latLng[1], latLng[2]);
      console.log('Google Maps Search Link:', `https://www.google.com/maps/search/?api=1&query=${latLng[1]},${latLng[2]}`);
    } else if (ogTitleMatch) {
      const cleanName = ogTitleMatch[1]
        .replace(/^\[รีวิว\]\s*ร้าน\s*/i, '')
        .split('|')[0]
        .trim();
      console.log('Generated Google Maps Search Link:', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName)}`);
    }

    // Check for address in HTML
    const addressMatch = data.match(/"address":"([^"]+)"/i) || data.match(/"streetAddress":"([^"]+)"/i);
    if (addressMatch) console.log('Address:', addressMatch[1]);
  });
});
