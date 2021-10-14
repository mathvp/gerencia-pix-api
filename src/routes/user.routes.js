const UserController = require('../controllers/UserController');

module.exports = function (app) {
  app.post(`/api/${process.env.API_VERSION}/users`, UserController.store);
}