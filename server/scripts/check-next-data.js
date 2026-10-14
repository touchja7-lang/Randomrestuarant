const fs = require('fs');
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
    const nextDataMatch = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/i);
    if (nextDataMatch) {
      console.log('FOUND __NEXT_DATA__!');
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const pageProps = nextData.props?.pageProps;
        console.log('pageProps keys:', Object.keys(pageProps || {}));

        // Look for business or restaurant data
        const business = pageProps?.business || pageProps?.restaurant || pageProps?.entity;
        if (business) {
          console.log('\n--- RESTAURANT DATA ---');
          console.log('Name:', business.name);
          console.log('DisplayName:', business.displayName);
          console.log('Address:', business.contact?.address || business.address);
          console.log('Lat/Lng:', business.lat, business.lng || business.contact?.lat);
          console.log('Rating:', business.rating || business.statistics?.rating);
          console.log('PriceRange:', business.priceRange);
          console.log('Categories/Tags:', business.categories?.map(c => c.name));
          console.log('Cover Photo:', business.coverPhoto?.url || business.defaultPhoto?.url);
        } else {
          // search deeper in props
          console.log('Dumping matching keys...');
          const str = JSON.stringify(pageProps);
          const nameMatch = str.match(/"name":"([^"]+)"/g);
          console.log('Names found:', nameMatch?.slice(0, 5));
          const latMatch = str.match(/"lat":([0-9.]+),"lng":([0-9.]+)/);
          console.log('Lat/Lng found:', latMatch ? latMatch[0] : 'None');
        }
      } catch (err) {
        console.error('Parse error:', err);
      }
    } else {
      console.log('__NEXT_DATA__ not found');
    }
  });
});
