/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const ExpressCassandra = require('express-cassandra');
const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const stream = require('stream');
// const { createMenu, createDishes } = require('./menuData.js');

const models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'sdcMenus',
    queryOptions: { consistency: ExpressCassandra.consistencies.one },
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1,
    },
    migration: 'drop',
  },
});

// const Menu = models.loadSchema('menu', {
//   fields: {
//     id: 'bigint',
//     mealOptions: {
//       type: 'list',
//       typeDef: '<mealOptions>',
//     },
//   },
//   key: ['id'],
// });

const Dishes = models.loadSchema('dishes', {
  fields: {
    resid: 'int',
    name: 'text',
    description: 'text',
    price: 'float',
    category: 'text',
    mealoption: 'text',
  },
  key: ['resId', 'name', 'description'],
});

// Menu.syncDB((err) => {
//   if (err) throw err;

//   const newMenu = new models.instance.Menu(createMenu());

//   newMenu.save((error) => {
//     if (error) {
//       console.log('this is save error', error);
//     }
//   });

//   // function readLines({ input }) {
//   //   const output = new stream.PassThrough({ objectMode: true });
//   //   const rl = readline.createInterface({ input });
//   //   rl.on('line', (line) => {
//   //     output.write(line);
//   //   });
//   //   rl.on('close', () => {
//   //     output.push(null);
//   //     // setTimeout(() => models.close(), 300000);
//   //   });
//   //   return output;
//   // }
//   // const input = fs.createReadStream('data.json.gz').pipe(zlib.createGunzip());
//   // (async () => {
//   //   for await (const line of readLines({ input })) {
//   //     const object = JSON.parse(line);
//   //     if (object.id % 1000 === 0) {
//   //       console.log(object.id);
//   //     }

//   //     const newMenu = new models.instance.Menu(object);

//   //     newMenu.save((error) => {
//   //       if (error) {
//   //         console.log('this is save error', error);
//   //       }
//   //     });
//   //   }
//   // })();
// });

Dishes.syncDB((err) => {
  if (err) throw err;
  // const n = 1;
  // console.log(`line: ${n}`);

  function readLines({ input }) {
    const output = new stream.PassThrough({ objectMode: true });
    const rl = readline.createInterface({ input });
    rl.on('line', (line) => {
      output.write(line);
    });
    rl.on('close', () => {
      output.push(null);
      // setTimeout(() => models.close(), 60000);
    });
    return output;
  }
  const input = fs.createReadStream('csv10M.csv.gz').pipe(zlib.createGunzip());
  (async () => {
    for await (const line of readLines({ input })) {
      const dish = line.split(',');
      const object = {
        resId: Number(dish[0]),
        name: dish[1],
        desc: dish[2],
        price: Number(dish[3]),
        category: dish[4],
        mealOption: dish[5],
      };
      const newDishes = new models.instance.dishes(object);
      if (object.resId % 10000 === 0) {
        console.log(object.resId);
      }
      newDishes.save((erro) => {
        if (erro) {
          console.log('this is create error', erro);
        }
      });
    }
  })();
});
