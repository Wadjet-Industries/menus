/* eslint-disable no-plusplus */
const { Client } = require('pg');

const client = new Client({
  user: 'johnyi',
  host: 'localhost',
  database: 'mydb',
  password: '',
  port: 5432,
});

client.connect();

const getMenu = (resid, callback) => {
  client.query(`SELECT * FROM dishes WHERE resid=${resid};`, (err, results) => {
    if (err) {
      callback(err);
    }
    const result = {};
    for (let i = 0; i < results.rows.length; i++) {
      const {
        name,
        description,
        price,
        category,
        mealoption,
      } = results.rows[i];
      const formattedPrice = Number(price.slice(1));
      if (result[mealoption]) {
        if (result[mealoption][category]) {
          result[mealoption][category][name] = {
            description,
            price: formattedPrice,
          };
        } else {
          result[mealoption][category] = {};
          result[mealoption][category][name] = {
            description,
            price: formattedPrice,
          };
        }
      } else {
        result[mealoption] = {};
        result[mealoption][category] = {};
        result[mealoption][category][name] = {
          description,
          price: formattedPrice,
        };
      }
    }
    callback(null, [result]);
  });
};

module.exports = { getMenu };
