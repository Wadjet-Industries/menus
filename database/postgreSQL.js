/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
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

const postgreSQLQuery = (query, callback) => {
  client.query(query, (err, result) => {
    if (err) {
      console.log(err);
    }
    callback(null, result);
  });
};

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

const postDish = ({
  resid,
  name,
  description,
  price,
  category,
  mealoption,
}, callback) => {
  const query = `INSERT INTO dishes VALUES ('${resid}', '${name}', '${mealoption}', '${category}', '${description}', '${price}');`;
  postgreSQLQuery(query, callback);
};

const updateDish = (resid, dish, callback) => {
  let changeValues = '';
  for (const key in dish) {
    if (key !== 'name' && key !== 'mealoption') {
      if (typeof dish[key] === 'string') {
        changeValues += `${key}='${dish[key]},'`;
      }
      changeValues += `${key}=${dish[key]},`;
    }
  }
  const query = `UPDATE dishes SET ${changeValues.slice(0, changeValues.length - 1)} WHERE resid=${resid} AND name='${dish.name}' AND mealoption='${dish.mealoption}';`;
  postgreSQLQuery(query, callback);
};

const deleteDish = (resid, dish, callback) => {
  console.log(resid, dish);
  const query = `DELETE FROM dishes WHERE resid=${resid} AND name='${dish.name}' AND mealoption='${dish.mealoption}';`;
  postgreSQLQuery(query, callback);
};

module.exports = {
  getMenu, postDish, updateDish, deleteDish, client,
};
