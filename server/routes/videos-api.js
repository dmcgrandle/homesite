/* videos-api.js - router for '/api/videos' path API */

// External Imports:
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Project Imports:
const tokenSvc = require('../services/token-service');
const mediaSvc = require('../services/media-service');
const userSvc = require('../services/user-service');



// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log(Date(Date.now()) + " : Videos API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/* GET album with given id.  Needs level 2+ access     
Format of :path - array of id strings, made URL-friendly with no spaces, and
by replacing / with +, so for example the path '/test/one/two' becomes
(test+one+two) and entire url is "http://example.com/api/videos/album/(test+one+two)" */
router.get('/album-by-path/:path', function(req, res, next) {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoAlbumByPath(req.params.path))
    .then(album => res.status(200).json(album))
    .catch(err => processError(err, res));
});

/*  GET array of albums of with given ids.  Needs level 2+ access
Format of :albumsIdsList - array of id numbers, made URL-friendly with no spaces, and
by replacing [] with () and commas with +, so for example the array [ 0, 2, 7 ]
becomes (0+2+7) and entire url is "http://example.com/api/photos/albums/(0+2+7)"     */
router.get('/albums/:albumIdsList', function(req, res, next) { 
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoAlbums(req.params.albumIdsList))
    .then(albums => res.status(200).json(albums))
    .catch(err => processError(err, res));
});
    

module.exports = router;
