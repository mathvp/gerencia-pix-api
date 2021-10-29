const { authJwt } = require('../middlewares');
const UserController = require('../controllers/UserController');

module.exports = function (app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    `/api/${process.env.API_VERSION}/users`,
    [],
    UserController.store
  );

  app.post(
    `/api/${process.env.API_VERSION}/users/login`,
    [],
    UserController.login
  );

  app.post(
    `/api/${process.env.API_VERSION}/users/logout`,
    [authJwt.verifyToken],
    UserController.logout
  );
}