/* downloads-api.js - router for '/api/downloads' path API */

// External Imports:
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Project Imports:
const tokenSvc = require('../services/token-service');
const userSvc = require('../services/user-service');
const dlSvc = require('../services/download-service');
const errSvc = require('../services/err-service');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log(Date(Date.now()) + " : Downloads API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());


/* GET list of downloads directory.  Needs level 2+ access */
router.get('/list', function(req, res, next) {
  userSvc.isValidLevel(req.user, 2)
    .then(() => dlSvc.getList())
    .then(downloads => res.status(200).json(downloads))
    .catch(err => errSvc.processError(err, res));
});

// Utility functions for users route API

module.exports = router;
