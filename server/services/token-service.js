/* token-service.js - provides authentication services */

// External Imports:
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// Project Imports:
const cfg = require('../config').tokenService;

exports.getNew = async uName => jwt.sign({ username: uName }, cfg.private_key,
  { algorithm: 'RS256', expiresIn: '1day' });

exports.getEmailChangeToken = async uName => jwt.sign({ username: uName },
  cfg.email_secret, { expiresIn: '1hour' });

exports.expiryTime = async token => jwt.decode(token).exp;

exports.verify = async token => jwt.verify(token, cfg.public_key);

exports.isValidEmailToken = async (token) => {
  try {
    jwt.verify(token, cfg.email_secret);
  } catch (err) {
    throw new Error('403 Invalid token');
  }
  return true;
};

exports.middlewareCheck = (unlessPath) => {
  // Used in router.use middleware check.  'unlessPath' is an object specifying
  // any paths to EXCLUDE from the token check (no authentication needed).
  if (unlessPath) {
    return expressJwt({ secret: cfg.public_key }).unless(unlessPath);
  }
  return expressJwt({ secret: cfg.public_key });
};
