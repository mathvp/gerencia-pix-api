const { authJwt } = require('../middlewares');
const BankController = require('../controllers/BankController');
const BankListController = require('../controllers/BankListController');
const UserCustomBankDataController = require('../controllers/UserCustomBankDataController');

module.exports = function (app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    `/api/${process.env.API_VERSION}/users/banks`,
    [authJwt.verifyToken],
    BankController.store
  );

  app.get(
    `/api/${process.env.API_VERSION}/users/banks/:bank_code?`,
    [authJwt.verifyToken],
    BankController.index
  );

  app.get(
    `/api/${process.env.API_VERSION}/banks`,
    [authJwt.verifyToken],
    BankListController.index
  );

  app.get(
    `/api/${process.env.API_VERSION}/users/banks/:bank_code/custom`,
    [authJwt.verifyToken],
    UserCustomBankDataController.index
  );

  app.post(
    `/api/${process.env.API_VERSION}/users/banks/:bank_code/custom`,
    [authJwt.verifyToken],
    UserCustomBankDataController.store
  );

  app.put(
    `/api/${process.env.API_VERSION}/users/banks`,
    [authJwt.verifyToken],
    UserCustomBankDataController.sortOrder
  );

  app.put(
    `/api/${process.env.API_VERSION}/users/banks/:bank_code`,
    [authJwt.verifyToken],
    UserCustomBankDataController.update
  );

  app.delete(
    `/api/${process.env.API_VERSION}/users/banks/:bank_code`,
    [authJwt.verifyToken],
    BankController.delete
  );
}