/* protected.js - Checks all protected static content for a valid auth token  */

// Imports
var express = require('express');
var router = express.Router();
var path = require('path');

var tokenSvc = require('../services/token-service');

// Constants

// middleware that is specific to this router:
// First middleware is a logger
router.use(function timeLog (req, res, next) {
  console.log('Accessing Protected Resource - Time: ', Date(Date.now()));
  next();
}); 
// This is the authentication check for the protected files
router.use(tokenSvc.middlewareCheck());
// Last middleware: serve all files here statically.  Note the need for '..'
// since being inside the router also changes directory to the 'routes' dir,
// so we first have to go back up one level before we can find 'protected'.
router.use((req, res, next) => {
  console.log('Hmmm ...');
  next();
});
router.use(express.static(path.join(__dirname, '..', 'protected')));
router.use((req, res, next) => {
  console.log('Well ...');
  next();
});



// If the static serve doesn't work, then throw an error.  TODO: implement as error
router.all('*', function (req, res, next) {
  console.log('Whoops!  This should have been served statically ...');
  console.log('req.originalUrl: ' + req.originalUrl);
  console.log('req.baseUrl: ' + req.baseUrl);
  console.log('req.path: ' + req.path);
  console.log('__dirname: ' + __dirname);
  next();
});

module.exports = router;
