/* file-service.ts - provides promise-based file and directory reading
   services to various other modules in this project. */

// External Imports:
import { Transform } from 'stream';
import { join } from 'path';
import { Stats, promises as fs } from 'fs';
import { Observable, from } from 'rxjs';
import * as klaw from 'klaw';
import * as through2 from 'through2';
const logFS = require('debug')('homesite:file-service');

// Project Imports:
import { FileObject } from '../model';
// const cfg = config.fileService;

// Set up filters:
function isHidden(path: string): boolean {
  // Regex to test if there is a hidden directory or file in path
  /* eslint-disable-next-line no-useless-escape */ // Not useless in this regex!
  return /(^|\/)\.[^\/\.]/g.test(path);
}

// Note: about 'this' in the next few functions.  Inside through2 we need to
// push data 'this.push(item)' onto an object that is not exposed in the function, but part
// of the internal workings of through2 - accessed with the 'this' keyword bound to the internal
// object when the given function is added to that object before being called. This doesn't work
// in arrow functions so we have to use the old convention of unnamed non-arrow functions.
const FilterExcludeIfNotMediaConstructor = function(testMediaFunc: Function): Transform {
  // Note - needs a function passed which will test for the media suffix that is passed
  return through2.obj(function(item, enc, next): void {
    if (
      item.stats.isFile() &&
      !isHidden(item.path) &&
      testMediaFunc(item.path.substr(-4, 4).toLowerCase())
    ) {
      this.push(item);
    }
    next();
  });
};

// use the constructor form of through2 so we can call this same logic multiple times,
// creating a 'new' instance for each function we call it from.
const FilterEFConstructor = through2.ctor({ objectMode: true }, function(item, enc, next): void {
  if (item.stats.isDirectory() && !isHidden(item.path)) {
    this.push(item);
  }
  next();
});

const stripPath = (item: klaw.Item, topDir: string): string => {
  // strip out everything in path up to and including the 'topDir'.
  // Note: search will return -1 on top level directory itself.
  const s = item.path.search(topDir);
  return s > 0 ? item.path.substr(s + topDir.length) : '';
};

class FileService {
  public mediaDirs = (topDir: string): Promise<string[]> =>
    new Promise((resolve, reject): void => {
      try {
        const items: string[] = [];
        const filterExcludeFiles = new FilterEFConstructor();
        klaw('.' + topDir)
          .pipe(filterExcludeFiles)
          .on('data', (item): void => {
            // console.log('item is: ' + util.inspect(item, {maxDepth: 5}));
            items.push(stripPath(item, topDir));
          })
          .on('end', (): void => resolve(items));
      } catch (err) {
        reject(err);
      }
    });

  public mediaFiles = (topDir: string, testMediaFunc: Function): Promise<string[]> =>
    new Promise((resolve, reject): void => {
      // Note - testMediaFunc must be a test media function passed which will test for the correct
      // file suffix. See function 'isPhotoSuffix' in media-service.ts for example.
      try {
        const items: string[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filterExcludeIfNotMedia = new (FilterExcludeIfNotMediaConstructor as any)(
          testMediaFunc
        );
        klaw('.' + topDir)
          .pipe(filterExcludeIfNotMedia)
          .on('data', (item: klaw.Item): number => items.push(stripPath(item, topDir)))
          .on('end', (): void => resolve(items));
      } catch (err) {
        reject(err);
      }
    });

  public deleteFile = (file: string): Promise<void> => fs.unlink(file);

  public renameFile = (oldFile: string, newFile: string): Observable<void> => {
    logFS('Renaming file: "', oldFile, '" to be "', newFile, '"');
    return from(fs.rename(oldFile, newFile));
  };

  public dirsAndFiles = (dir: string, doHidden: boolean): Observable<FileObject> =>
    new Observable((observer): void => {
      // Create an async recursive function for walking the directory tree:
      const walk = async (dir: string): Promise<void> => {
        const files = await fs.readdir(join(__dirname, dir));
        for (const file of files) {
          const filepath = join(dir, file);
          const stat: Stats = await fs.stat(join(__dirname, filepath));
          if (file[0] !== '.' || doHidden) {
            if (stat.isFile() || stat.isDirectory()) {
              observer.next({
                isFile: stat.isFile(),
                filename: file,
                size: stat.size,
                path: dir
              });
            }
            if (stat.isDirectory()) {
              await walk(filepath);
            }
          }
        }
      };
      // now call that async function and complete the Observable when it resolves
      walk(dir)
        .then((): void => observer.complete())
        .catch((err): void => observer.error(err));
    });
}

export const fileSvc = new FileService();
