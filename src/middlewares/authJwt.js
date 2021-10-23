const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      error: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        error: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;