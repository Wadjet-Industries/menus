const redis = require('redis');
const postgreSQLQuery = require('../../database/postgreSQL.js');

const client = redis.createClient('6379', '54.183.196.154');

client.on('connect', function() {
    console.log('connected');
});

module.exports = {
  getMenu: (req, res) => {
    const menuId = Number(req.params.L);
    client.get(menuId, (err, value) => {
      if (err) {
        console.log(err);
        return;
      }
      if (value) {
        res.send(JSON.parse(value));
      } else {
        postgreSQLQuery.getMenu(menuId, (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          client.set(menuId, JSON.stringify(result));
          res.send(result);
        });
      }
    });
  },

  postDish: (req, res) => {
    req.body.resid = Number(req.params.L);
    console.log(req.body);
    postgreSQLQuery.postDish(req.body, (err, result) => {
      if (err) {
        console.log('post error', err);
        return;
      }
      res.send(result);
    });
  },

  updateDish: (req, res) => {
    const id = Number(req.params.L);
    postgreSQLQuery.updateDish(id, req.body, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send(result);
    });
  },

  deleteDish: (req, res) => {
    const id = req.params.L;
    console.log(id, req.body);
    postgreSQLQuery.deleteDish(id, req.body, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send(result);
    });
  },
};
