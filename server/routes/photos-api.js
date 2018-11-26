/* photos-api.js - router for '/api/photos' path API */

// External Imports:
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

// Project Imports:
const tokenSvc = require('../services/token-service');
const mediaSvc = require('../services/media-service');
const userSvc = require('../services/user-service');
const errSvc = require('../services/err-service');

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log(Date(Date.now()) + " : Photos API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/* GET album with given id.  Needs level 2+ access */
router.get('/album-by-id/:id', (req, res) => {
  userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
    .then(() => mediaSvc.getPhotoAlbumById(Number(req.params.id)))
    .then(album => res.status(200).json(album))
    .catch(err => errSvc.processError(err, res));
});

/* GET photo with given id.  Needs level 2+ access */
router.get('/photo-by-id/:id', (req, res) => {
  userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
    .then(() => mediaSvc.getPhotoById(Number(req.params.id)))
    .then(photo => res.status(200).json(photo))
    .catch(err => errSvc.processError(err, res));
});

/* GET album with given id.  Needs level 2+ access
    Format of :path - array of id strings, made URL-friendly with no spaces, and
    by replacing / with +, so for example the path '/test/one/two' becomes
    (test+one+two) and entire url is "http://example.com/api/photos/album/(test+one+two)" */
router.get('/album-by-path/:path', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getPhotoAlbumByPath(req.params.path))
    .then(album => res.status(200).json(album))
    .catch(err => errSvc.processError(err, res));
});

/*  GET array of albums of with given ids.  Needs level 2+ access
    Format of :albumsIds - array of id numbers, made URL-friendly with no spaces, and
    by replacing [] with () and commas with +, so for example the array [ 0, 2, 7 ]
    becomes (0+2+7) and entire url is "http://example.com/api/photos/albums/(0+2+7)"     */
router.get('/albums/:albumIds', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getPhotoAlbums(req.params.albumIds))
    .then(albums => res.status(200).json(albums))
    .catch(err => errSvc.processError(err, res));
});

router.get('/photos/:photoIds', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getPhotos(req.params.photoIds))
    .then(photos => res.status(200).json(photos))
    .catch(err => errSvc.processError(err, res));
});

router.get('/thumbs/:photoIds', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getThumbs(req.params.photoIds))
    .then(thumbs => res.status(200).json(thumbs))
    .catch(err => errSvc.processError(err, res));
});

// Internal functions:

module.exports = router;
