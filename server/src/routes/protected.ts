/* protected.js - Checks all protected static content for a valid auth token  */

// Imports
// const express = require('express');
import * as express from 'express';
// const path = require('path');
import * as path from 'path';

// Project Imports:
import { TokenService } from '../services/token-service';

// Instantiate services:
const tokenSvc = new TokenService();
const router = express.Router();

// Middleware that is specific to this router:
// First middleware is a logger
router.use((req, res, next) => {
  // console.log('Accessing Protected Resource - Time: ', Date(Date.now()));
  console.log('Accessing Protected Resource - Time: ', Date.now());
  next();
});
// This is the authentication check for the protected files
router.use(tokenSvc.middlewareCheck());

// Last middleware: serve all files here statically.  Note the need for '..'
// since being inside the router also changes directory to the 'routes' dir,
// so we first have to go back up one level before we can find 'protected'.
router.use(express.static(path.join(__dirname, '..', 'protected')));

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