/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const db = require('../database/database.js');

const { findMenu, Menu, mongoose } = db;
const app = express();
const port = 3004;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use(express.static('public'));
app.use('/:L/menu', express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/:L/menu', (req, res) => {
  const menuId = req.params.L;
  findMenu(menuId)
    .then((result) => {
      const memo = [{}];
      const entries = Object.entries(result[0]);
      const menuData = Object.entries(entries[3][1]);
      menuData.forEach((entry) => {
        if (entry[0] !== 'id' && entry[0] !== '_id' && entry[0] !== '__v') {
          // eslint-disable-next-line prefer-destructuring
          memo[0][entry[0]] = entry[1];
        }
      });
      res.send(memo);
    });
});

app.post('/api/:L/menu', (req, res) => {
  const menuId = req.params.L;
  req.body.id = menuId;
  Menu.create(req.body, (err) => {
    if (err) {
      console.log('this is post error', err);
    } else {
      console.log('finished posting');
      res.send('finished posting');
    }
  });
});

app.put('/api/:L/menu', (req, res) => {
  const id = req.params.L;
  Menu.updateOne({ id }, req.body, (err) => {
    if (err) {
      console.log('this is put error', err);
    } else {
      console.log('finished updating');
      res.send('finished updating');
    }
  });
});

app.delete('/api/:L/menu', (req, res) => {
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
