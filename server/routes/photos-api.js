/* photos-api.js - router for '/api/photos' path API */

// External Imports:
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const util = require('util');

// Project Imports:
const tokenSvc = require('../services/token-service');
const mediaSvc = require('../services/media-service');
const userSvc = require('../services/user-service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log(Date(Date.now()) + " : Photos API called - '" + req.originalUrl + "'");
    next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/* GET album with given id.  Needs level 2+ access */
router.get('/album-by-id/:id', function (req, res, next) {
    userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
        .then(() => mediaSvc.getPhotoAlbumById(Number(req.params.id)))
        .then(album => res.status(200).json(album))
        .catch(err => processError(err, res));
});

/* GET photo with given id.  Needs level 2+ access */
router.get('/photo-by-id/:id', function (req, res, next) {
    userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
        .then(() => mediaSvc.getPhotoById(Number(req.params.id)))
        .then(photo => res.status(200).json(photo))
        .catch(err => processError(err, res));
});

/* GET album with given id.  Needs level 2+ access     
    Format of :path - array of id strings, made URL-friendly with no spaces, and
    by replacing / with +, so for example the path '/test/one/two' becomes
    (test+one+two) and entire url is "http://example.com/api/photos/album/(test+one+two)" */
router.get('/album-by-path/:path', function (req, res, next) {
    userSvc.isValidLevel(req.user, 2)
        .then(() => mediaSvc.getPhotoAlbumByPath(req.params.path))
        .then(album => res.status(200).json(album))
        .catch(err => processError(err, res));
});


/*  GET array of albums of with given ids.  Needs level 2+ access
    Format of :albumsIds - array of id numbers, made URL-friendly with no spaces, and
    by replacing [] with () and commas with +, so for example the array [ 0, 2, 7 ]
    becomes (0+2+7) and entire url is "http://example.com/api/photos/albums/(0+2+7)"     */
router.get('/albums/:albumIds', function (req, res, next) {
    userSvc.isValidLevel(req.user, 2)
        .then(() => mediaSvc.getPhotoAlbums(req.params.albumIds))
        .then(albums => res.status(200).json(albums))
        .catch(err => processError(err, res));
});

router.get('/photos/:photoIds', function (req, res, next) {
    userSvc.isValidLevel(req.user, 2)
        .then(() => mediaSvc.getPhotos(req.params.photoIds))
        .then(photos => res.status(200).json(photos))
        .catch(err => processError(err, res));
});

router.get('/thumbs/:photoIds', function (req, res, next) {
    userSvc.isValidLevel(req.user, 2)
        .then(() => mediaSvc.getThumbs(req.params.photoIds))
        .then(thumbs => res.status(200).json(thumbs))
        .catch(err => processError(err, res));
});



// Internal functions:

processError = function (err, res) {
    // This function called when an error has occurred during the settling of a
    // Promise.  Two possibilites - it could be an internal server error, or
    // it could be a code we've thrown ourselves to send client back relevant
    // error info: first 3 chars are the statusCode, rest is the err message.
    console.log(Date(Date.now()) + ' : ' + err.stack);
    let statusCode = Number(err.message.slice(0, 3));
    if (!statusCode) {// not our error - no 3 digit number at the front
        res.status(500).send('Server Error "' + err.message + '" - see server log for details');
    }
    else { // one of our error messages, decode and send.
        let msg = err.message.slice(4);
        res.status(statusCode).send(msg);
    }
}

module.exports = router;
