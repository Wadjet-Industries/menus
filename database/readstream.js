/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const mongoose = require('mongoose');
const stream = require('stream');

// const { createMenu } = require('./menuData.js');


const menuSchema = new mongoose.Schema({ any: {}, id: Number }, { strict: false });

const conn = mongoose.createConnection('mongodb://localhost/menu',
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connection success!');
    }
  });

// const lineReader = readline.createInterface({
//   input: fs.createReadStream('data4.json.gz').pipe(zlib.createGunzip()),
// });

const Menu = conn.model('Menu', menuSchema);

// const allMenus = [];

// conn.collection('menus').drop(
//   () => {
//     console.log('collection dropped!');

//     let n = 1;
//     lineReader.on('line', (line) => {
//       n += 1;
//       // if (n % 100 === 0) {
//       console.log(`line: ${n}`);
//       // }
//       // allMenus.push(JSON.parse(line));
//       // console.log(typeof JSON.parse(line));
//       // console.log(JSON.parse(line));
//       // if (n % 100 === 0) {
//       //   Menu.insertMany(allMenus, (err) => {
//       //     if (err) {
//       //       console.log('this is insertMany error', err);
//       //       mongoose.disconnect();
//       //     }
//       //     console.log('succesful insert');
//       //     allMenus = [];
//       //   });
//       // }
//       Menu.create(JSON.parse(line), (err) => {
//         if (err) {
//           console.log('this is create error', err);
//         }
//       });
//     });
//   },
// );

conn.collection('menus').drop(
  () => {
    const n = 1;
    console.log(`line: ${n}`);

    function readLines({ input }) {
      const output = new stream.PassThrough({ objectMode: true });
      const rl = readline.createInterface({ input });
      rl.on('line', (line) => {
        output.write(line);
      });
      rl.on('close', () => {
        output.push(null);
        conn.close();
      });
      return output;
    }
    const input = fs.createReadStream('data1000.json.gz').pipe(zlib.createGunzip());
    (async () => {
      for await (const line of readLines({ input })) {
        const object = JSON.parse(line);
        if (object.id % 1000 === 0) {
          console.log(object.id);
        }
        Menu.create(object, (err) => {
          if (err) {
            console.log('this is create error', err);
          }
        });
      }
    })();
  },
);
