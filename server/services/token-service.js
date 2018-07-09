/* token-service.js - provides authentication services */

// External Imports:
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// Internal constants.  TODO: put these in a config file
const PRIVATE_KEY = fs.readFileSync('./keys/jwtRS256.key');
const PUBLIC_KEY = fs.readFileSync('./keys/jwtRS256.key.pub');
const EMAIL_SECRET = 'This is a super-secret email secret - CHANGE ME';

exports.getNew = async function(uName) {
  return jwt.sign({username: uName}, PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '1day'});
};

exports.getEmailChangeToken = async function(uName) {
  return jwt.sign({username: uName}, EMAIL_SECRET, {expiresIn: '1hour'});
}

exports.expiryTime = async function(token) {
  return jwt.decode(token)['exp'];
};

exports.verify = async function(token) {
  return jwt.verify(token, PUBLIC_KEY);
};

exports.isValidEmailToken = async function(token) {
  try {
    let test = jwt.verify(token, EMAIL_SECRET);
  }
  catch (err) {
    throw new Error('403 Invalid token');
  }
  return true;
};

exports.middlewareCheck = function(unlessPath) {
  // Used in router.use middleware check.  'unlessPath' is an object specifying
  // any paths to EXCLUDE from the token check (no authentication needed).
  if (unlessPath) {
    return expressJwt({secret: PUBLIC_KEY}).unless(unlessPath);
  }
  else {
    return expressJwt({secret: PUBLIC_KEY});
  }
};
