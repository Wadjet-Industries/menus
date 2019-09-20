const postgreSQLQuery = require('../../database/postgreSQL.js');

module.exports = {
  getMenu: (req, res) => {
    const menuId = Number(req.params.L);
    postgreSQLQuery.getMenu(menuId, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send(result);
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
