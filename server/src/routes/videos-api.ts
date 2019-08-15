/* video-api.ts - router for '/api/videos' path API */

// External Imports:
import * as express from 'express';
import { Response } from 'express';
import * as bodyParser from 'body-parser';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Project Imports:
import { RequestWithUser, Video, VideoAlbum } from 'src/model';
import { tokenSvc } from '../services/token-service';
import { mediaSvc } from '../services/media-service';
import { userSvc } from '../services/user-service';
import { errSvc } from '../services/err-service';

// define a router to export:
const router = express.Router();

// middleware that is specific to this router
router.use(
    (req, res, next): void => {
        console.log(new Date().toLocaleString() + " : Videos API called - '" + req.originalUrl + "'");
        next();
    }
);
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/* GET video with given id.  Needs level 2+ access */
router.get(
    '/video-by-id/:id',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(switchMap((): Observable<Video> => mediaSvc.getMediaById(+req.params.id, 'video')))
            .subscribe(
                (video): Response => res.status(200).json(video),
                (err): void => errSvc.processError(err, res)
            );
    }
);

/* GET album with given id.  Needs level 2+ access */
router.get(
    '/album-by-id/:id',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(switchMap((): Observable<VideoAlbum> => mediaSvc.getAlbumById(+req.params.id, 'video')))
            .subscribe(
                (album): Response => res.status(200).json(album),
                (err): void => errSvc.processError(err, res)
            );
    }
);

/* GET album with given path string.  Needs level 2+ access
Format of :path - array of id strings, made URL-friendly with no spaces, and
by replacing / with +, so for example the path '/test/one/two' becomes
(test+one+two) and entire url is "http://example.com/api/videos/album/(test+one+two)" */
router.get(
    '/album-by-path/:path',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(
                switchMap((): Observable<VideoAlbum> => mediaSvc.getAlbumByPath(req.params.path, 'video'))
            )
            .subscribe(
                (album): Response => res.status(200).json(album),
                (err): void => errSvc.processError(err, res)
            );
    }
);

/* GET video with given path string.  Needs level 2+ access
Format of :path - array of id strings, made URL-friendly with no spaces, and
by replacing / with +, so for example the path '/test/one/two/video.mp4' becomes
(test+one+two+video.mp4) and entire url is
"http://example.com/api/videos/album/(test+one+two+video.mp4)"  The last parameter
is the name of the video */
router.get(
    '/video-by-path/:path',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .isValidLevel(req.user, 2)
            .then((): Promise<Video> => mediaSvc.getVideoByPath(req.params.path))
            .then((video): Response => res.status(200).json(video))
            .catch((err): void => errSvc.processError(err, res));
    }
);

/*  GET array of albums of with given ids.  Needs level 2+ access
Format of :albumsIds - array of id numbers, made URL-friendly with no spaces, and
by replacing [] with () and commas with +, so for example the array [ 0, 2, 7 ]
becomes (0+2+7) and entire url is "http://example.com/api/photos/albums/(0+2+7)"     */
router.get(
    '/albums/:ids',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(switchMap((): Observable<VideoAlbum[]> => mediaSvc.getAlbums(req.params.ids, 'video')))
            .subscribe(
                (albums): Response => res.status(200).json(albums),
                (err): void => errSvc.processError(err, res)
            );
    }
);

router.get(
    '/videos/:mediaIds',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .isValidLevel(req.user, 2)
            .then((): Promise<Video[]> => mediaSvc.getVideos(req.params.mediaIds))
            .then((videos): Response => res.status(200).json(videos))
            .catch((err): void => errSvc.processError(err, res));
    }
);

router.get(
    '/posters/:mediaIds',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .isValidLevel(req.user, 2)
            .then((): Promise<string[]> => mediaSvc.getPosters(req.params.mediaIds))
            .then((posters): Response => res.status(200).json(posters))
            .catch((err): void => errSvc.processError(err, res));
    }
);

export default router;
