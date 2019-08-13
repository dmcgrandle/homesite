/* -----------------          media-service.js                ------------------

------------------------------------------------------------------------------*/

// External Imports:
import { Db, InsertWriteOpResult } from 'mongodb';
import * as fs from 'fs-extra';
import { from, Observable, combineLatest, of, EMPTY, defer, Subscription } from 'rxjs';
import { tap, mergeMap, reduce, filter, concatMap } from 'rxjs/operators';
import { toArray, map, share, catchError, groupBy } from 'rxjs/operators';
import * as path from 'path';
import * as sharp from 'sharp';
import * as uniqueFilename from 'unique-filename';
import { spawn, SpawnOptions } from 'child_process';

// Project Imports:
import { Media, Photo, Video, FileObject } from '../model';
import { PhotoAlbum, VideoAlbum, MediaAlbum } from '../model';
import { database } from './db-service';
import { fileSvc } from './file-service';
import { errSvc } from './err-service';

const cfg = config.mediaService;

export class MediaService {
    // need the bang (!) to stop typescript from complaining that the assignment is inside a try block
    private db!: Db;
    private pSub!: Subscription;
    private vSub!: Subscription;

    public init(): void {
        this.pSub = this.readMedia(cfg.PHOTO_DIR.PATH, 'photo').subscribe(
            (): void => {
                console.log(new Date().toLocaleString(), ' : saved photoAlbums to db.');
            },
            (err): void => errSvc.exit(err)
        );
        this.vSub = this.readMedia(cfg.VIDEO_DIR.PATH, 'video').subscribe(
            (): void => {
                console.log(new Date().toLocaleString(), ' : saved videoAlbums to db.');
            },
            (err): void => errSvc.exit(err)
        );
    }

    public onDestroy(): void {
        this.pSub.unsubscribe();
        this.vSub.unsubscribe();
    }

