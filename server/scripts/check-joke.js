const https = require('https');

function check(url) {
  https.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  }, (res) => {
    console.log('URL:', url, '-> Status:', res.statusCode, 'Location:', res.headers.location);
    if (res.headers.location) {
      const next = new URL(res.headers.location, url).href;
      check(next);
    } else {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Final URL:', url, 'Length:', data.length);
        const title = data.match(/<title>([^<]+)<\/title>/i);
        console.log('Title:', title ? title[1] : 'No title');
        const ogTitle = data.match(/property="og:title"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:title"/i);
        console.log('OG Title:', ogTitle ? ogTitle[1] : 'No OG Title');
      });
    }
  });
}

check('https://www.wongnai.com/r/jokesamyaan');
