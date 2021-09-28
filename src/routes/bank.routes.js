const BankController = require('../controllers/BankController');

module.exports = function (app) {
  app.post('/users/:user_id/banks', BankController.store);
  app.get('/users/:user_id/banks', BankController.index);
}