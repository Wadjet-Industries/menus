/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const fs = require('fs');
const zlib = require('zlib');
const faker = require('faker');

const gzip = zlib.createGzip();
const out = fs.createWriteStream('restaurant10M.csv.gz');

const { createDishes } = require('./menuData.js');

gzip.pipe(out);

const createRecords = async () => {
  let i = 1;
  let ableToWrite = true;
  const write = () => {
    const dishes = createDishes(i);
    for (let j = 0; j < dishes.length; j++) {
      const {
        resid,
        name,
        description,
        price,
        category,
        mealoption,
      } = dishes[j];
      const csvMenu = `${resid},${name},${mealoption},${category},${description},${price}\n`;
      ableToWrite = gzip.write(csvMenu);
    }
    i++;
  };

  while (i < 10000001) {
    write();
    if (i % 10000 === 0) {
      console.log(i);
    }
    if (!ableToWrite) {
      await new Promise((resolve) => {
        gzip.once('drain', resolve);
      });
    }
  }
  await new Promise((resolve) => {
    gzip.end('10000001,burger,Lunch,Meat patty,Main,12.89\n', resolve);
  });
};

// gzip.write('resid,name,mealoption,category,description,price\n');
// createRecords();

const createRestaurants = async () => {
  let i = 1;
  let ableToWrite = true;
  const write = () => {
    const name = faker.lorem.word();
    const restaurant = `${i},${name}\n`;
    ableToWrite = gzip.write(restaurant);
    i++;
  };

  while (i < 10000001) {
    write();
    if (i % 10000 === 0) {
      console.log(i);
    }
    if (!ableToWrite) {
      await new Promise((resolve) => {
        gzip.once('drain', resolve);
      });
    }
  }
  await new Promise((resolve) => {
    gzip.end('10000001,What-a-burger\n', resolve);
  });
};

gzip.write('resid,name\n');
createRestaurants();
