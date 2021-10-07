const BankController = require('../controllers/BankController');
const BankListController = require('../controllers/BankListController');
const UserCustomBankDataController = require('../controllers/UserCustomBankDataController');

module.exports = function (app) {
  app.post('/users/:user_id/banks', BankController.store);
  app.get('/users/:user_id/banks', BankController.index);

  app.get('/banks', BankListController.index);

  app.get('/users/:user_id/banks/:bank_code/custom', UserCustomBankDataController.index);
  app.post('/users/:user_id/banks/:bank_code/custom', UserCustomBankDataController.store);
}