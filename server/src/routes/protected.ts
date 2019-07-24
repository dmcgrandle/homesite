/* protected.js - Checks all protected static content for a valid auth token  */

// Imports
import * as express from 'express';
import * as path from 'path';
import Debug from 'debug';

// Project Imports:
import { tokenSvc } from '../services/token-service';

// Instantiate services:
const router = express.Router();
const debug = Debug('homesite:protected');

// Middleware that is specific to this router:
// First middleware is a logger
router.use((req, res, next) => {
  // console.log('Accessing Protected Resource - Time: ', Date(Date.now()));
  debug(`Accessing Resource: ${(new Date()).toLocaleString()} - ${req.originalUrl}`);
  // console.log('Accessing Protected Resource: - Time: ', (new Date()).toLocaleString());
  // req.originalUrl
  next();
});
// This is the authentication check for the protected files
router.use(tokenSvc.middlewareCheck());

// Last middleware: serve all files here statically.
router.use(express.static(path.join(__dirname, 'protected')));

// If the static serve doesn't work, then throw an error.  TODO: implement as error
router.all('*', (req, res, next) => {
  console.log('Whoops!  This should have been served statically ...');
  console.log('req.originalUrl: ' + req.originalUrl);
  console.log('req.baseUrl: ' + req.baseUrl);
  console.log('req.path: ' + req.path);
  console.log('__dirname: ' + path.join(__dirname));
  next();
});

export default router;