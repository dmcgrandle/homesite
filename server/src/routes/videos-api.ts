/* video-api.ts - router for '/api/videos' path API */

// External Imports:
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Project Imports:
import { RequestWithUser } from 'src/model';
import { TokenService } from '../services/token-service';
import { MediaService } from '../services/media-service';
import { UserService } from '../services/user-service';
import { ErrorService } from '../services/err-service';

// instantiate needed services:
const router = express.Router();
const tokenSvc = new TokenService();
const mediaSvc = new MediaService();
const userSvc = new UserService();
const errSvc = new ErrorService();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log(Date.now() + " : Videos API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/* GET video with given id.  Needs level 2+ access */
router.get('/video-by-id/:id', (req: RequestWithUser, res: express.Response) => {
  userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
    .then(() => mediaSvc.getVideoById(Number(req.params.id)))
    .then(video => res.status(200).json(video))
    .catch(err => errSvc.processError(err, res));
});

/* GET album with given path string.  Needs level 2+ access
Format of :path - array of id strings, made URL-friendly with no spaces, and
by replacing / with +, so for example the path '/test/one/two' becomes
(test+one+two) and entire url is "http://example.com/api/videos/album/(test+one+two)" */
router.get('/album-by-path/:path', (req: RequestWithUser, res: express.Response) => {
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
router.get('/video-by-path/:path', (req: RequestWithUser, res: express.Response) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoByPath(req.params.path))
    .then(video => res.status(200).json(video))
    .catch(err => errSvc.processError(err, res));
});

/*  GET array of albums of with given ids.  Needs level 2+ access
Format of :albumsIds - array of id numbers, made URL-friendly with no spaces, and
by replacing [] with () and commas with +, so for example the array [ 0, 2, 7 ]
becomes (0+2+7) and entire url is "http://example.com/api/photos/albums/(0+2+7)"     */
router.get('/albums/:albumIds', (req: RequestWithUser, res: express.Response) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideoAlbums(req.params.albumIds))
    .then(albums => res.status(200).json(albums))
    .catch(err => errSvc.processError(err, res));
});

router.get('/videos/:mediaIds', (req: RequestWithUser, res: express.Response) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getVideos(req.params.mediaIds))
    .then(videos => res.status(200).json(videos))
    .catch(err => errSvc.processError(err, res));
});

router.get('/posters/:mediaIds', (req: RequestWithUser, res: express.Response) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => mediaSvc.getPosters(req.params.mediaIds))
    .then(posters => res.status(200).json(posters))
    .catch(err => errSvc.processError(err, res));
});

export default router;
