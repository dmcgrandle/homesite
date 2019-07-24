/* -----------------          media-service.js                ------------------

------------------------------------------------------------------------------*/

// External Imports:
import { Db } from 'mongodb';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as sharp from 'sharp';
import * as uniqueFilename from 'unique-filename';
import { spawn } from 'child_process';

// Project Imports:
import { MediaAlbum, Media, PhotoAlbum, Photo, VideoAlbum, Video } from '../model';
import { database } from './db-service';
import { fileSvc } from './file-service';
import { errSvc } from './err-service';

const cfg = config.mediaService;

namespace ms {
  export class MediaService {
    // need the bang (!) to stop typescript from complaining that the assignment is inside a try block
    private db!: Db;

    constructor() {
        this.init().then(() => {});
    }

    private async init() {
      try {
        this.db = await database;
        // console.log(Date(Date.now()) + ' : About to scan ' + cfg.PHOTO_DIR.PATH);
        const photoDirs: string[] = await fileSvc.mediaDirs(cfg.PHOTO_DIR.PATH);
        const photoFiles: string[] = await fileSvc.mediaFiles(cfg.PHOTO_DIR.PATH, this.isPhotoSuffix);
        // console.log(Date(Date.now()) + ' : Done scanning ' + cfg.PHOTO_DIR.PATH);
        await this.makeThumbsIfNeeded(photoFiles);
        const photoData = this.buildPhotos(photoDirs, photoFiles);
        await this.saveDataToDB('photoAlbums', photoData.albums);
        await this.saveDataToDB('photos', photoData.photos);
        console.log(Date.now() + ' : created new "photoAlbums" document in db.');
        // console.log(Date(Date.now()) + ' : About to scan ' + cfg.VIDEO_DIR.PATH);
        const videoDirs: string[] = await fileSvc.mediaDirs(cfg.VIDEO_DIR.PATH);
        const videoFiles: string[] = await fileSvc.mediaFiles(cfg.VIDEO_DIR.PATH, this.isVideoSuffix);
        // console.log(Date(Date.now()) + ' : Done scanning ' + cfg.VIDEO_DIR.PATH);
        await this.makePostersIfNeeded(videoFiles);
        const videoData = this.buildVideos(videoDirs, videoFiles);
        await this.saveDataToDB('videoAlbums', videoData.albums);
        await this.saveDataToDB('videos', videoData.videos);
        console.log(Date.now() + ' : created new "videoAlbums" document in db.');
      } catch (err) { errSvc.exit(err, 1); }
    }

    private async saveDataToDB(collection: string, data: MediaAlbum[] | Media[]): Promise<void> {
      try { // TODO: update existing instead of wiping every time.
        if (await this.db.collection(collection).find({ _id: 0 }).limit(1).count() !== 0) { // already exists
          await this.db.collection(collection).drop(); // wipe it out.
        }
        await this.db.collection(collection).insertMany(data);
      } catch (err) { errSvc.exit(err); }
    }

    private getFullThumbPath(file: string): string {
      // Returns a fullPath to the thumbnail version of file
      return uniqueFilename(path.join(__dirname, cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR),
        cfg.THUMBS.PREFIX, file) + cfg.THUMBS.SUFFIX;
    }

    private async createSomeThumbs(thumbsRemaining: Promise<sharp.OutputInfo>[]) {
      // Need to limit the number of thumbs created silmultaneously due to memory and resource
      // issues.  Started to run into problems at more than 300 at a time, so I figure 50
      // should be a safe number for most environments.  Settable in config.
      const numToDo = (thumbsRemaining.length > cfg.THUMBS.MAX_CREATE_AT_ONCE)
        ? cfg.THUMBS.MAX_CREATE_AT_ONCE : thumbsRemaining.length;
      if (numToDo > 0) { // still have work to do
        const newPArray: Promise<sharp.OutputInfo>[] = [];
        for (let i = 0; i < numToDo; i += 1) {
          const result = thumbsRemaining.shift();
          if (result) {
            newPArray.push(result);
          }
        }
        await Promise.all(newPArray); // wait on creation of up to MAX items
        console.log(Date.now() + ' : Finished creating ' + numToDo + ' thumbnails.');
        if (thumbsRemaining.length > 0) await this.createSomeThumbs(thumbsRemaining); // recurse remaining
      }
    }

