/* -----------------        download-service.js               ------------------
------------------------------------------------------------------------------*/

const logDS = require('debug')('homesite:download-service');

// External Imports:
import * as fs from 'fs-extra';
import { Db } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { spawn as spawnProc } from 'child_process';

// Project Imports:
import { Download, FileObject, FilenameChangedObj } from '../model';
// import config from './config';
import { database } from './db-service';
import { fileSvc } from './file-service';
import { errSvc } from './err-service';

// module level constants and services:
const cfg = config.downloadService;

// let cfg: any;
// if (fs.existsSync('./config.js')) {
//   import('./config.js').then((importedCfg: any) => {
//     cfg = importedCfg.downloadService;
//     console.log('cfg in download.service is ', cfg);
//   })
// }

namespace ds {

  export class DownloadService {
    // need the bang (!) to stop typescript from complaining that the assignment is inside a try block
    private db!: Db;

    constructor() {
      this.init();
    }

    private async init() {
      try {
        this.db = await database;
        const files: FileObject[] = await fileSvc.downloadFiles(cfg.DOWNLOAD_DIR.PATH, this.isDownloadSuffix);
        const downloads: Download[] = await this.buildDownloads(files);
        await this.saveDataToDB(cfg.DB_COLLECTION_NAME, downloads);
        console.log(Date.now() + ' : created new "download" document in db.');
      } catch (err) {
        errSvc.exit(err, 1);
      }
    }

    private isDownloadSuffix(/* str */) { // TODO: restrict file types.  For now, wide open
      //    const suffix = str.substr(-4,4).toLowerCase();
      return true;
    }

    // Set up Multer
    private storageOpts: multer.DiskStorageOptions = {
      destination: (req, file, next) => {
        next(null, 'protected/downloads/');
      },
      filename: (req, file, next) => {
        next(null, file.originalname);
      },
    };
    private multerConf: multer.Options = {
      storage: multer.diskStorage(this.storageOpts),
    };
    private multerUpload = multer(this.multerConf).single('upload');
    public upload = (req: Request, res: Response, next: NextFunction) => {
      req.on('aborted', () => {
        logDS('Upload aborted by client.');
      });
      req.on('close', () => {
        logDS('finished uploading.');
        if (req.file) {
          logDS(`${Date.now()} : File Uploaded: "${req.file.filename}"`);
        }
      });
      // Middleware function to upload - define next to handle errors
      this.multerUpload(req, res, (err) => {
        if (err) {
          logDS(err);
          return res.status(422).send('Error uploading file.');
        }
        next();
        return null;
      });
    };

    private async saveDataToDB(collection: string, data: Download[]) {
      try {
        if (await this.db.collection(collection).count() > 0) { // already exists
          await this.db.collection(collection).drop(); // wipe it out.
        }
        await this.db.collection(collection).insertMany(data);
      } catch (err) { errSvc.exit(err); }
    }

    private grepPromise(search: string): Promise<string | undefined> {
      // This "promisifies" the spawn function call to grep.
      return new Promise((resolve, reject) => {
        // Note - we want to escape any characters in search that are non-alphanumeric
        // Also want to search at the beginning of a line only, and ending with |
        /* eslint-disable-next-line no-useless-escape */ // Not useless in this case!
        const regexSearch = '^' + search.replace(/(?=\W)/g, '\\') + '\|';
        const grep = spawnProc('grep', ['-e', regexSearch, cfg.TYPE_DESCRIPTION_DB]);
        let dataOut = ''; // buffer results sent
        let dataErr = '';
        grep.stdout.on('data', (data) => { dataOut += data; });
        grep.stderr.on('data', (data) => { dataErr += data; });
        grep.on('close', (returnCode) => {
          if (dataErr && (returnCode !== 0)) {
            logDS('grepPromise Error! Return code is: ' + returnCode);
            reject(dataErr);
          } else {
            resolve(dataOut);
          }
        });
        grep.on('error', err => reject(err));
      });
    }

    private async getTypeDescription(type: string): Promise<string> {
      const grepResult = await this.grepPromise(type);
      let removeLF: string = '';
      if (grepResult) { // if no result, grepResult will be 'undefined'
        const description = grepResult.split('|')[1]; // get just the description
        removeLF = description.slice(0, -1); // strip the linefeed off the end
      }
      return removeLF;
    }

    private humanFileSize(bytes: number, si: boolean): string {
      // taken from mpen's answer in https://stackoverflow.com/questions/10420352/ but linted
      const thresh = si ? 1000 : 1024;
      if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
      }
      const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      let u = -1;
      let b = bytes;
      do {
        b /= thresh;
        u += 1;
      } while (Math.abs(b) >= thresh && u < units.length - 1);
      return b.toFixed(1) + ' ' + units[u];
    }

