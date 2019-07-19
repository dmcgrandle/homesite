/* downloads-api.ts - router for '/api/downloads' path API */

// External Imports:
import * as express from 'express';
import * as bodyParser from 'body-parser';

const router = express.Router();

// Project Imports:
import { RequestWithUser, Download } from 'src/model';
import { TokenService } from '../services/token-service';
import { UserService } from '../services/user-service';
import { DownloadService } from '../services/download-service';
import { ErrorService } from '../services/err-service';

// instantiate needed services:
const tokenSvc = new TokenService();
const userSvc = new UserService();
const dlSvc = new DownloadService();
const errSvc = new ErrorService();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log(Date.now() + " : Downloads API called - '" + req.originalUrl + "'");
  next();
});
router.use(tokenSvc.middlewareCheck());
router.use(bodyParser.json());


/* GET: list of downloads directory.  Needs level 2+ access */
router.get('/list', (req: RequestWithUser, res: express.Response) => {
  userSvc.isValidLevel(req.user, 2) // check username in jwt token for level
    .then(() => dlSvc.getList())
    .then((downloads: Download[]) => res.status(200).json(downloads))
    .catch(err => errSvc.processError(err, res));
});

/*  POST: upload a file to the downloads directory.  Needs level 3+ access
    Set this up a little differently than other router handlers: set up a middleware
    chain by defining 3 "next" functions that get called in order. */
router.post('/upload', userSvc.testLevelAtOrAbove3, dlSvc.upload, (req: RequestWithUser, res: express.Response) => {
  dlSvc.updateDownloadsDB(req.file)
    .then((download: Download) => res.status(200).json(download))
    .catch(err => errSvc.processError(err, res));
});

/*  POST: rename an existing file in the downloads directory.  Needs level 3+ access */
router.post('/rename', (req: RequestWithUser, res: express.Response) => {
  userSvc.isValidLevel(req.user, 3)
    .then(() => dlSvc.renameFile(req.body))
    .then((download: Download) => res.status(200).json(download))
    .catch(err => errSvc.processError(err, res));
});
    
/* DELETE: delete a download.  Needs level 3+ access */
router.delete('/:filename', (req: RequestWithUser, res: express.Response) => {
  userSvc.isValidLevel(req.user, 3)
    .then(() => dlSvc.delete(req.params.filename))
    .then((deletedDownload: Download) => res.status(200).json(deletedDownload))
    .catch(err => errSvc.processError(err, res));
});

// Utility functions for users route API

export default router;
