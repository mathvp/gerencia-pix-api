const BankController = require('../controllers/BankController');
const BankListController = require('../controllers/BankListController');
const UserCustomBankDataController = require('../controllers/UserCustomBankDataController');

module.exports = function (app) {
  app.post(`/api/${process.env.API_VERSION}/users/:user_id/banks`, BankController.store);
  app.get(`/api/${process.env.API_VERSION}/users/:user_id/banks`, BankController.index);

  app.get(`/api/${process.env.API_VERSION}/banks`, BankListController.index);

  app.get(`/api/${process.env.API_VERSION}/users/:user_id/banks/:bank_code/custom`, UserCustomBankDataController.index);
  app.post(`/api/${process.env.API_VERSION}/users/:user_id/banks/:bank_code/custom`, UserCustomBankDataController.store);
}