/* token-service.js - provides authentication services */

// External Imports:
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const util = require('util');

// Project Imports:
const cfg = require('../config').tokenService;

exports.getNew = async function (uName) {
    return jwt.sign({ username: uName }, cfg.private_key, { algorithm: 'RS256', expiresIn: '1day' });
};

exports.getEmailChangeToken = async function (uName) {
    return jwt.sign({ username: uName }, cfg.email_secret, { expiresIn: '1hour' });
}

exports.expiryTime = async function (token) {
    return jwt.decode(token)['exp'];
};

exports.verify = async function (token) {
    return jwt.verify(token, cfg.public_key);
};

exports.isValidEmailToken = async function (token) {
    try {
        jwt.verify(token, cfg.email_secret);
    }
    catch (err) {
        throw new Error('403 Invalid token');
    }
    return true;
};

exports.middlewareCheck = function (unlessPath) {
    // Used in router.use middleware check.  'unlessPath' is an object specifying
    // any paths to EXCLUDE from the token check (no authentication needed).
    if (unlessPath) {
        return expressJwt({ secret: cfg.public_key }).unless(unlessPath);
    }
    else {
        return expressJwt({ secret: cfg.public_key });
    }
};

errAndExit = function (err, code) {
    console.log(err);
    process.exit(code);
};