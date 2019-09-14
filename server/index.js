/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const db = require('../database/database.js');
const cassandra = require('../database/query.js');
const postgreSQLQuery = require('../database/postgreSQL.js');

const { Menu } = db;
const { getMenu, postMenu, updateMenu } = cassandra;
// const { query } = postgreSQLQuery;
const app = express();
const port = 3004;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use(express.static('public'));
app.use('/restaurant/:L/menu', express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/restaurant/:L/menu', (req, res) => {
  const menuId = Number(req.params.L);
  postgreSQLQuery.getMenu(menuId, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(result);
  });
});

app.post('/api/restaurant/:L/dish', (req, res) => {
  req.body.resid = Number(req.params.L);
  postMenu(req.body, (err, result) => {
    if (err) {
      console.log('post error', err);
      return;
    }
    res.send(result);
  });
});

app.put('/api/restaurant/:L/dish', (req, res) => {
  const id = Number(req.params.L);
  updateMenu(id, req.body, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(result);
  });
});

app.delete('/api/restaurant/:L/dish', (req, res) => {
  const id = req.params.L;
  Menu.deleteOne({ id }, (err) => {
    if (err) {
      console.log('this is delete error', err);
    } else {
      console.log('finished deleting');
      res.send('finished deleting');
    }
  });
});

app.listen(port, () => { console.log(`server ${port} is listening...`); });

module.exports.app = app;
