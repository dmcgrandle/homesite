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


/* GET: list of downloads directory.  Needs level 2+ access */
router.get('/list', function(req, res, next) {
  userSvc.isValidLevel(req.user, 2)  // check username in jwt token for level
    .then(() => dlSvc.getList())
    .then(downloads => res.status(200).json(downloads))
    .catch(err => errSvc.processError(err, res));
});

/* POST: upload a file to the downloads directory.  Needs level 3+ access */
router.post('/upload', userSvc.testLevelForUpload, dlSvc.upload, function(req, res) {
    dlSvc.updateDownloadsDB(req.file)
      .then(reply => res.status(200).json(reply))
      .catch(err => errSvc.processError(err, res));
});

/* DELETE: delete a download.  Needs level 3+ access */
router.delete('/:filename', function(req, res, next) {
  userSvc.isValidLevel(req.user, 3)
    .then(() => dlSvc.delete(req.params.filename))
    .then(delDl => res.status(200).json(delDl))
    .catch(err => errSvc.processError(err, res));
});

/*
router.post('/upload', function(req, res, next) {
  userSvc.isValidLevel(req.user, 3)
    .then(() => multer(multerConf).single('file'))
    .then(downloads => res.status(200).json(downloads))
    .catch(err => errSvc.processError(err, res));
});
*/

// Utility functions for users route API

module.exports = router;
