/* downloads-api.ts - router for '/api/downloads' path API */

// External Imports:
import * as express from 'express';
import { Response } from 'express';
import * as bodyParser from 'body-parser';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Project Imports:
import { RequestWithUser, Download } from 'src/model';
import { tokenSvc } from '../services/token-service';
import { userSvc } from '../services/user-service';
import { dlSvc } from '../services/download-service';
import { errSvc } from '../services/err-service';

// define a router to export:
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next): void => {
    console.log(
        new Date().toLocaleString() + " : Downloads API called - '" + req.originalUrl + "'"
    );
    next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/**
 * GET list of downloads
 * @remarks
 *
 * Set up an API GET response for '/api/list' that returns an array of downloads.
 * Requires level 2+ access.
 *
 * @callback - validates user level, gets downloads list and sends back to client.
 */
router.get('/list', (req: RequestWithUser, res: Response): void => {
    userSvc
        .errIfNotValidLevel(req.user, 2)
        .pipe(switchMap((): Observable<Download[]> => dlSvc.getList()))
        .subscribe(
            (downloads): Response => res.status(200).json(downloads),
            (err): void => errSvc.processError(err, res)
        );
});

/**
 * POST an upload into the downloads directory
 * @remarks
 *
 * Set up an API POST response for '/api/upload' that returns the download object created 
 * for the upload.  Set this up a little differently than other router handlers: set up a 
 * middleware chain by defining 3 "next" functions that get called in order.
 * Requires level 3+ access.
 *
 * @callback - validates user level, uploads the file, sends a response back with download.
 */
router.post(
    '/upload',
    userSvc.testLevelAtOrAbove3,
    dlSvc.upload,
    (req: RequestWithUser, res: express.Response): void => {
        dlSvc
            .updateDownloadsDB(req.file)
            .subscribe(
                (download: Download): Response => {
                    return res.status(200).json(download)
                },
                (err): void => errSvc.processError(err, res)
            )
    }
);

/*  POST: rename an existing file in the downloads directory.  Needs level 3+ access */
router.post('/rename', (req: RequestWithUser, res: express.Response): void => {
    userSvc
        .isValidLevel(req.user, 3)
        .then((): Promise<Download> => dlSvc.renameFile(req.body))
        .then((download: Download): Response => res.status(200).json(download))
        .catch((err): void => errSvc.processError(err, res));
});

/* DELETE: delete a download.  Needs level 3+ access */
router.delete('/:filename', (req: RequestWithUser, res: express.Response): void => {
    userSvc
        .isValidLevel(req.user, 3)
        .then((): Promise<Download> => dlSvc.delete(req.params.filename))
        .then((deletedDownload: Download): Response => res.status(200).json(deletedDownload))
        .catch((err): void => errSvc.processError(err, res));
});

// Utility functions for users route API

export default router;
