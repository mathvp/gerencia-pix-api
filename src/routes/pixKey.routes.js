const PixKeyController = require('../controllers/PixKeyController');

module.exports = function (app) {
  app.post(`/api/${process.env.API_VERSION}/users/:user_id/banks/:bank_code/pix-keys`, PixKeyController.store);
  app.get(`/api/${process.env.API_VERSION}/users/:user_id/banks/:bank_code/pix-keys`, PixKeyController.index);
}