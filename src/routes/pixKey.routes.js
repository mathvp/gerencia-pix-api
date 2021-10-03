const PixKeyController = require('../controllers/PixKeyController');

module.exports = function (app) {
  app.post('/users/:user_id/banks/:bank_code/pix-keys', PixKeyController.store);
  app.get('/users/:user_id/banks/:bank_code/pix-keys', PixKeyController.index);
}