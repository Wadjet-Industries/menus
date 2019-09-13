/* eslint-disable no-plusplus */
// const cassandra = require('cassandra-driver');

// const client = new cassandra.Client({
//   contactPoints: ['127.0.0.1'],
//   localDataCenter: 'datacenter1',
//   keyspace: '"scdMenus"',
// });

// const query = 'SELECT * FROM dishes WHERE resid = ?';
// client.execute(query, [10000000])
//   .then((result) => console.log(result));
const ExpressCassandra = require('express-cassandra');

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

// eslint-disable-next-line no-unused-vars
const Dishes = models.loadSchema('dishes', {
  fields: {
    resid: 'int',
    name: 'text',
    description: 'text',
    price: 'float',
    category: 'text',
    mealoption: 'text',
  },
  key: ['resid', 'name', 'mealoption'],
});

const getMenu = (resid, callback) => {
  models.instance.dishes.find({ resid }, { raw: true }, (err, results) => {
    if (err) throw err;
    const result = {};
    for (let i = 0; i < results.length; i++) {
      // console.log(results[i]);
      const {
        name,
        description,
        price,
        category,
        mealoption,
      } = results[i];
      if (result[mealoption]) {
        if (result[mealoption][category]) {
          result[mealoption][category][name] = {
            description,
            price: price.toFixed(2),
          };
        } else {
          result[mealoption][category] = {};
          result[mealoption][category][name] = {
            description,
            price: price.toFixed(2),
          };
        }
      } else {
        // console.log(mealoption);
        result[mealoption] = {};
        result[mealoption][category] = {};
        result[mealoption][category][name] = {
          description,
          price: price.toFixed(2),
        };
        // console.log([result]);
      }
    }
    // models.close();
    callback([result]);
  });
};

// getMenu(10000000, (result) => {
//   console.log(JSON.stringify(result));
// });

module.exports = { getMenu };
