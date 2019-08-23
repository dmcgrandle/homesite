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

/**
 * GET a video object by specifying the requested id number
 * @remarks
 *
 * Set up an API GET response for '/api/videos/video-by-id/:id' that returns a video object
 * in JSON format.
 *
 * @callback - validates user level, gets the video object and sends back to client.
 * Also processes any errors returned.
 */
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

/**
 * GET a video album object by specifying the requested id number
 * @remarks
 *
 * Set up an API GET response for '/api/videos/album-by-id/:id' that returns a video album object
 * in JSON format.
 *
 * @callback - validates user level, gets the video album object and sends back to client.
 * Also processes any errors returned.
 */
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

/**
 * GET a video album object by specifying the path.
 * @remarks
 *
 * Set up an API GET response for '/api/videos/album-by-path/:path' that returns a video album object
 * in JSON format.  This api call requires user level 2+ for access.
 * 
 * Format of :path - array of id strings, made URL-friendly with no spaces, and
 * by replacing / with +, so for example the path 'test/one/two' becomes (test+one+two)
 * and entire url is "http://example.com/api/videos/album/(test+one+two)".  Note - the
 * path can be relative (such as the previous example), or a full path can be specified
 * such as '/protected/videos/test/one/two': (+protected+videos+test+one+two), note the initial +
 *
 * @callback - validates user level 2+, gets the video album object and sends back to client.
 * Also processes any errors returned.
 */
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

/**
 * GET a video object by specifying the path.
 * @remarks
 *
 * Set up an API GET response for '/api/videos/video-by-path/:path' that returns a video object
 * in JSON format.  This api call requires user level 2+ for access.
 * 
 * Format of :path - array of id strings, made URL-friendly with no spaces, and
 * by replacing / with +, so for example the path 'test/one/two' becomes (test+one+two)
 * and entire url is "http://example.com/api/videos/album/(test+one+two+video.mp4)".  Note - the
 * path can be relative (such as the previous example), or a full path can be specified
 * such as '/protected/videos/test/one/two/video.mp4': (+protected+videos+test+one+two+video.mp4), 
 * note the initial +  The last parameter is the name of the video.
 *
 * @callback - validates user level 2+, gets the video object and sends back to client.
 * Also processes any errors returned.
 */
router.get(
    '/video-by-path/:path',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(
                switchMap((): Observable<Video> => mediaSvc.getMediaByPath(req.params.path, 'video'))
            )
            .subscribe(
                (video): Response => res.status(200).json(video),
                (err): void => errSvc.processError(err, res)
            );
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
    '/videos/:ids',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(switchMap((): Observable<Video[]> => mediaSvc.getMedias(req.params.ids, 'video')))
            .subscribe(
                (videos): Response => res.status(200).json(videos),
                (err): void => errSvc.processError(err, res)
            );
    }
);

router.get(
    '/thumbs/:ids',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(switchMap((): Observable<string[]> => mediaSvc.getThumbs(req.params.ids, 'video')))
            .subscribe(
                (videos): Response => res.status(200).json(videos),
                (err): void => errSvc.processError(err, res)
            );
    }
);

router.get(
    '/posters/:ids', // for compatibility with clients that may use the old syntax
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(switchMap((): Observable<string[]> => mediaSvc.getThumbs(req.params.ids, 'video')))
            .subscribe(
                (videos): Response => res.status(200).json(videos),
                (err): void => errSvc.processError(err, res)
            );
    }
);

export default router;
