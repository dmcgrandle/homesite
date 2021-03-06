/* -----------------        download-service.js               ------------------
------------------------------------------------------------------------------*/

const logDS = require('debug')('homesite:download-service');

// External Imports:
// import * as fs from 'fs-extra';
import { Db, InsertWriteOpResult, ReplaceWriteOpResult, InsertOneWriteOpResult } from 'mongodb';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { spawn as spawnProc } from 'child_process';
import { Observable, from, of, defer, forkJoin, throwError } from 'rxjs';
import { tap, filter, concatMap, map, toArray, mergeMap, catchError } from 'rxjs/operators';

// Project Imports:
import { Download, FileObject, FilenameChangedObj } from '../model';
import { database } from './db-service';
import { fileSvc } from './file-service';
import { errSvc } from './err-service';

// module level constants and services:
const cfg = config.downloadService;

class DownloadService {
  private db!: Db;

  public init(): void {
    this.readDownloadsFromDisk().subscribe(
      (): void =>
        console.log(`${new Date().toLocaleString()} : created new "download" document in db.`),
      (err): void => errSvc.exit(err, 1)
    );
  }

  private readDownloadsFromDisk(): Observable<boolean> {
    // prettier-ignore
    return from(database).pipe(
      tap((db): Db => (this.db = db)),
      mergeMap((): Observable<FileObject> => fileSvc.dirsAndFiles(cfg.DOWNLOAD_DIR.PATH, false)),
      filter((file): boolean => file.isFile === true), // no directories
      filter((file): boolean => file.path === cfg.DOWNLOAD_DIR.PATH), // no files from subdirectories
      concatMap((file, index): Observable<Download> => this.rxToDownload(file, index)),
      toArray(),
      mergeMap((downloads): Observable<boolean> => this.saveDataToDB(cfg.DB_COLLECTION_NAME, downloads))
    );
  }

  // Set up Multer
  private storageOpts: multer.DiskStorageOptions = {
    destination: (req, file, next): void => {
      next(null, 'protected/downloads/');
    },
    filename: (req, file, next): void => {
      next(null, file.originalname);
    }
  };
  private multerConf: multer.Options = {
    storage: multer.diskStorage(this.storageOpts)
  };
  private multerUpload = multer(this.multerConf).single('upload');
  public upload = (req: Request, res: Response, next: NextFunction): void => {
    req.on('aborted', (): void => {
      logDS('Upload aborted by client.');
    });
    req.on('close', (): void => {
      logDS('finished uploading.');
      if (req.file) {
        logDS(`${new Date().toLocaleString()} : File Uploaded: "${req.file.filename}"`);
      }
    });
    // Middleware function to upload - define next to handle errors
    this.multerUpload(req, res, (err): Response | null => {
      if (err) {
        logDS(err);
        return res.status(422).send('Error uploading file.');
      }
      next();
      return null;
    });
  };

  private saveDataToDB(collection: string, data: Download[]): Observable<boolean> {
    return from(this.db.collection(collection).countDocuments()).pipe(
      mergeMap(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (count): Promise<any> | Observable<number> =>
          count > 0 ? this.db.collection(collection).drop() : of(0)
      ),
      mergeMap((): Promise<InsertWriteOpResult> => this.db.collection(collection).insertMany(data)),
      map((res): boolean => res.result.n > 0) // return true on success
    );
  }