    private async buildDownloads(files: FileObject[]): Promise<Download[]> {
      // Returns an array of downloads which represents all the files in the downloads directory
      const downloads: Download[] = [];
      // let index = 0;
      for (let i = 0; i < files.length; i += 1) {
        const filename: string = files[i].filename;
        const suffix: string = filename.slice(filename.lastIndexOf('.')).toLowerCase();
        const download: Download = {
          _id: i,
          filename: filename,
          fullPath: cfg.DOWNLOAD_DIR.PATH + filename,
          suffix: suffix,
          /* eslint-disable-next-line no-await-in-loop */
          type: await this.getTypeDescription(suffix.slice(1)),
          size: files[i].size,
          sizeHR: this.humanFileSize(files[i].size, cfg.USE_SI_SIZE),
          icon: 'fiv-viv fiv-icon-' + suffix.slice(1),
        };
        downloads.push(download);
      }
      return downloads;
    }

    updateDownloadsDB: (file: FileObject) => Promise<Download> = async (file) => {
      const suffix: string = file.filename.slice(file.filename.lastIndexOf('.')).toLowerCase();
      const download = new Download({
        filename: file.filename,
        fullPath: '/' + file.path,
        suffix: suffix,
        size: file.size,
        sizeHR: this.humanFileSize(file.size, cfg.USE_SI_SIZE),
        icon: 'fiv-viv fiv-icon-' + suffix.slice(1)
      });
      try { // Find the last download, then create a new one at the end of the collection
        const lastDl = await this.db.collection(cfg.DB_COLLECTION_NAME)
          /* eslint-disable-next-line newline-per-chained-call */ // Lint not applicable in this case
          .find().sort({ _id: -1 }).limit(1).next();
        download._id = lastDl._id + 1;
        download.type = await this.getTypeDescription(suffix.slice(1));
        const dlReturned = await this.db.collection(cfg.DB_COLLECTION_NAME)
          .findOne({ filename: file.filename });
        if (dlReturned) { // a download with the same name exists - update it
          download._id = dlReturned._id;
          await this.db.collection(cfg.DB_COLLECTION_NAME).replaceOne({ _id: dlReturned._id }, download);
        } else {
          await this.db.collection(cfg.DB_COLLECTION_NAME).insertOne(download);
        }
      } catch (err) { errSvc.exit(err); }
      return download;
    };

    private async getDownloadById(id: number): Promise<Download> {
      const dlReturned = await this.db.collection(cfg.DB_COLLECTION_NAME).findOne({ _id: id });
      if (!dlReturned) throw new Error('404 Unknown FileId.  Please report this error.');
      return dlReturned;
    };

    getDownload: (dlName: string) => Promise<Download> = async (dlName) => {
      const download = await this.db.collection(cfg.DB_COLLECTION_NAME).findOne({ filename: dlName });
      if (!download) throw new Error('404 Unknown File.');
      return download;
    };

    getList: () => Promise<Download[]> = async () => {
      let downloads = [new Download()];
      try {
        downloads = await this.db.collection(cfg.DB_COLLECTION_NAME).find({}).toArray();
      } catch (err) { errSvc.exit(err, 1); }
      return downloads;
    };

    delete: (dlName: string) => Promise<Download> = async (dlName) => {
      await this.getDownload(dlName); // verify it exists before doing any work
      try {
        await fileSvc.deleteFile(`.${cfg.DOWNLOAD_DIR.PATH}${dlName}`);
      } catch (err) {
        throw new Error(`404 Error deleting file on disk File "${dlName}" not found.`)
      }
      const result = await this.db.collection(cfg.DB_COLLECTION_NAME).findOneAndDelete(
        { filename: dlName },
      );
      if (result.lastErrorObject.n !== 1) {
        logDS('Serious error: delete in download-service.js file deleted ok, but not found in db.');
        throw new Error('404 Eror deleting file - File not found in database.');
      }
      return result.value;
    };

    renameFile: (filenameChanged: FilenameChangedObj) => Promise<Download> = async (filenameChanged) => {
      const originalDl = await this.getDownloadById(filenameChanged._id);
      if (filenameChanged.newFilename !== originalDl.filename) {//only rename if needed
        try {
          const newFileFullPath = `.${cfg.DOWNLOAD_DIR.PATH}${filenameChanged.newFilename}`;
          await fileSvc.renameFile(`.${originalDl.fullPath}`, newFileFullPath);
        } catch (err) {
          throw new Error(`404 Error renaming file on disk - Original File "${originalDl.filename}" not found.`);
        }
        const result = await this.db.collection(cfg.DB_COLLECTION_NAME).findOneAndUpdate(
          { _id: filenameChanged._id },
          { $set: { 
            filename: filenameChanged.newFilename, 
            fullPath: `${cfg.DOWNLOAD_DIR.PATH}${filenameChanged.newFilename}` 
          }}
        );
        if (result.lastErrorObject.n !== 1) {
          throw new Error('404 Error renaming file in db - Unknown File Id.  Please report this error.');
        }
        // result returns OLD record, so now get the new one from db:
        const newDl = await this.getDownloadById(filenameChanged._id);
        return newDl;
      } else {
        return originalDl;
      }
    }

  }
}

export const dlSvc = new ds.DownloadService();
