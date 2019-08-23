/* -----------------          media-service.js                ------------------

------------------------------------------------------------------------------*/

// External Imports:
import { Db, InsertWriteOpResult } from 'mongodb';
import * as fs from 'fs-extra';
import { from, Observable, forkJoin, of, EMPTY, defer } from 'rxjs';
import { Subscription, throwError, OperatorFunction, merge } from 'rxjs';
import { tap, mergeMap, reduce, filter, concatMap } from 'rxjs/operators';
import { toArray, map, share, catchError, groupBy } from 'rxjs/operators';
import * as path from 'path';
import * as sharp from 'sharp';
import * as uniqueFilename from 'unique-filename';
import { spawn, SpawnOptions } from 'child_process';

// Project Imports:
import { Media, MediaAlbum, FileObject } from '../model';
import { database } from './db-service';
import { fileSvc } from './file-service';
import { errSvc } from './err-service';

const cfg = config.mediaService;

export class MediaService {
    // need the bang (!) to stop typescript from complaining that the assignment is inside a try block
    private db!: Db;
    private sub!: Subscription;

    public init(): void {
        this.sub = merge(
            this.readMedia(cfg.PHOTO_DIR.PATH, 'photo'), this.readMedia(cfg.VIDEO_DIR.PATH, 'video')
        ).subscribe(
            (mediaType): void => console.log(new Date().toLocaleString(), ` : saved ${mediaType}Albums to db.`),
            (err): void => errSvc.exit(err));
    }

    public onDestroy(): void {
        this.sub.unsubscribe();
    }

    private readMedia(dir: string, mediaType: string): Observable<string> {
    // follow pattern from here: https://rangle.io/blog/rxjs-where-is-the-if-else-operator/
        const tests = mediaType === 'photo' ? cfg.EXT.PHOTO : cfg.EXT.VIDEO;
        const source$ = from(database).pipe(
            tap((db): Db => (this.db = db)),
            mergeMap((): Observable<FileObject> => fileSvc.dirsAndFiles(dir, false)),
            share()
        );
        const medias$ = source$.pipe(
            filter((item): boolean => item.isFile === true), // only files
            filter((file): boolean => this.isMedia(file.filename, tests)), // only valid suffixes
            concatMap((file): Observable<FileObject> => this.makeThumbIfNeeded(file, mediaType)),
            map((file, index): Media => this.toMedia(file, index, mediaType)),
            toArray(),
            mergeMap((medias): Observable<Media[]> => this.saveDataToDB(mediaType + 's', medias))
        );
        const groupedFileObjects$ = source$.pipe(
            // create as many higher-order observables as we have directories and group
            groupBy((item): string => item.path || ''),
            mergeMap(
                (group$): Observable<FileObject[]> =>
                    group$.pipe(
                        reduce<FileObject, FileObject[]>((acc, cur): FileObject[] => [...acc, cur], [
                            { filename: group$.key, size: -1 }
                        ])
                    )
            ),
            toArray()
        );
        // use combineLatest instead of merge so both emit/complete before calling toMediaAlbum
        return forkJoin(medias$, groupedFileObjects$).pipe(
            map(
                ([medias, gFOs]): MediaAlbum[] =>
                    gFOs.map(
                        (dirContents, index): MediaAlbum =>
                            this.toMediaAlbum(medias, gFOs, dirContents, index, tests)
                    )
            ),
            mergeMap(
                (albums): Observable<MediaAlbum[]> => this.saveDataToDB(mediaType + 'Albums', albums)
            ),
            map((): string => mediaType)
        );
    }

    private getMediaIds(medias: Media[], dirContents: FileObject[], tests: string[]): number[] {
        const mediasInDir = dirContents.filter(
            (item): boolean | undefined => item.isFile === true && this.isMedia(item.filename, tests)
        );
        return mediasInDir.map(
            (file): number => {
                const fMedia = medias.find(
                    (media): boolean => media.fullPath === path.join(file.path || '', file.filename)
                );
                return fMedia ? fMedia._id : -1;
            }
        );
    }

    private getAlbumIds(groupedFileObjects: FileObject[][], dirContents: FileObject[]): number[] {
        const dirsInDirContents = dirContents.filter(
            (item): boolean | undefined => item.isFile === false
        );
        const result = dirsInDirContents.map(
            (dir): number => {
                const foundId = groupedFileObjects.findIndex(
                    (dirArray): boolean => dirArray[0].filename === path.join(dir.path || '', dir.filename)
                );
                return foundId;
            }
        );
        return result;
    }

