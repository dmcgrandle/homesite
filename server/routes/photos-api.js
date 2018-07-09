/* photos.js - router for '/api/photos' path API */

// External Imports:
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Project Imports:
const tokenSvc = require('../services/token-service');
const photoSvc = require('../services/photo-service');


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log(Date(Date.now()) + " : Photos API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

module.exports = router;
