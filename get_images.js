const https = require('https');
const fs = require('fs');

https.get('https://krishnajha3104.framer.website/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/https:\/\/framerusercontent\.com\/images\/[^"']+/g);
    if (match) {
      console.log("Found images:", [...new Set(match)]);
    } else {
      console.log("No images found");
    }
  });
}).on('error', err => console.log('Error:', err.message));
