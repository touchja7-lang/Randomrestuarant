const https = require('https');

function fetchUrl(url, maxRedirects = 5) {
  if (maxRedirects === 0) {
    console.error('Too many redirects');
    return;
  }

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
    console.log(`Status: ${res.statusCode} for ${url}`);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      const nextUrl = new URL(res.headers.location, url).href;
      console.log('Redirecting to:', nextUrl);
      fetchUrl(nextUrl, maxRedirects - 1);
      return;
    }

    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Final data length:', data.length);
      const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) console.log('Title:', titleMatch[1]);

      const ogTitle = data.match(/property="og:title"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:title"/i);
      if (ogTitle) console.log('og:title:', ogTitle[1]);

      const ogDesc = data.match(/property="og:description"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:description"/i);
      if (ogDesc) console.log('og:description:', ogDesc[1]);

      const ogImage = data.match(/property="og:image"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:image"/i);
      if (ogImage) console.log('og:image:', ogImage[1]);

      // Look for JSON-LD scripts
      const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
      let match;
      while ((match = jsonLdRegex.exec(data)) !== null) {
        try {
          const parsed = JSON.parse(match[1]);
          console.log('\n--- FOUND JSON-LD ---');
          console.log('Type:', parsed['@type']);
          console.log('Name:', parsed.name);
          console.log('Address:', parsed.address);
          console.log('Geo:', parsed.geo);
          console.log('PriceRange:', parsed.priceRange);
          console.log('AggregateRating:', parsed.aggregateRating);
          console.log('Image:', parsed.image);
        } catch (e) {
          // not valid json
        }
      }

      // Check for Google Maps link or coordinates inside the page
      const mapsMatch = data.match(/https:\/\/(?:maps\.google\.com|www\.google\.com\/maps)[^"'\s]+/gi);
      if (mapsMatch) {
        console.log('\nFound Google Maps links:', mapsMatch.slice(0, 3));
      }
    });
  }).on('error', (err) => {
    console.error('Fetch error:', err.message);
  });
}

fetchUrl('https://www.wongnai.com/r/213057HF');
