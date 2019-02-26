/* downloads-api.js - router for '/api/downloads' path API */

// External Imports:
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

// Project Imports:
const tokenSvc = require('../services/token-service');
const userSvc = require('../services/user-service');
const dlSvc = require('../services/download-service');
const errSvc = require('../services/err-service');

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log(Date(Date.now()) + " : Downloads API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());


/* GET: list of downloads directory.  Needs level 2+ access */
router.get('/list', (req, res) => {
  userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
    .then(() => dlSvc.getList())
    .then(downloads => res.status(200).json(downloads))
    .catch(err => errSvc.processError(err, res));
});

/*  POST: upload a file to the downloads directory.  Needs level 3+ access
    Set this up a little differently than other router handlers: set up a middleware
    chain by defining 3 "next" functions that get called in order. */
router.post('/upload', userSvc.testLevelAtOrAbove3, dlSvc.upload, (req, res) => {
  dlSvc.updateDownloadsDB(req.file)
    .then(reply => res.status(200).json(reply))
    .catch(err => errSvc.processError(err, res));
});

/*  POST: rename an existing file in the downloads directory.  Needs level 3+ access */
router.post('/rename', (req, res) => {
  userSvc.isValidLevel(req.user, 3)
    .then(() => dlSvc.renameFile(req.body))
    .then(reply => res.status(200).json(reply))
    .catch(err => errSvc.processError(err, res));
});
    
/* DELETE: delete a download.  Needs level 3+ access */
router.delete('/:filename', (req, res) => {
  userSvc.isValidLevel(req.user, 3)
    .then(() => dlSvc.delete(req.params.filename))
    .then(delDl => res.status(200).json(delDl))
    .catch(err => errSvc.processError(err, res));
});

// Utility functions for users route API

module.exports = router;