    private async makeThumbsIfNeeded(files: string[]): Promise<void> {
      // This function checks all files in the files array to see if
      // thumbnails already exist, and creates them if they do not.
      await fs.ensureDir(path.join(__dirname, cfg.PHOTO_DIR.PATH, cfg.PHOTO_DIR.CACHE_DIR));
      let pArray1: Promise<boolean>[] = []; // promise array to build
      for (let i = 0; i < files.length; i += 1) {
        const thumb = this.getFullThumbPath(files[i]);
        pArray1.push(fs.pathExists(thumb));
      }
      const thumbsExist = await Promise.all(pArray1);
      let pArray2: Promise<sharp.OutputInfo>[] = []; // clear out the promise array & set up with thumb creations needed
      for (let i = 0; i < files.length; i += 1) {
        if (!thumbsExist[i]) {
          const fileIn = path.join(__dirname, cfg.PHOTO_DIR.PATH + files[i]);
          const fileOut = this.getFullThumbPath(files[i]);
          pArray2.push(sharp(fileIn)
            .resize(cfg.THUMBS.WIDTH, null, {fit: 'inside'})
            .toFormat(cfg.THUMBS.FORMAT)
            .toFile(fileOut)
          );
        }
      }
      if (pArray2.length > 0) {
        console.log(Date.now() + ' : About to create ' + pArray2.length
          + ' thumbnails.  This could take a while...');
        await this.createSomeThumbs(pArray2);
      }
    }

    private getFullPosterPath(file: string) {
      // Returns a fullPath to the thumbnail version of file
      return uniqueFilename(path.join(__dirname, cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR),
        cfg.POSTERS.PREFIX, file) + cfg.POSTERS.SUFFIX;
    }

    private ffmpegPromise(...args: any): Promise<string> {
      // This "promisifies" the spawn function call to ffmpeg.  Needed to write my own
      // rather than using a generic one such as 'child-process-es6-promise' because
      // ffmpeg throws info into stderr instead of stdout even if it's not an error,
      // so I check the return code too.
      const name: string = args[0];
      const ffArgs = args[1];
      const options = args[2];
      return new Promise((resolve, reject) => {
        const ffmpeg = spawn(name, ffArgs, options);
        let dataOut = ''; // buffer results sent
        let dataErr = '';
        ffmpeg.stdout.on('data', (data) => { dataOut += data; });
        ffmpeg.stderr.on('data', (data) => { dataErr += data; });
        ffmpeg.on('close', (returnCode) => {
          if (dataErr && (returnCode !== 0)) {
            console.log('ffmpegPromise Error! Return code is: ' + returnCode);
            reject(dataErr);
          } else {
            resolve(dataOut);
          }
        });
        ffmpeg.on('error', err => reject(err));
      });
    }

