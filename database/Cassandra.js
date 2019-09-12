/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const ExpressCassandra = require('express-cassandra');
const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const stream = require('stream');

const models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'mykeyspace',
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

const Menu = models.loadSchema('Menu', {
  fields: {
    id: 'int',
    Brunch: 'text',
    Lunch: 'text',
    Dinner: 'text',
  },
  key: ['id'],
});

// sync the schema definition with the cassandra database table
// if the schema has not changed, the callback will fire immediately
// otherwise express-cassandra will try to migrate the schema and fire the callback afterwards
Menu.syncDB((err) => {
  if (err) throw err;
  // console.log(result);
  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
  // models.instance.Menu.truncate(
  //   () => {
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
      // setTimeout(() => models.close(), 300000);
    });
    return output;
  }
  const input = fs.createReadStream('data.json.gz').pipe(zlib.createGunzip());
  (async () => {
    for await (const line of readLines({ input })) {
      const object = JSON.parse(line);
      if (object.id % 1000 === 0) {
        console.log(object.id);
      }

      const newMenu = new models.instance.Menu(object);

      newMenu.save((error) => {
        if (error) {
          console.log('this is save error', error);
        }
      });
    }
  })();
  //   },
  // );
});
