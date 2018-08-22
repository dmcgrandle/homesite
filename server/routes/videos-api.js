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

/* GET video with given id.  Needs level 2+ access */
router.get('/video-by-id/:id', function(req, res, next) { 
  userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
    .then(() => mediaSvc.getVideoById(Number(req.params.id)))
    .then(video => res.status(200).json(video))
    .catch(err => processError(err, res));
});

/* GET album with given path string.  Needs level 2+ access     
Format of :path - array of id strings, made URL-friendly with no spaces, and
by replacing / with +, so for example the path '/test/one/two' becomes
(test+one+two) and entire url is "http://example.com/api/videos/album/(test+one+two)" */
router.get('/album-by-path/:path', function(req, res, next) {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoAlbumByPath(req.params.path))
    .then(album => res.status(200).json(album))
    .catch(err => processError(err, res));
});

/* GET video with given path string.  Needs level 2+ access     
Format of :path - array of id strings, made URL-friendly with no spaces, and
by replacing / with +, so for example the path '/test/one/two/video.mp4' becomes
(test+one+two+video.mp4) and entire url is 
"http://example.com/api/videos/album/(test+one+two+video.mp4)"  The last parameter 
is the name of the video */
router.get('/video-by-path/:path', function(req, res, next) {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoByPath(req.params.path))
    .then(video => res.status(200).json(video))
    .catch(err => processError(err, res));
});


/*  GET array of albums of with given ids.  Needs level 2+ access
Format of :albumsIds - array of id numbers, made URL-friendly with no spaces, and
by replacing [] with () and commas with +, so for example the array [ 0, 2, 7 ]
becomes (0+2+7) and entire url is "http://example.com/api/photos/albums/(0+2+7)"     */
router.get('/albums/:albumIds', function(req, res, next) { 
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoAlbums(req.params.albumIds))
    .then(albums => res.status(200).json(albums))
    .catch(err => processError(err, res));
});

router.get('/videos/:videoIds', function(req, res, next) { 
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideos(req.params.videoIds))
    .then(videos => res.status(200).json(videos))
    .catch(err => processError(err, res));
});


router.get('/posters/:videoIds', function(req, res, next) { 
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getPosters(req.params.videoIds))
    .then(posters => res.status(200).json(posters))
    .catch(err => processError(err, res));
});

// Internal functions:

processError = function (err, res) {
  // This function called when an error has occurred during the settling of a
  // Promise.  Two possibilites - it could be an internal server error, or
  // it could be a code we've thrown ourselves to send client back relevant
  // error info: first 3 chars are the statusCode, rest is the err message.
  console.log(Date(Date.now()) + ' : ' + err.stack);
  let statusCode = Number(err.message.slice(0,3));
  if (!statusCode) {// not our error - no 3 digit number at the front
    res.status(500).send('Server Error "' + err.message + '" - see server log for details');
  }
  else { // one of our error messages, decode and send.
    let msg = err.message.slice(4);
    res.status(statusCode).send(msg);
  }
}

module.exports = router;