    private async createSomePosters(postersRemaining: string[]) {
      // Need to limit the number of posters created silmultaneously due to memory and resource
      // issues. Instead of doing the thumbExists check, then setting up the whole promise array,
      // then executing it a batch at a time, this time we are doing the check, the promise array
      // setup and 'await Promise.all' if needed all in the same batch.
      const numToDo = (postersRemaining.length > cfg.POSTERS.MAX_CREATE_AT_ONCE)
        ? cfg.POSTERS.MAX_CREATE_AT_ONCE : postersRemaining.length;
      if (numToDo > 0) { // still have work to do
        let pArray1: Promise<boolean>[] = []; // promise array to build 
        for (let i = 0; i < numToDo; i += 1) {
          pArray1.push(fs.pathExists(this.getFullPosterPath(postersRemaining[i])));
        } // first, check to see if the posters already exist.  Queue up MAX_CREATE_AT_ONCE of them.
        try {
          const postersExist = await Promise.all(pArray1);
          let pArray2: Promise<string>[] = [];
          for (let i = 0; i < numToDo; i += 1) {
            if (!postersExist[i]) {
              const fileIn = path.join(__dirname, cfg.VIDEO_DIR.PATH + postersRemaining[0]);
              const fileOut = this.getFullPosterPath(postersRemaining[0]);
              pArray2.push(this.ffmpegPromise('ffmpeg', ['-ss', '00:00:05', '-i', fileIn, '-vframes', '1',
                '-q:v', '2', '-vf', 'scale=' + cfg.POSTERS.WIDTH + ':-1', fileOut]));
            }
            postersRemaining.shift(); // drop the first item in the array.
          }
          if (pArray2.length > 0) {
            console.log(Date.now() + ' : Creating ' + pArray2.length + ' posters...');
            await Promise.all(pArray2);
          }
        } catch (err) { errSvc.exit(err, 1); }
        if (postersRemaining.length > 0) {
          try {
            await this.createSomePosters(postersRemaining); // recurse for the remaining
          } catch (err) { errSvc.exit(err, 1); }
        }
      }
    }

    private async makePostersIfNeeded(files: string[]) {
      // Doing this differently than creating thumbs, since we are dealing with streams and
      // events with spawn of a child process for every ffmpeg call.  With spawn it starts
      // executing as soon as it is set up, so need to handle it differently than 'sharp'.
      try {
        await fs.ensureDir(path.join(__dirname, cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR));
        const posterFiles = files.slice(); // clone the files array since we'll be modifying it
        console.log(Date.now() + ' : Found ' + posterFiles.length + ' videos.  Will create posters if needed.');
        await this.createSomePosters(posterFiles);
      } catch (err) { errSvc.exit(err, 1); }
    }

    private buildAlbumsArray(paths: string[], media: string) {
      const albums: MediaAlbum[] = [];
      let aIndex = 0; // aIndex becomes album._id
      let splitPaths = [];
      let prevTargetAlbumPath = '';
      let prevTargetAlbumIndex = 0;
      paths.forEach((fullPath) => { // Create albums array of album objects
        // 1. First set up some default info for this album.
        // Three good things come from splitting the path: it makes stripping the last
        // directory off the path easy for comparing this path to the previous one;
        // the album.name is the last element in the split array; and finally it
        // allows us to quickly assemble all parents
        splitPaths = fullPath.split('/');
        const album: MediaAlbum = {
          _id: aIndex,
          name: splitPaths[splitPaths.length - 1],
          path: fullPath,
          description: '',
          featuredMedia: { // blank to start with
            _id: -1,
            filename: '',
            fullPath: '',
            thumbPath: '',
            caption: ''
          },
          mediaIds: [],
          albumIds: []
        };
        albums[aIndex] = album;
        // 2. Now add this album's index (which equals it's _id) to it's parent's
        // albums array.
        const targetAlbumPath = fullPath.slice(0, -(splitPaths[splitPaths.length - 1].length + 1));
        const targetAlbumIndex = ((targetAlbumPath === prevTargetAlbumPath) ? prevTargetAlbumIndex
          : albums.findIndex(testAlbum => testAlbum.path === targetAlbumPath));
        if (aIndex > 0) albums[targetAlbumIndex].albumIds.push(aIndex); // add to proper albumIds array
        prevTargetAlbumPath = targetAlbumPath;
        prevTargetAlbumIndex = targetAlbumIndex;
        aIndex += 1;
      }); // end create albums array of album objects
      return albums;
    }

