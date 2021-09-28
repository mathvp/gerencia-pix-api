const UserController = require('../controllers/UserController');

module.exports = function (app) {
  app.post('/users', UserController.store);
}