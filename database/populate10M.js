/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const fs = require('fs');
const zlib = require('zlib');
const gzip = zlib.createGzip();
const out = fs.createWriteStream('data3.json.gz');

const { createMenu } = require('./menuData.js');
// const stream = fs.createWriteStream('data.json', { flags: 'a' });
gzip.pipe(out);

for (let i = 1; i < 101; i++) {
  if (i % 100 === 0) {
    console.log(i);
  }
  const menu = createMenu(i);
  gzip.write(JSON.stringify(menu) + '+\n');
}

gzip.end();
