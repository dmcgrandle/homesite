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
  console.log(new Date().toLocaleString() + " : Downloads API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());

/**
 * GET list of downloads
 * @remarks
 *
 * Set up an API GET response for '/api/downloads/list' that returns an array of downloads.
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
 * Set up an API POST response for '/api/downloads/upload' that returns the download object created
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
        (download: Download): Response => res.status(200).json(download),
        (err): void => errSvc.processError(err, res)
      );
  }
);

/**
 * POST: rename an existing file in the downloads directory
 * @remarks
 *
 * Set up an API POST response for '/api/downloads/rename' that returns the download object which has
 * been updated with a new filename value.
 * Requires level 3+ access.
 *
 * @callback - validates user level, updates filename, sends a response back with download.
 */
router.post('/rename', (req: RequestWithUser, res: express.Response): void => {
  userSvc
    .errIfNotValidLevel(req.user, 3)
    .pipe(switchMap((): Observable<Download> => dlSvc.renameFileIfNeeded(req.body)))
    .subscribe(
      (download): Response => res.status(200).json(download),
      (err): void => errSvc.processError(err, res)
    );
});

/**
 * DELETE: delete a download (file) from the downloads directory
 * @remarks
 *
 * Set up an API DELETE response for '/api/downloads/:filename' that deletes the download object
 * from the database, and the associated file on disk.
 * Requires level 3+ access.
 *
 * @callback - validates user level, deletes the database entry and the file, then finally sends a 
 * response back with the deleted download object.
 */
router.delete('/:filename', (req: RequestWithUser, res: express.Response): void => {
  userSvc
    .errIfNotValidLevel(req.user, 3)
    .pipe(switchMap((): Observable<Download> => dlSvc.delete(req.params.filename)))
    .subscribe(
      (deletedDownload): Response => res.status(200).json(deletedDownload),
      (err): void => errSvc.processError(err, res)
    )
});

export default router;