  // This makes an Observable of the spawn function call to grep within the type description file
  private getTypeDescription(search: string): Observable<string> {
    return new Observable<string>((observer): void => {
      // Note - we want to escape any characters in search that are non-alphanumeric
      // Also want to search at the beginning of a line only, and ending with |
      /* eslint-disable-next-line no-useless-escape */ // Not useless in this case!
      const regexSearch = '^' + search.replace(/(?=\W)/g, '\\') + '|';
      const grep = spawnProc('grep', ['-e', regexSearch, cfg.TYPE_DESCRIPTION_DB]);
      let dataOut = ''; // buffer results sent
      let dataErr = '';
      grep.stdout.on('data', (data): void => {
        dataOut += data;
      });
      grep.stderr.on('data', (data): void => {
        dataErr += data;
      });
      grep.on('close', (returnCode): void => {
        if (dataErr && returnCode !== 0) {
          logDS('grepPromise Error! Return code is: ' + returnCode);
          observer.error(dataErr);
        } else {
          observer.next(dataOut);
          observer.complete();
        }
      });
      grep.on('error', (err): void => observer.error(err));
    }).pipe(map((result): string => (result ? result.split('|')[1].slice(0, -1) : '')));
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

  private rxToDownload(file: FileObject, index: number): Observable<Download> {
    const suffix = file.filename.slice(file.filename.lastIndexOf('.')).toLowerCase();
    return this.getTypeDescription(suffix.slice(1)).pipe(
      map(
        (type): Download => ({
          _id: index,
          filename: file.filename,
          fullPath: cfg.DOWNLOAD_DIR.PATH + file.filename,
          suffix: suffix,
          type: type,
          size: file.size,
          sizeHR: this.humanFileSize(file.size, cfg.USE_SI_SIZE),
          icon: 'fiv-viv fiv-icon-' + suffix.slice(1)
        })
      )
    );
  }

  private lastDl(): Observable<Download> {
    return from(
      this.db
        .collection(cfg.DB_COLLECTION_NAME)
        .find()
        .sort({ _id: -1 })
        .limit(1)
        .next()
    );
  }

  private renameAndSave(originalDl: Download, changed: FilenameChangedObj): Observable<Download> {
    const eMsg1 = `404 Error renaming file on disk - Original File ${originalDl.filename} not found.`;
    const eMsg2 = '404 Error renaming file in db - Unknown File Id.  Please report this error.';
    const newFileFullPath = `.${cfg.DOWNLOAD_DIR.PATH}${changed.newFilename}`;
    return fileSvc.renameFile(`.${originalDl.fullPath}`, newFileFullPath).pipe(
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      catchError(() => throwError(new Error(eMsg1))),
      mergeMap(
        (): Promise<FindAndModifyWriteOpResultObject> =>
          this.db.collection(cfg.DB_COLLECTION_NAME).findOneAndUpdate(
            { _id: changed._id },
            {
              $set: {
                filename: changed.newFilename,
                fullPath: `${cfg.DOWNLOAD_DIR.PATH}${changed.newFilename}`
              }
            }
          )
      ),
      mergeMap(
        (r): Observable<Download> =>
          r.lastErrorObject.n === 1 ? this.getDownload(changed._id) : throwError(new Error(eMsg2))
      )
    );
  }

  private getDownload(id: number): Observable<Download> {
    return from(this.db.collection(cfg.DB_COLLECTION_NAME).findOne({ _id: id })).pipe(
      map(
        (download): Download => {
          if (download) return download;
          throw new Error('404 Unknown FileId.  Please report this error.');
        }
      )
    );
  }

  private getDownloadByName(dlName: string): Observable<Download> {
    return from(this.db.collection(cfg.DB_COLLECTION_NAME).findOne({ filename: dlName })).pipe(
      catchError((): Observable<never> => throwError(new Error('404 Unknown File.')))
    );
  }

  // public methods:
  public getList(): Observable<Download[]> {
    return from(
      this.db
        .collection(cfg.DB_COLLECTION_NAME)
        .find({})
        .toArray()
    );
  }

  public updateDownloadsDB(file: FileObject): Observable<Download> {
    const col = cfg.DB_COLLECTION_NAME;
    const newDl$ = this.rxToDownload(file, -1);
    const nextId$ = this.lastDl().pipe(map((lastDl): number => lastDl._id + 1));
    const existingDl$ = this.db.collection(col).findOne({ filename: file.filename });
    return forkJoin(newDl$, nextId$, existingDl$).pipe(
      mergeMap(
        ([newDl, nextId, existingDl]): Observable<Download> =>
          defer(
            (): Promise<ReplaceWriteOpResult | InsertOneWriteOpResult> => {
              if (existingDl) {
                newDl._id = existingDl._id;
                return this.db.collection(col).replaceOne({ _id: newDl._id }, newDl);
              } else {
                newDl._id = nextId;
                return this.db.collection(col).insertOne(newDl);
              }
            }
          ).pipe(map((): Download => newDl)) // use defer to easily map to Download from Promise
      )
    );
  }

  public delete(dlName: string): Observable<Download> {
    return this.getDownloadByName(dlName).pipe(
      mergeMap((): Promise<void> => fileSvc.deleteFile(`.${cfg.DOWNLOAD_DIR.PATH}${dlName}`)),
      catchError(
        (): Observable<never> =>
          throwError(new Error(`404 Error deleting file on disk File "${dlName}" not found.`))
      ),
      mergeMap(
        (): Promise<FindAndModifyWriteOpResultObject<Download>> =>
          this.db.collection(cfg.DB_COLLECTION_NAME).findOneAndDelete({ filename: dlName })
      ),
      map(
        (result): Download => {
          if (result.lastErrorObject.n !== 1) {
            logDS('Serious error: delete -- file deleted ok, but not found in db.');
            throw new Error('404 Eror deleting file - File not found in database.');
          }
          if (result.value) return result.value;
          throw new Error(`404 Error deleting file "${dlName}" not found in db.`);
        }
      )
    );
  }

  public renameFileIfNeeded(filenameChanged: FilenameChangedObj): Observable<Download> {
    return from(this.getDownload(filenameChanged._id)).pipe(
      mergeMap(
        (originalDl): Observable<Download> => {
          if (filenameChanged.newFilename !== originalDl.filename) {
            return this.renameAndSave(originalDl, filenameChanged);
          } else {
            return of(originalDl); // filenames are the same, no need to do any work
          }
        }
      )
    );
  }
}

export const dlSvc = new DownloadService();
dlSvc.init();
