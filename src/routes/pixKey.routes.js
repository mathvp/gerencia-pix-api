const { authJwt } = require('../middlewares');
const PixKeyController = require('../controllers/PixKeyController');

module.exports = function (app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    `/api/${process.env.API_VERSION}/users/:user_id/banks/:bank_code/pix-keys`,
    [authJwt.verifyToken],
    PixKeyController.store
  );

  app.get(
    `/api/${process.env.API_VERSION}/users/:user_id/banks/:bank_code/pix-keys`,
    [authJwt.verifyToken],
    PixKeyController.index
  );

  app.delete(
    `/api/${process.env.API_VERSION}/users/:user_id/banks/:bank_code/:pix_key_id`,
    [authJwt.verifyToken],
    PixKeyController.delete
  );

  app.put(
    `/api/${process.env.API_VERSION}/users/:user_id/banks/:bank_code/:pix_key_id`,
    [authJwt.verifyToken],
    PixKeyController.update
  );

}