    private makeThumbIfNeeded(file: FileObject, mediaType: string): Observable<FileObject> {
        let thumb: string;
        if (mediaType === 'photo') {
            thumb = this.getPhotoThumbPath(file.filename);
        } else {
            thumb = this.getVideoThumbPath(file.filename);
        }
        return from(fs.pathExists(thumb)).pipe(
            concatMap(
                (exists): Observable<sharp.OutputInfo | string> => {
                    if (!exists) {
                        const fileIn = path.join(__dirname, file.path || '', file.filename);
                        return defer(
                            (): Observable<sharp.OutputInfo | string> => {
                                if (mediaType === 'photo') {
                                    return from(
                                        sharp(fileIn)
                                            .resize(cfg.THUMBS.WIDTH, null, { fit: 'inside' })
                                            .toFormat(cfg.THUMBS.FORMAT)
                                            .toFile(thumb)
                                    );
                                } else {
                                    return this.ffmpeg$('ffmpeg', [
                                        '-ss',
                                        '00:00:03',
                                        '-i',
                                        fileIn,
                                        '-vframes',
                                        '1',
                                        '-q:v',
                                        '2',
                                        '-vf',
                                        'scale=' + cfg.POSTERS.WIDTH + ':-1',
                                        thumb
                                    ]);
                                }
                            }
                        ).pipe(
                            catchError(
                                (err): Observable<never> => {
                                    console.log(err, `creating thumb for ${file.filename} in ${file.path}`);
                                    return EMPTY; // bad item won't be added back into Observable stream
                                }
                            )
                        );
                    }
                    return of('Thumb exists'); // Just send back something to be mapped into file
                }
            ),
            map((): FileObject => file) // map file back into Observable stream
        );
    }

    private toMedia(file: FileObject, id: number, mediaType: string): Media {
        return {
            _id: id,
            filename: file.filename,
            path: file.path || '',
            fullPath: path.join(file.path || '', file.filename),
            thumbPath: this.getRelTorPPath(file.filename, mediaType)
        };
    }

    private toMediaAlbum(
        medias: Media[],
        groupedFileObjects: FileObject[][],
        dirContents: FileObject[],
        id: number,
        tests: string[]
    ): MediaAlbum {
        {
            const mediaIds = this.getMediaIds(medias, dirContents, tests);
            // if there is media in this directory, use the first one as featuredMedia, else default
            const mFound = medias.find((media): boolean => media._id === mediaIds[0]);
            const def = medias.find((media): boolean => media._id === cfg.DEFAULT_FEATURE._id);
            const splitPath = dirContents[0].filename.split('/');
            return {
                _id: id,
                name: splitPath[splitPath.length - 1],
                path: splitPath.slice(0, -1).join('/'),
                // path: splitPath.slice(3).join('/'), // remove prefix from beginning
                fullPath: dirContents[0].filename,
                description: '',
                featuredMedia: mFound ? mFound : def ? def : new Media(),
                mediaIds: mediaIds,
                albumIds: this.getAlbumIds(groupedFileObjects, dirContents)
            };
        }
    }

    private saveDataToDB<T>(collection: string, data: T[]): Observable<T[]> {
        return from(this.db.collection(collection).countDocuments()).pipe(
            mergeMap(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (count): Observable<T> =>
                    count > 0 ? from(this.db.collection<T>(collection).drop()) : of(0)
            ),
            mergeMap(
                (): Observable<InsertWriteOpResult> =>
                    from(this.db.collection<T>(collection).insertMany(data))
            ),
            map(
                (): T[] => data // return data that has now been saved
            )
        );
    }

    private getPhotoThumbPath(file: string): string {
    // Returns a fullPath to the thumbnail version of file
        return (
            uniqueFilename(
                path.join(__dirname, cfg.PHOTO_DIR.PATH, cfg.PHOTO_DIR.CACHE_DIR),
                cfg.THUMBS.PREFIX,
                file
            ) + cfg.THUMBS.SUFFIX
        );
    }

    private getVideoThumbPath(file: string): string {
    // Returns a fullPath to the thumbnail version of file
        return (
            uniqueFilename(
                path.join(__dirname, cfg.VIDEO_DIR.PATH, cfg.VIDEO_DIR.CACHE_DIR),
                cfg.POSTERS.PREFIX,
                file
            ) + cfg.POSTERS.SUFFIX
        );
    }

    private ffmpeg$(...args: [string, string[], SpawnOptions?]): Observable<string> {
    // This makes an Observable out of the spawn function call to ffmpeg.  Need a custom
    // Observable because ffmpeg throws info into stderr instead of stdout even if it's not an
    // error, so the return code is checked and also parse for empty file to detect that.
        const name: string = args[0];
        const ffArgs = args[1];
        const options = args[2];
        return new Observable(
            (observer): void => {
                const ffmpeg = spawn(name, ffArgs, options || {});
                let dataErr = '';
                if (ffmpeg.stderr) {
                    ffmpeg.stderr.on('data', (data: string): string => (dataErr += data));
                }
                ffmpeg.on(
                    'close',
                    (returnCode): void => {
                        const outputArray = dataErr.split(/\r?\n/g); // split on line breaks
                        const lastLine = outputArray[outputArray.length - 2];
                        if (lastLine.startsWith('Output file is empty,')) {
                            returnCode = 1; // arbitrary number to detect an error
                        }
                        if (dataErr && returnCode !== 0) {
                            observer.error(lastLine);
                        } else {
                            observer.next(lastLine);
                            observer.complete();
                        }
                    }
                );
                ffmpeg.on('error', (err): void => observer.error(err));
            }
        );
    }

