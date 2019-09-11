const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const mongoose = require('mongoose');
const { createMenu } = require('./menuData.js');

const menuSchema = new mongoose.Schema({ any: {}, id: Number }, { strict: false });

const conn = mongoose.createConnection('mongodb://localhost/menu',
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connection success!');
    }
  });

let lineReader = readline.createInterface({
  input: fs.createReadStream('data4.json.gz').pipe(zlib.createGunzip())
});

const Menu = conn.model('Menu', menuSchema);

const allMenus = [];

conn.collection('menus').drop(
  () => {
    console.log('collection dropped!');

    let n = 1;
    lineReader.on('line', (line) => {
      console.log("line: " + n);
      n += 1;
      // allMenus.push(JSON.parse(line));
      // console.log(typeof JSON.parse(line));
      // console.log(JSON.parse(line));
      // if (n % 100 === 0) {
      //   Menu.insertMany(allMenus, (err) => {
      //     if (err) {
      //       console.log('this is insertMany error', err);
      //       mongoose.disconnect();
      //     }
      //     console.log('succesful insert');
      //     allMenus = [];
      //   });
      // }
      Menu.create(JSON.parse(line), (err) => {
        if (err) {
          console.log('this is create error', err);
        } else {
          console.log('succesful insert');
        }
      });
    });
    // mongoose.disconnect();
  }
);
