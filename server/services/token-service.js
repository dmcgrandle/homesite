/* token-service.js - provides authentication services */

// External Imports:
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const util = require('util');

// Internal constant.  Most are in the config file, except this one.  The issue is
// the middlewareCheck function at the bottom - it needs to be set up with a valid
// value for cfg.public_key before the asynchronous cfg function has been called.
// TODO: solve this issue.
const PUBLIC_KEY = fs.readFileSync('./keys/jwtRS256.key.pub');

// Set up cfg for holding variables from config.json:
let cfg = { public_key : '' }; // module scope needed, used throughout the module.
(async function() { // set up module-scope variables asynchronously. 
  try { // if errors then crash
    let config = JSON.parse(await require('./config-service.js')).token;
    // replace key values with the contents of the secret files pointed to by the config values
    config.private_key = await fs.readFile(config.private_key, 'utf8');
    config.public_key = await fs.readFile(config.public_key, 'utf8');
    config.email_secret = await fs.readFile(config.email_secret, 'utf8');
    cfg = config; // danged JS immutability!  Once set, cfg internals can't be changed, thus "config".
  }
  catch(err) { errAndExit(err, 1) };
})(); // IIFE 

exports.getNew = async function(uName) {
  return jwt.sign({username: uName}, cfg.private_key, {algorithm: 'RS256', expiresIn: '1day'});
};

exports.getEmailChangeToken = async function(uName) {
  return jwt.sign({username: uName}, cfg.email_secret, {expiresIn: '1hour'});
}

exports.expiryTime = async function(token) {
  return jwt.decode(token)['exp'];
};

exports.verify = async function(token) {
  return jwt.verify(token, cfg.public_key);
};

exports.isValidEmailToken = async function(token) {
  try {
    let test = jwt.verify(token, cfg.email_secret);
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

errAndExit = function(err, code) {
  console.log(err);
  process.exit(code);
};