    private getRelTorPPath(file: string, mediaType: string) { // Get Relative Thumb or Poster Path
      // Returns a valid web URL path for the client to retrieve the thumbnail
      let url = '';
      if (mediaType === 'photo') {
        url = uniqueFilename(cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR, cfg.THUMBS.PREFIX, file)
          + cfg.THUMBS.SUFFIX;
      } else { // mediaType === 'video
        url = uniqueFilename(cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR, cfg.POSTERS.PREFIX, file)
          + cfg.POSTERS.SUFFIX;
      }
      return url;
    }

    /* eslint-disable */ // I know this function is ugly.  TODO - find a better way to test this.
    private isEmpty(obj: Object) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key))
          return false;
      }
      return true;
    }
    /* eslint-enable */

    /* eslint-disable no-param-reassign */
    // TODO - Currently being lazy by modifying albums parameter. Fix this.
    private buildMediaArray(albums: MediaAlbum[], files: string[], mediaType: string) {
      // Builds the main photos array to be saved in the database, and also builds
      // the photos arrays that are stored within each album.
      let prevTargetAlbumPath = '';
      const medias: Media[] = [];
      // const thumbPathKey = 'thumbPath';
      let fIndex = 0; // fInxex == photo._id
      let targetAlbumIndex = 0;
      let prevTargetAlbumIndex = 0;
      files.forEach((file) => {
        const splitPaths = file.split('/');
        const mediaFilename = splitPaths[splitPaths.length - 1];
        const prefix = (mediaType === 'photo') ? cfg.PHOTO_DIR.PATH : cfg.VIDEO_DIR.PATH;
        const mediaFullPath = `${prefix}${file}`;
        const thumbPath = this.getRelTorPPath(file, mediaType);
        const media : Media = {
          _id: fIndex, // id of this Photo/Video
          filename: mediaFilename, // filename without path
          fullPath: mediaFullPath, // full path and filename of media
          thumbPath: thumbPath, // path + filename of thumbnail relative to root URL
          caption: ''
        };
        const targetAlbumPath = file.slice(0, -(mediaFilename.length + 1));
        if (targetAlbumPath === prevTargetAlbumPath) {
          targetAlbumIndex = prevTargetAlbumIndex;
        } else { // first photo in a new album, so set up featuredMedia
          targetAlbumIndex = albums.findIndex(album => album.path === targetAlbumPath);
          albums[targetAlbumIndex].featuredMedia = {
            _id: fIndex,
            filename: mediaFilename,
            fullPath: mediaFullPath,
            thumbPath: thumbPath,
            caption: '',
          };
          albums[targetAlbumIndex].featuredMedia.thumbPath = thumbPath;
          splitPaths.pop(); // first, drop the filename
          const numParents = splitPaths.length - 1; // have to save it since we mod splitPaths
          for (let i = 0; i < numParents; i += 1) { // walk up the tree finding all parents
            splitPaths.pop(); // drop current album name to find the parent
            const parentAlbumPath = splitPaths.join('/');
            if (parentAlbumPath) {
              const parentAlbumIndex = albums.findIndex(album => album.path === parentAlbumPath);
              if (this.isEmpty(albums[parentAlbumIndex].featuredMedia)) {
                albums[parentAlbumIndex].featuredMedia = {
                  _id: fIndex,
                  filename: mediaFilename,
                  fullPath: mediaFullPath,
                  thumbPath: thumbPath,
                  caption: '',
                };
                albums[parentAlbumIndex].featuredMedia.thumbPath = thumbPath;
              }
            }
          }// end for (walking up the parent tree)
        } // end set up featuredMedia
        // albums[targetAlbumIndex][mediaType + 'Ids'].push(fIndex); // eg: add photo id to photos array
        albums[targetAlbumIndex]['mediaIds'].push(fIndex);
        medias.push(media); // eg: add photo to the photos array
        // set up indexes for next iteration of loop:
        prevTargetAlbumPath = targetAlbumPath;
        prevTargetAlbumIndex = targetAlbumIndex;
        fIndex += 1;
      });
      return medias;
    }
    /* eslint-enable no-param-reassign */

    private buildVideos(paths: string[], files: string[]) {
      //    const PREFIX = '/protected/videos/'
      const newAlbums: VideoAlbum[] = this.buildAlbumsArray(paths, 'video');
      const newVideos: Video[] = this.buildMediaArray(newAlbums, files, 'video');
      newAlbums[0].featuredMedia = {
        _id: newVideos[0]._id,
        filename: newVideos[0].filename,
        fullPath: newVideos[0].fullPath,
        thumbPath: newVideos[0].thumbPath,
        caption: '',
      };
      newAlbums[0].name = 'Root Video Album';
      return { albums: newAlbums, videos: newVideos };
    }

    private buildPhotos(paths: string[], files: string[]) {
      //    const PREFIX = '/protected/images/'
      const newAlbums: PhotoAlbum[] = this.buildAlbumsArray(paths, 'photo');
      const newPhotos: Photo[] = this.buildMediaArray(newAlbums, files, 'photo');
      // root album featuredMedia is not set by above code, so set it manually to the first photo
      newAlbums[0].featuredMedia = {
        _id: newPhotos[0]._id,
        filename: newPhotos[0].filename,
        fullPath: newPhotos[0].fullPath,
        thumbPath: newPhotos[0].thumbPath,
        caption: '',
      };
      newAlbums[0].name = 'Root Photo Album';
      return { albums: newAlbums, photos: newPhotos };
    }

    private isPhotoSuffix(str: string) { // TODO: add more recognized picture formats
      return ((str === '.jpg') || (str === 'jpeg'));
    }

    private isVideoSuffix(str: string) { // TODO: add more recognized video formats
      return ((str === '.mp4') || (str === '.mov'));
    }

    // -------------------
    // Exported methods:

    getPhotoAlbumById: (id: number) => Promise<PhotoAlbum> = async (id) => {
      if ((id < 0) || typeof (id) !== 'number') throw new Error('404 Bad ID.');
      const album: MediaAlbum | null = await this.db.collection('photoAlbums').findOne({ _id: id });
      if (!album) throw new Error('404 Unknown Album.');
      return album;
    };

    getPhotoById: (id: number) => Promise<Photo> = async (id) => {
      if ((id < 0) || typeof (id) !== 'number') throw new Error('404 Bad ID.');
      const photo: Photo | null = await this.db.collection('photos').findOne({ _id: id });
      if (!photo) throw new Error('404 Unknown Photo id: ' + id);
      return photo;
    };

    getVideoById: (id: number) => Promise<Video> = async (id) => {
      if ((id < 0) || typeof (id) !== 'number') throw new Error('404 Bad ID.');
      const video: Video | null = await this.db.collection('videos').findOne({ _id: id });
      if (!video) throw new Error('404 Unknown Video id: ' + id);
      return video;
    };

    getPhotoAlbumByPath: (pathEncoded: string) => Promise<PhotoAlbum> = async (pathEncoded) => {
      const thisPath: string = pathEncoded.slice(1, -1).replace(/\+/g, '/');
      const album: PhotoAlbum | null = await this.db.collection('photoAlbums').findOne({ path: thisPath });
      if (!album) throw new Error('404 Unknown Album: ' + thisPath);
      return album;
    };

    getPhotoAlbums: (albumIdsList: string) => Promise<PhotoAlbum[]> = async (albumIdsList) => {
      const idsArray = albumIdsList.slice(1, -1).split('+').map(Number);
      const pArray: Promise<PhotoAlbum>[] = []; // set up promises array for all of the albums being requested
      for (let i = 0; i < idsArray.length; i += 1) {
        const photoAlbum = this.db.collection('photoAlbums').findOne({ _id: idsArray[i] });
        pArray.push(photoAlbum);
      }
      const albums = await Promise.all(pArray);
      for (let i = 0; i < idsArray.length; i += 1) {
        if (!albums[i]) { // validity check
          throw new Error('403 Album IDs list: ' + albumIdsList + ' is invalid.');
        }
      }
      return albums;
    };

    getPhotos: (mediaIds: string) => Promise<Photo[]>  = async (mediaIds) => {
      const idsArray = mediaIds.slice(1, -1).split('+').map(Number);
      const pArray = []; // set up promises array for all of the photos being requested
      for (let i = 0; i < idsArray.length; i += 1) {
        pArray.push(this.db.collection('photos').findOne({ _id: idsArray[i] }));
      }
      const photos = await Promise.all(pArray);
      for (let i = 0; i < idsArray.length; i += 1) {
        if (!photos[i]) { // validity check
          throw new Error('403 Photo IDs list: ' + mediaIds + ' is invalid.');
        }
      }
      return photos;
    };

    getVideos: (mediaIds: string) => Promise<Video[]> = async (mediaIds) => {
      const idsArray = mediaIds.slice(1, -1).split('+').map(Number);
      const pArray = []; // set up promises array for all of the videos being requested
      for (let i = 0; i < idsArray.length; i += 1) {
        pArray.push(this.db.collection('videos').findOne({ _id: idsArray[i] }));
      }
      const videos = await Promise.all(pArray);
      for (let i = 0; i < idsArray.length; i += 1) {
        if (!videos[i]) { // validity check
          throw new Error('403 Video IDs list: ' + mediaIds + ' is invalid.');
        }
      }
      return videos;
    };

    getThumbs: (mediaIdsList: string) => Promise<string[]> = async (mediaIdsList) => {
      const photos: Photo[] = await this.getPhotos(mediaIdsList);
      const thumbs: string[]= [];
      photos.forEach(photo => thumbs.push(photo.thumbPath));
      return thumbs;
    };

    getPosters: (posterIds: string) => Promise<string[]> = async (posterIds) => {
      const videos = await this.getVideos(posterIds);
      const posters: string[] = [];
      videos.forEach(video => posters.push(video.thumbPath));
      return posters;
    };


    getVideoAlbums: (albumIdsList: string) => Promise<VideoAlbum[]> = async (albumIdsList) => {
      const idsArray = albumIdsList.slice(1, -1).split('+').map(Number);
      const pArray = []; // set up promises array for all of the albums being requested
      for (let i = 0; i < idsArray.length; i += 1) {
        pArray.push(this.db.collection('videoAlbums').findOne({ _id: idsArray[i] }));
      }
      const albums = await Promise.all(pArray);
      for (let i = 0; i < idsArray.length; i += 1) {
        if (!albums[i]) { // validity check
          throw new Error('403 Album IDs list: ' + albumIdsList + ' is invalid.');
        }
      }
      return albums;
    };

    getVideoAlbumByPath: (pathEncoded: string) => Promise<VideoAlbum> = async (pathEncoded) => {
      const thisPath = pathEncoded.slice(1, -1).replace(/\+/g, '/');
      const album = await this.db.collection('videoAlbums').findOne({ path: thisPath });
      if (!album) throw new Error('404 Unknown Album: ' + thisPath);
      return album;
    };

    getVideoByPath: (pathEncoded: string) => Promise<Video> = async (pathEncoded) => {
      // Note - this function currently assumes that the path sent does NOT include
      // the VIDEO_DIR.PATH at the front.  TODO: check for this instead of assuming ...
      const thisPath = cfg.VIDEO_DIR.PATH + pathEncoded.slice(1, -1).replace(/\+/g, '/');
      const video = await this.db.collection('videos').findOne({ fullPath: thisPath });
      if (!video) throw new Error('404 Unknown Video: ' + thisPath);
      return video;
    };
  }
}

export const mediaSvc = new ms.MediaService();
