/* videos-api.js - router for '/api/videos' path API */

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
  console.log(Date(Date.now()) + " : Videos API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/* GET video with given id.  Needs level 2+ access */
router.get('/video-by-id/:id', (req, res) => {
  userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
    .then(() => mediaSvc.getVideoById(Number(req.params.id)))
    .then(video => res.status(200).json(video))
    .catch(err => errSvc.processError(err, res));
});

/* GET album with given path string.  Needs level 2+ access
Format of :path - array of id strings, made URL-friendly with no spaces, and
by replacing / with +, so for example the path '/test/one/two' becomes
(test+one+two) and entire url is "http://example.com/api/videos/album/(test+one+two)" */
router.get('/album-by-path/:path', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoAlbumByPath(req.params.path))
    .then(album => res.status(200).json(album))
    .catch(err => errSvc.processError(err, res));
});

/* GET video with given path string.  Needs level 2+ access
Format of :path - array of id strings, made URL-friendly with no spaces, and
by replacing / with +, so for example the path '/test/one/two/video.mp4' becomes
(test+one+two+video.mp4) and entire url is
"http://example.com/api/videos/album/(test+one+two+video.mp4)"  The last parameter
is the name of the video */
router.get('/video-by-path/:path', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoByPath(req.params.path))
    .then(video => res.status(200).json(video))
    .catch(err => errSvc.processError(err, res));
});

/*  GET array of albums of with given ids.  Needs level 2+ access
Format of :albumsIds - array of id numbers, made URL-friendly with no spaces, and
by replacing [] with () and commas with +, so for example the array [ 0, 2, 7 ]
becomes (0+2+7) and entire url is "http://example.com/api/photos/albums/(0+2+7)"     */
router.get('/albums/:albumIds', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoAlbums(req.params.albumIds))
    .then(albums => res.status(200).json(albums))
    .catch(err => errSvc.processError(err, res));
});

router.get('/videos/:videoIds', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideos(req.params.videoIds))
    .then(videos => res.status(200).json(videos))
    .catch(err => errSvc.processError(err, res));
});

router.get('/posters/:videoIds', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getPosters(req.params.videoIds))
    .then(posters => res.status(200).json(posters))
    .catch(err => errSvc.processError(err, res));
});

module.exports = router;
