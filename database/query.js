/* eslint-disable no-plusplus */
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
    if (err) {
      callback(err);
    }
    const result = {};
    for (let i = 0; i < results.length; i++) {
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
        result[mealoption] = {};
        result[mealoption][category] = {};
        result[mealoption][category][name] = {
          description,
          price: price.toFixed(2),
        };
      }
    }
    callback(null, [result]);
  });
};

const postMenu = (dish, callback) => {
  const newDish = new models.instance.dishes(dish);
  newDish.save((err, result) => {
    if (err) {
      console.log(err);
    }
    callback(null, result);
  });
};

const updateMenu = (resid, dish, callback) => {
  const queryObject = {
    resid,
    name: dish.name,
    mealoption: dish.mealoption,
  };
  delete dish.name;
  delete dish.mealoption;
  const options = { if_exists: true };
  models.instance.dishes.update(queryObject, dish, options, (err, result) => {
    if (err) {
      console.log(err);
    }
    callback(null, result);
  });
};

module.exports = { getMenu, postMenu, updateMenu };
