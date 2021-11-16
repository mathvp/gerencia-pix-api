const jwt = require('jsonwebtoken');
const config = require('../../../src/config/auth.config');

verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      error: "No token provided!"
    });
  }

  next();
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;