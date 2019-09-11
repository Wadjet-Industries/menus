const zlib = require('zlib');
const unzip = zlib.createUnzip();
const fs = require('fs');
const inp = fs.createReadStream('data2.json.gz');

// read file line by line while decompressing from gzip

inp.pipe(unzip)
  .on('error', (error) => {
    // handle error
    console.log(error);
  })
  .pipe(out)
  .on('error', (error) => {
    // handle error
    console.log(error);
  });