    private getRelTorPPath(file: string, mediaType: string): string {
    // Get Relative Thumb or Poster Path
    // Returns a valid web URL path for the client to retrieve the thumbnail
        let url = '';
        if (mediaType === 'photo') {
            url =
        uniqueFilename(cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR, cfg.THUMBS.PREFIX, file) +
        cfg.THUMBS.SUFFIX;
        } else {
            url =
        uniqueFilename(cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR, cfg.POSTERS.PREFIX, file) +
        cfg.POSTERS.SUFFIX;
        }
        return url;
    }

    private isMedia(filename: string, tests: string[]): boolean {
        const split = filename.split('.');
        const suffix = split[split.length - 1].toLowerCase();
        // TODO: add more recognized picture formats
        return tests.find((test): boolean => test === suffix) !== undefined;
    }

    private decodeIds(encodedIds: string): number[] {
        return encodedIds
            .slice(1, -1)
            .split('+')
            .map(Number);
    }

    private decodePath(pathEncoded: string): string {
        return pathEncoded.slice(1, -1).replace(/\+/g, '/');
    }

    private validateResult<T>(errMessage: string): OperatorFunction<T, T> {
        return mergeMap(
            (item: T): Observable<T> => {
                return (item ? of(item) : throwError(new Error(errMessage)))
            }
        );
    }

    private decodeToFullPath(pathEncoded: string, mediaType: string): string {
        const decoded = this.decodePath(pathEncoded);
        const prefix = mediaType === 'photo' ? cfg.PHOTO_DIR.PATH : cfg.VIDEO_DIR.PATH;
        return decoded[0] === '/' ? decoded : `${prefix}${decoded}`;
    }

    // -------------------
    // Exported methods:

    public getMediaById(id: number, mediaType: string): Observable<Media> {
        if (id < 0 || typeof id !== 'number') return throwError(new Error(`404 ${id} - Bad ID.`));
        return from(this.db.collection(mediaType + 's').findOne({ _id: id })).pipe(
            this.validateResult(`404 Unknown ${mediaType} id: ${id}`)
        );
    }

    // getMediaByPath can be called one of two ways:
    // - with a full path including the forward slash, something like '/protected/videos/my/album/video.mp4',
    // - or else as a relative path without the '/protected/<media>' prefix, such as 'my/album/video.mp4'.
    // If there is a leading slash it is assumed to be the first, full path method.
    public getMediaByPath(pathEncoded: string, mediaType: string): Observable<Media> {
        const fullPath = this.decodeToFullPath(pathEncoded, mediaType);
        return from(this.db.collection(mediaType + 's').findOne({ fullPath: fullPath })).pipe(
            this.validateResult(`404 Unknown ${mediaType} path: ${this.decodePath(pathEncoded)}`)
        );
    }

    public getAlbumById(id: number, mediaType: string): Observable<MediaAlbum> {
        if (id < 0 || typeof id !== 'number') return throwError(new Error(`404 ${id} - Bad ID.`));
        return from(this.db.collection(mediaType + 'Albums').findOne({ _id: id })).pipe(
            this.validateResult(`404 Unknown ${mediaType}Album id: ${id}`)
        );
    }

    public getAlbumByPath(pathEncoded: string, mediaType: string): Observable<MediaAlbum> {
        const fullPath = this.decodeToFullPath(pathEncoded, mediaType);
        return from(this.db.collection(mediaType + 'Albums').findOne({ fullPath: fullPath })).pipe(
            this.validateResult(`404 Unknown ${mediaType}Album path: ${this.decodePath(pathEncoded)}`)
        );
    }

    public getAlbums(encodedIds: string, mediaType: string): Observable<MediaAlbum[]> {
        return from(this.decodeIds(encodedIds)).pipe(
            concatMap((id): Observable<MediaAlbum> => this.getAlbumById(id, mediaType)),
            toArray()
        );
    }

    public getMedias(encodedIds: string, mediaType: string): Observable<Media[]> {
        return from(this.decodeIds(encodedIds)).pipe(
            concatMap((id): Observable<Media> => this.getMediaById(id, mediaType)),
            toArray()
        );
    }

    public getThumbs(encodedIds: string, mediaType: string): Observable<string[]> {
        return from(this.decodeIds(encodedIds)).pipe(
            concatMap((id): Observable<Media> => this.getMediaById(id, mediaType)),
            map((media): string => media.thumbPath),
            toArray()
        );
    }
}

export const mediaSvc = new MediaService();
mediaSvc.init();
