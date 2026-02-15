const jwt = require('jsonwebtoken');

const signToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

module.exports = { signToken };