    private readMedia(dir: string, mediaType: string): Observable<MediaAlbum[]> {
        const tests = mediaType === 'photo' ? cfg.EXT.PHOTO : cfg.EXT.VIDEO;
        const source$ = from(database).pipe(
            tap((db): Db => (this.db = db)),
            mergeMap((): Observable<FileObject> => fileSvc.dirsAndFiles(dir, false)),
            share()
        );
        const medias$ = source$.pipe(
            filter((item): boolean => item.isFile === true), // only files
            filter((file): boolean => this.isMedia(file.filename, tests)), // only valid suffixes
            concatMap(
                (file): Observable<FileObject> => this.makeThumbIfNeeded(file, mediaType)
            ),
            map((file, index): Media => this.toMedia(file, index, mediaType)),
            toArray(),
            mergeMap(
                (medias): Observable<Media[]> => this.saveDataToDB(mediaType + 's', medias)
            )
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
        return combineLatest(medias$, groupedFileObjects$).pipe(
            map(
                ([medias, gFOs]): MediaAlbum[] =>
                    gFOs.map(
                        (dirContents, index): MediaAlbum =>
                            this.toMediaAlbum(medias, gFOs, dirContents, index, tests)
                    )
            ),
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            mergeMap(albums => this.saveDataToDB(mediaType + 'Albums', albums))
        );
    }

    private getMediaIds(
        medias: Media[],
        dirContents: FileObject[],
        tests: string[]
    ): number[] {
        const mediasInDir = dirContents.filter(
            (item): boolean | undefined =>
                item.isFile === true && this.isMedia(item.filename, tests)
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

    private getAlbumIds(
        groupedFileObjects: FileObject[][],
        dirContents: FileObject[]
    ): number[] {
        const dirsInDirContents = dirContents.filter(
            (item): boolean | undefined => item.isFile === false
        );
        const result = dirsInDirContents.map(
            (dir): number => {
                const foundId = groupedFileObjects.findIndex(
                    (dirArray): boolean =>
                        dirArray[0].filename === path.join(dir.path || '', dir.filename)
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
        // prettier-ignore
        return from(fs.pathExists(thumb)).pipe(
            concatMap((exists): Observable<sharp.OutputInfo | unknown> => {
                if (!exists) {
                    const fileIn = path.join(__dirname, file.path || '', file.filename);
                    const result$ = defer((): Observable<sharp.OutputInfo | unknown> => {
                        if (mediaType === 'photo') {
                            return from(sharp(fileIn)
                                .resize(cfg.THUMBS.WIDTH, null, { fit: 'inside' })
                                .toFormat(cfg.THUMBS.FORMAT)
                                .toFile(thumb)
                            )
                        } else {
                            return from(this.ffmpegPromise('ffmpeg', 
                                [
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
                                ]
                            ))
                        }
                    }).pipe(
                        catchError((err): Observable<never> => {
                            console.log(err, `creating thumb for ${file.filename} in ${file.path}`);
                            return EMPTY; // bad file won't be added back into Observable stream
                        })
                    )
                    return result$;
                }
                return of('Thumb exists'); // Just send back something to be mapped into file
            }),
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
            const splitPath = dirContents[0].filename.split('/'); // get name and path
            const name = splitPath[splitPath.length - 1]; // extract name from the end
            return {
                _id: id,
                name: name !== '' ? name : 'root',
                path: splitPath.slice(3).join('/'), // remove prefix from beginning
                fullPath: dirContents[0].filename,
                description: name,
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
                path.join(__dirname, cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR),
                cfg.THUMBS.PREFIX,
                file
            ) + cfg.THUMBS.SUFFIX
        );
    }

    private getVideoThumbPath(file: string): string {
    // Returns a fullPath to the thumbnail version of file
        return (
            uniqueFilename(
                path.join(__dirname, cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR),
                cfg.POSTERS.PREFIX,
                file
            ) + cfg.POSTERS.SUFFIX
        );
    }

    private ffmpegPromise(...args: [string, string[], SpawnOptions?]): Promise<string> {
    // This "promisifies" the spawn function call to ffmpeg.  Needed to write my own
    // rather than using a generic one such as 'child-process-es6-promise' because
    // ffmpeg throws info into stderr instead of stdout even if it's not an error,
    // so I check the return code too.
        const name: string = args[0];
        const ffArgs = args[1];
        const options = args[2];
        return new Promise(
            (resolve, reject): void => {
                const ffmpeg = spawn(name, ffArgs, options || {});
                let dataErr = '';
                ffmpeg.stderr &&
          ffmpeg.stderr.on(
              // ffmpeg apparently only uses stderr, not stdout
              'data',
              (data): void => {
                  dataErr += data;
              }
          );
                ffmpeg.on(
                    'close',
                    (returnCode): void => {
                        const outputArray = dataErr.split(/\r?\n/g); // split on line breaks
                        const lastLine = outputArray[outputArray.length - 2];
                        if (lastLine.startsWith('Output file is empty,')) {
                            returnCode = 1; // arbitrary number to detect an error
                        }
                        if (dataErr && returnCode !== 0) {
                            reject(lastLine);
                        } else {
                            resolve(lastLine);
                        }
                    }
                );
                ffmpeg.on('error', (err): void => reject(err));
            }
        );
    }

    private getRelTorPPath(file: string, mediaType: string): string {
    // Get Relative Thumb or Poster Path
    // Returns a valid web URL path for the client to retrieve the thumbnail
        let url = '';
        if (mediaType === 'photo') {
            url =
        uniqueFilename(
            cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR,
            cfg.THUMBS.PREFIX,
            file
        ) + cfg.THUMBS.SUFFIX;
        } else {
            url =
        uniqueFilename(
            cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR,
            cfg.POSTERS.PREFIX,
            file
        ) + cfg.POSTERS.SUFFIX;
        }
        return url;
    }

    private isMedia(filename: string, tests: string[]): boolean {
        const split = filename.split('.');
        const suffix = split[split.length - 1].toLowerCase();
        // TODO: add more recognized picture formats
        return tests.find((test): boolean => test === suffix) !== undefined;
    }

    // -------------------
    // Exported methods:

    public getPhotoAlbumById = async (id: number): Promise<PhotoAlbum> => {
        if (id < 0 || typeof id !== 'number') throw new Error('404 Bad ID.');
        const album: MediaAlbum | null = await this.db
            .collection('photoAlbums')
            .findOne({ _id: id });
        if (!album) throw new Error('404 Unknown Album.');
        return album;
    };

    public getPhotoById = async (id: number): Promise<Photo> => {
        if (id < 0 || typeof id !== 'number') throw new Error('404 Bad ID.');
        const photo: Photo | null = await this.db.collection('photos').findOne({ _id: id });
        if (!photo) throw new Error('404 Unknown Photo id: ' + id);
        return photo;
    };

    public getVideoById = async (id: number): Promise<Video> => {
        if (id < 0 || typeof id !== 'number') throw new Error('404 Bad ID.');
        const video: Video | null = await this.db.collection('videos').findOne({ _id: id });
        if (!video) throw new Error('404 Unknown Video id: ' + id);
        return video;
    };

    public getPhotoAlbumByPath = async (pathEncoded: string): Promise<PhotoAlbum> => {
        const thisPath: string = pathEncoded.slice(1, -1).replace(/\+/g, '/');
        const album: PhotoAlbum | null = await this.db
            .collection('photoAlbums')
            .findOne({ path: thisPath });
        if (!album) throw new Error('404 Unknown Album: ' + thisPath);
        return album;
    };

    public getPhotoAlbums = async (albumIdsList: string): Promise<PhotoAlbum[]> => {
        const idsArray = albumIdsList
            .slice(1, -1)
            .split('+')
            .map(Number);
        const pArray: Promise<PhotoAlbum>[] = []; // set up promises array for all of the albums being requested
        for (let i = 0; i < idsArray.length; i += 1) {
            const photoAlbum = this.db.collection('photoAlbums').findOne({ _id: idsArray[i] });
            pArray.push(photoAlbum);
        }
        const albums = await Promise.all(pArray);
        for (let i = 0; i < idsArray.length; i += 1) {
            if (!albums[i]) {
                // validity check
                throw new Error('403 Album IDs list: ' + albumIdsList + ' is invalid.');
            }
        }
        return albums;
    };

    public getPhotos = async (mediaIds: string): Promise<Photo[]> => {
        const idsArray = mediaIds
            .slice(1, -1)
            .split('+')
            .map(Number);
        const pArray = []; // set up promises array for all of the photos being requested
        for (let i = 0; i < idsArray.length; i += 1) {
            pArray.push(this.db.collection('photos').findOne({ _id: idsArray[i] }));
        }
        const photos = await Promise.all(pArray);
        for (let i = 0; i < idsArray.length; i += 1) {
            if (!photos[i]) {
                // validity check
                throw new Error('403 Photo IDs list: ' + mediaIds + ' is invalid.');
            }
        }
        return photos;
    };

    public getVideos = async (mediaIds: string): Promise<Video[]> => {
        const idsArray = mediaIds
            .slice(1, -1)
            .split('+')
            .map(Number);
        const pArray = []; // set up promises array for all of the videos being requested
        for (let i = 0; i < idsArray.length; i += 1) {
            pArray.push(this.db.collection('videos').findOne({ _id: idsArray[i] }));
        }
        const videos = await Promise.all(pArray);
        for (let i = 0; i < idsArray.length; i += 1) {
            if (!videos[i]) {
                // validity check
                throw new Error('403 Video IDs list: ' + mediaIds + ' is invalid.');
            }
        }
        return videos;
    };

    public getThumbs = async (mediaIdsList: string): Promise<string[]> => {
        const photos: Photo[] = await this.getPhotos(mediaIdsList);
        const thumbs: string[] = [];
        photos.forEach((photo): number => thumbs.push(photo.thumbPath));
        return thumbs;
    };

    public getPosters = async (posterIds: string): Promise<string[]> => {
        const videos = await this.getVideos(posterIds);
        const posters: string[] = [];
        videos.forEach((video): number => posters.push(video.thumbPath));
        return posters;
    };

    public getVideoAlbums = async (albumIdsList: string): Promise<VideoAlbum[]> => {
        const idsArray = albumIdsList
            .slice(1, -1)
            .split('+')
            .map(Number);
        const pArray = []; // set up promises array for all of the albums being requested
        for (let i = 0; i < idsArray.length; i += 1) {
            pArray.push(this.db.collection('videoAlbums').findOne({ _id: idsArray[i] }));
        }
        const albums = await Promise.all(pArray);
        for (let i = 0; i < idsArray.length; i += 1) {
            if (!albums[i]) {
                // validity check
                throw new Error('403 Album IDs list: ' + albumIdsList + ' is invalid.');
            }
        }
        return albums;
    };

    public getVideoAlbumByPath = async (pathEncoded: string): Promise<VideoAlbum> => {
        const thisPath = pathEncoded.slice(1, -1).replace(/\+/g, '/');
        const album = await this.db.collection('videoAlbums').findOne({ path: thisPath });
        if (!album) throw new Error('404 Unknown Album: ' + thisPath);
        return album;
    };

    public getVideoByPath = async (pathEncoded: string): Promise<Video> => {
    // Note - this function currently assumes that the path sent does NOT include
    // the VIDEO_DIR.PATH at the front.  TODO: check for this instead of assuming ...
        const thisPath = cfg.VIDEO_DIR.PATH + pathEncoded.slice(1, -1).replace(/\+/g, '/');
        const video = await this.db.collection('videos').findOne({ fullPath: thisPath });
        if (!video) throw new Error('404 Unknown Video: ' + thisPath);
        return video;
    };
}

export const mediaSvc = new MediaService();
mediaSvc.init();
