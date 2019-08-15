/* photos-api.ts - router for '/api/photos' path API */

// External Imports:
import * as express from 'express';
import { Response } from 'express';
import * as bodyParser from 'body-parser';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Project Imports:
import { RequestWithUser, PhotoAlbum, Photo } from 'src/model';
import { tokenSvc } from '../services/token-service';
import { mediaSvc } from '../services/media-service';
import { userSvc } from '../services/user-service';
import { errSvc } from '../services/err-service';

// define a router to export:
const router = express.Router();

// middleware that is specific to this router
router.use(
    (req, res, next): void => {
        console.log(new Date().toLocaleString() + " : Photos API called - '" + req.originalUrl + "'");
        next();
    }
);
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/* GET photo with given id.  Needs level 2+ access */
router.get(
    '/photo-by-id/:id',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 4)
            .pipe(switchMap((): Observable<Photo> => mediaSvc.getMediaById(+req.params.id, 'photo')))
            .subscribe(
                (photo): Response => res.status(200).json(photo),
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
            .pipe(switchMap((): Observable<PhotoAlbum> => mediaSvc.getAlbumById(+req.params.id, 'photo')))
            .subscribe(
                (album): Response => res.status(200).json(album),
                (err): void => errSvc.processError(err, res)
            );
    }
);

/* GET album with given path.  Needs level 2+ access
    Format of :path - array of id strings, made URL-friendly with no spaces, and
    by replacing / with +, so for example the path '/test/one/two' becomes
    (test+one+two) and entire url is "http://example.com/api/photos/album/(test+one+two)" */
router.get(
    '/album-by-path/:path',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .errIfNotValidLevel(req.user, 2)
            .pipe(
                switchMap((): Observable<PhotoAlbum> => mediaSvc.getAlbumByPath(req.params.path, 'photo'))
            )
            .subscribe(
                (album): Response => res.status(200).json(album),
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
            .pipe(switchMap((): Observable<PhotoAlbum[]> => mediaSvc.getAlbums(req.params.ids, 'photo')))
            .subscribe(
                (albums): Response => res.status(200).json(albums),
                (err): void => errSvc.processError(err, res)
            );
    }
);

router.get(
    '/photos/:mediaIds',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .isValidLevel(req.user, 2)
            .then((): Promise<Photo[]> => mediaSvc.getPhotos(req.params.mediaIds))
            .then((photos): Response => res.status(200).json(photos))
            .catch((err): void => errSvc.processError(err, res));
    }
);

router.get(
    '/thumbs/:mediaIds',
    (req: RequestWithUser, res: express.Response): void => {
        userSvc
            .isValidLevel(req.user, 2)
            .then((): Promise<string[]> => mediaSvc.getThumbs(req.params.mediaIds))
            .then((thumbs): Response => res.status(200).json(thumbs))
            .catch((err): void => errSvc.processError(err, res));
    }
);

// Internal functions:

export default router;
