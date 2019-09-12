/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const fs = require('fs');
const zlib = require('zlib');
// const { Parser } = require('json2csv');

const gzip = zlib.createGzip();
const out = fs.createWriteStream('data.json.gz');

const { createMenu } = require('./menuData.js');
// const stream = fs.createWriteStream('data.json', { flags: 'a' });
gzip.pipe(out);

// const fields = ['id', 'Brunch', 'Lunch', 'Dinner'];
// const json2csvParser = new Parser({ fields });

// gzip.write('"id","Brunch","Lunch","Dinner"\n');

// for (let i = 1; i < 10000001; i++) {
//   if (i % 1000 === 0) {
//     console.log(i);
//   }
//   const menu = createMenu(i);
//   if (menu.Brunch) {
//     menu.Brunch = JSON.stringify(menu.Brunch);
//   }

//   if (menu.Lunch) {
//     menu.Lunch = JSON.stringify(menu.Lunch);
//   }

//   if (menu.Dinner) {
//     menu.Dinner = JSON.stringify(menu.Dinner);
//   }

//   gzip.write(`${JSON.stringify(menu)}\n`);
// }

const writeOneMillionTimes = (writer) => {
  let i = 1000000;
  const write = () => {
    let ok = true;
    do {
      console.log(i);
      i -= 1;
      const menu = createMenu(i);
      if (menu.Brunch) {
        menu.Brunch = JSON.stringify(menu.Brunch);
      }

      if (menu.Lunch) {
        menu.Lunch = JSON.stringify(menu.Lunch);
      }

      if (menu.Dinner) {
        menu.Dinner = JSON.stringify(menu.Dinner);
      }

      if (i === 0) {
        // last time!
        writer.write(`${JSON.stringify(menu)}`);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(`${JSON.stringify(menu)}\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      console.log(ok);
      console.log('last if block');
      async () => {
        await writer.once('drain', async () => await console.log('called after drain'));
      };
    }
  };
  write();
};

writeOneMillionTimes(gzip);

gzip.end();
